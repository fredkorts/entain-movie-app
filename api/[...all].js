// api/[...all].js
const app = require('../backend/dist/index.js').default;

module.exports = (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  // If it's /api/movies (list), rewrite to /movies; let [id].js handle /api/movies/:id
  if (/^\/api\/movies(\/)?$/.test(url.pathname)) {
    req.url = '/movies' + url.search;
  } else if (/^\/api\/health(\/)?$/.test(url.pathname)) {
    req.url = '/health' + url.search;
  } else {
    // Fallback: strip leading /api if present
    req.url = url.pathname.replace(/^\/api(\/|$)/, '/') + url.search;
  }
  return app(req, res);
};
