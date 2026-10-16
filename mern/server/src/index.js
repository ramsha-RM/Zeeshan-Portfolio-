import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import cors from 'cors';
import connectDB from './config/db.js';
import projectRoutes from './routes/projects.js';
import adminRoutes from './routes/admin.js';
import leadRoutes from './routes/leads.js';
import uploadRoutes from './routes/uploads.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { assertAdminConfiguration } from './middleware/adminAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
const configuredOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173')).split(',').map(origin => origin.trim()).filter(Boolean);
const allowedOrigins = new Set(configuredOrigins);
const allowLocalhostPattern = /^http:\/\/(localhost|127\.0\.0\.1):(\d+)$/;

assertAdminConfiguration();

app.use(cors({
  origin(origin, callback) {
    const isLocalDevelopmentOrigin =
      process.env.NODE_ENV !== 'production' && allowLocalhostPattern.test(origin || '');
    if (!origin || allowedOrigins.has(origin) || isLocalDevelopmentOrigin) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

const startDb = () =>
  connectDB().catch(() => {
    console.error('Retrying database connection in 15 seconds');
    setTimeout(startDb, 15000);
  });

startDb();

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/uploads', uploadRoutes);

if (existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log('API on http://localhost:' + port));
}

export default app;