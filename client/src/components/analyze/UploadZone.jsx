import { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

const MAX_SIZE = 8 * 1024 * 1024;

function formatSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadZone({ file, onFileSelected, onRemove, error }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function validateAndSet(candidate) {
    if (!candidate) return;
    if (candidate.type !== 'application/pdf') {
      onFileSelected(null, 'Only PDF files are supported.');
      return;
    }
    if (candidate.size > MAX_SIZE) {
      onFileSelected(null, 'File size exceeds the 8 MB limit.');
      return;
    }
    onFileSelected(candidate, null);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  }

  if (file) {
    return (
      <div className="card flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text">{file.name}</p>
          <p className="text-xs text-muted">{formatSize(file.size)}</p>
        </div>
        <button onClick={onRemove} className="text-muted hover:text-danger" aria-label="Remove file">
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
      >
        <UploadCloud size={30} className="text-muted" />
        <p className="mt-4 text-sm font-medium text-text">Drop your resume here</p>
        <p className="mt-1 text-sm text-muted">
          or <span className="font-medium text-primary">browse files</span>
        </p>
        <p className="mt-4 text-xs text-muted">Supported: PDF · Maximum 8 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
