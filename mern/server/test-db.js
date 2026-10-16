import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI is missing from .env');
  process.exit(1);
}

const parsed = new URL(uri);
console.log('User:', decodeURIComponent(parsed.username));
console.log('Password length:', decodeURIComponent(parsed.password).length);
console.log('Host:', parsed.hostname);
console.log('Database:', parsed.pathname.replace('/', '') || '(none)');
console.log('Connecting to MongoDB...');

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('CONNECTED SUCCESSFULLY');
    process.exit(0);
  })
  .catch((err) => {
    console.error('CONNECTION FAILED:', err.message);
    process.exit(1);
  });