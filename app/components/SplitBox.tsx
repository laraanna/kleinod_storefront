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
        </div>
      </div>
    </section>
  );
}
