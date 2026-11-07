import React, { useState } from 'react';
import { Wrench, Video, AlertCircle, Sparkles, CheckCircle2, Play, RefreshCw } from 'lucide-react';
import { Article, TechniqueStep } from '../types/research';

interface ShowMeHowProps {
  article: Article;
  language: 'en' | 'es';
  lowDataMode: boolean;
}

export const ShowMeHow: React.FC<ShowMeHowProps> = ({
  article,
  language,
  lowDataMode,
}) => {
  const [steps, setSteps] = useState<TechniqueStep[]>(article.technique_steps || []);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [videoStatus, setVideoStatus] = useState<'idle' | 'generating' | 'ready' | 'fallback'>('idle');
  const [videoProgress, setVideoProgress] = useState(0);

  const handleExtractWithGemini = async () => {
    setLoadingSteps(true);
    try {
      const res = await fetch('/api/gemini/technique-steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleText: article.full_text,
          articleTitle: article.title,
          language,
        }),
      });
      const data = await res.json();
      if (data.sufficient_detail && Array.isArray(data.steps) && data.steps.length > 0) {
        setSteps(data.steps);
      }
    } catch (err) {
      console.warn("Failed to extract technique steps via Gemini, preserving verified steps:", err);
    } finally {
      setLoadingSteps(false);
    }
  };

  const handleMakeVideo = () => {
    setVideoStatus('generating');
    setVideoProgress(15);

    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setVideoStatus('ready');
          return 100;
        }
        return prev + 25;
      });
    }, 600);
  };

  if (!article.has_technique && steps.length === 0) {
    return null;
  }

  return (
    <div className="card-surface bg-white border-2 border-[#500000]/20 rounded-2xl p-5 sm:p-6 mb-8 shadow-xs">
      {/* Title & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#500000] text-white flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5 text-amber-300" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              {language === 'es' ? 'Cómo se Hace: Pasos Prácticos' : 'Show Me How: Practical Field Steps'}
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'es'
                ? 'Pasos extraídos estrictamente del texto de esta investigación'
                : 'Extracted strictly from the text of this research study'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Make short video button */}
          {!lowDataMode && (
            <button
              type="button"
              onClick={handleMakeVideo}
              disabled={videoStatus === 'generating'}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Video className="w-4 h-4" aria-hidden="true" />
              <span>
                {videoStatus === 'generating'
                  ? language === 'es'
                    ? 'Generando con Veo...'
                    : 'Generating with Veo...'
                  : language === 'es'
                  ? 'Hacer Video Corto'
                  : 'Make a Short Video'}
              </span>
            </button>
          )}

          {/* Refresh/Extract */}
          <button
            type="button"
            onClick={handleExtractWithGemini}
            disabled={loadingSteps}
            title="Re-extract with Gemini"
            aria-label="Re-extract steps"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loadingSteps ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Video Generation Simulation / Player */}
      {!lowDataMode && videoStatus !== 'idle' && (
        <div className="mb-6 p-4 rounded-xl bg-stone-900 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {language === 'es' ? 'Clip Guía de Campo (Veo)' : 'Field Guide Clip (Veo)'}
            </span>
            <span className="text-[11px] text-stone-400">
              AI illustration — follow the written steps.
            </span>
          </div>

          {videoStatus === 'generating' ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-full bg-stone-800 rounded-full h-2.5 max-w-md mx-auto overflow-hidden">
                <div
                  className="bg-amber-400 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
              <p className="text-sm text-stone-300">
                {language === 'es'
                  ? `Sintetizando pasos visuales... ${videoProgress}%`
                  : `Synthesizing field steps... ${videoProgress}%`}
              </p>
            </div>
          ) : (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-stone-950 flex flex-col justify-between p-4 border border-stone-800">
              <div className="flex items-center justify-between">
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  AgriLife Field Clip
                </span>
                <span className="text-xs text-stone-300">
                  {steps.length} {language === 'es' ? 'pasos demostrados' : 'demonstrated steps'}
                </span>
              </div>

              <div className="text-center my-auto">
                <div className="w-14 h-14 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center mx-auto mb-2 shadow-lg cursor-pointer hover:scale-105 transition-transform">
                  <Play className="w-7 h-7 fill-stone-950 ml-0.5" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">{article.title}</h4>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  {language === 'es'
                    ? 'Simulación generada a partir de los pasos de la investigación. Recuerde verificar las condiciones locales con su agente de Extensión.'
                    : 'Field demonstration preview compiled from research steps. Remember to verify local conditions with your county Extension agent.'}
                </p>
              </div>

              <div className="text-[11px] text-stone-400 text-center border-t border-stone-800 pt-2">
                AI illustration — follow the written steps.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step by Step Breakdown */}
      {steps.length === 0 ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">
              {language === 'es'
                ? 'Esta publicación no contiene suficientes detalles para pasos de equipo.'
                : 'This publication does not contain enough equipment detail for clear field steps.'}
            </p>
            <p className="text-xs text-amber-700 mt-1">
              {language === 'es'
                ? 'No inventamos pasos que no estén en el texto. Consulte con su oficina de Extensión.'
                : 'We strictly refuse to guess or invent steps. Consult your county AgriLife Extension office.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {steps.map((st, index) => (
            <div
              key={st.step_number || index}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Step Image (Diagram Style with Mandatory Label) */}
                {!lowDataMode && (
                  <div className="sm:w-48 shrink-0">
                    <div className="relative rounded-lg overflow-hidden border border-stone-300 bg-white shadow-2xs aspect-4/3 flex items-center justify-center">
                      <img
                        src={st.image_url || article.image_url || "/src/assets/images/hero_texas_agriculture_1794072805147.jpg"}
                        alt={`Diagram for Step ${st.step_number}: ${st.title}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-[10px] text-stone-600 text-center mt-1 font-medium italic">
                      AI illustration — follow the written steps.
                    </p>
                  </div>
                )}

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-7 h-7 rounded-full bg-[#500000] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {st.step_number || index + 1}
                    </span>
                    <h4 className="text-base font-bold text-stone-900">{st.title}</h4>
                  </div>

                  <p className="text-sm text-stone-800 leading-relaxed pl-9 mb-2">
                    {st.description}
                  </p>

                  {st.caution && (
                    <div className="ml-9 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong>{language === 'es' ? 'Precaución: ' : 'Caution: '}</strong>
                        {st.caution}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
