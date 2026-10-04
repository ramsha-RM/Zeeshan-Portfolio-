import { Router } from 'express';
import { signUpload } from '../controllers/uploadController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.post('/sign', requireAdmin, signUpload);

export default router;
