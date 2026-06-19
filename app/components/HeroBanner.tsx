import {Image} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react'; // useRef hinzugefügt
import logoVisual from '~/assets/logo-visual-icon.svg';
import {useTranslation} from 'react-i18next';

interface HeroBannerProps {
  imageSource: string;
  alt?: string;
}

export function HeroBanner({imageSource, alt}: HeroBannerProps) {
  const {t} = useTranslation();
  const imageRef = useRef<HTMLImageElement>(null); // Ref für das Hauptbild

  const fullText = t('hero.title');
  const splitWord = t('hero.splitWord');

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    // Funktion zum Aktivieren der Sichtbarkeit
    const setLoaded = () => {
      img.classList.add('loaded');
    };

    // WICHTIG: Wenn das Bild bereits im Cache war und fertig ist
    if (img.complete) {
      setLoaded();
    } else {
      // Ansonsten auf das Event warten
      img.addEventListener('load', setLoaded);
    }

    return () => {
      img.removeEventListener('load', setLoaded);
    };
  }, [imageSource]); // Wichtig: Wenn sich die Source ändert, neu triggern

  return (
    <div className="hero-banner">
      <Image
        ref={imageRef} // Hier verknüpfen wir die Ref
        src={imageSource}
        alt={alt || fullText}
        sizes="100vw"
        loading="lazy"
        className="hero-image" // Optionale Klasse für Styling
        aspectRatio="4/5"
      />

      <div className="hero-banner--text">
        <h3>
          {fullText.split(splitWord).map((part, index, array) => {
            const isLast = index === array.length - 1;
            return (
              <span key={`hero-text-${index}`}>
                {part}
                {!isLast && (
                  <>
                    {splitWord}
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
