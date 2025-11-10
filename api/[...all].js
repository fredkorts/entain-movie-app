// api/[...all].js
const app = require('../backend/dist/index.js').default;

module.exports = (req, res) => {
  // Turn "/api/anything/here?x=1" into "/anything/here?x=1"
  const url = new URL(req.url, 'http://localhost');
  url.searchParams.delete('...all'); // clean up if present
  const normalizedPath = url.pathname.replace(/^\/api(\/|$)/, '/'); // always strip "/api"
  req.url = normalizedPath + url.search;

  // (Optional) quick debug to verify normalization in Vercel logs
  // console.log('Normalized to', req.url);

  return app(req, res);
};
