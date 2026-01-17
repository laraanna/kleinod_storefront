import type {EntryContext, AppLoadContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://*.googletagmanager.com',
      "'unsafe-inline'",
    ],
    scriptSrcElem: [
      "'self'",
      // 'https://static.elfsight.com',
      'https://cdn.shopify.com',
      'https://www.googletagmanager.com',
      'https://connect.facebook.net',
      'https://slrgkgulru.pixelflow.so',
      "'unsafe-inline'",
    ],
    styleSrc: [
      "'self'",
      'https://fonts.gstatic.com',
      'https://fonts.googleapis.com',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com',
      'https://fonts.googleapis.com',
      'https://cdn.shopify.com',
    ],
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com', // Shopify's internal service
      'http://localhost:*', // Allow connections to local development servers
      'ws://localhost:*', // WebSocket connections for local development
      'ws://127.0.0.1:*', // WebSocket connections for local development
      'ws://*.tryhydrogen.dev:*', // WebSocket connections for Hydrogen dev environments
      'https://region1.google-analytics.com', // ✅ GA regional tracking server
      'https://stats.g.doubleclick.net', // ✅ Required for some GA features
      'https://www.facebook.com', // Allow Facebook Pixel connections
      'https://connect.facebook.net', // Allow Facebook Pixel script connections
      'https://api.pixelflow.so', // Allow PixelFlow API connections
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://*.googletagmanager.com',
    ],
    imgSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com',
      'https://www.facebook.com', // Allow Facebook Pixel tracking images
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
