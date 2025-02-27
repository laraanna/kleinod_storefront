import {Await, Link} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import useMediaQuery from '../helper/matchMedia';

export function AtelierSection() {
  const isLargeScreen = useMediaQuery('(min-width: 45em)');
  return (
    <section className="atelier-section--grid">
      <div className="atelier-section--grid-left">
        <Image
          src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/atelier.jpg?v=1738335880"
          width={1080}
          height={1350}
        />
        {!isLargeScreen && (
          <div className="cta-headers">
            <span className="uppercase text-sm">discover</span>
            <p className="cta uppercase text-2xl">
              <span>
                Techniques and Materials
                <br />
              </span>
            </p>
          </div>
        )}
      </div>
      <div className="atelier-section--grid-right">
        <div className="atelier-section--grid-right-content">
          {isLargeScreen && (
            <p className="description">
              Atelier Kleinod crafts timeless jewelry with an artistic vision.
              With a meticulous focus on materials and craftsmanship, our
              atelier seamlessly merges tradition and innovation to create
              pieces of enduring beauty.{' '}
            </p>
          )}
          <Link to={`/about`}>Our Technics & Materials</Link>
          {/* <a href="" className="underline">Technics & Materials</a> */}
          <Image
            src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/logo-atelier-font.svg?v=1738339268"
            width={300}
            height={150}
          />
        </div>
      </div>
    </section>
  );
}
