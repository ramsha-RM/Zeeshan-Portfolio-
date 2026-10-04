import crypto from 'node:crypto';

export const signUpload = (_req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({ message: 'Cloudinary is not configured on the server' });
  }

  const folder = process.env.CLOUDINARY_FOLDER || 'portfolio';
  const timestamp = Math.round(Date.now() / 1000);
  const signature = crypto
    .createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  res.json({ cloudName, apiKey, folder, timestamp, signature });
};
