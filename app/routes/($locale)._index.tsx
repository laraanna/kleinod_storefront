import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {BannerLanding} from 'app/components/BannerLanding';
import {AtelierSection} from 'app/components/AtelierSection';
import {HeroBanner} from 'app/components/HeroBanner';
export const meta: MetaFunction = () => {
  return [{title: 'Atelier Kleinod | Jewelry and Unique Artifacts'}];
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
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home--wrapper">
      <BannerLanding
        image="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/banner-saturn-signet.jpg?v=1736329216"
        products={data.recommendedProducts}
      ></BannerLanding>
      <HeroBanner
        imageSource="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/product_detail_dreiklang_3.jpg?v=1764840474"
        text="Modern heirlooms for everyday wear"
      />

      <CustomSection />
      <AtelierSection />

      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
    </div>
  );
}

function CustomSection() {
  return (
    <section className="custom-section">
      <h2 className="custom-section__heading">Custom Objects</h2>
      <div className="custom-section__grid">
        <div className="custom-section__image-wrapper">
          <Link to="/products/monolight-case">
            <Image
              src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/lighter-custom-1.jpg?v=1766408579"
              alt="Lighter Case"
              aspectRatio="1/1"
              sizes="(min-width: 45em) 50vw, 100vw"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="custom-section__image-wrapper">
          <Link to="/products/echo-tie-bar">
            <Image
              src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/echo_tie_bar_product_detail_1.jpg?v=1769720658"
              alt="Echo Tie Bar"
              aspectRatio="1/1"
              sizes="(min-width: 45em) 50vw, 100vw"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image
            data={image}
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

// function RecommendedProducts({
//   products,
// }: {
//   products: Promise<RecommendedProductsQuery | null>;
// }) {
//   return (
//     <div className="recommended-products">
//       <h2>Recommended Products</h2>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Await resolve={products}>
//           {(response) => (
//             <div className="recommended-products-grid">
//               {response && response.collection
//                 ? response.collection.products.nodes.map((product) => (
//                     <Link
//                       key={product.id}
//                       className="recommended-product"
//                       to={`/products/${product.handle}`}
//                     >
//                       <Image
//                         data={product.images.nodes[0]}
//                         aspectRatio="1/1"
//                         sizes="(min-width: 45em) 20vw, 50vw"
//                       />
//                       <h4>{product.title}</h4>
//                       <small>
//                         <Money data={product.priceRange.minVariantPrice} />
//                       </small>
//                     </Link>
//                   ))
//                 : null}
//             </div>
//           )}
//         </Await>
//       </Suspense>
//       <br />
//     </div>
//   );
// }

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
fragment RecommendedProduct on Product {
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
    nodes {
      id
      url
      altText
      width
      height
    }
  }
}

query RecommendedProducts($country: CountryCode, $language: LanguageCode) 
@inContext(country: $country, language: $language) {
  collection(handle: "banner") {
    products(first: 4, reverse: false) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
}
` as const;
