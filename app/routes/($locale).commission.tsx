// import {Link, type MetaFunction} from '@remix-run/react';
import {Link} from '~/components/Link';
import {type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

export const meta: MetaFunction = () => {
  return [{title: `Atelier Kleinod | Commission`}];
};

export default function Commission() {
  const {t} = useTranslation();

  useEffect(() => {
    const handleImageLoad = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img) {
        img.classList.add('loaded');
      }
    };

    const timeoutId = setTimeout(() => {
      const commissionImageElements =
        document.querySelectorAll<HTMLImageElement>(
          '.commission--block-image img, .commission--container img',
        );

      commissionImageElements.forEach((img) => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', handleImageLoad);
        }
      });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      const commissionImageElements =
        document.querySelectorAll<HTMLImageElement>(
          '.commission--block-image img, .commission--container img',
        );
      commissionImageElements.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, []);

  return (
    <div className="commission--container">
      {/* First Block */}
      <div className="commission--block reverse lineTopDesktop">
        <div className="commission--block-split">
          <div className="">
            <div className="commission-text lineLeftDesktop">
              <h4>{t('commission.title-1')}</h4>
              <p>{t('commission.description-1')}</p>
            </div>
          </div>
          <div className="split lineTop">
            <div className="commission--block-image lineLeftDesktop lineRight lineBottom">
              <Link to="/products/monolight-case">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/lighter-custom-1.jpg?v=1766408579"
                  alt="Bowtie in Sterling Silver"
                  aspectRatio="4/5"
                  width={850}
                  height={1063}
                />
              </Link>
            </div>
            <div className="commission--block-image lineBottom">
              <Link to="/products/monolight-case">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/lighter-custom-2.jpg?v=1766410656"
                  alt="Bowtie in Sterling Silver"
                  aspectRatio="4/5"
                  width={850}
                  height={1063}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="commission--block-image lineBottom">
          <Link to="/products/echo-tie-bar">
            <Image
              src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/echo_tie_bar_product_detail_1.jpg?v=1769720658"
              alt="Bowtie in Sterling Silver"
              aspectRatio="4/5"
              width={1500}
              height={2000}
            />
          </Link>
        </div>
      </div>

      {/* Second Block */}
      <div className="commission--block lineTop">
        <div className="commission--block-split">
          <div className="lineRightDesktop">
            <div className="commission-text">
              <h4>{t('commission.title-2')}</h4>
              <p>{t('commission.description-2')}</p>
            </div>
          </div>
          <div className="split lineTop">
            <div className="commission--block-image lineRight">
              <Link to="/products/bespoke-wedding-bands">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_weddingBands_2.jpg?v=1741963246"
                  alt="Wedding Bands in Sterling Silver and 18K gold"
                  aspectRatio="4/5"
                  width={850}
                  height={1063}
                />
              </Link>
            </div>
            <div className="commission--block-image">
              <Link to="/products/bespoke-wedding-bands">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_weddingBands_3.jpg?v=1741963246"
                  alt="Wedding Bands in Sterling Silver and 18K gold"
                  aspectRatio="4/5"
                  width={850}
                  height={1063}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="commission--block-image lineLeft hide-mobile">
          <Link to="/products/bespoke-wedding-bands">
            <Image
              src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_weddingBands_1.jpg?v=1741963250"
              alt="Wedding Bands in Sterling Silver and 18K gold"
              aspectRatio="4/5"
              width={1500}
              height={2000}
            />
          </Link>
        </div>
      </div>

      {/* Third Block */}
      <div className="commission--block reverse lineTop">
        <div className="commission--block-split">
          <div className="lineRightDesktop">
            <div className="commission-text">
              <h4>{t('commission.title-3')}</h4>
              <p>
                {t('commission.description-3a')}{' '}
                <a href="mailto:hello@kleinod-atelier.com">
                  hello@kleinod-atelier.com
                </a>{' '}
                {t('commission.description-3b')}
              </p>
            </div>
          </div>
          <div className="doubleImage lineTop lineBottom">
            <div>
              <Link to="/products/bespoke-engagement-ring">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_engagement_1.jpg?v=1769684883"
                  alt="Eardrops in Sterling Silver"
                  aspectRatio="5/4"
                  width={2125}
                  height={1700}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="commission--block-image lineRightDesktop lineBottom">
          <Link to="/products/bespoke-engagement-ring">
            <Image
              src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_engagement_2.jpg?v=1769684886"
              alt="Eardrops in Sterling Silver"
              aspectRatio="4/5"
              width={1500}
              height={2000}
            />
          </Link>
        </div>
      </div>
      {/* <AtelierSection></AtelierSection> */}
      {/* Fourth Block */}
      <div className="commission--block">
        <div className="commission--block-image lineRightDesktop">
          <Link to="/products/bespoke-engagement-ring">
            <Image
              src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_engagement_3.jpg?v=1769684888"
              alt="Brooche in Sterling Silver"
              aspectRatio="4/5"
              width={1500}
              height={2000}
            />
          </Link>
        </div>
        <div className="commission--block-image hide-mobile">
          <Link to="/products/bespoke-engagement-ring">
            <Image
              src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/IMG_1057.jpg?v=1769721760"
              alt="Brooche in Sterling Silver"
              aspectRatio="4/5"
              width={1500}
              height={2000}
            />
          </Link>
        </div>
      </div>
      {/* <div className="commission--block lineTop lineBottom">
        <div className="commission--block-image lineRightDesktop">
          <Image
            src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_epingle_1.jpg?v=1741964904"
            alt="Hair pin in Sterling Silver"
            aspectRatio="4/5"
            width={1500}
            height={2000}
          />
        </div>
        <div className="commission--block-image hide-mobile">
          <Image
            src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_epingle_2.jpg?v=1741964904"
            alt="Hair pin in Sterling Silver"
            aspectRatio="4/5"
            width={1500}
            height={2000}
          />
        </div>
      </div> */}
    </div>
  );
}
