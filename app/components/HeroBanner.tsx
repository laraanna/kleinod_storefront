import {Image} from '@shopify/hydrogen';
import {useEffect} from 'react';
import logoVisual from '~/assets/logo-visual-icon.svg';

interface HeroBannerProps {
  imageSource: string;
  text: string;
  alt?: string;
}

export function HeroBanner({imageSource, text, alt}: HeroBannerProps) {
  useEffect(() => {
    const handleImageLoad = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img) {
        img.classList.add('loaded');
      }
    };

    const timeoutId = setTimeout(() => {
      const heroImageElements =
        document.querySelectorAll<HTMLImageElement>('.hero-banner img');

      heroImageElements.forEach((img) => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', handleImageLoad);
        }
      });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      const heroImageElements =
        document.querySelectorAll<HTMLImageElement>('.hero-banner img');
      heroImageElements.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, [imageSource]);

  return (
    <div className="hero-banner">
      <Image
        src={imageSource}
        alt={alt || text}
        sizes="100vw"
        loading="lazy"
        fetchPriority="low"
        aspectRatio="4/5"
      />
      <div className="hero-banner--text">
        <h3>
          {text.split(' heirlooms ').map((part, index, array) => {
            const isLast = index === array.length - 1;
            return (
              <span key={`hero-text-${part}`}>
                {part}
                {!isLast && (
                  <>
                    {' heirlooms '}
                    <br />
                  </>
                )}
              </span>
            );
          })}
        </h3>
        <img
          src={logoVisual}
          alt="Atelier Kleinod Logo"
          className="hero-banner--logo"
        />
      </div>
    </div>
  );
}
