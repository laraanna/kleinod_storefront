import type {
  CountryCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  pathPrefix: string;
};

export function getLocaleFromRequest(request: Request): Locale {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();
  const segments = path.split('/');
  // const firstSegment = segments[1];
  const firstSegment = url.pathname.split('/')[1];

  // console.log('DEBUG FIRST SEGMENT:', firstSegment);
  // console.log('DEBUG PATH:', path);

  // 1. GERMAN (Short only)
  if (firstSegment === 'de') {
    return {
      language: 'DE' as LanguageCode,
      country: 'DE' as CountryCode,
      pathPrefix: '/de',
    };
  }

  // 2. FRENCH (Short only)
  if (firstSegment === 'fr') {
    return {
      language: 'FR' as LanguageCode,
      country: 'FR' as CountryCode,
      pathPrefix: '/fr',
    };
  }

  // 3. DEFAULT (International - English)
  return {
    language: 'EN' as LanguageCode,
    country: 'IE' as CountryCode,
    pathPrefix: '',
  };
}

export const LANGUAGES = [
  {label: 'EN', language: 'EN', country: 'IE', path: ''},
  {label: 'DE', language: 'DE', country: 'DE', path: '/de'},
  {label: 'FR', language: 'FR', country: 'FR', path: '/fr'},
];
