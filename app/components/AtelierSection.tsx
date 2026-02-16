import {Await} from '@remix-run/react';
import {Link} from '~/components/Link';
import {Suspense, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import useMediaQuery from '../helper/matchMedia';
import {SplitBox} from './SplitBox';

export function AtelierSection() {
  return (
    <SplitBox
      title=""
      ImageSource="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/landscape-texture.jpg?v=1766405042"
      paragraph="Atelier Kleinod, a creative studio redefining jewelry and everyday objects through masterful craftsmanship. Merging tradition with innovation, the atelier revitalizes timeless artisanal techniques."
      cta="TECHNIQUES & MATERIALS"
      ctaLink="/about"
    ></SplitBox>
  );
}
