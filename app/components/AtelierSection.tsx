import {Await, Link} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import useMediaQuery from '../helper/matchMedia';
import {SplitBox} from './SplitBox';

export function AtelierSection() {
  return (
    <SplitBox
      ImageSource="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/atelier.jpg?v=1738335880&width=2160&height=2700&crop=center"
      title="Sculptural fine jewelry"
      paragraph="Seamlessly blending traditional artistry with innovative techniques to create timeless beauty."
      cta="Discover Atelier Kleinod"
      ctaLink="/about"
    ></SplitBox>
  );
}
