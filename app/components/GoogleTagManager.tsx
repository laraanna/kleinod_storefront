import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GoogleTagManager() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('Google Tag Manager');

  // Add Google Tag Manager script to the head
  useEffect(() => {
    if (window.dataLayer) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5J26GK6V';
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    // Page view
    subscribe('page_viewed', (event) => {
      window.dataLayer.push({
        event: 'page_viewed',
        page: {
          url: event.url,
          path: new URL(event.url).pathname,
        },
        shop: {
          currency: event.shop?.currency ?? 'EUR',
        },
      });
    });

    // Product view
    subscribe('product_viewed', (event) => {
      const product = event.products?.[0];

      window.dataLayer.push({
        event: 'product_viewed',
        ecommerce: {
          items: [
            {
              item_id: product?.id,
              item_name: product?.title,
              item_variant: product?.variantTitle,
              price: product?.price,
              currency: event.shop?.currency ?? 'EUR',
              item_brand: product?.vendor,
            },
          ],
        },
      });
    });

    // Add to cart
    subscribe('product_added_to_cart', (event) => {
      console.log('product_added_to_cart', event);
      const line = event.currentLine;
      if (!line) return; // Safeguard for undefined line
      const prevLine = event.prevLine;
      const quantityAdded = line.quantity - (prevLine?.quantity ?? 0);
      const item = line.merchandise;

      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          items: [
            {
              item_id: item.id,
              item_name: item.product.title,
              item_variant: item.title,
              price: line.cost.totalAmount.amount,
              quantity: quantityAdded,
              currency: event.shop?.currency ?? 'EUR',
              item_brand: item.product.vendor,
            },
          ],
        },
      });
    });

    // Remove from cart
    subscribe('product_removed_from_cart', (event) => {
      const line = event.currentLine;
      const prevLine = event.prevLine;

      const removedQuantity = (prevLine?.quantity ?? 0) - (line?.quantity ?? 0);

      const item = line?.merchandise ?? prevLine?.merchandise;

      if (!item) return;

      window.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
          items: [
            {
              item_id: item.id,
              item_name: item.product.title,
              item_variant: item.title,
              price:
                line?.cost?.totalAmount?.amount ??
                prevLine?.cost?.totalAmount?.amount,
              quantity: removedQuantity,
              currency: event.shop?.currency ?? 'EUR',
              item_brand: item.product.vendor,
            },
          ],
        },
      });
    });

    // Cart updated
    subscribe('cart_updated', (event) => {
      const lines = event.cart?.lines?.nodes ?? [];

      window.dataLayer.push({
        event: 'cart_updated',
        ecommerce: {
          items: lines.map((line) => ({
            item_id: line.merchandise.id,
            item_name: line.merchandise.product.title,
            item_variant: line.merchandise.title,
            price: line.cost.totalAmount.amount,
            quantity: line.quantity,
          })),
          value: event.cart?.cost?.totalAmount?.amount ?? 0,
          currency: event.cart?.cost?.totalAmount?.currencyCode ?? 'EUR',
        },
      });
    });

    subscribe('cart_viewed', (event) => {
      const lines = event.cart?.lines?.nodes ?? [];

      window.dataLayer.push({
        event: 'cart_viewed',
        ecommerce: {
          items: lines.map((line) => ({
            item_id: line.merchandise.id,
            item_name: line.merchandise.product.title,
            item_variant: line.merchandise.title,
            price: line.cost.totalAmount.amount,
            quantity: line.quantity,
          })),
          value: event.cart?.cost?.totalAmount?.amount ?? 0,
          currency: event.cart?.cost?.totalAmount?.currencyCode ?? 'EUR',
        },
        page: {
          url: event.url,
        },
      });
    });

    ready();
  }, [ready, subscribe]);

  return null;
}
