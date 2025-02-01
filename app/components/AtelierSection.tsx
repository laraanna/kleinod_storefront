import {Await, Link} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';

export function AtelierSection() {
  return (
    <section className="atelier-section--grid">
      <div className="atelier-section--grid-left">
        <Image
          src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/atelier.jpg?v=1738335880"
          width={1080}
          height={1350}
        />
      </div>
      <div className="atelier-section--grid-right">
        <div className="atelier-section--grid-right-content">
          <p className="description">
            Atelier Kleinod, a creative studio redefining jewelry and everyday
            objects through masterful craftsmanship. Merging tradition with
            innovation, the atelier revitalizes timeless artisanal techniques.
          </p>
          <Link to={`/about`}>Technics & Materials</Link>
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
