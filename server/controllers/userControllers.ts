import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import aiService from '../lib/aiService.js';
import cache from '../lib/cache.js';
import logger from '../lib/logger.js';
import { aiGenerationDurationHistogram } from '../lib/metrics.js';

// Get User Credits
export const getUserCredits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    res.json({ credits: user?.credits ?? 0 });
  } catch (error) {
    next(error);
  }
};

// Controller function to create new project
export const createUserProject = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;
  const { initial_prompt } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, credits: true },
    });

    if (!user || user.credits < 5) {
      return res.status(403).json({ message: 'Add credits to create more projects' });
    }

    const projectName =
      initial_prompt.length > 50 ? initial_prompt.substring(0, 47) + '...' : initial_prompt;

    // Create project and initial conversation atomically
    const project = await prisma.$transaction(async (tx) => {
      const p = await tx.websiteProject.create({
        data: {
          name: projectName,
          initial_prompt,
          userId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          totalCreation: { increment: 1 },
          credits: { decrement: 5 },
        },
      });

      await tx.conversation.create({
        data: {
          role: 'user',
          content: initial_prompt,
          projectId: p.id,
        },
      });

      return p;
    });

    res.json({ project_id: project.id });

    // Background asynchronous AI generation
    (async () => {
      const aiTimer = aiGenerationDurationHistogram.startTimer({ operation: 'create' });
      try {
        logger.info({ projectId: project.id }, 'Starting AI enhancement for project');

        const enhancedPrompt = await aiService.enhancePrompt(initial_prompt);

        await prisma.conversation.create({
          data: {
            role: 'assistant',
            content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
            projectId: project.id,
          },
        });

        await prisma.conversation.create({
          data: {
            role: 'assistant',
            content: 'Now generating your website...',
            projectId: project.id,
          },
        });

        const cleanedCode = await aiService.generateWebsiteCode(enhancedPrompt);
        aiTimer({ status: 'success' });

        const version = await prisma.version.create({
          data: {
            code: cleanedCode,
            description: 'Initial Version',
            projectId: project.id,
          },
        });

        await prisma.websiteProject.update({
          where: { id: project.id },
          data: {
            current_code: cleanedCode,
            current_version_index: version.id,
          },
        });

        await prisma.conversation.create({
          data: {
            role: 'assistant',
            content: "I've created your website! You can now preview it and request any changes.",
            projectId: project.id,
          },
        });

        logger.info({ projectId: project.id }, 'AI Project generation completed successfully');
      } catch (aiError: any) {
        aiTimer({ status: 'error' });
        logger.error({ err: aiError, projectId: project.id }, 'AI Generation Error in background task');

        await prisma.conversation.create({
          data: {
            role: 'assistant',
            content: 'AI generation failed: ' + (aiError.message || 'Please retry.'),
            projectId: project.id,
          },
        });

        // Refund credits on failure
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: 5 } },
        });
      }
    })();
  } catch (error) {
    next(error);
  }
};

// Controller function to get a single user project
export const getUserProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId as string, userId },
      include: {
        conversation: { orderBy: { timestamp: 'asc' } },
        versions: { orderBy: { timestamp: 'asc' } },
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

// Controller function to get all user projects (Paginated & Projected)
export const getUserProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.websiteProject.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          initial_prompt: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.websiteProject.count({ where: { userId } }),
    ]);

    res.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller function to toggle project publish
export const togglePublish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId as string, userId },
      select: { id: true, isPublished: true },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updated = await prisma.websiteProject.update({
      where: { id: projectId as string },
      data: { isPublished: !project.isPublished },
      select: { isPublished: true },
    });

    cache.invalidatePrefix('published:');
    cache.delete(`proj:code:${projectId}`);

    res.json({
      message: updated.isPublished ? 'Project Published Successfully' : 'Project Unpublished',
      isPublished: updated.isPublished,
    });
  } catch (error) {
    next(error);
  }
};

// Controller function to purchase credits
export const purchaseCredits = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Purchase feature coming soon' });
};
