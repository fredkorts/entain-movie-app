// api/movies/[id].js
const app = require('../../../backend/dist/index.js').default;

module.exports = (req, res) => {
  // Extract the id from the path: /api/movies/:id
  // Works regardless of query string.
  const m = req.url.match(/^\/api\/movies\/([^/?#]+)(.*)$/);
  const id = m?.[1];
  const rest = m?.[2] ?? '';

  // Rewrite to your Express route (/movies/:id?...)
  req.url = `/movies/${id || ''}${rest}`;

  // Optional one-line debug in Vercel logs:
  // console.log('DETAIL forward to:', req.url);

  return app(req, res);
};
