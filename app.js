// ==============================================================================
// Hostinger Node.js Universal Entry Point (CommonJS + ES Module Bridge)
// Compatible with:
//  - Phusion Passenger (CloudLinux / cPanel / LiteSpeed)
//  - Direct node server.js / node app.js
//  - Hostinger hPanel Node.js Application Manager
// ==============================================================================

let appInstance = null;

const handler = (req, res) => {
  if (appInstance) {
    return appInstance(req, res);
  }
  const checkInterval = setInterval(() => {
    if (appInstance) {
      clearInterval(checkInterval);
      appInstance(req, res);
    }
  }, 50);
};

module.exports = handler;

(async () => {
  try {
    const backend = await import('./backend/server.js');
    appInstance = backend.default || backend;
  } catch (err) {
    console.error('[Hostinger Startup Error]:', err);
  }
})();
