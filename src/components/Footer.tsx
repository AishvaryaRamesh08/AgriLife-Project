import React from 'react';
import { ExternalLink, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { INSTITUTION_CONFIG } from '../services/researchApi';

interface FooterProps {
  language: 'en' | 'es';
  onNavigateAbout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigateAbout }) => {
  return (
    <footer className="bg-[#500000] text-white border-t-4 border-[#3b0000] mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/15">
          {/* Col 1: Wordmark & Core Mandate */}
          <div className="space-y-3">
            <div className="text-xl font-black tracking-tight text-white">
              AgriLife Research-to-Field
            </div>
            <p className="text-xs text-stone-200 leading-relaxed font-normal">
              {language === 'es'
                ? 'Explicaciones asistidas por IA de la investigación de Texas A&M. El contenido revisado por especialistas está marcado. Siempre consulte con su agente del condado de AgriLife Extension antes de tomar decisiones agronómicas mayores.'
                : 'AI-assisted explanations of Texas A&M research. Reviewed content is marked. Always check with your county AgriLife Extension agent before major agronomic decisions.'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>
                {language === 'es'
                  ? 'Compromiso de rigor y no invención'
                  : 'Strict Grounding: No Invented Rates or Data'}
              </span>
            </div>
            {onNavigateAbout && (
              <button
                type="button"
                onClick={onNavigateAbout}
                className="text-xs font-semibold text-white underline underline-offset-2 hover:text-amber-300"
              >
                {language === 'es' ? 'Acerca del proyecto' : 'About the project'}
              </button>
            )}
          </div>

          {/* Col 2: Land-Grant & Extension Directory */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-200">
              {language === 'es' ? 'Oficinas de Extensión en Texas' : 'Texas Extension Network'}
            </div>
            <p className="text-xs text-stone-200 leading-relaxed">
              {language === 'es'
                ? 'AgriLife Extension tiene oficinas y agentes especializados en los 254 condados de Texas.'
                : 'Texas A&M AgriLife Extension serves all 254 counties in Texas with local agents, soil tests, and test plot research.'}
            </p>
            <a
              href={INSTITUTION_CONFIG.extensionDirectoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 rounded-lg transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              <span>{language === 'es' ? 'Buscar Directorio de Condados' : 'Find Your County Office'}</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Col 3: Research Repositories */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-200">
              {language === 'es' ? 'Fuentes de Información' : 'Primary Repositories'}
            </div>
            <ul className="text-xs text-stone-200 space-y-1.5">
              <li>
                <a
                  href="https://oaktrust.library.tamu.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>Texas A&M OAKTrust Digital Repository</span>
                  <ExternalLink className="w-3 h-3 text-stone-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://agrilifeextension.tamu.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>Texas A&M AgriLife Extension Publications</span>
                  <ExternalLink className="w-3 h-3 text-stone-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://agrilifetoday.tamu.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>AgriLife Today Field News</span>
                  <ExternalLink className="w-3 h-3 text-stone-300" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300">
          <div>
            © {new Date().getFullYear()} Texas A&M AgriLife. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </div>
          <div className="text-stone-300 text-[11px]">
            {language === 'es'
              ? 'Desarrollado para agricultores, ganaderos y mayordomos de tierras de Texas.'
              : 'Engineered for Texas farmers, ranchers, and land stewards.'}
          </div>
        </div>
      </div>
    </footer>
  );
};
