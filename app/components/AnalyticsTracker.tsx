import { useAnalytics } from "@shopify/hydrogen";
import { useEffect } from "react";


declare global {
  interface Window {
    dataLayer: any[];
    gtag?: any;
    fbq?: any;
  }
}

function sendServerEvent(payload: any) {
  return fetch("/en/api.track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function AnalyticsTracker() {
  const { subscribe, register } = useAnalytics();
  const { ready } = register("Analytics Tracker");

  useEffect(() => {
    subscribe("product_viewed", ({ product }) => {
      const eventId = crypto.randomUUID();

      const payload = {
        event: "view_item",
        event_id: eventId,
        ecommerce: {
          items: [
            {
              item_id: product.id,
              item_name: product.title,
              price: product.priceRange?.minVariantPrice?.amount,
            },
          ],
        },
      };

      // Client GA4
      window.gtag?.("event", "view_item", {
        event_id: eventId,
        items: payload.ecommerce.items,
        value: payload.ecommerce.items[0].price,
        currency: "EUR",
        debug_mode: true,
      });

      // Client Meta
      window.fbq?.("track", "ViewContent", {
        event_id: eventId,
        content_ids: [product.id],
        content_type: "product",
        value: product.priceRange?.minVariantPrice?.amount,
        currency: "EUR",
      });

      // Server-side
      sendServerEvent(payload);
    });

    ready();
  }, [ready, subscribe]);

  return null;
}
