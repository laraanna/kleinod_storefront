import {Await, Link} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import useMediaQuery from '../helper/matchMedia';
import {SplitBox} from './SplitBox';

export function AtelierSection() {
  return (
    <SplitBox
      ImageSource="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/atelier.jpg?v=1738335880&width=2160&height=2700&crop=center"
      title="Noble Materials That Move with You"
      paragraph="Blending traditional craftsmanship with a forward-thinking approach,
            each piece is carefully crafted to honor the beauty of the materials
            and the emotions they carry."
      ctaLink="/about"
    ></SplitBox>
  );
}
