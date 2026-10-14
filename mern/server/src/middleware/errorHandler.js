export const notFound = (req, res) => res.status(404).json({ message: 'No route for ' + req.originalUrl });

export const errorHandler = (err, _req, res, _next) => {
  // Malformed JSON body from express.json()
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'The request body is not valid JSON.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'The request is too large.' });
  }
  if (err.status === 403 && err.expose) {
    return res.status(403).json({ message: err.message });
  }

  console.error(err);
  const status = err.status || err.statusCode || 500;
  // Don't leak internal error details on unexpected failures.
  const message = status < 500 && err.expose ? err.message : 'Something went wrong on our side. Please try again.';
  return res.status(status).json({ message });
};
