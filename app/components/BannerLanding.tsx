import {Await, Link} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

export function BannerLanding({
  image,
  products,
}: {
  image: string;
  products: Promise<RecommendedProductsQuery | null>;
}) {
  const [isClient, setIsClient] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    // Ensure client-only execution
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const loadScrollMagic = async () => {
      try {
        const ScrollMagic = await import('scrollmagic');
        const controller = new ScrollMagic.Controller();
        controllerRef.current = controller;

        const updateScene = () => {
          if (sceneRef.current) {
            sceneRef.current.destroy(true); // Destroy the existing scene
          }

          const lastProduct =
            productRef.current?.children[
              productRef.current?.children.length - 1
            ];

          if (lastProduct) {
            const lastProductBottom =
              lastProduct.getBoundingClientRect().bottom;
            const scrollContainerTop =
              scrollContainerRef.current?.getBoundingClientRect().top ?? 0;
            const containerHeight =
              scrollContainerRef.current?.clientHeight ?? 0;

            const distanceToBottom = lastProductBottom - scrollContainerTop;
            const duration = Math.max(distanceToBottom - containerHeight, 0);

            sceneRef.current = new ScrollMagic.Scene({
              triggerElement: pinRef.current as HTMLElement,
              triggerHook: 0,
              duration,
            })
              .setPin(pinRef.current as HTMLElement)
              .addTo(controller);
          }
        };

        updateScene();

        const resizeObserver = new ResizeObserver(() => {
          updateScene(); // Re-run the scene update when resizing
        });

        if (scrollContainerRef.current) {
          resizeObserver.observe(scrollContainerRef.current);
        }

        return () => {
          if (sceneRef.current) {
            sceneRef.current.destroy(true);
          }
          if (controller) {
            controller.destroy(true);
          }
          resizeObserver.disconnect();
        };
      } catch (error) {
        console.error('ScrollMagic failed to load:', error);
      }
    };

    loadScrollMagic();
  }, [isClient]);

  return (
    <div ref={scrollContainerRef} className="banner-landing--wrapper flex">
      <div
        ref={pinRef}
        className="banner-landing--image w-[50vw] min-w-[50vw] h-screen overflow-hidden"
      >
        <img className="w-full h-full object-cover" src={image} alt="Banner" />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div
              ref={productRef}
              className="banner-landing--products w-6/12 h-screen"
            >
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
                          />

                          <div className="product-headers">
                            <span className="uppercase text-sm">discover</span>
                            <p className="uppercase text-2xl">
                              {product.title.split(' ').map((word, index) => (
                                <span key={index}>
                                  {word}
                                  <br />
                                </span>
                              ))}
                            </p>
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
