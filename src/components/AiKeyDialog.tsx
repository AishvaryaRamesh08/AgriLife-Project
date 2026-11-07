import React, { useEffect, useRef, useState } from 'react';
import { X, KeyRound, ExternalLink, Sparkles, Trash2, Loader2 } from 'lucide-react';
import {
  GEMINI_KEY_URL,
  STATIC_AI,
  describeKeyProblem,
  hasKey,
  registerKeyDialog,
  removeKey,
  saveKey,
  verifyKey,
} from '../services/aiClient';

interface AiKeyDialogProps {
  language: 'en' | 'es';
}

/**
 * Static (GitHub Pages) build only: asks the visitor for their own Gemini API
 * key the first time they use an AI feature, or when opened from Settings.
 */
export const AiKeyDialog: React.FC<AiKeyDialogProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keySaved, setKeySaved] = useState(hasKey());
  const resolverRef = useRef<((saved: boolean) => void) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const es = language === 'es';

  useEffect(() => {
    if (!STATIC_AI) return;
    return registerKeyDialog((resolve) => {
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      setValue('');
      setError(null);
      setKeySaved(hasKey());
      setIsOpen(true);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!STATIC_AI || !isOpen) return null;

  function close(saved: boolean) {
    setIsOpen(false);
    setChecking(false);
    resolverRef.current?.(saved);
    resolverRef.current = null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = value.trim();
    if (!key) {
      setError(es ? 'Pegue su clave primero.' : 'Paste your key first.');
      return;
    }
    setChecking(true);
    setError(null);
    const problem = await verifyKey(key);
    setChecking(false);
    if (problem === 'invalid') {
      setError(
        es
          ? 'Google no aceptó esa clave. Revise que la copió completa.'
          : "Google didn't accept that key. Check that you copied all of it."
      );
      return;
    }
    if (problem === 'quota' || problem === 'network') {
      setError(describeKeyProblem(problem, language));
      return;
    }
    saveKey(key);
    close(true);
  };

  const handleRemove = () => {
    removeKey();
    setKeySaved(false);
    setValue('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-key-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) close(false);
      }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        <div className="bg-[#500000] text-white px-5 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-amber-300" aria-hidden="true" />
            <div>
              <h2 id="ai-key-title" className="text-lg font-bold">
                {es ? 'Activar respuestas de IA' : 'Turn on AI answers'}
              </h2>
              <p className="text-xs text-stone-200">
                {es ? 'Con su propia clave gratuita de Gemini' : 'With your own free Gemini API key'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => close(false)}
            aria-label={es ? 'Cerrar' : 'Close'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
          <p className="text-sm text-stone-700 leading-relaxed">
            {es
              ? 'Este sitio funciona por completo en su navegador, sin servidor. El chat, el escaneo de fotos y las guías de campo usan Gemini de Google con su propia clave. Los artículos, el clima y su configuración funcionan sin clave.'
              : 'This site runs entirely in your browser, with no server. The chat, photo scan and field guides use Google Gemini with your own key. Articles, weather and your farm settings work without one.'}
          </p>

          <a
            href={GEMINI_KEY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#500000] underline underline-offset-2 hover:text-[#680000]"
          >
            {es ? 'Obtener una clave gratis en Google AI Studio' : 'Get a free key from Google AI Studio'}
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>

          <div>
            <label htmlFor="ai-key-input" className="block text-sm font-bold text-stone-900 mb-1.5">
              {es ? 'Clave de API de Gemini' : 'Gemini API key'}
            </label>
            <input
              ref={inputRef}
              id="ai-key-input"
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={keySaved ? (es ? 'Clave guardada: pegue una nueva para cambiarla' : 'Key saved: paste a new one to replace it') : 'AIza…'}
              className="w-full min-h-[48px] px-3.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/40 focus:border-[#500000]"
            />
            {error && (
              <p role="alert" className="mt-2 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={checking}
            className="w-full min-h-[50px] bg-[#500000] hover:bg-[#600000] disabled:opacity-70 text-white font-bold text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {checking ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-300" aria-hidden="true" />
            )}
            {checking ? (es ? 'Verificando clave…' : 'Checking key…') : es ? 'Guardar y activar IA' : 'Save & turn on AI'}
          </button>

          {keySaved && (
            <button
              type="button"
              onClick={handleRemove}
              className="w-full min-h-[44px] text-sm font-bold text-stone-600 hover:text-red-700 inline-flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              {es ? 'Quitar la clave guardada de este navegador' : 'Remove the saved key from this browser'}
            </button>
          )}

          <p className="text-xs text-stone-500 leading-relaxed">
            {es
              ? 'Su clave se guarda solo en este navegador y se envía solo a Google. Nunca llega a este sitio ni a GitHub.'
              : 'Your key is stored only in this browser and is sent only to Google. It never reaches this site or GitHub.'}
          </p>
        </form>
      </div>
    </div>
  );
};
