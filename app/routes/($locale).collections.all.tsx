import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import type {ProductItemGalleryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {CollectionFilter} from '~/components/CollectionFilter';
import React from 'react'; // Import React
import {useSearchParams} from '@remix-run/react'; // Import useSearchParams from Remix
import {useEffect} from 'react'; // Import useEffect from React

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Hydrogen | Products`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const url = new URL(request.url);
  const sortBy = url.searchParams.get('sort_by') || 'PRICE_DESCENDING'; // Default to 'PRICE_DESCENDING'

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {
        ...paginationVariables,
        sortKey: sortBy,
      }
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Ensure that the sort_by parameter is reflected in the URL and state
  const sortBy = searchParams.get('sort_by') || 'PRICE_DESCENDING'; // Default to 'PRICE_DESCENDING'

  // Function to update the URL with the new sort_by param
  const updateSortBy = (sortKey: string) => {
    setSearchParams({sort_by: sortKey});
  };

  // useEffect(() => {
  //   console.log('Sorting by:', sortBy);
  // }, [sortBy]);

  return (
    <div className="collection">
      <CollectionFilter sortBy={sortBy} onSortChange={updateSortBy} />
      <PaginatedResourceSection
        connection={products}
        resourcesClassName="products-grid"
      >
        {({
          node: product,
          index,
        }: {
          node: ProductItemGalleryFragment;
          index: number;
        }) => {
          const uniqueKey = `${product.id}-${index}`;

          return (
            // Use React.Fragment or a div as the only child to avoid multiple root nodes
            <React.Fragment key={uniqueKey}>
              <ProductItem
                key={`product-item-${uniqueKey}`}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
              <ProductItemLifestyle
                key={`product-item-lifestyle-${uniqueKey}`}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            </React.Fragment>
          );
        }}
      </PaginatedResourceSection>
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemGalleryFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="2/3"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <div className="product-item-description">
        <p className="uppercase">{product.title}</p>
        <Money data={product.priceRange.minVariantPrice} />
      </div>
    </Link>
  );
}

function ProductItemLifestyle({
  product,
  loading,
}: {
  product: ProductItemGalleryFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

  // Check if the gallery_images metafield exists and parse its value
  const galleryImages =
    product.metafield?.namespace === 'custom' &&
    product.metafield?.key === 'gallery_images' &&
    product.metafield?.value
      ? (JSON.parse(product.metafield.value) as string[])
      : null;

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {galleryImages && (
        <Image
          alt={product.title}
          aspectRatio="2/3"
          src={galleryImages[1]}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT_GALLERY = `#graphql
  fragment ProductItemGallery on Product {
  id
  handle
  title
  featuredImage {
    id
    altText
    url
    width
    height
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
    maxVariantPrice {
      amount
      currencyCode
    }
  }
  variants(first: 1) {
    nodes {
      selectedOptions {
        name
        value
      }
    }
  }
  metafield(namespace: "custom", key: "gallery_images") {
    namespace
    key
    value
    type
  }
}
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2024-01/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $sortReverse: Boolean

  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor, sortKey: $sortKey, reverse: $sortReverse) {
      nodes {
        ...ProductItemGallery
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT_GALLERY}
` as const;
