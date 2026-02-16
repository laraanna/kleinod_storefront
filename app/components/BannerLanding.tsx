import {Await} from '@remix-run/react';
import {Link} from '~/components/Link';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import useMediaQuery from '../helper/matchMedia';
import ImageSwiper from './ImageSwiper';
import {banner} from '~/bannerData';

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
  const isLargeScreen = useMediaQuery('(min-width: 45em)');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add fade-in effect to images after they load
  useEffect(() => {
    if (!isClient) return;

    const handleImageLoad = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img) {
        img.classList.add('loaded');
      }
    };

    const setupImageFadeIn = () => {
      const bannerImageElements = document.querySelectorAll<HTMLImageElement>(
        '.banner-landing--products img, .banner-landing--wrapper .swiper-slide img',
      );

      bannerImageElements.forEach((img) => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', handleImageLoad);
        }
      });
    };

    // Initial setup
    const timeoutId = setTimeout(setupImageFadeIn, 50);

    // Also set up when products load (using MutationObserver to watch for new images)
    const observer = new MutationObserver(() => {
      setupImageFadeIn();
    });

    if (productRef.current) {
      observer.observe(productRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      const bannerImageElements = document.querySelectorAll<HTMLImageElement>(
        '.banner-landing--products img, .banner-landing--wrapper .swiper-slide img',
      );
      bannerImageElements.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !isLargeScreen) return;

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
  }, [isClient, isLargeScreen]);

  return (
    <div ref={scrollContainerRef} className="banner-landing--wrapper">
      <div ref={pinRef} className="banner-landing--image">
        <ImageSwiper images={banner} type="BANNER" />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div ref={productRef} className="banner-landing--products">
              {response
                ? response.collection?.products.nodes.map((product, index) => {
                    const isAboveFold = index < 3;
                    return (
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
                              width={1500}
                              height={2000}
                              loading={isAboveFold ? 'eager' : 'lazy'}
                              fetchPriority={isAboveFold ? 'high' : 'low'}
                            />

                            <div className="cta-headers">
                              <span className="uppercase text-sm">
                                discover
                              </span>
                              <p className="cta uppercase text-2xl">
                                {product.title.split(' ').map((word) => (
                                  <span key={product.id + '-' + word}>
                                    {word}
                                    <br />
                                  </span>
                                ))}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
