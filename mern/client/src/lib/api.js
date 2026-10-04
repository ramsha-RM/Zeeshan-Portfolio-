export const apiBase = import.meta.env.VITE_API_URL || '';

export async function api(path, { method = 'GET', body, adminKey } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (adminKey) headers['x-admin-key'] = adminKey;

  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error((data && data.message) || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function uploadImage(file, adminKey) {
  const sign = await api('/api/uploads/sign', { method: 'POST', adminKey });
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sign.apiKey);
  form.append('timestamp', sign.timestamp);
  form.append('signature', sign.signature);
  form.append('folder', sign.folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
    method: 'POST',
    body: form
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error((data.error && data.error.message) || 'Image upload failed');
  }

  return data.secure_url;
}
