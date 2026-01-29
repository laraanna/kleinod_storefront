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
import useMediaQuery from '../helper/matchMedia';
import {categories, materials} from '~/filterData';

enum ProductSortKeys {
  TITLE = 'TITLE',
  PRICE = 'PRICE',
}

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Atelier Kleinod | Products`}];
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
    pageBy: 250, // Increased from 8 to show more products initially
  });

  const url = new URL(request.url);

  const isProductSortKey = (value: string | null): value is ProductSortKeys =>
    !!value &&
    Object.values(ProductSortKeys).includes(value as ProductSortKeys);

  const sortKeyInput = url.searchParams.get('sort_by'); // Get value from URL

  const sortKey: ProductSortKeys = isProductSortKey(sortKeyInput)
    ? sortKeyInput
    : ProductSortKeys.PRICE; // Default to TITLE or any other default value

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

  useEffect(() => {
    const materialId = searchParams.get('material');
    const categoryId = searchParams.get('category');

    // Find the matching material object and return its name
    const materialName =
      materials.find((m) => m.id === materialId)?.name || null;

    // Find the matching category object and return its name
    const categoryName =
      categories.find((c) => c.id === categoryId)?.name || null;

    // Prevent unnecessary updates (avoid triggering updateFilters)
    setMaterialParams((prev) => (prev !== materialName ? materialName : prev));
    setCategoryParams((prev) => (prev !== categoryName ? categoryName : prev));
  }, [searchParams]); // Sync with URL parameter changes

  const isLargeScreen = useMediaQuery('(min-width: 45em)');

  // Add fade-in effect to images after they load
  useEffect(() => {
    const handleImageLoad = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img) {
        img.classList.add('loaded');
      }
    };

    const timeoutId = setTimeout(() => {
      const productImageElements = document.querySelectorAll<HTMLImageElement>(
        '.product-item img, .related-product img',
      );

      productImageElements.forEach((img) => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', handleImageLoad);
        }
      });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      const productImageElements = document.querySelectorAll<HTMLImageElement>(
        '.product-item img, .related-product img',
      );
      productImageElements.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, [products]);

  // Function to update filters in the URL (material, category, and sort_by)
  const updateFilters = (
    material: string | null,
    category: string | null,
    sortKey: string | null,
  ) => {
    setSearchParams((prevParams) => {
      const updatedParams: any = {
        ...prevParams,
        material: materials.find((m) => m.name === material)?.id || undefined,
        category: categories.find((c) => c.name === category)?.id || undefined,
        sort_by: sortKey || undefined,
      };

      for (const key in updatedParams) {
        if (!updatedParams[key]) {
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

  const resetFilter = (material: string, category: string) => {
    setMaterialParams(material);
    setCategoryParams(category);
    updateFilters(material, category, sortKey);
  };

  return (
    <div className="collection--wrapper">
      <CollectionFilter
        selectedCategory={categoryParams}
        selectedMaterial={materialParams}
        selectedSortBy={sortKey}
        onSortChange={updateSortKey}
        onMaterialChange={updateMaterial}
        onCategoryChange={updateCategory}
        onResetFilter={resetFilter}
      />
      {products.nodes.length !== 0 && (
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
            const galleryImages = getGalleryImages(product);

            const isAboveFold = index < 6;
            return (
              <>
                <ProductItem
                  key={`product-item-${uniqueKey}`}
                  product={product}
                  loading={isAboveFold ? 'eager' : 'lazy'}
                  fetchPriority={isAboveFold ? 'high' : 'low'}
                  isLargeScreen={isLargeScreen}
                  galleryImages={galleryImages}
                  galleryImageIndex={0}
                />
                <ProductItem
                  key={`product-item-lifestyle-${uniqueKey}`}
                  product={product}
                  loading="lazy"
                  fetchPriority="low"
                  isLargeScreen={false}
                  galleryImages={galleryImages}
                  galleryImageIndex={1}
                />
                {/* {!isLargeScreen && ( */}
                <ProductItemDescription
                  key={`product-item-description-${uniqueKey}`}
                  product={product}
                />
                {/* )} */}
              </>
            );
          }}
        </PaginatedResourceSection>
      )}
      {products.nodes.length === 0 && (
        <div className="no-products">
          <p>
            We currently don’t have a product that matches your selection, but
            we’d love to create it for you!
          </p>
          <p>
            Get in touch at&nbsp;
            <a href="mailto:hello@kleinod-atelier.com">
              hello@kleinod-atelier.com
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}

function getGalleryImages(
  product: ProductItemGalleryFragment,
): string[] | null {
  const metafield = product.metafield;

  if (
    metafield?.namespace === 'custom' &&
    metafield?.key === 'gallery_images' &&
    metafield?.value
  ) {
    try {
      const parsedValue = JSON.parse(metafield.value);
      if (
        Array.isArray(parsedValue) &&
        parsedValue.every((value): value is string => typeof value === 'string')
      ) {
        return parsedValue;
      }
    } catch (_error) {
      return null;
    }
  }

  return null;
}

type ProductItemCardProps = {
  product: ProductItemGalleryFragment;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  galleryImages?: string[] | null;
  galleryImageIndex?: number;
  showDescription?: boolean;
};

function ProductItemCard({
  product,
  loading,
  fetchPriority,
  galleryImages,
  galleryImageIndex = 0,
  showDescription = false,
}: ProductItemCardProps) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

  const hasGalleryImages = galleryImages && galleryImages.length > 0;
  const normalizedIndex = hasGalleryImages
    ? Math.min(Math.max(galleryImageIndex, 0), galleryImages.length - 1)
    : 0;
  const galleryImageSrc = hasGalleryImages
    ? galleryImages?.[normalizedIndex] ?? galleryImages?.[0]
    : undefined;

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {galleryImageSrc ? (
        <Image
          alt={product.title}
          aspectRatio="2/3"
          src={galleryImageSrc}
          loading={loading}
          fetchPriority={fetchPriority}
          sizes="(min-width: 45em) 33vw, 50vw"
        />
      ) : (
        product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="2/3"
            data={product.featuredImage}
            loading={loading}
            fetchPriority={fetchPriority}
            sizes="(min-width: 45em) 33vw, 50vw"
          />
        )
      )}
      {showDescription && (
        <div className="product-item-description">
          <p className="uppercase">{product.title}</p>
          {parseFloat(product.priceRange.minVariantPrice?.amount ?? '0') === 0
            ? 'Inquiry'
            : <Money data={product.priceRange.minVariantPrice} />}
        </div>
      )}
    </Link>
  );
}

function ProductItem({
  product,
  loading,
  fetchPriority,
  isLargeScreen,
  galleryImages,
  galleryImageIndex,
}: {
  product: ProductItemGalleryFragment;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  isLargeScreen: boolean;
  galleryImages?: string[] | null;
  galleryImageIndex?: number;
}) {
  return (
    <ProductItemCard
      product={product}
      loading={loading}
      fetchPriority={fetchPriority}
      galleryImages={galleryImages}
      galleryImageIndex={galleryImageIndex}
      showDescription={isLargeScreen}
    />
  );
}

function ProductItemDescription({
  product,
}: {
  product: ProductItemGalleryFragment;
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item description"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="product-item-description">
        <p className="uppercase">{product.title}</p>
        {parseFloat(product.priceRange.minVariantPrice?.amount ?? '0') === 0
          ? 'Inquiry'
          : <Money data={product.priceRange.minVariantPrice} />}
      </div>
    </Link>
  );
}

function ProductItemLifestyle({
  product,
  loading,
  galleryImages,
  galleryImageIndex,
}: {
  product: ProductItemGalleryFragment;
  loading?: 'eager' | 'lazy';
  galleryImages?: string[] | null;
  galleryImageIndex?: number;
}) {
  return (
    <ProductItemCard
      product={product}
      loading={loading}
      galleryImages={galleryImages}
      galleryImageIndex={galleryImageIndex}
    />
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
