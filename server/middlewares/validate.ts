import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error: any) {
      if (error?.issues) {
        return res.status(400).json({
          message: 'Invalid request payload',
          errors: error.issues.map((i: any) => ({ path: i.path.join('.'), message: i.message })),
        });
      }
      return res.status(400).json({ message: 'Invalid request payload' });
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      Object.defineProperty(req, 'params', { value: parsed, writable: true, configurable: true });
      next();
    } catch (error: any) {
      if (error?.issues) {
        return res.status(400).json({
          message: 'Invalid request parameters',
          errors: error.issues.map((i: any) => ({ path: i.path.join('.'), message: i.message })),
        });
      }
      return res.status(400).json({ message: 'Invalid request parameters' });
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query || {});
      Object.defineProperty(req, 'query', { value: parsed, writable: true, configurable: true });
      next();
    } catch (error: any) {
      if (error?.issues) {
        return res.status(400).json({
          message: 'Invalid query parameters',
          errors: error.issues.map((i: any) => ({ path: i.path.join('.'), message: i.message })),
        });
      }
      return res.status(400).json({ message: 'Invalid query parameters' });
    }
  };
};


// Common Schemas
export const createProjectSchema = z.object({
  initial_prompt: z.string().trim().min(3, 'Prompt must be at least 3 characters').max(3000, 'Prompt must be under 3000 characters'),
});

export const makeRevisionSchema = z.object({
  message: z.string().trim().min(1, 'Revision message cannot be empty').max(3000, 'Revision message must be under 3000 characters'),
});

export const saveProjectCodeSchema = z.object({
  code: z.string().min(1, 'Code is required').max(5000000, 'Code exceeds 5MB limit'),
});

export const projectIdParamSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
});

export const rollbackParamSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  versionId: z.string().min(1, 'Version ID is required'),
});

export const paginationQuerySchema = z.object({
  page: z
    .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 1), z.number().int().min(1))
    .default(1),
  limit: z
    .preprocess((val) => (val !== undefined && val !== '' ? Number(val) : 20), z.number().int().min(1).max(50))
    .default(20),
});


