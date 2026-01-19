import { useAnalytics } from "@shopify/hydrogen";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

async function sendServerEvent(payload: any) {
  await fetch("/api.track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function GoogleTagManager() {
  const { subscribe, register } = useAnalytics();
  const { ready } = register("Google Tag Manager");

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

      // 1) Client GTM
      window.dataLayer.push(payload);

      // 2) Server GTM (Stape)
      sendServerEvent(payload);
    });

    ready();
  }, [ready, subscribe]);

  return null;
}
