import {Await, Link} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import useMediaQuery from '../helper/matchMedia';

export function SplitBox({
  ImageSource,
  title,
  paragraph,
  cta,
  ctaLink,
}: {
  ImageSource: string;
  title: string;
  paragraph: string;
  cta?: string;
  ctaLink?: string;
}) {
  const isLargeScreen = useMediaQuery('(min-width: 45em)');
  return (
    <section className="splitBox--grid">
      <div className="splitBox--grid-left">
        <Image src={ImageSource} width={1080} height={1350} />
      </div>
      <div className="splitBox--grid-right">
        <div className="splitBox--grid-right-content">
          <div className="tagline">
            <h3> {title}</h3>
            <p>{paragraph}</p>
          </div>
          {cta && ctaLink && (
            <Link to={ctaLink}>
              <span className="uppercase">{cta}</span>
            </Link>
          )}
          <div className="atelier-name">
            <Image
              src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/atelier-kleinod-name.svg?v=1765127458"
              alt="Atelier Kleinod"
              className="atelier-logo"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
