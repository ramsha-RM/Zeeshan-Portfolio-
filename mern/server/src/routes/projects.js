import { Router } from 'express';
import {
  listProjects,
  listAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { requireDb } from '../middleware/requireDb.js';

const router = Router();

router.use((req, res, next) => (req.method === 'GET' && req.path === '/' ? next() : requireDb(req, res, next)));

router.get('/', listProjects);
router.get('/admin/all', requireAdmin, listAllProjects);
router.get('/:slug', getProject);
router.post('/', requireAdmin, createProject);
router.put('/:id', requireAdmin, updateProject);
router.delete('/:id', requireAdmin, deleteProject);

export default router;