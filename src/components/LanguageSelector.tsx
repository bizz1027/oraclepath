import { useState, useEffect } from 'react';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
  selectedLanguage: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'deu', name: 'Deutsch' },
  { code: 'spa', name: 'Español' },
  { code: 'fra', name: 'Français' },
  { code: 'ita', name: 'Italiano' },
  { code: 'por', name: 'Português' },
  { code: 'nld', name: 'Nederlands' },
  { code: 'swe', name: 'Svenska' },
  { code: 'nor', name: 'Norsk' },
  { code: 'dan', name: 'Dansk' },
  { code: 'pol', name: 'Polski' }
];

export default function LanguageSelector({ onLanguageChange, selectedLanguage }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLangName = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name || 'English';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
      >
        <span>🌐</span>
        <span>{selectedLangName}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-48 bg-purple-900/95 border border-purple-700/50 rounded-lg shadow-xl">
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-purple-800/50 transition-colors ${
                  selectedLanguage === language.code ? 'text-purple-300 font-medium' : 'text-purple-200'
                }`}
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 