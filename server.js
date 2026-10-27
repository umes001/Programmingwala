// ==============================================================================
// Hostinger Node.js Universal Entry Point (CommonJS + ES Module Bridge)
// Compatible with:
//  - Phusion Passenger (CloudLinux / cPanel / LiteSpeed)
//  - Direct node server.js / node app.js
//  - Hostinger hPanel Node.js Application Manager
// ==============================================================================

let appInstance = null;
let initError = null;

const handler = (req, res) => {
  if (appInstance) {
    return appInstance(req, res);
  }

  if (initError) {
    if (!res.headersSent) {
      res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>503 Service Unavailable</h1><p>The application server is starting up. Please refresh shortly.</p>');
    }
    return;
  }

  let attempts = 0;
  const maxAttempts = 60; // 3 seconds max (60 * 50ms)
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
        res.end('<h1>503 Service Unavailable</h1><p>Server initialization in progress. Please refresh in a few moments.</p>');
      }
    }
  }, 50);
};

module.exports = handler;

(async () => {
  try {
    const backend = await import('./backend/server.js');
    appInstance = backend.default || backend;
  } catch (err) {
    initError = err;
    console.error('[Hostinger Startup Error]:', err.message || err);
  }
})();
