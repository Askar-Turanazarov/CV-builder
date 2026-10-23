import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { generateResumeRouter } from './routes/generateResume.route.js';
import { exportPdfRouter } from './routes/exportPdf.route.js';
import { generateCoverLetterRouter } from './routes/generateCoverLetter.route.js';
import { exportCoverLetterPdfRouter } from './routes/exportCoverLetterPdf.route.js';
import { errorHandler } from './middleware/errorHandler.js';

// The Express app without listen(): index.ts serves it locally, and on
// Vercel api/index.mjs exports it as the serverless function.
export const app = express();

// Behind Vercel's proxy the client IP is in X-Forwarded-For — needed for the
// per-IP rate limits to see real visitors instead of the proxy.
if (process.env.VERCEL) app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/generate-resume', generateResumeRouter);
app.use('/api/export-pdf', exportPdfRouter);
app.use('/api/generate-cover-letter', generateCoverLetterRouter);
app.use('/api/export-cover-letter-pdf', exportCoverLetterPdfRouter);

app.use(errorHandler);
