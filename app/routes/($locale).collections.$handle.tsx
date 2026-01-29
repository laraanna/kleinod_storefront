import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import type {ProductItemGalleryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {useEffect} from 'react';
import useMediaQuery from '../helper/matchMedia';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Atelier Kleinod | ${data?.collection?.title ?? ''} Collection`},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 250,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const products = collection.products;
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

  return (
    <div className="collection--wrapper">
      {collection.description && (
        <div
          className="collection-description"
          dangerouslySetInnerHTML={{__html: collection.description}}
        />
      )}
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
                <ProductItemDescription
                  key={`product-item-description-${uniqueKey}`}
                  product={product}
                />
              </>
            );
          }}
        </PaginatedResourceSection>
      )}
      {products.nodes.length === 0 && (
        <div className="no-products">
          <p>
            We currently don't have a product that matches your selection, but
            we'd love to create it for you!
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
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
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
          {parseFloat(product.priceRange.minVariantPrice?.amount ?? '0') ===
          0 ? (
            'Inquiry'
          ) : (
            <Money data={product.priceRange.minVariantPrice} />
          )}
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
        {parseFloat(product.priceRange.minVariantPrice?.amount ?? '0') === 0 ? (
          'Inquiry'
        ) : (
          <Money data={product.priceRange.minVariantPrice} />
        )}
      </div>
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

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT_GALLERY}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItemGallery
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
