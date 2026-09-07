import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import projectRoutes from './routes/projects.js';
import leadRoutes from './routes/leads.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

connectDB().catch(err => console.error("DB Connection Error:", err));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/projects', projectRoutes);
app.use('/api/leads', leadRoutes);
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log('API on http://localhost:' + port));
}

export default app;