import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertTriangle, XCircle, Calendar, Sparkles, RefreshCw, ThermometerSun } from 'lucide-react';
import { Article, TexasCounty, MyFarmSettings } from '../types/research';
import { INSTITUTION_CONFIG } from '../services/researchApi';
import { ensureAiReady, generateFieldGuide } from '../services/aiClient';

interface FieldGuideGeneratorProps {
  article: Article;
  currentCounty: TexasCounty;
  farmSettings: MyFarmSettings;
  language: 'en' | 'es';
}

interface FieldGuideResult {
  applies_to_farm: 'yes' | 'partially' | 'no';
  applicability_explanation: string;
  practical_steps: string[];
  timing_window: string;
  cautions: string;
  extension_recommendation: string;
}

export const FieldGuideGenerator: React.FC<FieldGuideGeneratorProps> = ({
  article,
  currentCounty,
  farmSettings,
  language,
}) => {
  const [selectedCounty, setSelectedCounty] = useState(farmSettings.county || currentCounty.name);
  const [selectedCrop, setSelectedCrop] = useState(
    farmSettings.crops[0] || article.crops[0] || 'Cotton'
  );
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<FieldGuideResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateGuide = async () => {
    if (!(await ensureAiReady())) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateFieldGuide({
        articleText: article.full_text,
        articleTitle: article.title,
        county: selectedCounty,
        crop: selectedCrop,
        language,
      });
      if (data.fieldGuide) {
        setGuide(data.fieldGuide);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.error('Failed to generate localized field guide:', err);
      setError(
        language === 'es'
          ? 'No se pudo generar la guía. Intente de nuevo.'
          : "Couldn't generate the guide. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-surface bg-[#F5F5F5] border border-stone-200 rounded-2xl p-5 sm:p-6 mb-8 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#500000] text-white flex items-center justify-center shrink-0">
          <Compass className="w-5 h-5 text-amber-300" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            {language === 'es'
              ? '¿Qué significa esto para mi campo?'
              : 'What This Means for My Farm'}
          </h3>
          <p className="text-xs text-stone-600">
            {language === 'es'
              ? 'Adapte esta investigación de Texas A&M a su ubicación y cultivo exactos'
              : 'Custom agronomic translation for your exact Texas county and crops'}
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="guide-county-select" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            {language === 'es' ? 'Condado' : 'Texas County'}
          </label>
          <select
            id="guide-county-select"
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 focus:border-[#500000] focus:outline-none"
          >
            {INSTITUTION_CONFIG.counties.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} County ({c.region})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="guide-crop-select" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            {language === 'es' ? 'Cultivo o Ganado' : 'Target Crop / Enterprise'}
          </label>
          <select
            id="guide-crop-select"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 focus:border-[#500000] focus:outline-none"
          >
            <option value="Cotton">Cotton</option>
            <option value="Grain Sorghum">Grain Sorghum</option>
            <option value="Corn">Corn</option>
            <option value="Beef Cattle">Beef Cattle</option>
            <option value="Pasture / Hay">Pasture / Hay</option>
            <option value="Wheat">Wheat</option>
            <option value="Peaches">Peaches</option>
            <option value="Pecans">Pecans</option>
            <option value="Cover Crops">Cover Crops</option>
            <option value="Vegetables">Vegetables</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={generateGuide}
        disabled={loading}
        className="w-full min-h-[48px] bg-[#500000] hover:bg-[#680000] active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm mb-4"
      >
        <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
        <span>
          {loading
            ? language === 'es'
              ? 'Analizando aplicabilidad con Gemini...'
              : 'Analyzing applicability with Gemini...'
            : language === 'es'
            ? `Generar Guía de Campo para ${selectedCounty} Co. (${selectedCrop})`
            : `Generate Field Guide for ${selectedCounty} Co. (${selectedCrop})`}
        </span>
      </button>

      {error && (
        <p role="alert" className="-mt-2 mb-4 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {/* Results View */}
      {guide && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 animate-in fade-in">
          {/* Applicability Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              guide.applies_to_farm === 'yes'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : guide.applies_to_farm === 'partially'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-stone-100 border-stone-300 text-stone-900'
            }`}
          >
            {guide.applies_to_farm === 'yes' ? (
              <CheckCircle2 className="w-6 h-6 text-[#2E7D32] shrink-0 mt-0.5" />
            ) : guide.applies_to_farm === 'partially' ? (
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-stone-500 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm">
                {guide.applies_to_farm === 'yes'
                  ? language === 'es'
                    ? 'Esta investigación aplica directamente a su campo'
                    : 'This research applies directly to your farm'
                  : guide.applies_to_farm === 'partially'
                  ? language === 'es'
                    ? 'Aplica parcialmente – adaptaciones locales necesarias'
                    : 'Partially applies – local adaptations required'
                  : language === 'es'
                  ? 'No probado para este condado o cultivo'
                  : 'Not tested for this county or crop'}
              </h4>
              <p className="text-xs mt-1 leading-relaxed">{guide.applicability_explanation}</p>
            </div>
          </div>

          {/* Practical Steps */}
          {guide.practical_steps && guide.practical_steps.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                {language === 'es' ? 'Pasos Prácticos en su Campo:' : 'Practical Steps for Your Farm:'}
              </h5>
              <ol className="space-y-2">
                {guide.practical_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-800">
                    <span className="w-5 h-5 rounded-full bg-[#500000] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Timing & Cautions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100 text-xs">
            {guide.timing_window && (
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
                  <Calendar className="w-4 h-4 text-[#500000]" />
                  <span>{language === 'es' ? 'Momento Óptimo' : 'Timing Window'}</span>
                </div>
                <p className="text-stone-700">{guide.timing_window}</p>
              </div>
            )}

            {guide.cautions && (
              <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{language === 'es' ? 'Precauciones' : 'Cautions'}</span>
                </div>
                <p className="text-amber-950">{guide.cautions}</p>
              </div>
            )}
          </div>

          {/* County Extension Agent Note */}
          <div className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-lg border border-stone-200">
            {guide.extension_recommendation}
          </div>
        </div>
      )}
    </div>
  );
};
