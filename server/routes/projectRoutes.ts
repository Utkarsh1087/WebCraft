import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  deleteProject,
  getProjectById,
  getProjectPreview,
  getPublishedProjects,
  makeRevision,
  rollbackToVersion,
  saveProjectCode,
} from '../controllers/projectController.js';
import {
  validateBody,
  validateParams,
  validateQuery,
  makeRevisionSchema,
  saveProjectCodeSchema,
  projectIdParamSchema,
  rollbackParamSchema,
  paginationQuerySchema,
} from '../middlewares/validate.js';
import { aiLimiter, publicReadLimiter } from '../middlewares/rateLimiter.js';

const projectRouter = express.Router();

// Public endpoints
projectRouter.get('/published', publicReadLimiter, validateQuery(paginationQuerySchema), getPublishedProjects);
projectRouter.get('/published/:projectId', publicReadLimiter, validateParams(projectIdParamSchema), getProjectById);

// Protected endpoints
projectRouter.post(
  '/revision/:projectId',
  protect,
  aiLimiter,
  validateParams(projectIdParamSchema),
  validateBody(makeRevisionSchema),
  makeRevision
);

projectRouter.put(
  '/save/:projectId',
  protect,
  express.json({ limit: '2mb' }),
  validateParams(projectIdParamSchema),
  validateBody(saveProjectCodeSchema),
  saveProjectCode
);

projectRouter.get(
  '/rollback/:projectId/:versionId',
  protect,
  validateParams(rollbackParamSchema),
  rollbackToVersion
);

projectRouter.delete(
  '/:projectId',
  protect,
  validateParams(projectIdParamSchema),
  deleteProject
);

projectRouter.get(
  '/preview/:projectId',
  protect,
  validateParams(projectIdParamSchema),
  getProjectPreview
);

export default projectRouter;