import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({
  path: new URL('../../.env', import.meta.url),
});

const fallbackMongoUri = 'mongodb://127.0.0.1:27017/portfolio';

mongoose.set('bufferCommands', false);

let lastDbError = '';

const describeError = (error) => {
  const servers = error?.reason?.servers;
  if (servers && typeof servers.values === 'function') {
    const details = [...servers.values()]
      .map((server) => `${server.address}: ${server.error?.message || server.type}`)
      .join(' | ');
    if (details) return details;
  }
  return error?.message || 'Unknown error';
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || fallbackMongoUri;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
    });

    lastDbError = '';
    console.log('MongoDB Connected');
    return mongoose.connection;
  } catch (error) {
    lastDbError = describeError(error);
    console.error('MongoDB connection failed:', lastDbError);
    throw error;
  }
};

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const getDbStatus = () => ({
  state: mongoose.connection.readyState,
  error: lastDbError,
});

export const waitForDb = (timeoutMs = 3000) => {
  if (isDbConnected()) return Promise.resolve(true);
  if (mongoose.connection.readyState !== 2) return Promise.resolve(false);

  return new Promise((resolve) => {
    const done = (value) => {
      clearTimeout(timer);
      mongoose.connection.off('connected', onConnected);
      resolve(value);
    };
    const onConnected = () => done(true);
    const timer = setTimeout(() => done(isDbConnected()), timeoutMs);
    mongoose.connection.on('connected', onConnected);
  });
};

export default connectDB;