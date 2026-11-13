// ==============================================================================
// Hostinger Node.js Universal Entry Point (CommonJS + ES Module Bridge)
// Compatible with:
//  - Phusion Passenger (CloudLinux / cPanel / LiteSpeed)
//  - Direct node server.js / node app.js
//  - Hostinger hPanel Node.js Application Manager
// ==============================================================================

let appInstance = null;
let initError = null;

const renderErrorPage = (err) => {
  const errText = err ? (err.stack || err.message || String(err)) : 'Server initialization in progress. Please refresh in a few moments.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>503 Service Unavailable</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #1e293b; border-radius: 12px; padding: 32px; max-width: 650px; width: 100%; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); border: 1px solid #334155; }
    h1 { color: #f87171; margin-top: 0; font-size: 22px; }
    p { color: #94a3b8; line-height: 1.6; font-size: 14px; }
    pre { background: #0f172a; padding: 14px; border-radius: 8px; overflow-x: auto; font-size: 13px; color: #fca5a5; border: 1px solid #ef444433; white-space: pre-wrap; word-break: break-word; }
    .btn { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-top: 16px; cursor: pointer; border: none; }
    .btn:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div class="card">
    <h1>503 - Application Startup Notice</h1>
    <p>${err ? 'The server encountered an error while starting up:' : 'Server initialization is still in progress. Please refresh in a few moments.'}</p>
    ${err ? `<pre><code>${errText}</code></pre>` : ''}
    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">Hostinger Node.js Application Bridge</p>
    <button onclick="location.reload()" class="btn">Refresh Page</button>
  </div>
</body>
</html>`;
};

const handler = (req, res) => {
  if (appInstance) {
    return appInstance(req, res);
  }

  if (initError) {
    if (!res.headersSent) {
      res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderErrorPage(initError));
    }
    return;
  }

  let attempts = 0;
  const maxAttempts = 600; // 30 seconds max (600 * 50ms)
  const timer = setInterval(() => {
    attempts++;
    if (appInstance) {
      clearInterval(timer);
      return appInstance(req, res);
    }
    if (initError || attempts >= maxAttempts) {
      clearInterval(timer);
      if (!res.headersSent) {
        res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderErrorPage(initError));
      }
    }
  }, 50);
};

module.exports = handler;

(async () => {
  try {
    const backend = await import('./backend/server.js');
    appInstance = backend.default || backend;
    console.log('[Hostinger Bridge] Backend successfully initialized.');
  } catch (err) {
    initError = err;
    console.error('[Hostinger Startup Error]:', err.stack || err.message || err);
  }
})();
