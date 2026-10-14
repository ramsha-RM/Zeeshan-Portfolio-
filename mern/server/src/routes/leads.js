import { Router } from 'express';
import { createLead } from '../controllers/leadController.js';
import { createRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

const leadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'You’ve sent several messages already. Please try again later.'
});

router.post('/', leadLimiter, createLead);

export default router;
