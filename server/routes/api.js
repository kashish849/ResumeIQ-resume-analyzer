import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });
import {
  handleParseResume,
  handleAnalyze,
  handleJobMatch,
  handleTemplates,
  handleReportExport,
} from '../controllers/analyzeController.js';

const router = Router();

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB, matches spec

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are supported.'));
    }
    cb(null, true);
  },
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'resumeiq-api', time: new Date().toISOString() });
});

router.post('/parse-resume', upload.single('resume'), handleParseResume);
router.post('/analyze', upload.single('resume'), handleAnalyze);
router.post('/job-match', handleJobMatch);
router.get('/templates', handleTemplates);
router.post('/report', handleReportExport);

export default router;
