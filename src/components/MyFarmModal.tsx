import React, { useState } from 'react';
import { X, Check, MapPin, Sprout, ExternalLink } from 'lucide-react';
import { INSTITUTION_CONFIG } from '../services/researchApi';
import { MyFarmSettings } from '../types/research';

interface MyFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: MyFarmSettings;
  onSave: (settings: MyFarmSettings) => void;
  language: 'en' | 'es';
}

const ALL_CROPS = [
  "Cotton",
  "Corn",
  "Grain Sorghum",
  "Beef Cattle",
  "Pasture / Hay",
  "Wheat",
  "Vegetables",
  "Pecans",
  "Peaches",
  "Cover Crops",
  "Wine Grapes",
  "Sheep / Goats"
];

export const MyFarmModal: React.FC<MyFarmModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
  language,
}) => {
  const [selectedCounty, setSelectedCounty] = useState(currentSettings.county || 'Lubbock');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    currentSettings.crops.length > 0 ? currentSettings.crops : ['Cotton', 'Grain Sorghum']
  );

  if (!isOpen) return null;

  const currentCountyObj = INSTITUTION_CONFIG.counties.find(
    (c) => c.name.toLowerCase() === selectedCounty.toLowerCase()
  ) || INSTITUTION_CONFIG.counties[0];

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter((c) => c !== crop));
      }
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleSave = () => {
    onSave({
      county: selectedCounty,
      crops: selectedCrops,
      firstTimeCompleted: true,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#500000] text-white px-5 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-amber-300" aria-hidden="true" />
            <div>
              <h2 id="modal-title" className="text-lg font-bold">
                {language === 'es' ? 'Configuración de Mi Campo' : 'My Farm Settings'}
              </h2>
              <p className="text-xs text-stone-200">
                {language === 'es'
                  ? 'Personalice investigación, clima y guías de campo'
                  : 'Personalize research, weather & field guides'}
              </p>
            </div>
          </div>
          {currentSettings.firstTimeCompleted && (
            <button
              type="button"
              onClick={onClose}
              aria-label={language === 'es' ? 'Cerrar' : 'Close'}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* County Selector */}
          <div>
            <label htmlFor="county-select" className="block text-sm font-bold text-stone-900 mb-1.5">
              1. {language === 'es' ? 'Seleccione su Condado de Texas' : 'Select Your Texas County'}
            </label>
            <p className="text-xs text-stone-500 mb-2">
              {language === 'es'
                ? 'Conecta el clima local y su oficina de Extensión AgriLife'
                : 'Connects local weather and your County AgriLife Extension office'}
            </p>
            <select
              id="county-select"
              value={selectedCounty}
              onChange={(e) => {
                const newC = e.target.value;
                setSelectedCounty(newC);
                // Pre-populate with county's primary crops if user switches
                const cObj = INSTITUTION_CONFIG.counties.find((c) => c.name === newC);
                if (cObj && cObj.primaryCrops.length > 0) {
                  setSelectedCrops(cObj.primaryCrops);
                }
              }}
              className="w-full min-h-[48px] px-3.5 py-2.5 bg-stone-50 border-2 border-stone-300 rounded-xl font-semibold text-stone-900 focus:border-[#500000] focus:outline-none"
            >
              {INSTITUTION_CONFIG.counties.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} County ({c.region})
                </option>
              ))}
            </select>

            {/* County Extension Link Note */}
            {currentCountyObj && (
              <div className="mt-2 text-xs text-stone-600 flex items-center gap-1.5">
                <span>{language === 'es' ? 'Oficina de Extensión local:' : 'Local Extension office:'}</span>
                <a
                  href={currentCountyObj.extensionOfficeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#500000] underline inline-flex items-center gap-1 hover:text-[#700000]"
                >
                  {currentCountyObj.name} AgriLife Extension
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>

          {/* Crops Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-stone-900">
                2. {language === 'es' ? '¿Qué cultiva o cría?' : 'What do you grow or raise?'}
              </label>
              <span className="text-xs text-stone-500">
                {selectedCrops.length} {language === 'es' ? 'seleccionados' : 'selected'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              {language === 'es'
                ? 'Toque para marcar todos los que correspondan a su operación'
                : 'Tap to check all that apply to your operation'}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {ALL_CROPS.map((crop) => {
                const isSelected = selectedCrops.includes(crop);
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => toggleCrop(crop)}
                    className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left text-sm font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#500000] text-white border-[#500000] shadow-xs'
                        : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate">{crop}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0 ml-1.5 text-amber-300" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full min-h-[50px] bg-[#500000] hover:bg-[#600000] active:scale-[0.99] text-white font-bold text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Sprout className="w-5 h-5 text-amber-300" aria-hidden="true" />
              {language === 'es' ? 'Guardar y Personalizar mi Feed' : 'Save & Personalize My Feed'}
            </button>
            <p className="text-center text-xs text-stone-400 mt-2">
              {language === 'es'
                ? 'Guardado en su dispositivo (sin contraseña). Puede cambiarlo en cualquier momento.'
                : 'Saved securely on your device (no password required). Editable anytime.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
