import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Basic rate limiting to protect the analysis endpoints from abuse.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again shortly.' },
});
app.use('/api', limiter);

app.use('/api', apiRoutes);

// Serve the built React app (client/dist) when it exists, so this single
// server can host both the API and the frontend — no separate static host needed.
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Central error handler so a bad PDF or upload never surfaces "Failed to fetch".
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'MulterError' || err.message?.includes('file')) {
    return res.status(400).json({ error: err.message || 'There was a problem with your uploaded file.' });
  }
  res.status(err.status || 500).json({
    error: err.publicMessage || 'Something went wrong on the ResumeIQ server. Please try again.',
  });
});

app.listen(PORT, () => {
  console.log(`ResumeIQ API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
