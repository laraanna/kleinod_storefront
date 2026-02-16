import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  // if (
  //   params.locale &&
  //   params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  // ) {
  //   // If the locale URL param is defined, yet we still are still at the default locale
  //   // then the the locale param must be invalid, send to the 404 page
  //   throw new Response(null, {status: 404});
  // }

  // Get the expected prefix from your i18n config (e.g., "de")
  const expectedPrefix = language.toLowerCase();

  if (params.locale && params.locale.toLowerCase() !== expectedPrefix) {
    // Now /de matches language "DE", so it won't 404.
    throw new Response(null, {status: 404});
  }

  return null;
}
