import {RemixBrowser} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {createInstance} from 'i18next';
import {I18nextProvider, initReactI18next} from 'react-i18next';
// import Backend from 'i18next-http-backend';
import {i18nConfig} from './i18n/config';

async function hydrate() {
  const instance = createInstance();
  // 1. Daten aus dem Fenster-Objekt fischen
  const loaderData = window.__remixContext?.state?.loaderData?.root;
  const i18nData = loaderData?.i18nResources; // Das ist dein JSON-Inhalt
  const locale = loaderData?.locale ?? 'de';

  console.log('Hydration Check:', {locale, i18nData}); // Hilft beim Debuggen!

  await instance.use(initReactI18next).init({
    ...i18nConfig,
    lng: locale,
    resources: {
      [locale]: {
        // WICHTIG: Hier muss das Objekt rein, das die Übersetzungen enthält
        common: i18nData,
      },
    },
    detection: {
      order: ['htmlTag'],
    },
  });
  if (
    typeof window !== 'undefined' &&
    !window.location.origin.includes('webcache.googleusercontent.com')
  ) {
    startTransition(() => {
      hydrateRoot(
        document,
        <I18nextProvider i18n={instance}>
          <StrictMode>
            <RemixBrowser />
          </StrictMode>
        </I18nextProvider>,
      );
    });
  }
}

hydrate();
