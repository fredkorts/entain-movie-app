import 'dotenv/config';
import express, { type RequestHandler, type ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import moviesRouter from './routes/movies';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health
const healthHandler: RequestHandler = (_req, res) => {
  res.json({ ok: true, service: 'backend', timestamp: new Date().toISOString() });
};
app.get('/health', healthHandler);

/**
 * IMPORTANT:
 * Vercel functions receive /api/*, but our edge shims rewrite:
 *   - /api/movies            -> /movies
 *   - /api/movies/:id?lang=  -> /movies/:id?lang=
 * so mount the router at /movies in Express.
 */
app.use('/movies', moviesRouter);

// 404 – keep it chatty so we can see what missed
const notFound: RequestHandler = (req, res) => {
  // If you want, uncomment next line to see misses in logs:
  // console.warn('Express 404:', req.method, req.originalUrl);
  res.status(404).json({ error: { message: 'Not found', status: 404, path: req.originalUrl } });
};
app.use(notFound);

// Error handler
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = (err && (err as any).status) || 500;
  const message = status === 500 ? 'Internal server error' : (err && err.message) || 'Error';
  if ((err as any)?.retryAfter) res.set('Retry-After', String((err as any).retryAfter));
  res.status(status).json({ error: { message, status } });
};
app.use(errorHandler);

export default app;

// Local dev only
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
}
