import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import type {ProductItemGalleryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {CollectionFilter} from '~/components/CollectionFilter';
import {useSearchParams} from '@remix-run/react'; // Import useSearchParams from Remix
import {useEffect, useState} from 'react'; // Import useEffect from React
import Product from './($locale).products.$handle';

enum ProductSortKeys {
  TITLE = 'TITLE',
  PRICE = 'PRICE',
}

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
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const url = new URL(request.url);

  const isProductSortKey = (value: string | null): value is ProductSortKeys =>
    !!value &&
    Object.values(ProductSortKeys).includes(value as ProductSortKeys);

  const sortKeyInput = url.searchParams.get('sort_by'); // Get value from URL

  const sortKey: ProductSortKeys = isProductSortKey(sortKeyInput)
    ? sortKeyInput
    : ProductSortKeys.TITLE; // Default to TITLE or any other default value

  const category = url.searchParams.get('category') || null;
  const material = url.searchParams.get('material') || null;

  let materialFilter = '';
  if (material && material !== 'all') {
    materialFilter = `(tag:${material})`;
  }
  let categoryFilter = '';
  if (category && category !== 'all') {
    categoryFilter = `(product_type:${category})`;
  }

  let filter = '';
  if (materialFilter && categoryFilter !== '') {
    filter = materialFilter + ' AND ' + categoryFilter;
  } else if (materialFilter === '' && categoryFilter !== '') {
    filter = categoryFilter;
  } else if (materialFilter !== '' && categoryFilter === '') {
    filter = materialFilter;
  }

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {
        ...paginationVariables,
        sortKey,
        query: filter,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products, sortKey, category, material};
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
  const {products, sortKey, category, material} =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [materialParams, setMaterialParams] = useState<string | null>(
    material || null,
  );
  const [categoryParams, setCategoryParams] = useState<string | null>(
    category || null,
  );

  // Function to update filters in the URL (material, category, and sort_by)
  const updateFilters = (
    material: string | null,
    category: string | null,
    sortKey: string | null,
  ) => {
    setSearchParams((prevParams) => {
      const updatedParams: any = {
        ...prevParams, // Merge previous parameters
        material: material || undefined, // If material is null, don't add it to the URL
        category: category || undefined, // If category is null, don't add it to the URL
        sort_by: sortKey || undefined, // If sortKey is null, don't add it to the URL
      };

      // Clean up undefined values to avoid passing them as URL parameters
      for (const key in updatedParams) {
        if (updatedParams[key] === null || updatedParams[key] === undefined) {
          delete updatedParams[key];
        }
      }

      return updatedParams;
    });
  };

  const updateMaterial = (material: string) => {
    setMaterialParams(material); // Store the material value
    updateFilters(material, categoryParams, sortKey); // Update filters with the current material, category, and sortKey
  };

  const updateCategory = (category: string) => {
    setCategoryParams(category); // Store the category value
    updateFilters(materialParams, category, sortKey); // Update filters with the current material, category, and sortKey
  };

  const updateSortKey = (sortKey: string) => {
    updateFilters(materialParams, categoryParams, sortKey); // Update filters with the current sortKey, material, and category
  };

  return (
    <div className="collection--wrapper">
      <CollectionFilter
        selectedCategory={categoryParams}
        selectedMaterial={materialParams}
        selectedSortBy={searchParams.get('sort_by') || ''}
        onSortChange={updateSortKey}
        onMaterialChange={updateMaterial}
        onCategoryChange={updateCategory}
      />
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
            <div key={uniqueKey}>
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
            </div>
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
  productType
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
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor, sortKey: $sortKey, query:$query) {
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
