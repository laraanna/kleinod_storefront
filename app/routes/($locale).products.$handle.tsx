import {Suspense, useState, useEffect} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {ProductFragment} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  Image,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl, useVariantUrl} from '~/lib/variants';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {AtelierSection} from 'app/components/AtelierSection';
import ImageSwiper from '~/components/ImageSwiper';
import useMediaQuery from '../helper/matchMedia';
import {customEngraveID} from '~/specialProductFeatures';

// export const meta: MetaFunction<typeof loader> = ({data}) => {
//   return [{title: `Atelier Kleinod | ${data?.product.title ?? ''}`}];
// };

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data?.product) return [];

  const title = `${data.product.title} | Atelier Kleinod`;
  const url = `https://kleinod-atelier.com/products/${data.product.handle}`;
  const description = data.product.description;

  return [
    {title},
    {property: 'og:title', content: title},
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {name: 'twitter:description', content: description},
    {property: 'og:url', content: url},
    {property: 'og:type', content: 'product'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:url', content: url},
    {tagName: 'link', rel: 'canonical', href: url},
  ];
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
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  let recommendedProductsData: any[] = [];
  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const relatedProducts = storefront.query(RELATED_PRODUCTS_QUERY, {
    variables: {productId: product.id},
  });

  try {
    const result = await relatedProducts;
    recommendedProductsData = result?.productRecommendations?.slice(0, 3) || [];
  } catch (error) {
    console.error('Error fetching relatedProducts data:', error);
  }

  // Extract metafield value and parse it to get the IDs
  let materialIds = [];
  if (product.metafield?.value) {
    try {
      materialIds = JSON.parse(product.metafield.value) as any[]; // Assuming it's a JSON array of IDs
    } catch (error) {
      console.error('Error parsing metafield value:', error);
    }
  }

  // Fetch material data based on the extracted IDs
  let materialData = [];
  if (materialIds.length > 0) {
    const materialPromises = materialIds.map((id) =>
      storefront.query(MATERIAL_QUERY, {
        variables: {id},
      }),
    );

    try {
      const materialResults = await Promise.all(materialPromises);

      // Extract "label" field value from each material response
      materialData = materialResults.map((result) => {
        const fields = result.metaobject?.fields;
        const labelField = fields?.find(
          (field: {key: string; value: string}) => field.key === 'label',
        ); // Find the 'label' field
        return labelField ? labelField.value : null; // Store the value of 'label' or null if not found
      });
    } catch (error) {
      console.error('Error fetching material data:', error);
    }
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  return {
    product,
    materialData,
    recommendedProductsData,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    variants,
  };
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants, materialData, recommendedProductsData} =
    useLoaderData<typeof loader>();
  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );

  const isLargeScreen = useMediaQuery('(min-width: 45em)');

  const {title, descriptionHtml} = product;

  const productImages = product.images.nodes;
  const mainImages = productImages.filter(
    (imageObj) => !imageObj.url.includes('lifestyle'),
  );
  const lastTwoImages = productImages.filter((imageObj) =>
    imageObj.url.includes('lifestyle'),
  );

  const [firstSwiper, setFirstSwiper] = useState(null);
  const [secondSwiper, setSecondSwiper] = useState(null);

  const [activeImage, setActiveImage] = useState(productImages[0]);

  useEffect(() => {
    // Add fade-in effect to images after they load
    const handleImageLoad = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img) {
        img.classList.add('loaded');
      }
    };

    // Use a small delay to ensure DOM has updated after activeImage change
    const timeoutId = setTimeout(() => {
      // Find all product images and add load listeners
      const productImageElements = document.querySelectorAll<HTMLImageElement>(
        '.product-image img, .product--images-thumbnails img, .product--imageShowcase img, .swiper-slide img, .related-product img',
      );

      productImageElements.forEach((img) => {
        if (img.complete) {
          // Image already loaded
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', handleImageLoad);
        }
      });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      const productImageElements = document.querySelectorAll<HTMLImageElement>(
        '.product-image img, .product--images-thumbnails img, .product--imageShowcase img, .swiper-slide img, .related-product img',
      );
      productImageElements.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, [productImages, activeImage, recommendedProductsData]);

  const handleThumbnailClick = (image: any) => {
    setActiveImage(image);
  };

  useEffect(() => {
    if (productImages.length > 0) {
      setActiveImage(productImages[0]);
    }
  }, [productImages]);

  return (
    <div className="product--wrapper">
      <div className="product--container">
        {!isLargeScreen ? (
          <ImageSwiper
            type="PRODUCT"
            images={mainImages.map((img: any) => ({
              id: img.id || '',
              url: img.url || '',
              altText: img.altText || '',
            }))}
            onSwiper={setFirstSwiper}
            slidesPerView={1}
            centeredSlides={false}
          />
        ) : (
          <div className="product--images">
            <div className="product--images-thumbnails">
              {mainImages.map((image: any, index: number) => (
                <button
                  key={image.id}
                  style={{
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveImage(image)}
                >
                  <Image
                    data={image}
                    width="160"
                    height="200"
                    crop="center"
                    alt={image.altText || `Image ${index + 1}`}
                    style={{borderRadius: '5px'}}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'low'}
                  />
                </button>
              ))}
            </div>
            {activeImage && (
              <div className="product-image">
                <Image
                  alt={activeImage.altText || 'Product Image'}
                  aspectRatio="4/5"
                  data={activeImage}
                  key={activeImage.id}
                  sizes="(min-width: 45em) 50vw, 100vw"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            )}
          </div>
        )}
        <div className="product--description">
          <h1 className="uppercase">{title}</h1>
          <div
            className="product--description-info"
            dangerouslySetInnerHTML={{__html: descriptionHtml}}
          />
          <br />
          {/* Render material data */}
          {product.id !== `gid://shopify/Product/${customEngraveID}` && (
            <div className="product--description-material">
              <h3 className="uppercase">Material</h3>
              {materialData && materialData.length > 0
                ? materialData.map((label, index) => (
                    <div key={label}>
                      <label className="capitalize">{label}</label>
                    </div>
                  ))
                : null}
            </div>
          )}

          <Suspense
            fallback={
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={[]}
              />
            }
          >
            <Await
              errorElement="There was a problem loading product variants"
              resolve={variants}
            >
              {(data) => (
                <ProductForm
                  product={product}
                  selectedVariant={selectedVariant}
                  variants={data?.product?.variants.nodes || []}
                />
              )}
            </Await>
          </Suspense>
        </div>
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>
      <div className="product--imageShowcase">
        {lastTwoImages.map((image: any, index: number) => (
          <div key={image.id}>
            <Image
              data={image}
              crop="center"
              aspectRatio="4/5"
              sizes="(min-width: 50vw) 50vw, 100vw"
              alt={image.altText || `Image ${index + 1}`}
              loading="lazy"
              fetchPriority="low"
            />
          </div>
        ))}
      </div>

      {/* Related Products Section */}
      <div className="product--relatedProducts">
        <h3>You might also like</h3>
        {!isLargeScreen ? (
          <ImageSwiper
            type="RECOMMENDATION"
            productRecommendation={recommendedProductsData}
            onSwiper={setSecondSwiper}
            slidesPerView={'auto'}
            centeredSlides={true}
          />
        ) : (
          <div className="product--relatedProducts-container">
            {recommendedProductsData &&
              recommendedProductsData.map(
                (relatedProduct: any, index: number) => (
                  <div key={relatedProduct.id} className="related-product">
                    <Link to={`/products/${relatedProduct.handle}`}>
                      <Image
                        src={relatedProduct.images.edges[0]?.node.url}
                        crop="center"
                        aspectRatio="4/5"
                        alt={
                          relatedProduct.images.edges[0]?.node.altText ||
                          relatedProduct.title
                        }
                        sizes="(min-width: 45em) 33vw, 100vw"
                        loading="lazy"
                        fetchPriority="low"
                      />
                    </Link>
                    <div className="product-item-description">
                      <p className="uppercase">{relatedProduct.title}</p>
                      <ProductPrice
                        price={relatedProduct.priceRange?.minVariantPrice}
                      />
                    </div>
                  </div>
                ),
              )}
          </div>
        )}
      </div>
      <AtelierSection></AtelierSection>
    </div>
  );
}

const MATERIAL_QUERY = `#graphql
query($id: ID!) {
  metaobject(id: $id) {
    id
    type
    fields {
      key
      value
    }
  }
}
`;

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    collections(first: 1) {
      edges {
        node {
          id
        }
      }
    }
    images(first: 10) {
      nodes{
        url
        id
        altText
      }
    }
    description
    metafield(namespace: "shopify", key: "jewelry-material"){
        id
        value
        key
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;

const RELATED_PRODUCTS_QUERY = `#graphql
query productRecommendations($productId: ID!) {
    productRecommendations(productId: $productId, intent: RELATED) {
      id
      title
      handle
      priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
      images(first: 1) {
        edges {
          node {
            url
            altText
            id
            width
            height
          }
        }
      }
    }
  }
` as const;
