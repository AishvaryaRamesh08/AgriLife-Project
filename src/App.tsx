import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WeatherCard } from './components/WeatherCard';
import { MyFarmModal } from './components/MyFarmModal';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { ResearcherDashboard } from './components/ResearcherDashboard';
import { Footer } from './components/Footer';
import { VoiceInputButton } from './components/VoiceInputButton';
import { GlobalFloatingChatbot } from './components/GlobalFloatingChatbot';
import { INSTITUTION_CONFIG, getArticles, searchArticles } from './services/researchApi';
import { Article, TexasCounty, MyFarmSettings } from './types/research';
import { Search, Filter, X, Sparkles, Sprout, ArrowUpDown } from 'lucide-react';

export default function App() {
  // App-wide state
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [reviewerMode, setReviewerMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // My Farm Settings State
  const [farmSettings, setFarmSettings] = useState<MyFarmSettings>(() => {
    try {
      const stored = localStorage.getItem('agrilife_my_farm');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {
      county: 'Lubbock',
      crops: ['Cotton', 'Grain Sorghum'],
      firstTimeCompleted: false,
    };
  });

  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);

  // Navigation State
  const [currentView, setCurrentView] = useState<'feed' | 'article' | 'researcher-dashboard'>('feed');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Articles & Search State
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('all');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  // Active county object
  const activeCounty: TexasCounty =
    INSTITUTION_CONFIG.counties.find(
      (c) => c.name.toLowerCase() === farmSettings.county.toLowerCase()
    ) || INSTITUTION_CONFIG.counties[0];

  // First visit check: show My Farm modal if never configured
  useEffect(() => {
    if (!farmSettings.firstTimeCompleted) {
      setIsFarmModalOpen(true);
    }
  }, []);

  // Save farm settings to localStorage
  const handleSaveFarmSettings = (settings: MyFarmSettings) => {
    setFarmSettings(settings);
    localStorage.setItem('agrilife_my_farm', JSON.stringify(settings));
  };

  // Load articles
  const loadArticles = async () => {
    setLoadingArticles(true);
    try {
      const filters = {
        crop: selectedCropFilter,
        topic: selectedTopicFilter,
        region: selectedRegionFilter,
        type: selectedTypeFilter,
        county: farmSettings.county,
      };

      let res: Article[];
      if (searchQuery.trim()) {
        res = await searchArticles(searchQuery, filters);
      } else {
        res = await getArticles(filters);
      }
      setArticles(res);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoadingArticles(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [
    selectedCropFilter,
    selectedTopicFilter,
    selectedRegionFilter,
    selectedTypeFilter,
    searchQuery,
    farmSettings.county,
  ]);

  // Cycle text size: normal -> large -> xlarge -> normal
  const cycleTextSize = () => {
    if (textSize === 'normal') setTextSize('large');
    else if (textSize === 'large') setTextSize('xlarge');
    else setTextSize('normal');
  };

  // Root class string for accessibility
  const rootTextSizeClass =
    textSize === 'large'
      ? 'text-size-large'
      : textSize === 'xlarge'
      ? 'text-size-xlarge'
      : 'text-size-normal';

  const rootContrastClass = highContrast ? 'high-contrast' : '';

  const handleSelectArticle = (art: Article) => {
    setSelectedArticle(art);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleUpdated = (updated: Article) => {
    setSelectedArticle(updated);
    setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  // Distinct filter options
  const filterCrops = [
    'All',
    'Cotton',
    'Grain Sorghum',
    'Corn',
    'Beef Cattle',
    'Pasture / Hay',
    'Wheat',
    'Peaches',
    'Pecans',
    'Cover Crops',
  ];

  const filterTopics = [
    'All',
    'Drought',
    'Irrigation',
    'Pests',
    'Soil Health',
    'Planting',
    'Livestock',
    'Weather',
  ];

  const filterRegions = [
    'All',
    'High Plains',
    'Central Texas',
    'Blackland Prairie',
    'Coastal Bend',
    'Hill Country',
    'Winter Garden',
    'Panhandle',
  ];

  const hasActiveFilters =
    selectedCropFilter !== 'all' ||
    selectedTopicFilter !== 'all' ||
    selectedRegionFilter !== 'all' ||
    selectedTypeFilter !== 'all' ||
    searchQuery.trim() !== '';

  const clearFilters = () => {
    setSelectedCropFilter('all');
    setSelectedTopicFilter('all');
    setSelectedRegionFilter('all');
    setSelectedTypeFilter('all');
    setSearchQuery('');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-stone-50 ${rootTextSizeClass} ${rootContrastClass}`}>
      {/* Top Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'es' : 'en'))}
        textSize={textSize}
        onCycleTextSize={cycleTextSize}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((c) => !c)}
        lowDataMode={lowDataMode}
        onToggleLowDataMode={() => setLowDataMode((d) => !d)}
        reviewerMode={reviewerMode}
        onToggleReviewerMode={() => setReviewerMode((r) => !r)}
        farmSettings={farmSettings}
        onOpenFarmSettings={() => setIsFarmModalOpen(true)}
        currentView={currentView}
        onNavigateFeed={() => {
          setCurrentView('feed');
          setSelectedArticle(null);
        }}
        onNavigateDashboard={() => {
          setCurrentView('researcher-dashboard');
          setSelectedArticle(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'feed' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Weather Card for selected county */}
            <WeatherCard
              county={activeCounty}
              lowDataMode={lowDataMode}
              language={language}
              onOpenFarmSettings={() => setIsFarmModalOpen(true)}
            />

            {/* Farm Personalization Welcome Strip */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#500000]/10 text-[#500000] flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5 text-[#500000]" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                    {language === 'es'
                      ? `Investigación destacada para ${activeCounty.name} Co.`
                      : `Recommended Research for ${activeCounty.name} County`}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'es' ? 'Cultivos configurados: ' : 'Your crops: '}
                    <span className="font-semibold text-stone-800">
                      {farmSettings.crops.join(', ')}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFarmModalOpen(true)}
                className="min-h-[44px] px-3.5 py-2 text-xs font-bold text-[#500000] bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                {language === 'es' ? 'Ajustar Mi Campo' : 'Edit My Farm'}
              </button>
            </div>

            {/* Search Bar & Voice Input */}
            <div className="mb-6 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'es'
                      ? 'Buscar por tema, cultivo o síntoma (ej. riego de algodón, gusano cogollero, mezquite)...'
                      : 'Search by topic, crop, or symptom (e.g., cotton irrigation, armyworms, brush)...'
                  }
                  className="w-full min-h-[48px] pl-11 pr-4 bg-white border border-stone-300 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:border-[#500000] shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Voice Search Button */}
              <VoiceInputButton
                onTranscript={(text) => setSearchQuery(text)}
                language={language}
                label="Voice search query"
              />
            </div>

            {/* Filter Tabs / Selectors (Segmented Buttons for interactive controls) */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs mb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#500000]" />
                  <span>{language === 'es' ? 'Filtros de Campo' : 'Field Filters'}</span>
                </span>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-bold text-[#500000] hover:underline"
                  >
                    {language === 'es' ? 'Limpiar filtros' : 'Reset all filters'}
                  </button>
                )}
              </div>

              {/* Crop Filter Horizontal Scroller */}
              <div>
                <div className="text-[11px] font-semibold text-stone-500 mb-1.5">
                  {language === 'es' ? 'Por Cultivo o Ganado:' : 'Crop or Livestock:'}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {filterCrops.map((c) => {
                    const isSelected = selectedCropFilter.toLowerCase() === c.toLowerCase();
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedCropFilter(c.toLowerCase())}
                        className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-[#500000] text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topic Filter Horizontal Scroller */}
              <div>
                <div className="text-[11px] font-semibold text-stone-500 mb-1.5">
                  {language === 'es' ? 'Por Tema Agronómico:' : 'Agronomic Topic:'}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {filterTopics.map((t) => {
                    const isSelected = selectedTopicFilter.toLowerCase() === t.toLowerCase();
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTopicFilter(t.toLowerCase())}
                        className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-[#500000] text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Region and Type Quick Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-stone-100">
                <select
                  value={selectedRegionFilter}
                  onChange={(e) => setSelectedRegionFilter(e.target.value)}
                  className="min-h-[38px] px-2.5 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg font-medium text-stone-800"
                >
                  <option value="all">
                    {language === 'es' ? 'Todas las Regiones' : 'All Texas Regions'}
                  </option>
                  {filterRegions.filter((r) => r !== 'All').map((r) => (
                    <option key={r} value={r.toLowerCase()}>
                      {r}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="min-h-[38px] px-2.5 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg font-medium text-stone-800"
                >
                  <option value="all">
                    {language === 'es' ? 'Todos los Tipos' : 'All Types'}
                  </option>
                  <option value="research">Research</option>
                  <option value="news">Extension News</option>
                </select>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {language === 'es' ? 'Artículos y Guías Prácticas' : 'Research Publications'}
                <span className="text-xs text-stone-500 font-normal ml-2">
                  ({articles.length} {language === 'es' ? 'resultados' : 'studies found'})
                </span>
              </h2>

              <span className="text-xs text-stone-500 hidden sm:inline">
                {language === 'es'
                  ? 'Coincidencias con su campo aparecen primero'
                  : 'Prioritizing your farm & county'}
              </span>
            </div>

            {/* Articles Grid */}
            {loadingArticles ? (
              <div className="py-12 text-center text-sm text-stone-500">
                {language === 'es'
                  ? 'Cargando investigaciones de Texas A&M...'
                  : 'Loading Texas A&M research publications...'}
              </div>
            ) : articles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
                <p className="font-bold text-stone-800">
                  {language === 'es'
                    ? 'No se encontraron publicaciones con esos filtros.'
                    : 'No research articles found matching these filters.'}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 bg-[#500000] text-white font-bold text-xs rounded-xl"
                >
                  {language === 'es' ? 'Limpiar Filtros' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onSelect={handleSelectArticle}
                    language={language}
                    lowDataMode={lowDataMode}
                    farmSettings={farmSettings}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Article Detail View */}
        {currentView === 'article' && selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onBack={() => {
              setCurrentView('feed');
              setSelectedArticle(null);
            }}
            county={activeCounty}
            farmSettings={farmSettings}
            language={language}
            lowDataMode={lowDataMode}
            reviewerMode={reviewerMode}
            allArticles={articles}
            onArticleUpdated={handleArticleUpdated}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {/* Researcher Dashboard View */}
        {currentView === 'researcher-dashboard' && (
          <ResearcherDashboard
            articles={articles}
            onSelectArticle={handleSelectArticle}
            onBackToFeed={() => {
              setCurrentView('feed');
              setSelectedArticle(null);
            }}
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Global Floating Research Chatbot */}
      <GlobalFloatingChatbot
        currentArticle={selectedArticle}
        allArticles={articles}
        county={activeCounty}
        farmSettings={farmSettings}
        language={language}
        isOpen={isChatOpen}
        onToggleOpen={() => setIsChatOpen((prev) => !prev)}
        onSelectArticle={handleSelectArticle}
      />

      {/* My Farm Settings Modal */}
      <MyFarmModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        currentSettings={farmSettings}
        onSave={handleSaveFarmSettings}
        language={language}
      />
    </div>
  );
}
