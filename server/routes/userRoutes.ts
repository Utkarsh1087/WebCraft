import express from 'express';
import {
  getUserCredits,
  createUserProject,
  getUserProject,
  getUserProjects,
  togglePublish,
  purchaseCredits,
} from '../controllers/userControllers.js';
import { protect } from '../middlewares/auth.js';
import {
  validateBody,
  validateParams,
  validateQuery,
  createProjectSchema,
  projectIdParamSchema,
  paginationQuerySchema,
} from '../middlewares/validate.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';

const userRouter = express.Router();

userRouter.get('/credits', protect, getUserCredits);

userRouter.post(
  '/project',
  protect,
  aiLimiter,
  validateBody(createProjectSchema),
  createUserProject
);

userRouter.get(
  '/project/:projectId',
  protect,
  validateParams(projectIdParamSchema),
  getUserProject
);

userRouter.get(
  '/project',
  protect,
  validateQuery(paginationQuerySchema),
  getUserProjects
);

userRouter.get(
  '/publish-toggle/:projectId',
  protect,
  validateParams(projectIdParamSchema),
  togglePublish
);

userRouter.post('/purchase-credits', protect, purchaseCredits);

export default userRouter;