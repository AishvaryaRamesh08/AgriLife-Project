import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  MapPin,
  Calendar,
  Filter,
} from 'lucide-react';
import { Article, FarmerFeedback } from '../types/research';

interface ResearcherDashboardProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onBackToFeed: () => void;
  language: 'en' | 'es';
}

export const ResearcherDashboard: React.FC<ResearcherDashboardProps> = ({
  articles,
  onSelectArticle,
  onBackToFeed,
  language,
}) => {
  const [feedbacks, setFeedbacks] = useState<FarmerFeedback[]>([]);
  const [filterCounty, setFilterCounty] = useState('all');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('agrilife_farmer_feedbacks');
      if (stored) {
        setFeedbacks(JSON.parse(stored));
      } else {
        // Pre-seed some realistic farmer feedback from Texas counties
        const initialSamples: FarmerFeedback[] = [
          {
            id: 'fb-1',
            articleId: 'tamu-2024-cot-irr',
            articleTitle: 'Deficit Irrigation Strategies in Texas High Plains Cotton',
            helpful: true,
            triedOnFarm: true,
            note: 'Held well water until first bloom in Lubbock County. Lowered electricity pump bill by $18/acre with zero lint yield drag.',
            county: 'Lubbock',
            crop: 'Cotton',
            timestamp: '2026-09-12T14:32:00Z',
          },
          {
            id: 'fb-2',
            articleId: 'tamu-2024-cattle-forage',
            articleTitle: 'Drought-Resilient Pasture Stocking: Rotational Grazing with Tifton 85 Bermudagrass',
            helpful: true,
            triedOnFarm: true,
            note: 'Installed 4 polywire paddocks on Brazos river bottom pasture. Pulled heifers at 4 inches. Bermudagrass rebounded 2 weeks faster after August rains.',
            county: 'Brazos',
            crop: 'Beef Cattle',
            timestamp: '2026-08-28T10:15:00Z',
          },
          {
            id: 'fb-3',
            articleId: 'tamu-2024-soil-covercrop',
            articleTitle: 'Multi-Species Winter Cover Crops for Soil Water Storage and Weed Suppression',
            helpful: true,
            triedOnFarm: true,
            note: 'Terminated rye 24 days before corn planting in Williamson County heavy clay. Planter sliced clean through straw blanket.',
            county: 'Williamson',
            crop: 'Corn',
            timestamp: '2026-04-18T16:45:00Z',
          },
          {
            id: 'fb-4',
            articleId: 'tamu-2024-pest-armyworm',
            articleTitle: 'Action Thresholds and Insecticide Selection for Fall Armyworm',
            helpful: true,
            triedOnFarm: true,
            note: 'Switched from lambda to Prevathon after counting 3 worms/sq ft. 100% control, hay made quality premium.',
            county: 'Ellis',
            crop: 'Pasture / Hay',
            timestamp: '2026-08-04T09:20:00Z',
          },
        ];
        setFeedbacks(initialSamples);
        localStorage.setItem('agrilife_farmer_feedbacks', JSON.stringify(initialSamples));
      }
    } catch (e) {
      console.warn("Feedback load error:", e);
    }
  }, []);

  const totalVotes = feedbacks.filter((f) => f.helpful !== null).length;
  const positiveVotes = feedbacks.filter((f) => f.helpful === true).length;
  const helpfulPct = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 100;
  const triedCount = feedbacks.filter((f) => f.triedOnFarm).length;

  const filteredFeedbacks =
    filterCounty === 'all'
      ? feedbacks
      : feedbacks.filter((f) => f.county.toLowerCase() === filterCounty.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onBackToFeed}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#500000] hover:text-[#700000] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Volver al Feed' : 'Back to Feed'}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {language === 'es'
              ? 'Panel de Impacto para Investigadores y Extensión'
              : 'Researcher & Extension Field Impact Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {language === 'es'
              ? 'Monitoreo de retroalimentación de agricultores en tiempo real, validaciones en campo y estado de revisión de artículos.'
              : 'Real-time farmer adoption metrics, on-farm trial notes, and specialist review audit trail.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>TAMU AgriLife Extension Audit</span>
          </span>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card-surface bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
            {language === 'es' ? 'Utilidad Percibida' : 'Helpful Rating'}
          </div>
          <div className="text-3xl font-black text-[#2E7D32] tabular-nums">
            {helpfulPct}%
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {positiveVotes} {language === 'es' ? 'de' : 'of'} {totalVotes}{' '}
            {language === 'es' ? 'respuestas favorables' : 'positive farmer ratings'}
          </p>
        </div>

        <div className="card-surface bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
            {language === 'es' ? 'Pruebas en Campo' : 'On-Farm Trials'}
          </div>
          <div className="text-3xl font-black text-[#500000] tabular-nums">
            {triedCount}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'es'
              ? 'Productores que probaron el método'
              : 'Producers actively adopted practice'}
          </p>
        </div>

        <div className="card-surface bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
            {language === 'es' ? 'Publicaciones Totales' : 'Total Publications'}
          </div>
          <div className="text-3xl font-black text-stone-900 tabular-nums">
            {articles.length}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {articles.filter((a) => a.review_status === 'reviewed').length}{' '}
            {language === 'es' ? 'revisados por especialista' : 'peer-reviewed'}
          </p>
        </div>

        <div className="card-surface bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
            {language === 'es' ? 'Pendientes de Revisión' : 'Pending Review'}
          </div>
          <div className="text-3xl font-black text-amber-600 tabular-nums">
            {articles.filter((a) => a.review_status === 'ai_draft').length}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'es' ? 'Borradores IA esperando visto bueno' : 'AI drafts awaiting sign-off'}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Articles Status & Recent Farmer Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Publications Status & Quick Review Trigger */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-900">
            {language === 'es' ? 'Estado de Artículos en Biblioteca' : 'Library Review Pipeline'}
          </h2>

          <div className="space-y-3">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="p-4 bg-white rounded-xl border border-stone-200 hover:border-[#500000] cursor-pointer transition-all shadow-2xs flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      {art.crops.join(', ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[10px] text-stone-400">{art.source_repository}</span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 line-clamp-1">{art.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{art.authors}</p>
                </div>

                <div className="shrink-0 text-right">
                  {art.review_status === 'reviewed' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Reviewed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>AI Draft</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: "I tried this on my farm" Producer Notes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">
              {language === 'es' ? 'Notas de Productores en Campo' : 'Producer Field Notes'}
            </h2>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={filterCounty}
                onChange={(e) => setFilterCounty(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg text-xs px-2 py-1"
              >
                <option value="all">All Counties</option>
                <option value="Lubbock">Lubbock</option>
                <option value="Brazos">Brazos</option>
                <option value="Williamson">Williamson</option>
                <option value="Ellis">Ellis</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFeedbacks.length === 0 ? (
              <p className="text-xs text-stone-500 p-4 bg-stone-50 rounded-xl">
                No farmer notes recorded for this filter yet.
              </p>
            ) : (
              filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-1.5 font-bold text-stone-800">
                      <MapPin className="w-3.5 h-3.5 text-[#500000]" />
                      <span>
                        {fb.county} County · {fb.crop}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-stone-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(fb.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-stone-900">
                    "{fb.note || 'Applied recommended protocol on farm with positive outcomes.'}"
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="truncate max-w-[280px]">Study: {fb.articleTitle}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Tried on farm</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
