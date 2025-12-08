import {Await, Link} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import useMediaQuery from '../helper/matchMedia';
import {SplitBox} from './SplitBox';

export function AtelierSection() {
  return (
    <SplitBox
      ImageSource="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/section_atelier_structure.jpg?v=1765126045"
      title=""
      paragraph="Atelier Kleinod, a creative studio redefining jewelry and everyday objects through masterful craftsmanship. Merging tradition with innovation, the atelier revitalizes timeless artisanal techniques."
      cta="TECHNIQUES & MATERIALS"
      ctaLink="/about"
    ></SplitBox>
  );
}
