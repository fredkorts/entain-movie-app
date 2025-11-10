import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(helmet());
app.use(cors());          // we'll restrict origins later if needed
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'backend', timestamp: new Date().toISOString() });
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
