const clients = new Set();

export function streamProjectEvents(_req, res) {
  res.set({
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'X-Accel-Buffering': 'no'
  });
  res.flushHeaders();
  res.write('retry: 3000\n\n');
  clients.add(res);

  const keepAlive = setInterval(() => {
    if (res.writable) res.write(': keep-alive\n\n');
  }, 20000);

  res.on('close', () => {
    clearInterval(keepAlive);
    clients.delete(res);
  });
}

export function publishProjectChange() {
  for (const client of clients) {
    if (!client.writable) {
      clients.delete(client);
      continue;
    }
    client.write('event: projects-changed\ndata: {}\n\n');
  }
}
