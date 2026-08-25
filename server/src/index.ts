import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { generateResumeRouter } from './routes/generateResume.route.js';
import { exportPdfRouter } from './routes/exportPdf.route.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
// Deliberately not named PORT: some hosting/preview harnesses inject a PORT
// env var for "the" web process, which would collide with the client's dev
// server when both run under one `npm run dev`.
const PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3001;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/generate-resume', generateResumeRouter);
app.use('/api/export-pdf', exportPdfRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
