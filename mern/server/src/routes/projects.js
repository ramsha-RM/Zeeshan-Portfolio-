import { Router } from 'express';
import {
  listProjects,
  getProject,
  createProject
} from '../controllers/projectController.js';

const router = Router();

router.get('/', listProjects);
router.get('/:slug', getProject);
router.post('/', createProject);

export default router;