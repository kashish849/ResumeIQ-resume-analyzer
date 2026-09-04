import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../../components/analyze/UploadZone.jsx';
import ProcessingSteps from '../../components/analyze/ProcessingSteps.jsx';
import { analyzeResume } from '../../services/api.js';
import { addHistoryEntry } from '../../lib/history.js';
import { useToast } from '../../components/Toast.jsx';

const SAMPLE_JOB = `We're looking for a Frontend Developer with 2+ years of experience in React, JavaScript, and REST APIs. You'll collaborate with our team to build responsive web applications, write tests with Jest, and work within a CI/CD pipeline. TypeScript experience is a strong plus. Familiarity with Git and agile workflows is expected.`;

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const stepTimer = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => () => clearInterval(stepTimer.current), []);

  function handleFileSelected(selected, error) {
    setFile(selected);
    setFileError(error);
  }

  async function handleAnalyze() {
    if (!file) {
      setFileError('Please attach a PDF resume to analyze.');
      return;
    }
    setAnalyzing(true);
    setStepIndex(0);
    stepTimer.current = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, 5));
    }, 700);

    try {
      const result = await analyzeResume({ file, jobDescription });
      clearInterval(stepTimer.current);
      setStepIndex(6);
      addHistoryEntry({ fileName: file.name, analysis: result.analysis, jobMatch: result.jobMatch });
      sessionStorage.setItem(
        'resumeiq-last-analysis',
        JSON.stringify({ fileName: file.name, ...result })
      );
      setTimeout(() => navigate('/dashboard/results'), 400);
    } catch (err) {
      clearInterval(stepTimer.current);
      setAnalyzing(false);
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text">Analyze resume</h1>
        <p className="mt-1 text-sm text-muted">
          Upload a PDF and, optionally, a job description to see your ATS score and job match.
        </p>
      </div>

      {analyzing ? (
        <ProcessingSteps activeIndex={stepIndex} />
      ) : (
        <>
          <UploadZone
            file={file}
            error={fileError}
            onFileSelected={handleFileSelected}
            onRemove={() => { setFile(null); setFileError(null); }}
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="jd" className="text-sm font-medium text-text">
                Job description <span className="text-muted">(optional)</span>
              </label>
              <div className="flex gap-3 text-xs">
                <button onClick={() => setJobDescription(SAMPLE_JOB)} className="font-medium text-primary hover:text-primary-hover">
                  Use sample job
                </button>
                <button onClick={() => setJobDescription('')} className="font-medium text-muted hover:text-text">
                  Clear
                </button>
              </div>
            </div>
            <textarea
              id="jd"
              rows={8}
              className="input resize-none"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="mt-1.5 text-right text-xs text-muted">{jobDescription.length} characters</p>
          </div>

          <button onClick={handleAnalyze} className="btn-primary w-full py-3 text-base">
            Analyze
          </button>
        </>
      )}
    </div>
  );
}
