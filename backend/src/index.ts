import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import moviesRouter from './routes/movies';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health on both paths (covers Vercel's /api/* and stripped path)
app.get(['/api/health', '/health'], (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'backend', timestamp: new Date().toISOString() });
});

// Movies on both paths
app.use(['/api/movies', '/movies'], moviesRouter);

// 404 fallback
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: { message: 'Not found', status: 404 } });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err?.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  if (err?.retryAfter) res.set('Retry-After', String(err.retryAfter)); // <-- use res.set, not setHeader
  res.status(status).json({ error: { message, status } });
});

export default app;

// Local dev only
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
}
