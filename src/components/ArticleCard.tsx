import React from 'react';
import { ShieldCheck, Clock, FileText, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Article, MyFarmSettings } from '../types/research';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  language: 'en' | 'es';
  lowDataMode: boolean;
  farmSettings: MyFarmSettings;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  language,
  lowDataMode,
  farmSettings,
}) => {
  // Check if article matches user's farm
  const matchesCrop = article.crops.some((c) => farmSettings.crops.includes(c));
  const matchesFarm = matchesCrop;

  const takeawayText =
    language === 'es' && article.spanish_takeaway
      ? article.spanish_takeaway
      : article.takeaway;

  return (
    <article
      onClick={() => onSelect(article)}
      className="card-surface group relative bg-[#F5F5F5] hover:bg-white border border-stone-200 hover:border-[#500000]/40 rounded-2xl p-5 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Meta Line: Unboxed, typographic discipline */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 text-xs text-stone-500 font-medium">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
              {article.type === 'research'
                ? language === 'es'
                  ? 'Investigación'
                  : 'Research'
                : language === 'es'
                ? 'Noticia'
                : 'News'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.source_repository}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
          </div>

          {/* Farm Match Tag */}
          {matchesFarm && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#500000] bg-[#500000]/10 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3 text-[#500000]" aria-hidden="true" />
              {language === 'es' ? 'Para su cultivo' : 'Matches Your Farm'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#500000] transition-colors leading-snug mb-3">
          {article.title}
        </h3>

        {/* One-Sentence Plain Takeaway */}
        <div className="mb-4 bg-white/90 p-3.5 rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm sm:text-[15px] text-stone-800 font-medium leading-relaxed">
              <strong className="text-stone-900">
                {language === 'es' ? 'En pocas palabras:' : 'Quick Takeaway:'}{' '}
              </strong>
              {takeawayText}
            </p>
          </div>
        </div>

        {/* Image (Hidden in Low Data Mode) */}
        {!lowDataMode && article.image_url && (
          <div className="relative mb-4 h-44 rounded-xl overflow-hidden bg-stone-200">
            <img
              src={article.image_url}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}

        {/* Crops and Topics: Unboxed Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 mb-4">
          <span className="font-semibold text-stone-800">
            {language === 'es' ? 'Cultivos:' : 'Crops:'}
          </span>
          {article.crops.map((crop, idx) => (
            <span key={crop}>
              {crop}
              {idx < article.crops.length - 1 ? ' · ' : ''}
            </span>
          ))}

          <span className="text-stone-300 mx-1">|</span>

          <span className="font-semibold text-stone-800">
            {language === 'es' ? 'Temas:' : 'Topics:'}
          </span>
          {article.topics.map((topic, idx) => (
            <span key={topic} className="capitalize">
              {topic}
              {idx < article.topics.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Review Status Badge & Open Button */}
      <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
        {/* Review Status Badge */}
        {article.review_status === 'reviewed' ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32]">
            <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {language === 'es'
                ? `Revisado por ${article.reviewer_name?.split(',')[0] || 'Especialista'}`
                : `Reviewed by ${article.reviewer_name?.split(',')[0] || 'Specialist'}`}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D97706]">
            <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {language === 'es'
                ? 'Borrador IA – pendiente de revisión'
                : 'AI draft – pending specialist review'}
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-1 text-xs font-bold text-[#500000] group-hover:translate-x-1 transition-transform">
          <span>{language === 'es' ? 'Ver resumen' : 'View Guide'}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
};
