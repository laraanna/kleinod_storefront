import {Await, Link} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';

export function AtelierSection() {
  return (
    <section className="atelier-section--wrapper">
      <div className="atelier-section-image--container">
      </div>
      <div className="atelier-overlay--wrapper">
        <Image src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/atelier-kleinod-title.svg?v=1736338618"  />
      </div>
    </section>
  );
}
