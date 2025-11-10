// api/[...all].js
const app = require('../backend/dist/index.js').default;

module.exports = (req, res) => {
  // Vercel puts everything after /api/ into req.query['...all']
  const rest = req.query['...all'];
  if (rest) {
    const segments = Array.isArray(rest) ? rest.join('/') : rest; // e.g. "movies/1025527"
    // Preserve the original query string (minus the ...all param)
    const url = new URL(req.url, 'http://localhost');
    url.searchParams.delete('...all');
    req.url = `/${segments}${url.search}`; // becomes "/movies/1025527?lang=ru"
  }
  return app(req, res);
};
