import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('hi') ? 'hi' : 'en';

  return (
    <div className="inline-flex items-center rounded-full border border-line p-0.5 text-sm">
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`rounded-full px-3 py-1 transition ${
          lang === 'en' ? 'bg-ink text-white' : 'text-subtle hover:text-ink'
        }`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => i18n.changeLanguage('hi')}
        className={`rounded-full px-3 py-1 transition ${
          lang === 'hi' ? 'bg-ink text-white' : 'text-subtle hover:text-ink'
        }`}
        aria-pressed={lang === 'hi'}
      >
        हिं
      </button>
    </div>
  );
}
