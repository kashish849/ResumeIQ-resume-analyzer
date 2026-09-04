import { useEffect, useState } from 'react';
import { fetchTemplates } from '../../services/api.js';
import { useToast } from '../../components/Toast.jsx';
import { FileText, Loader2 } from 'lucide-react';

export default function Templates() {
  const [templates, setTemplates] = useState(null);
  const [selected, setSelected] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTemplates()
      .then((data) => setTemplates(data.templates))
      .catch((err) => {
        showToast(err.message, 'error');
        setTemplates([]);
      });
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text">Resume templates</h1>
        <p className="mt-1 text-sm text-muted">Pick a starting layout, then tailor it to your experience.</p>
      </div>

      {templates === null ? (
        <div className="flex justify-center py-16">
          <Loader2 size={22} className="animate-spin text-muted" />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div key={t.id} className="card overflow-hidden p-0">
              <div className="flex h-40 items-center justify-center bg-surface-2">
                <FileText size={32} className="text-muted" />
              </div>
              <div className="p-5">
                <p className="font-display font-semibold text-text">{t.name}</p>
                <p className="mt-1 text-sm text-muted">{t.description}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelected(t.id)}
                    className={selected === t.id ? 'btn-primary flex-1 py-2 text-sm' : 'btn-secondary flex-1 py-2 text-sm'}
                  >
                    {selected === t.id ? 'Selected' : 'Use template'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
