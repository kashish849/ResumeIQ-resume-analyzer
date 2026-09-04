import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import UploadZone from '../../components/analyze/UploadZone.jsx';
import { parseResume, matchJob } from '../../services/api.js';
import { useToast } from '../../components/Toast.jsx';

export default function JobMatcher() {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { showToast } = useToast();

  async function handleMatch() {
    if (!file) {
      setFileError('Please attach a PDF resume to compare.');
      return;
    }
    if (!jobDescription.trim()) {
      showToast('Please add a job description to calculate job match.', 'error');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { parsed } = await parseResume({ file });
      const { jobMatch } = await matchJob({ resumeText: parsed.rawText, jobDescription });
      setResult(jobMatch);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text">Job matcher</h1>
        <p className="mt-1 text-sm text-muted">
          Compare a resume against a specific job description to see your fit.
        </p>
      </div>

      <UploadZone
        file={file}
        error={fileError}
        onFileSelected={(f, err) => { setFile(f); setFileError(err); }}
        onRemove={() => { setFile(null); setFileError(null); }}
      />

      <div>
        <label htmlFor="jd" className="mb-2 block text-sm font-medium text-text">
          Job description
        </label>
        <textarea
          id="jd"
          rows={8}
          className="input resize-none"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <button onClick={handleMatch} disabled={loading} className="btn-primary w-full py-3 text-base">
        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Calculate match'}
      </button>

      {result && (
        <div className="card p-6">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted">Job match</p>
            <p className="font-display text-3xl font-bold text-primary">{result.matchPercentage}%</p>
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium text-muted">Matching keywords</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.matchingKeywords.map((k) => (
                <span key={k} className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  {k}
                </span>
              ))}
              {!result.matchingKeywords.length && <p className="text-sm text-muted">None found.</p>}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium text-muted">Missing</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.missingKeywords.map((k) => (
                <span key={k} className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                  {k}
                </span>
              ))}
              {!result.missingKeywords.length && <p className="text-sm text-muted">None — great coverage.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
