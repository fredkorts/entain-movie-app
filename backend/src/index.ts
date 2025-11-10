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

// Health (only /api/* is invoked on Vercel; /health root 404 is expected there)
const healthHandler: RequestHandler = (_req, res) => {
  res.json({ ok: true, service: 'backend', timestamp: new Date().toISOString() });
};
app.get('/api/health', healthHandler);

// Movies routes (serverless will call with /api/*)
app.use('/api/movies', moviesRouter);

// 404 fallback
const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { message: 'Not found', status: 404 } });
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

// Local dev server (Vercel sets VERCEL=1 in functions)
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
}
