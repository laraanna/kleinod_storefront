import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

const BASE_URL = 'https://kleinod-atelier.com';
const CURRENCY_FALLBACK = 'EUR';

const PRODUCTS_QUERY = `#graphql
  query ProductsForGoogleFeed($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          tags
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                image {
                  url
                  altText
                }
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const data = await storefront.query(PRODUCTS_QUERY, {
    variables: { first: 250 },
  });

  const products = data?.products?.edges ?? [];

  const itemsXml = products
    .flatMap(({ node }: any) => {
      const productId = node.id;
      const handle = node.handle;
      const productTitle = escapeXml(node.title);
      const productDescription = escapeXml(
        (node.description || '').substring(0, 5000)
      );

      const productImageNode = node.images?.edges?.[0]?.node;
      const productImageUrl = productImageNode?.url
        ? escapeXml(productImageNode.url)
        : '';

      const variants = node.variants?.edges ?? [];

      // For Google variant grouping
      const itemGroupId = escapeXml(handle);

      return variants.map(({ node: variant }: any) => {
        const variantSku = variant.sku || variant.id;
        const variantImageNode = variant.image || productImageNode;
        const variantImageUrl = variantImageNode?.url
          ? escapeXml(variantImageNode.url)
          : '';
        const available = variant.availableForSale;

        const priceAmount = variant.price?.amount ?? null;
        const priceCurrency =
          variant.price?.currencyCode ?? CURRENCY_FALLBACK;

        const priceString = priceAmount
          ? `${Number(priceAmount).toFixed(2)} ${priceCurrency}`
          : '';

        // Find the "Material" option (case-insensitive)
        const materialOption = (variant.selectedOptions || []).find(
          (opt: any) => opt.name?.toLowerCase() === 'material'
        );
        const materialValue: string | null = materialOption?.value || null;

        // Build link – include ?Material=... if present
        const link = materialValue
          ? `${BASE_URL}/products/${handle}?Material=${encodeURIComponent(
              materialValue
            )}`
          : `${BASE_URL}/products/${handle}`;

        const availability = available ? 'in stock' : 'out of stock';

        const materialXml = materialValue
          ? `<g:material>${escapeXml(materialValue)}</g:material>`
          : '';

        return `
        <item>
          <g:id>${escapeXml(variantSku)}</g:id>
          <g:item_group_id>${itemGroupId}</g:item_group_id>
          <g:title>${productTitle}</g:title>
          <g:description>${productDescription}</g:description>
          <g:link>${link}</g:link>
          ${
            variantImageUrl
              ? `<g:image_link>${variantImageUrl}</g:image_link>`
              : ''
          }
          <g:availability>${availability}</g:availability>
          ${
            priceString
              ? `<g:price>${priceString}</g:price>`
              : ''
          }
          <g:condition>new</g:condition>
          ${materialXml}
        </item>`;
      });
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Kleinod Products</title>
    <link>${BASE_URL}</link>
    <description>Google Merchant Center Feed</description>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

function escapeXml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
