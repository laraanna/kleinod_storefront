import type { ActionFunctionArgs } from "@shopify/remix-oxygen";

export async function action({ request }: ActionFunctionArgs) {
  const payload = await request.json();

  await fetch("https://privacy.kleinod-atelier.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return new Response(null, { status: 204 });
}
