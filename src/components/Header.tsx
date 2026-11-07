import React, { useState } from 'react';
import {
  Globe,
  Sliders,
  Eye,
  WifiOff,
  ShieldCheck,
  ChevronDown,
  Building2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { INSTITUTION_CONFIG } from '../services/researchApi';
import { MyFarmSettings } from '../types/research';

interface HeaderProps {
  language: 'en' | 'es';
  onToggleLanguage: () => void;
  textSize: 'normal' | 'large' | 'xlarge';
  onCycleTextSize: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  lowDataMode: boolean;
  onToggleLowDataMode: () => void;
  reviewerMode: boolean;
  onToggleReviewerMode: () => void;
  farmSettings: MyFarmSettings;
  onOpenFarmSettings: () => void;
  currentView: 'feed' | 'article' | 'researcher-dashboard';
  onNavigateFeed: () => void;
  onNavigateDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  textSize,
  onCycleTextSize,
  highContrast,
  onToggleHighContrast,
  lowDataMode,
  onToggleLowDataMode,
  reviewerMode,
  onToggleReviewerMode,
  farmSettings,
  onOpenFarmSettings,
  currentView,
  onNavigateFeed,
  onNavigateDashboard,
}) => {
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const [showControlsDrawer, setShowControlsDrawer] = useState(false);

  const selectedUni = INSTITUTION_CONFIG.universities[0];

  const getTextSizeLabel = () => {
    if (textSize === 'normal') return 'A';
    if (textSize === 'large') return 'A+';
    return 'A++';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#500000] text-white shadow-md border-b border-[#3b0000]">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateFeed}
              className="text-left focus-visible:outline-2 focus-visible:outline-white rounded-lg p-1"
            >
              <div className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white whitespace-nowrap">
                AgriLife Research-to-Field
              </div>
              <div className="text-[11px] sm:text-xs text-stone-200 font-medium tracking-wide mt-0.5">
                {language === 'es'
                  ? 'Investigación de Texas A&M, hecha práctica.'
                  : 'Texas A&M research, made practical.'}
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-100">
            <button
              type="button"
              onClick={onNavigateFeed}
              className={`hover:text-white transition-colors pb-1 border-b-2 ${
                currentView === 'feed' ? 'border-white text-white' : 'border-transparent text-stone-200'
              }`}
            >
              {language === 'es' ? 'Artículos y Feed' : 'Research Feed'}
            </button>
            <button
              type="button"
              onClick={onOpenFarmSettings}
              className="hover:text-white transition-colors text-stone-200 inline-flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'es' ? 'Mi Campo:' : 'My Farm:'}{' '}
                <strong className="text-white">{farmSettings.county} Co.</strong>
              </span>
            </button>
            <a
              href={INSTITUTION_CONFIG.extensionDirectoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors text-stone-200 inline-flex items-center gap-1"
            >
              <span>{language === 'es' ? 'Directorio de Extensión' : 'County Directory'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-300" />
            </a>
            {reviewerMode && (
              <button
                type="button"
                onClick={onNavigateDashboard}
                className={`hover:text-white transition-colors pb-1 border-b-2 text-amber-300 ${
                  currentView === 'researcher-dashboard'
                    ? 'border-amber-300 font-bold'
                    : 'border-transparent'
                }`}
              >
                {language === 'es' ? 'Panel de Investigador' : 'Researcher Dashboard'}
              </button>
            )}
          </nav>

          {/* Primary Quick Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* University Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUniDropdown(!showUniDropdown)}
                className="min-h-[44px] px-3 py-1.5 rounded-lg bg-[#3b0000] hover:bg-[#2b0000] text-xs font-bold text-white flex items-center gap-1.5 border border-white/20 transition-colors"
                title="Land-Grant University Switcher"
              >
                <Building2 className="w-4 h-4 text-stone-300" aria-hidden="true" />
                <span className="hidden sm:inline">TAMU AgriLife</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-300" aria-hidden="true" />
              </button>

              {showUniDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-stone-900 rounded-xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    {language === 'es' ? 'Universidad Land-Grant' : 'Land-Grant Institution'}
                  </div>
                  {INSTITUTION_CONFIG.universities.map((uni) => (
                    <button
                      key={uni.id}
                      type="button"
                      disabled={!uni.active}
                      onClick={() => setShowUniDropdown(false)}
                      className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between ${
                        uni.active
                          ? 'bg-[#500000]/10 text-[#500000] font-bold'
                          : 'text-stone-400 cursor-not-allowed hover:bg-stone-50'
                      }`}
                    >
                      <span>{uni.name}</span>
                      {uni.status && (
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-normal">
                          {uni.status}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={onToggleLanguage}
              aria-label={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#3b0000] hover:bg-[#2b0000] text-xs font-bold border border-white/20 transition-colors"
              title="Toggle English / Español"
            >
              <Globe className="w-4 h-4 mr-1 text-amber-300" aria-hidden="true" />
              <span>{language === 'en' ? 'ES' : 'EN'}</span>
            </button>

            {/* Accessibility & Modes Toggle Drawer Trigger on Mobile */}
            <button
              type="button"
              onClick={() => setShowControlsDrawer(!showControlsDrawer)}
              aria-label="Display & Accessibility Controls"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#3b0000] hover:bg-[#2b0000] border border-white/20 text-white transition-colors"
              title="Controls (Text size, contrast, low data, reviewer)"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Accessibility & Status Toolbar (Expandable on Mobile, Inline on Desktop) */}
        {showControlsDrawer && (
          <div className="py-2.5 px-3 mb-2 bg-[#3b0000] rounded-xl flex flex-wrap items-center justify-between gap-2.5 text-xs border border-white/10 animate-in fade-in">
            <div className="flex flex-wrap items-center gap-2">
              {/* Text Size */}
              <button
                type="button"
                onClick={onCycleTextSize}
                className="min-h-[38px] px-3 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 transition-colors"
                title="Change font size"
              >
                <span>Text:</span>
                <span className="bg-white text-[#500000] px-1.5 py-0.5 rounded text-xs font-black">
                  {getTextSizeLabel()}
                </span>
              </button>

              {/* High Contrast */}
              <button
                type="button"
                onClick={onToggleHighContrast}
                className={`min-h-[38px] px-3 rounded-md font-bold flex items-center gap-1.5 transition-colors ${
                  highContrast
                    ? 'bg-amber-300 text-stone-950 font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="High Contrast Mode for direct sunlight"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Alto Contraste' : 'High Contrast'}</span>
              </button>

              {/* Low Data Mode */}
              <button
                type="button"
                onClick={onToggleLowDataMode}
                className={`min-h-[38px] px-3 rounded-md font-bold flex items-center gap-1.5 transition-colors ${
                  lowDataMode
                    ? 'bg-amber-300 text-stone-950 font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Low-Data Mode: hides images and video for rural cellular links"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Bajo Consumo de Datos' : 'Low-Data Mode'}</span>
              </button>

              {/* Reviewer Mode */}
              <button
                type="button"
                onClick={onToggleReviewerMode}
                className={`min-h-[38px] px-3 rounded-md font-bold flex items-center gap-1.5 transition-colors ${
                  reviewerMode
                    ? 'bg-emerald-400 text-stone-950 font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Specialist Reviewer Mode"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Modo Revisor' : 'Reviewer Mode'}</span>
              </button>
            </div>

            {/* Mobile quick links */}
            <div className="flex md:hidden items-center gap-2 pt-1 border-t border-white/10 w-full justify-between">
              <button
                type="button"
                onClick={onOpenFarmSettings}
                className="text-amber-300 font-bold inline-flex items-center gap-1 py-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{farmSettings.county} Co.</span>
              </button>

              {reviewerMode && (
                <button
                  type="button"
                  onClick={onNavigateDashboard}
                  className="text-stone-200 underline font-semibold py-1"
                >
                  {language === 'es' ? 'Panel de Investigador' : 'Researcher Dashboard'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
