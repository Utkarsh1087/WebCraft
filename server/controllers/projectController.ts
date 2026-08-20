import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import aiService from '../lib/aiService.js';
import cache from '../lib/cache.js';
import logger from '../lib/logger.js';
import { aiGenerationDurationHistogram } from '../lib/metrics.js';

// Controller function to make revision
export const makeRevision = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;
  const { projectId } = req.params;
  const { message } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, credits: true },
    });

    if (!userId || !user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.credits < 5) {
      return res.status(403).json({ message: 'Add more credits to make changes' });
    }

    const currentProject = await prisma.websiteProject.findFirst({
      where: { id: projectId as string, userId },
      select: { id: true, current_code: true },
    });

    if (!currentProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Atomic credit decrement
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 5 } },
    });

    await prisma.conversation.create({
      data: {
        role: 'user',
        content: message,
        projectId: projectId as string,
      },
    });

    const aiTimer = aiGenerationDurationHistogram.startTimer({ operation: 'revision' });

    try {
      // Enhance user Prompt
      const enhancedPrompt = await aiService.enhancePrompt(message);

      await prisma.conversation.create({
        data: {
          role: 'assistant',
          content: 'Now making changes to your website...',
          projectId: projectId as string,
        },
      });

      // Generate updated website code
      const cleanedCode = await aiService.generateWebsiteCode(enhancedPrompt, currentProject.current_code || '');
      aiTimer({ status: 'success' });


      const version = await prisma.version.create({
        data: {
          code: cleanedCode,
          description: `Revision: ${message.substring(0, 40)}`,
          projectId: projectId as string,
        },
      });

      await prisma.websiteProject.update({
        where: { id: projectId as string },
        data: {
          current_code: cleanedCode,
          current_version_index: version.id,
        },
      });

      await prisma.conversation.create({
        data: {
          role: 'assistant',
          content: "I've made the changes to your website! You can now preview it",
          projectId: projectId as string,
        },
      });

      // Invalidate project cache
      cache.delete(`proj:code:${projectId}`);
      cache.invalidatePrefix('published:');

      return res.json({ message: 'Changes made successfully' });
    } catch (aiErr: any) {
      aiTimer({ status: 'error' });
      // Refund credits on failure
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 5 } },
      });
      logger.error({ err: aiErr, projectId }, 'AI revision generation failed');
      return res.status(502).json({ message: 'AI generation service temporarily unavailable, credits refunded.' });
    }
  } catch (error) {
    next(error);
  }
};

// Controller function to rollback to a specific version
export const rollbackToVersion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { projectId, versionId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const version = await prisma.version.findFirst({
      where: { id: versionId as string, projectId: projectId as string },
    });

    if (!version) {
      return res.status(404).json({ message: 'Version not found' });
    }

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId as string, userId },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await prisma.websiteProject.update({
      where: { id: projectId as string },
      data: {
        current_code: version.code,
        current_version_index: version.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: 'assistant',
        content: 'I have rolled back the website to selected version. You can now preview it.',
        projectId: projectId as string,
      },
    });

    cache.delete(`proj:code:${projectId}`);
    cache.invalidatePrefix('published:');

    res.json({ message: 'Version rolled back successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller Function to Delete a Project
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await prisma.websiteProject.deleteMany({
      where: { id: projectId as string, userId },
    });

    cache.delete(`proj:code:${projectId}`);
    cache.invalidatePrefix('published:');

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller for getting project code for preview
export const getProjectPreview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId as string, userId },
      include: {
        versions: { orderBy: { timestamp: 'asc' } },
        conversation: { orderBy: { timestamp: 'asc' } },
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

// Get published projects (Cached & Paginated & Projected)
export const getPublishedProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const skip = (page - 1) * limit;

    const cacheKey = `published:p${page}:l${limit}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    const [projects, total] = await Promise.all([
      prisma.websiteProject.findMany({
        where: { isPublished: true },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          initial_prompt: true,
          current_version_index: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.websiteProject.count({ where: { isPublished: true } }),
    ]);

    const result = {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache for 30 seconds
    cache.set(cacheKey, result, 30);
    res.setHeader('X-Cache', 'MISS');

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get a single project's HTML code by id (Cached)
export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const cacheKey = `proj:code:${projectId}`;

    const cachedCode = cache.get<{ code: string }>(cacheKey);
    if (cachedCode) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedCode);
    }

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId as string, isPublished: true },
      select: { current_code: true },
    });

    if (!project || !project.current_code) {
      return res.status(404).json({ message: 'Project not found or not published' });
    }

    const result = { code: project.current_code };
    cache.set(cacheKey, result, 60);
    res.setHeader('X-Cache', 'MISS');

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Controller to save project code
export const saveProjectCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;
    const { code } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId as string, userId },
      select: { id: true },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await prisma.websiteProject.update({
      where: { id: projectId as string },
      data: { current_code: code, current_version_index: '' },
    });

    cache.delete(`proj:code:${projectId}`);
    cache.invalidatePrefix('published:');

    res.json({ message: 'Project saved successfully' });
  } catch (error) {
    next(error);
  }
};