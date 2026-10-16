import { Router } from 'express';
import {
  listProjects,
  listAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { requireAdmin, requireTrustedOrigin } from '../middleware/adminAuth.js';
import { requireDb } from '../middleware/requireDb.js';
import { streamProjectEvents } from '../projectEvents.js';

const router = Router();

// Public reads pass straight through. Admin reads need a session; writes also
// need a trusted Origin (CSRF guard). Auth is enforced once, here.
router.use((req, res, next) => {
  const isPublicRead = req.method === 'GET' && req.path !== '/admin/all';
  if (isPublicRead) return next();
  if (req.method === 'GET') return requireAdmin(req, res, next);
  return requireTrustedOrigin(req, res, () => requireAdmin(req, res, next));
});

router.get('/', listProjects);
router.get('/events', streamProjectEvents);
router.get('/admin/all', requireDb, listAllProjects);
router.get('/:slug', getProject);
router.post('/', requireDb, createProject);
router.put('/:id', requireDb, updateProject);
router.delete('/:id', requireDb, deleteProject);

export default router;
