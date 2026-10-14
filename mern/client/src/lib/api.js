export const apiBase = import.meta.env.VITE_API_URL || '';

const DEFAULT_TIMEOUT_MS = 15000;

/** Human-readable fallback text for responses that carried no usable message. */
const messageForStatus = (status) => {
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'This request was blocked.';
  if (status === 404) return 'We couldn’t find what you were looking for.';
  if (status === 413) return 'That’s too much data to send at once.';
  if (status === 429) return 'Too many requests. Please wait a little and try again.';
  if (status >= 500) return 'The server is having trouble right now. Please try again in a few minutes.';
  return 'Something went wrong. Please try again.';
};

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function api(path, { method = 'GET', body, timeout = DEFAULT_TIMEOUT_MS, credentials = 'include' } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials,
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('The server took too long to respond. Please try again.', 0);
    }
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    throw new ApiError(
      offline
        ? 'You appear to be offline. Check your connection and try again.'
        : 'Couldn’t reach the server. Check your connection and try again.',
      0
    );
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  const isJson = (response.headers.get('content-type') || '').includes('application/json');
  if (isJson) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new ApiError((data && typeof data.message === 'string' && data.message) || messageForStatus(response.status), response.status);
  }

  return data;
}

export async function uploadImage(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }

  const sign = await api('/api/uploads/sign', { method: 'POST' });
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sign.apiKey);
  form.append('timestamp', sign.timestamp);
  form.append('signature', sign.signature);
  form.append('folder', sign.folder);

  let response;
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
      method: 'POST',
      body: form
    });
  } catch {
    throw new Error('Couldn’t reach the image service. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data.error && data.error.message) || 'Image upload failed. Please try again.');
  }

  return data.secure_url;
}
