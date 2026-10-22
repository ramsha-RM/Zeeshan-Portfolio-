import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import dns from 'node:dns/promises';
import tls from 'node:tls';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB, { getDbStatus, isDbConnected } from './config/db.js';
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

let dbAttempt = null;
const ensureDb = () => {
  if (isDbConnected()) return Promise.resolve();
  if (!dbAttempt) {
    dbAttempt = connectDB()
      .catch(() => {})
      .finally(() => {
        dbAttempt = null;
      });
  }
  return dbAttempt;
};
const dbGate = async (_req, _res, next) => {
  if (process.env.VERCEL) {
    await Promise.race([ensureDb(), new Promise((resolve) => setTimeout(resolve, 5000))]);
  }
  next();
};

if (!process.env.VERCEL) startDb();

app.get('/api/health', dbGate, (_req, res) =>
  res.json({ ok: true, hasMongoUri: Boolean(process.env.MONGO_URI), ...getDbStatus() })
);

app.get('/api/net-test', async (_req, res) => {
  const result = {};
  let target = null;
  try {
    const host = new URL(process.env.MONGO_URI).hostname;
    const records = await dns.resolveSrv(`_mongodb._tcp.${host}`);
    target = records[0];
    result.srv = records.map((record) => `${record.name}:${record.port}`);
  } catch (error) {
    result.srvError = error.message;
  }

  if (target) {
    result.tls = await new Promise((resolve) => {
      const started = Date.now();
      const socket = tls.connect({
        host: target.name,
        port: target.port,
        servername: target.name,
        timeout: 8000,
      });
      socket.once('secureConnect', () => {
        const info = `${socket.getProtocol()} handshake ok in ${Date.now() - started}ms`;
        socket.destroy();
        resolve(info);
      });
      socket.once('timeout', () => {
        socket.destroy();
        resolve('timeout: no TLS handshake in 8s');
      });
      socket.once('error', (error) => resolve(`error: ${error.message}`));
    });
  }

  const started = Date.now();
  let probe;
  try {
    probe = await mongoose
      .createConnection(process.env.MONGO_URI, { serverSelectionTimeoutMS: 12000 })
      .asPromise();
    await probe.db.admin().ping();
    result.ping = `ok in ${Date.now() - started}ms`;
  } catch (error) {
    const servers = error.reason?.servers ? [...error.reason.servers.values()] : [];
    result.ping = `failed after ${Date.now() - started}ms: ${error.name}: ${error.message}`;
    result.servers = servers.map(
      (server) => `${server.address}: ${server.type}${server.error ? ' / ' + server.error.name + ': ' + server.error.message : ''}`
    );
  } finally {
    if (probe) await probe.close().catch(() => {});
  }

  try {
    const response = await fetch('https://api.ipify.org?format=json');
    result.outboundIp = (await response.json()).ip;
  } catch (error) {
    result.outboundIp = `lookup failed: ${error.message}`;
  }
  res.json(result);
});

app.use('/api/admin', adminRoutes);
app.use('/api/projects', dbGate, projectRoutes);
app.use('/api/leads', dbGate, leadRoutes);
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