import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request}: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;
  const body = robotsTxtData(origin);

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

function robotsTxtData(origin: string) {
  const sitemapUrl = `${origin}/sitemap.xml`;

  return `
User-agent: *
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /account
Allow: /

Sitemap: ${sitemapUrl}

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*

User-agent: Nutch
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 10

User-agent: AhrefsSiteAudit
Crawl-delay: 10

User-agent: MJ12bot
Crawl-Delay: 10

User-agent: Pinterest
Crawl-delay: 1
  `.trim();
}
