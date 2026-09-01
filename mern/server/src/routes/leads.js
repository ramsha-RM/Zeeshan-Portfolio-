import { Router } from 'express';
import { createLead } from '../controllers/leadController.js';

const router = Router();
router.post('/', createLead);

export default router;
