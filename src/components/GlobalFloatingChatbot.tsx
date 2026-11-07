import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
  Camera,
  ExternalLink,
  Sparkles,
  HelpCircle,
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
  BookOpen,
  Sprout,
  ChevronDown,
} from 'lucide-react';
import { Article, TexasCounty, MyFarmSettings } from '../types/research';
import { VoiceInputButton } from './VoiceInputButton';
import { askChat, analyzePhoto, ensureAiReady } from '../services/aiClient';

interface GlobalFloatingChatbotProps {
  currentArticle: Article | null;
  allArticles: Article[];
  county: TexasCounty;
  farmSettings: MyFarmSettings;
  language: 'en' | 'es';
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectArticle?: (article: Article) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  contextMode?: 'article' | 'library';
  articleTitle?: string;
  isPhotoUpload?: boolean;
  photoUrl?: string;
  relatedArticleId?: string;
}

export const GlobalFloatingChatbot: React.FC<GlobalFloatingChatbotProps> = ({
  currentArticle,
  allArticles,
  county,
  farmSettings,
  language,
  isOpen,
  onToggleOpen,
  onSelectArticle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-init',
      role: 'assistant',
      content:
        language === 'es'
          ? `¡Hola! Soy el asistente de investigación de Texas A&M AgriLife. Pregúnteme sobre cualquier cultivo, suelo, riego o manejo ganadero.`
          : `Howdy! I'm your Texas A&M AgriLife research assistant. Ask me anything about Texas crops, soils, irrigation, or livestock management.`,
      contextMode: 'library',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string>('image/jpeg');
  const [isMinimized, setIsMinimized] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevArticleIdRef = useRef<string | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen, isMinimized]);

  // When article context changes, welcome user to the article if opened
  useEffect(() => {
    if (currentArticle && currentArticle.id !== prevArticleIdRef.current) {
      prevArticleIdRef.current = currentArticle.id;
      const articleNotice: ChatMessage = {
        id: 'article-focus-' + Date.now(),
        role: 'assistant',
        content:
          language === 'es'
            ? `Ahora enfocado en: "${currentArticle.title}". Pregúnteme sobre los hallazgos específicos, dosis, sincronización o métodos de este estudio.`
            : `Now focused on: "${currentArticle.title}". Ask me about the specific findings, application rates, timing, or results from this study.`,
        contextMode: 'article',
        articleTitle: currentArticle.title,
      };
      setMessages((prev) => [...prev, articleNotice]);
    } else if (!currentArticle && prevArticleIdRef.current) {
      prevArticleIdRef.current = null;
      const libraryNotice: ChatMessage = {
        id: 'library-focus-' + Date.now(),
        role: 'assistant',
        content:
          language === 'es'
            ? `Ahora en modo biblioteca general. Puede consultar sobre cualquier tema de agricultura o ganadería en Texas.`
            : `Now in general library mode. You can ask about any Texas agricultural research topic or crop.`,
        contextMode: 'library',
      };
      setMessages((prev) => [...prev, libraryNotice]);
    }
  }, [currentArticle, language]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Suggested questions based on current context
  const getSuggestedQuestions = () => {
    if (currentArticle && currentArticle.suggested_questions?.length) {
      return currentArticle.suggested_questions.slice(0, 3);
    }

    if (language === 'es') {
      return [
        `¿Qué recomienda la investigación para ${farmSettings.crops[0] || 'algodón'} con sequía?`,
        `¿Cómo mejorar la salud del suelo y materia orgánica?`,
        `¿Cuál es el mejor momento para regar en ${county.name}?`,
      ];
    }

    return [
      `What does research say about drought management for ${farmSettings.crops[0] || 'cotton'}?`,
      `How do cover crops impact soil moisture in ${county.region}?`,
      `Optimal irrigation timing and sensor placement guidelines`,
    ];
  };

  // Build research library corpus for server when in general feed mode
  const buildLibraryCorpus = () => {
    return allArticles
      .map(
        (a) =>
          `ID: ${a.id}
TITLE: ${a.title}
CROPS: ${a.crops.join(', ')}
TOPICS: ${a.topics.join(', ')}
REGIONS: ${a.texas_regions.join(', ')}
KEY TAKEAWAY: ${a.takeaway}
WHAT WAS STUDIED: ${a.plain_summary.what_they_studied}
WHAT WAS FOUND: ${a.plain_summary.what_found}
WHAT IT MEANS FOR THE FARM: ${a.plain_summary.what_it_means}
CAUTIONS: ${a.plain_summary.things_to_watch}
WEATHER GUIDANCE: ${a.weather_guidance?.rule || 'None specified'}`
      )
      .join('\n\n---\n\n');
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query && !photoBase64) return;
    // Static (GitHub Pages) build: asks for the visitor's Gemini key first.
    if (!(await ensureAiReady())) return;

    // Handle Photo upload branch
    if (photoBase64) {
      const userMsgId = 'u-' + Date.now();
      const currentPhoto = photoPreview;
      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId,
          role: 'user',
          content:
            query ||
            (language === 'es'
              ? 'Foto de campo enviada para escaneo visual'
              : 'Field photo uploaded for visual scan'),
          isPhotoUpload: true,
          photoUrl: currentPhoto || undefined,
          contextMode: currentArticle ? 'article' : 'library',
        },
      ]);
      setInput('');
      const base64ToSend = photoBase64;
      const mimeToSend = photoMimeType;
      setPhotoPreview(null);
      setPhotoBase64(null);
      setLoading(true);

      try {
        const data = await analyzePhoto({
          imageBase64: base64ToSend,
          mimeType: mimeToSend,
          availableArticles: allArticles.map((a) => ({
            id: a.id,
            title: a.title,
            crops: a.crops,
            topics: a.topics,
          })),
          language,
        });
        setMessages((prev) => [
          ...prev,
          {
            id: 'a-' + Date.now(),
            role: 'assistant',
            content:
              data.description ||
              data.fallback ||
              "I can't diagnose from a photo. Here is related research, and your county Extension office can confirm.",
            contextMode: currentArticle ? 'article' : 'library',
          },
        ]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'a-' + Date.now(),
            role: 'assistant',
            content:
              "I can't diagnose from a photo. Here is related research, and your county Extension office can confirm: " +
              county.extensionOfficeUrl,
            contextMode: currentArticle ? 'article' : 'library',
          },
        ]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Text Q&A branch
    const userMsgId = 'u-' + Date.now();
    const newMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: query,
      contextMode: currentArticle ? 'article' : 'library',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const payload: Parameters<typeof askChat>[0] = {
        extensionOfficeUrl: county.extensionOfficeUrl,
        userMessage: query,
        language,
        conversationHistory: messages
          .filter((m) => !m.id.startsWith('welcome-') && !m.id.startsWith('article-focus-') && !m.id.startsWith('library-focus-'))
          .slice(-6)
          .map((m) => ({ role: m.role, content: m.content })),
      };

      if (currentArticle) {
        payload.articleText = currentArticle.full_text;
        payload.articleTitle = currentArticle.title;
      } else {
        payload.libraryCorpus = buildLibraryCorpus();
      }

      const data = await askChat(payload);
      const replyText =
        data.reply ||
        data.fallback ||
        (currentArticle
          ? `This research doesn't cover that. I don't want to guess. Your county AgriLife Extension office can help: ${county.extensionOfficeUrl}`
          : `Our research library does not currently cover that specific question. Your county AgriLife Extension agent can help: ${county.extensionOfficeUrl}`);

      // Check if reply references any existing article to create an interactive link
      let matchedArticleId: string | undefined;
      for (const art of allArticles) {
        if (replyText.toLowerCase().includes(art.title.toLowerCase().slice(0, 30))) {
          matchedArticleId = art.id;
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'a-' + Date.now(),
          role: 'assistant',
          content: replyText,
          contextMode: currentArticle ? 'article' : 'library',
          articleTitle: currentArticle?.title,
          relatedArticleId: matchedArticleId,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'a-' + Date.now(),
          role: 'assistant',
          content: `Our AI research assistant is temporarily taking a breather. Your ${county.name} County AgriLife Extension office can assist directly: ${county.extensionOfficeUrl}`,
          contextMode: currentArticle ? 'article' : 'library',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (activeSpeechId === msgId) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'es' ? 'es-US' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setActiveSpeechId(null);
    utterance.onerror = () => setActiveSpeechId(null);

    setActiveSpeechId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setPhotoBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeechId(null);
    setMessages([
      {
        id: 'welcome-cleared-' + Date.now(),
        role: 'assistant',
        content: currentArticle
          ? language === 'es'
            ? `Conversación reiniciada. Pregúnteme cualquier duda sobre "${currentArticle.title}".`
            : `Chat refreshed. Ask anything about "${currentArticle.title}".`
          : language === 'es'
          ? `Conversación reiniciada. Pregunte sobre cultivos, sequía, suelo o ganado en Texas.`
          : `Chat refreshed. Ask about any Texas agricultural research topic or field practice.`,
        contextMode: currentArticle ? 'article' : 'library',
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 no-print">
        {/* Pulsing prompt chip when closed */}
        {!isOpen && (
          <button
            type="button"
            onClick={onToggleOpen}
            className="hidden md:flex items-center gap-2 bg-stone-900/90 hover:bg-stone-950 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg backdrop-blur-xs transition-all hover:scale-102 border border-white/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>
              {currentArticle
                ? language === 'es'
                  ? 'Preguntar sobre este artículo'
                  : 'Ask This Article'
                : language === 'es'
                ? 'Preguntar a AgriLife AI'
                : 'Ask AgriLife AI'}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleOpen}
          aria-label={
            isOpen
              ? language === 'es'
                ? 'Cerrar asistente de investigación'
                : 'Close research assistant'
              : currentArticle
              ? language === 'es'
                ? 'Abrir chat sobre este artículo'
                : 'Ask this article'
              : language === 'es'
              ? 'Abrir asistente de investigación'
              : 'Open research assistant'
          }
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#500000]/40 ${
            isOpen
              ? 'bg-stone-800 hover:bg-stone-900 text-white rotate-0'
              : 'bg-[#500000] hover:bg-[#680000] text-white hover:scale-105 active:scale-95'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-amber-300" />
              {currentArticle && (
                <span
                  title="Article Active"
                  className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-[#500000] rounded-full"
                />
              )}
            </div>
          )}
        </button>
      </div>

      {/* Floating Pop-up Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AgriLife Research Assistant Chat"
          className={`fixed z-50 transition-all duration-200 no-print ${
            isMinimized
              ? 'bottom-22 right-5 sm:right-6 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden'
              : 'bottom-22 right-4 left-4 sm:left-auto sm:right-6 sm:w-[440px] max-h-[82vh] h-[580px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4'
          }`}
        >
          {/* Header */}
          <div className="bg-[#500000] text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                {currentArticle ? (
                  <BookOpen className="w-4 h-4 text-amber-300" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
                    {currentArticle
                      ? language === 'es'
                        ? 'Preguntar sobre este artículo'
                        : 'Ask This Article'
                      : language === 'es'
                      ? 'Asistente AgriLife'
                      : 'AgriLife Research AI'}
                  </h3>
                  <span className="text-[10px] font-semibold bg-white/15 px-1.5 py-0.5 rounded text-amber-200 shrink-0">
                    {currentArticle ? 'Grounded' : county.name}
                  </span>
                </div>
                <p className="text-[11px] text-stone-200 truncate mt-0.5">
                  {currentArticle
                    ? currentArticle.title
                    : language === 'es'
                    ? 'Respuestas basadas en investigaciones de Texas A&M'
                    : 'Texas A&M agricultural studies & field advice'}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={handleClearChat}
                title={language === 'es' ? 'Reiniciar conversación' : 'Reset chat'}
                aria-label="Reset chat"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={onToggleOpen}
                title={language === 'es' ? 'Cerrar' : 'Close'}
                aria-label="Close chat"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body & Controls (Only rendered when not minimized) */}
          {!isMinimized && (
            <>
              {/* Context Notice / Switcher Banner */}
              <div className="bg-stone-100 border-b border-stone-200 px-3.5 py-2 flex items-center justify-between text-xs text-stone-700 shrink-0">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                  <span className="font-semibold text-stone-900 truncate">
                    {currentArticle
                      ? language === 'es'
                        ? 'Modo: Estudio específico'
                        : 'Mode: Current Article'
                      : language === 'es'
                      ? 'Modo: Biblioteca general AgriLife'
                      : 'Mode: Full AgriLife Library'}
                  </span>
                </div>

                <a
                  href={county.extensionOfficeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#500000] hover:underline shrink-0 ml-2"
                >
                  <span>{county.name} Office</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Suggested Questions */}
              <div className="bg-stone-50 border-b border-stone-200 px-3 py-2.5 shrink-0 overflow-x-auto">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  <HelpCircle className="w-3 h-3 text-[#500000]" />
                  <span>{language === 'es' ? 'Preguntas sugeridas:' : 'Suggested Questions:'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {getSuggestedQuestions().map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(q)}
                      disabled={loading}
                      className="text-[11px] font-medium text-stone-800 bg-white hover:bg-stone-100 hover:text-[#500000] border border-stone-200 rounded-lg px-2.5 py-1 text-left transition-colors shadow-2xs leading-snug"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Scroll View */}
              <div className="flex-1 p-3.5 sm:p-4 space-y-3.5 overflow-y-auto bg-stone-50/50">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-[#500000] text-white rounded-br-none shadow-xs'
                          : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none shadow-2xs'
                      }`}
                    >
                      {m.photoUrl && (
                        <div className="mb-2 max-w-xs rounded-lg overflow-hidden border border-white/20">
                          <img src={m.photoUrl} alt="Crop upload" className="w-full h-auto" />
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{m.content}</p>

                      {/* Assistant actions: Read Aloud and Related Article click */}
                      {m.role === 'assistant' && (
                        <div className="mt-2 pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                          <button
                            type="button"
                            onClick={() => handleReadAloud(m.id, m.content)}
                            aria-label={activeSpeechId === m.id ? 'Stop audio' : 'Read aloud'}
                            className="inline-flex items-center gap-1 font-semibold text-[#500000] hover:text-[#700000]"
                          >
                            {activeSpeechId === m.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                                <span>{language === 'es' ? 'Detener' : 'Stop voice'}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{language === 'es' ? 'Escuchar' : 'Read aloud'}</span>
                              </>
                            )}
                          </button>

                          {m.relatedArticleId && onSelectArticle && (
                            <button
                              type="button"
                              onClick={() => {
                                const target = allArticles.find((a) => a.id === m.relatedArticleId);
                                if (target) onSelectArticle(target);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>{language === 'es' ? 'Ver estudio' : 'Open study'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-xs text-stone-500 italic p-2 bg-white/80 rounded-xl border border-stone-200 w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    <span>
                      {currentArticle
                        ? language === 'es'
                          ? 'Consultando el texto de este estudio...'
                          : 'Searching this research article...'
                        : language === 'es'
                        ? 'Consultando biblioteca de Texas A&M...'
                        : 'Consulting Texas A&M research library...'}
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Photo Preview Thumbnail Bar */}
              {photoPreview && (
                <div className="px-3 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-lg border border-amber-300 shrink-0"
                    />
                    <div className="text-xs min-w-0">
                      <p className="font-bold text-amber-950 truncate">
                        {language === 'es' ? 'Foto de campo adjunta' : 'Field photo attached'}
                      </p>
                      <p className="text-[10px] text-amber-800 truncate">
                        {language === 'es'
                          ? 'Gemini describirá lo visible y buscará estudios.'
                          : "Gemini will scan symptoms and match research."}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setPhotoBase64(null);
                    }}
                    aria-label="Remove photo"
                    className="p-1 rounded-md text-stone-500 hover:text-stone-800 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-2.5 sm:p-3 bg-white border-t border-stone-200 flex items-center gap-1.5 shrink-0"
              >
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Camera / Photo Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title={language === 'es' ? 'Preguntar con una foto' : 'Ask with a photo'}
                  aria-label="Upload field photo"
                  className="min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Voice Input Button */}
                <VoiceInputButton
                  onTranscript={(text) => setInput((prev) => (prev ? prev + ' ' + text : text))}
                  language={language}
                  label="Voice question"
                />

                {/* Text Input */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    currentArticle
                      ? language === 'es'
                        ? 'Pregunte sobre este estudio...'
                        : 'Ask about this article...'
                      : language === 'es'
                      ? 'Pregunte sobre cultivos, riego...'
                      : 'Ask about crops, soil, pests...'
                  }
                  className="flex-1 min-h-[42px] px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:border-[#500000] focus:bg-white focus:outline-none"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !photoBase64)}
                  aria-label="Send message"
                  className="min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl bg-[#500000] hover:bg-[#680000] disabled:bg-stone-300 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
