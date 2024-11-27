import {Await, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

export function BannerLanding({
  image,
  products,
}: {
  image: string;
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="banner-landing--wrapper flex">
      <div className="banner-landing--image w-6/12 h-screen overflow-hidden">
        <img className="w-full h-full object-cover" src={image} alt="Banner" />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="banner-landing--products w-6/12 h-screen overflow-y-auto">
              {response
                ? response.collection?.products.nodes.map((product) => (
                    <div key={product.id} className="product-item">
                      <Link
                        key={product.id}
                        className="recommended-product"
                        to={`/products/${product.handle}`}
                      >
                        <div className="relative w-full">
                          <Image
                            data={product.images.nodes[0]}
                            className="w-full h-auto"
                            aspectRatio="4/5"
                            // sizes="(min-width: 100%) 20vw, 80vh"
                          />
                          <div className="absolute bottom-0 left-0 bg-white bg-opacity-75 p-2">
                            <span className="uppercase">discover</span>
                            <p>{product.title}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
