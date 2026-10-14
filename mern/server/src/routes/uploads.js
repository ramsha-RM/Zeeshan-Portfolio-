import { Router } from 'express';
import { signUpload } from '../controllers/uploadController.js';
import { requireAdmin, requireTrustedOrigin } from '../middleware/adminAuth.js';

const router = Router();

router.post('/sign', requireTrustedOrigin, requireAdmin, signUpload);

export default router;
