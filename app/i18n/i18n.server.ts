import {RemixI18Next} from 'remix-i18next/server'; // Wichtig: /server für v6
import {i18nConfig} from './config';
import de from './de.json';
import en from './en.json';
import fr from './fr.json';

export const i18n = new RemixI18Next({
  detection: {
    supportedLanguages: i18nConfig.supportedLanguages,
    fallbackLanguage: i18nConfig.fallbackLanguage,
    order: ['searchParams', 'cookie', 'header'],
  },
  i18next: {
    ...i18nConfig,
    resources: {
      de: {common: de},
      en: {common: en},
      fr: {common: fr},
    },
  },
});
