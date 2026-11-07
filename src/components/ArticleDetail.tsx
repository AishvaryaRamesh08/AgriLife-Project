import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Share2,
  Printer,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Copy,
  MessageSquare,
  Sparkles,
  Edit3,
  CloudSun,
  AlertTriangle,
} from 'lucide-react';
import { Article, TexasCounty, MyFarmSettings, GlossaryTerm, FarmerFeedback } from '../types/research';
import { ShowMeHow } from './ShowMeHow';
import { FieldGuideGenerator } from './FieldGuideGenerator';
import { saveReviewerApproval } from '../services/researchApi';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  county: TexasCounty;
  farmSettings: MyFarmSettings;
  language: 'en' | 'es';
  lowDataMode: boolean;
  reviewerMode: boolean;
  allArticles: Article[];
  onArticleUpdated: (updatedArticle: Article) => void;
  onOpenChat?: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onBack,
  county,
  farmSettings,
  language,
  lowDataMode,
  reviewerMode,
  allArticles,
  onArticleUpdated,
  onOpenChat,
}) => {
  const [readingLevel, setReadingLevel] = useState<'farmer' | 'technical'>('farmer');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<GlossaryTerm | null>(null);

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Feedback states
  const [feedbackHelpful, setFeedbackHelpful] = useState<boolean | null>(() => {
    try {
      const stored = localStorage.getItem(`feedback_helpful_${article.id}`);
      return stored !== null ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [triedOnFarm, setTriedOnFarm] = useState(false);
  const [farmerNote, setFarmerNote] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Reviewer edit states
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewerNameInput, setReviewerNameInput] = useState(
    article.reviewer_name || 'Dr. Robert Sloan, Texas A&M AgriLife Agronomist'
  );
  const [editedWhatStudied, setEditedWhatStudied] = useState(article.plain_summary.what_they_studied);
  const [editedWhatFound, setEditedWhatFound] = useState(article.plain_summary.what_found);
  const [editedWhatMeans, setEditedWhatMeans] = useState(article.plain_summary.what_it_means);
  const [editedThingsWatch, setEditedThingsWatch] = useState(article.plain_summary.things_to_watch);
  const [editedSpanishTakeaway, setEditedSpanishTakeaway] = useState(article.spanish_takeaway);

  // Read aloud helper
  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    const summaryText =
      language === 'es'
        ? `${article.spanish_takeaway}. Lo que estudiaron: ${article.spanish_plain_summary.what_they_studied}. Lo que encontraron: ${article.spanish_plain_summary.what_found}. Qué significa para su campo: ${article.spanish_plain_summary.what_it_means}. Cosas a vigilar: ${article.spanish_plain_summary.things_to_watch}.`
        : `${article.takeaway}. What they studied: ${article.plain_summary.what_they_studied}. What they found: ${article.plain_summary.what_found}. What it means for your farm: ${article.plain_summary.what_it_means}. Things to watch out for: ${article.plain_summary.things_to_watch}.`;

    const utterance = new SpeechSynthesisUtterance(summaryText);
    utterance.lang = language === 'es' ? 'es-US' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Feedback submit helper
  const handleFeedback = (helpful: boolean) => {
    setFeedbackHelpful(helpful);
    localStorage.setItem(`feedback_helpful_${article.id}`, JSON.stringify(helpful));

    const feedbackObj: FarmerFeedback = {
      id: 'fb-' + Date.now(),
      articleId: article.id,
      articleTitle: article.title,
      helpful,
      triedOnFarm,
      note: farmerNote.trim() || undefined,
      county: farmSettings.county || county.name,
      crop: farmSettings.crops[0] || article.crops[0],
      timestamp: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('agrilife_farmer_feedbacks');
      const all: FarmerFeedback[] = stored ? JSON.parse(stored) : [];
      all.push(feedbackObj);
      localStorage.setItem('agrilife_farmer_feedbacks', JSON.stringify(all));
    } catch (e) {
      console.warn("Could not save feedback:", e);
    }
    setFeedbackSubmitted(true);
  };

  // Reviewer approval helper
  const handleApproveReview = () => {
    const updated: Article = {
      ...article,
      review_status: 'reviewed',
      reviewer_name: reviewerNameInput,
      spanish_takeaway: editedSpanishTakeaway,
      plain_summary: {
        what_they_studied: editedWhatStudied,
        what_found: editedWhatFound,
        what_it_means: editedWhatMeans,
        things_to_watch: editedThingsWatch,
      },
    };

    saveReviewerApproval(article.id, reviewerNameInput, {
      plain: updated.plain_summary,
      spanish: updated.spanish_plain_summary,
    });

    onArticleUpdated(updated);
    setIsEditingReview(false);
  };

  // Generate share summary (< 300 chars)
  const shareText = `${article.title.slice(0, 75)}... ${article.takeaway.slice(0, 140)} - Read full Texas A&M research guide at: https://agrilife.org/r/${article.id}`;

  const currentSummary = language === 'es' ? article.spanish_plain_summary : article.plain_summary;

  // Render glossary term triggers within text
  const renderTextWithGlossary = (text: string) => {
    if (!article.glossary_terms || article.glossary_terms.length === 0) {
      return text;
    }

    let elements: (string | React.ReactNode)[] = [text];

    article.glossary_terms.forEach((termObj) => {
      const newElements: (string | React.ReactNode)[] = [];
      const regex = new RegExp(`\\b(${termObj.term})\\b`, 'i');

      elements.forEach((el) => {
        if (typeof el === 'string') {
          const parts = el.split(regex);
          for (let i = 0; i < parts.length; i++) {
            if (parts[i].toLowerCase() === termObj.term.toLowerCase()) {
              newElements.push(
                <button
                  key={`${termObj.term}-${i}`}
                  type="button"
                  onClick={() => setActiveGlossaryTerm(termObj)}
                  className="inline underline decoration-dotted decoration-[#500000] decoration-2 font-semibold text-stone-900 hover:text-[#500000] cursor-help px-0.5 rounded focus-visible:outline-2 focus-visible:outline-[#500000]"
                  title={`Tap to define "${termObj.term}"`}
                >
                  {parts[i]}
                </button>
              );
            } else if (parts[i]) {
              newElements.push(parts[i]);
            }
          }
        } else {
          newElements.push(el);
        }
      });
      elements = newElements;
    });

    return elements;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 printable-field-guide">
      {/* Back and Utility Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{language === 'es' ? 'Volver al feed' : 'Back to Research Feed'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isPlayingAudio ? 'Stop reading' : 'Read aloud'}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors ${
              isPlayingAudio
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-[#500000] text-white hover:bg-[#680000]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{language === 'es' ? 'Detener lectura' : 'Stop Voice'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>{language === 'es' ? 'Leer en voz alta' : 'Read Aloud'}</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            aria-label="Share field summary"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            title="Share summary via SMS or WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Print Field Guide Button */}
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Print field guide"
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs hidden sm:flex items-center gap-1.5 transition-colors"
            title="Print clean 1-page field guide"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'es' ? 'Imprimir Guía' : 'Print Field Guide'}</span>
          </button>
        </div>
      </div>

      {/* Review Status Banner */}
      <div className="mb-4">
        {article.review_status === 'reviewed' ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-950 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2E7D32] shrink-0" aria-hidden="true" />
              <span>
                <strong>{language === 'es' ? 'Revisado por especialista: ' : 'Reviewed by specialist: '}</strong>
                {article.reviewer_name}
              </span>
            </div>
            {reviewerMode && (
              <button
                type="button"
                onClick={() => setIsEditingReview(!isEditingReview)}
                className="text-emerald-800 underline font-bold"
              >
                {language === 'es' ? 'Editar' : 'Edit'}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between text-xs text-amber-950 font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D97706] shrink-0" aria-hidden="true" />
              <div>
                <span>
                  <strong>{language === 'es' ? 'Borrador IA: ' : 'AI draft: '}</strong>
                  {language === 'es'
                    ? 'Resumen y traducción pendientes de revisión por especialista agronómico'
                    : 'Summary pending specialist review'}
                </span>
                {language === 'es' && (
                  <p className="text-[11px] text-amber-800 font-normal">
                    AI translation – pending review
                  </p>
                )}
              </div>
            </div>
            {reviewerMode && (
              <button
                type="button"
                onClick={() => setIsEditingReview(!isEditingReview)}
                className="bg-[#500000] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#680000]"
              >
                {language === 'es' ? 'Revisar y Aprobar' : 'Review & Approve'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reviewer Mode Inline Editor */}
      {reviewerMode && isEditingReview && (
        <div className="mb-6 p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 no-print">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-950 mb-3">
            <Edit3 className="w-4 h-4 text-amber-700" />
            <span>
              {language === 'es'
                ? 'Modo Revisor de Extensión: Editar y Aprobar'
                : 'Extension Reviewer Mode: Edit & Approve'}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Reviewer Name & Credential:
              </label>
              <input
                type="text"
                value={reviewerNameInput}
                onChange={(e) => setReviewerNameInput(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                What They Studied (Plain Language):
              </label>
              <textarea
                value={editedWhatStudied}
                onChange={(e) => setEditedWhatStudied(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                What They Found:
              </label>
              <textarea
                value={editedWhatFound}
                onChange={(e) => setEditedWhatFound(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                What It Means for Your Farm:
              </label>
              <textarea
                value={editedWhatMeans}
                onChange={(e) => setEditedWhatMeans(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Things to Watch Out For:
              </label>
              <textarea
                value={editedThingsWatch}
                onChange={(e) => setEditedThingsWatch(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Spanish Takeaway Translation:
              </label>
              <textarea
                value={editedSpanishTakeaway}
                onChange={(e) => setEditedSpanishTakeaway(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleApproveReview}
              className="px-4 py-2 bg-[#2E7D32] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{language === 'es' ? 'Aprobar como Revisado' : 'Approve as Reviewed'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditingReview(false)}
              className="px-3 py-2 text-stone-600 text-xs font-semibold hover:text-stone-900"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Article Title & Source Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-medium mb-2">
          <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
            {article.type === 'research' ? 'Research Publication' : 'Extension News'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{article.source_repository}</span>
          <span aria-hidden="true">·</span>
          <span>{article.date}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight mb-3">
          {article.title}
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 mb-4">
          <strong>{language === 'es' ? 'Autores: ' : 'Authors: '}</strong>
          {article.authors}
        </p>

        {/* Hero Photo (Hidden in low data mode) */}
        {!lowDataMode && article.image_url && (
          <div className="relative rounded-2xl overflow-hidden mb-6 aspect-16/9 bg-stone-200 shadow-xs">
            <img
              src={article.image_url}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Reading Level Segmented Control */}
        <div className="flex items-center justify-between flex-wrap gap-3 p-3 bg-stone-100 rounded-2xl no-print">
          <div className="text-xs font-bold text-stone-800">
            {language === 'es' ? 'Nivel de Lectura:' : 'Reading Level:'}
          </div>
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl shadow-2xs border border-stone-200">
            <button
              type="button"
              onClick={() => setReadingLevel('farmer')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                readingLevel === 'farmer'
                  ? 'bg-[#500000] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'es' ? 'Para el Agricultor (Directo)' : 'Farmer-Friendly'}
            </button>
            <button
              type="button"
              onClick={() => setReadingLevel('technical')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                readingLevel === 'technical'
                  ? 'bg-[#500000] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'es' ? 'Técnico (Estadísticas)' : 'Technical (Agronomic Data)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Plain Language Summary Card */}
      {readingLevel === 'farmer' ? (
        <section
          aria-label="Plain language research summary"
          className="card-surface bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs mb-8 space-y-6"
        >
          {/* Quick Takeaway Banner */}
          <div className="p-4 rounded-xl bg-stone-50 border-2 border-[#500000]/20">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="text-xs font-bold text-[#500000] uppercase tracking-wider mb-1">
                  {language === 'es' ? 'Conclusión Clave' : 'The Bottom Line'}
                </h2>
                <p className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                  {language === 'es' && article.spanish_takeaway
                    ? article.spanish_takeaway
                    : article.takeaway}
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: What they studied */}
          <div>
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-2">
              1. {language === 'es' ? 'Qué estudiaron' : 'What they studied'}
            </h3>
            <p className="text-stone-800 text-base leading-relaxed pl-3 border-l-2 border-stone-200">
              {renderTextWithGlossary(currentSummary.what_they_studied)}
            </p>
          </div>

          {/* Section 2: What they found */}
          <div>
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-2">
              2. {language === 'es' ? 'Qué encontraron' : 'What they found'}
            </h3>
            <p className="text-stone-800 text-base leading-relaxed pl-3 border-l-2 border-[#500000]/40 font-medium">
              {renderTextWithGlossary(currentSummary.what_found)}
            </p>
          </div>

          {/* Section 3: What it means for your farm */}
          <div>
            <h3 className="text-sm font-bold text-[#500000] uppercase tracking-wider mb-2">
              3. {language === 'es' ? 'Qué significa para su campo' : 'What it means for your farm'}
            </h3>
            <p className="text-stone-900 text-base leading-relaxed pl-3 border-l-2 border-[#500000] font-semibold">
              {renderTextWithGlossary(currentSummary.what_it_means)}
            </p>
          </div>

          {/* Section 4: Things to watch out for */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>4. {language === 'es' ? 'Cosas a vigilar' : 'Things to watch out for'}</span>
            </h3>
            <p className="text-amber-950 text-sm leading-relaxed">
              {renderTextWithGlossary(currentSummary.things_to_watch)}
            </p>
          </div>
        </section>
      ) : (
        /* Technical View */
        <section
          aria-label="Technical research summary"
          className="card-surface bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs mb-8"
        >
          <div className="flex items-center gap-2 mb-3 text-stone-900 font-bold">
            <BookOpen className="w-5 h-5 text-[#500000]" />
            <h3>Agronomic & Methodological Overview</h3>
          </div>
          <p className="text-stone-800 text-sm leading-relaxed font-mono whitespace-pre-line mb-4">
            {article.technical_summary}
          </p>
          <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600">
            Full methodology, statistical p-values, and replication data available in the primary repository below.
          </div>
        </section>
      )}

      {/* Weather Check Box (Linked to active county forecast) */}
      {article.weather_guidance && (
        <section
          aria-label="Article weather check"
          className="card-surface bg-white border-2 border-blue-200 rounded-2xl p-5 sm:p-6 mb-8 shadow-xs"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <CloudSun className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {language === 'es'
                  ? `Verificación de Clima: ${county.name} County`
                  : `Weather Check for ${county.name} County`}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'es'
                  ? 'Comparación entre las condiciones de este estudio y su pronóstico'
                  : 'Comparing this study’s guidance directly with your local forecast'}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-sm text-blue-950 mb-3">
            <strong className="block text-xs uppercase tracking-wider text-blue-900 mb-1">
              {language === 'es' ? 'Regla del Estudio:' : 'Guidance in this Study:'}
            </strong>
            {article.weather_guidance.rule}
          </div>

          <p className="text-xs text-stone-600">
            {language === 'es'
              ? `Consulte el pronóstico de 5 días de ${county.name} en la parte superior del feed antes de aplicar químicos o iniciar el riego.`
              : `Review the 5-day ${county.name} County forecast at the top of the feed before scheduling spray or irrigation runs.`}
          </p>
        </section>
      )}

      {/* "What this means for my farm" Localized Field Guide */}
      <FieldGuideGenerator
        article={article}
        currentCounty={county}
        farmSettings={farmSettings}
        language={language}
      />

      {/* "Show me how" Practical Technique Steps (if applicable) */}
      {article.has_technique && (
        <ShowMeHow
          article={article}
          language={language}
          lowDataMode={lowDataMode}
        />
      )}

      {/* Full Article Text or Original Link */}
      <section className="mb-8 p-5 bg-stone-50 rounded-2xl border border-stone-200 no-print">
        {article.access === 'open' ? (
          <div>
            <button
              type="button"
              onClick={() => setShowFullText(!showFullText)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#500000]" />
                <span>
                  {showFullText
                    ? language === 'es'
                      ? 'Ocultar texto completo del artículo'
                      : 'Hide Full Research Article'
                    : language === 'es'
                    ? 'Ver texto completo del artículo (Acceso Abierto)'
                    : 'View Full Research Article (Open Access)'}
                </span>
              </div>
              {showFullText ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showFullText && (
              <div className="mt-4 pt-4 border-t border-stone-200 text-xs sm:text-sm text-stone-800 leading-relaxed font-mono whitespace-pre-line max-h-96 overflow-y-auto bg-white p-4 rounded-xl border border-stone-200">
                {article.full_text}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-stone-900">
                {language === 'es' ? 'Artículo de resumen únicamente' : 'Summary-only publication'}
              </p>
              <p className="text-stone-600">
                {language === 'es'
                  ? 'Este resumen fue elaborado a partir del extracto público oficial.'
                  : 'This summary was synthesized from the official public abstract.'}
              </p>
            </div>
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#500000] text-white font-bold rounded-lg hover:bg-[#680000] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{language === 'es' ? 'Leer el original' : 'Read the Original'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </section>

      {/* Grounded Article Chatbot Callout banner */}
      <section className="bg-stone-50 border border-stone-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#500000] text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
              {language === 'es' ? '¿Dudas sobre este estudio?' : 'Questions about this study?'}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              {language === 'es'
                ? 'Hable con el asistente con IA fundamentado o use el icono en la esquina inferior derecha.'
                : 'Ask the grounded AI assistant directly or use the chat button in the bottom right corner.'}
            </p>
          </div>
        </div>

        {onOpenChat && (
          <button
            type="button"
            onClick={onOpenChat}
            className="min-h-[44px] px-4 py-2 bg-[#500000] hover:bg-[#680000] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {language === 'es' ? 'Preguntar sobre este artículo' : 'Ask This Article'}
            </span>
          </button>
        )}
      </section>

      {/* Farmer Feedback Section */}
      <section
        aria-label="Farmer feedback"
        className="card-surface bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 mb-8 shadow-xs no-print"
      >
        <h3 className="text-base font-bold text-stone-900 mb-1">
          {language === 'es' ? '¿Fue útil este resumen?' : 'Was this helpful?'}
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          {language === 'es'
            ? 'Sus comentarios ayudan a los especialistas de Texas A&M a perfeccionar futuras investigaciones.'
            : 'Your feedback helps Texas A&M Extension specialists calibrate future field guides.'}
        </p>

        {feedbackSubmitted ? (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
            <span>
              {language === 'es'
                ? '¡Gracias! Su experiencia fue guardada en el panel de investigación de Texas A&M.'
                : 'Thank you! Your feedback has been recorded for the researcher dashboard.'}
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Thumbs up / down */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleFeedback(true)}
                className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  feedbackHelpful === true
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{language === 'es' ? 'Sí, muy útil' : 'Yes, helpful'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleFeedback(false)}
                className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  feedbackHelpful === false
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{language === 'es' ? 'No mucho' : 'Not helpful'}</span>
              </button>
            </div>

            {/* "I tried this on my farm" Option */}
            <div className="pt-3 border-t border-stone-100">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={triedOnFarm}
                  onChange={(e) => setTriedOnFarm(e.target.checked)}
                  className="w-4 h-4 text-[#500000] rounded focus:ring-[#500000]"
                />
                <span>
                  {language === 'es'
                    ? 'Probé este método o recomendación en mi campo'
                    : 'I tried this on my farm'}
                </span>
              </label>

              {triedOnFarm && (
                <div className="mt-3 space-y-2 animate-in fade-in">
                  <textarea
                    value={farmerNote}
                    onChange={(e) => setFarmerNote(e.target.value)}
                    placeholder={
                      language === 'es'
                        ? 'Nota opcional: ¿Cómo respondió su cultivo o ganado? (ej. condado, fecha, resultado)'
                        : 'Optional note: How did your crop or herd respond? (e.g. soil moisture, yield, timing)'
                    }
                    rows={2}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#500000]"
                  />
                  <button
                    type="button"
                    onClick={() => handleFeedback(feedbackHelpful ?? true)}
                    className="min-h-[38px] px-4 py-1.5 bg-[#500000] text-white font-bold text-xs rounded-lg hover:bg-[#680000]"
                  >
                    {language === 'es' ? 'Enviar Experiencia de Campo' : 'Submit Farmer Note'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Glossary Pop-up Modal / Drawer */}
      {activeGlossaryTerm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#500000]" />
                <h4 className="font-bold text-base text-stone-900">{activeGlossaryTerm.term}</h4>
              </div>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-semibold">
                {activeGlossaryTerm.source === 'article' ? 'From study' : 'General definition'}
              </span>
            </div>
            <p className="text-sm text-stone-800 leading-relaxed mb-4">
              {activeGlossaryTerm.definition}
            </p>
            <button
              type="button"
              onClick={() => setActiveGlossaryTerm(null)}
              className="w-full min-h-[44px] bg-[#500000] text-white font-bold text-xs rounded-xl hover:bg-[#680000]"
            >
              {language === 'es' ? 'Entendido' : 'Got it'}
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200">
            <h3 className="font-bold text-lg text-stone-900 mb-2">
              {language === 'es' ? 'Compartir con Vecinos o Equipo' : 'Share with Neighbors or Crew'}
            </h3>
            <p className="text-xs text-stone-500 mb-3">
              {language === 'es'
                ? 'Resumen corto (menos de 300 caracteres) listo para mensaje de texto o WhatsApp.'
                : 'Text-message length summary (under 300 chars) ready for SMS or WhatsApp.'}
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 font-mono mb-4 select-all">
              {shareText}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {/* Copy */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shareText);
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                }}
                className="min-h-[44px] px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{shareCopied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              {/* SMS */}
              <a
                href={`sms:?&body=${encodeURIComponent(shareText)}`}
                className="min-h-[44px] px-3 rounded-xl bg-[#500000] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#680000] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>SMS</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors"
              >
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="w-full min-h-[44px] border border-stone-300 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-100"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
