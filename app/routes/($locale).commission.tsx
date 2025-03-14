import {type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {AtelierSection} from 'app/components/AtelierSection';

export const meta: MetaFunction = () => {
  return [{title: `Atelier Kleinod | Commission`}];
};

export default function Commission() {
  return (
    <div className="commission--container">
      {/* First Block */}
      <div className="commission--block reverse lineTop">
        <div className="commission--block-split">
          <div className="">
            <div className="commission-text">
              <h4>Bespoke Pieces</h4>
              <p>
                At Atelier Kleinod, jewelry is more than an accessory—it’s a
                personal expression. Beyond our made-to-order collections, we
                offer a bespoke service for those who seek a truly unique piece,
                crafted to their vision. Whether it’s a special gift, a symbolic
                piece, or an heirloom designed to last generations, we are
                excited to craft your ideas to life.
              </p>
            </div>
          </div>
          <div className="split lineTop">
            <div className="commission--block-image lineRight">
              <Image
                src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_bowtie_2.jpg?v=1741961898"
                alt="Bowtie in Sterling Silver"
                aspectRatio="4/5"
                width={850}
                height={1063}
              />
            </div>
            <div className="commission--block-image">
              <Image
                src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_bowtie_3.jpg?v=1741961902"
                alt="Bowtie in Sterling Silver"
                aspectRatio="4/5"
                width={850}
                height={1063}
              />
            </div>
          </div>
        </div>
        <div className="commission--block-image lineRight">
          <Image
            src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_bowtie_1.jpg?v=1741961898"
            alt="Bowtie in Sterling Silver"
            aspectRatio="4/5"
            width={1500}
            height={2000}
          />
        </div>
      </div>
      {/* Second Block */}
      <div className="commission--block lineTop">
        <div className="commission--block-image lineRight">
          <Image
            src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_brooche_1.jpg?v=1741962385"
            alt="Brooche in Sterling Silver"
            aspectRatio="4/5"
            width={1500}
            height={2000}
          />
        </div>
        <div className="commission--block-image hide-mobile">
          <Image
            src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_brooche_2.jpg?v=1741962385"
            alt="Brooche in Sterling Silver"
            aspectRatio="4/5"
            width={1500}
            height={2000}
          />
        </div>
      </div>
      {/* Third Block */}
      <div className="commission--block lineTop">
        <div className="commission--block-split">
          <div className="lineRight">
            <div className="commission-text">
              <h4>Process</h4>
              <p>
                Each custom piece begins with a conversation, where we explore
                your inspirations, materials, and design preferences. From
                initial sketches to the final handcrafted piece, every step is
                guided by meticulous craftsmanship and attention to detail.
                Whether it’s reimagining an old treasure, incorporating
                meaningful elements, or designing from scratch, we ensure that
                your vision is realized with integrity and expertise.
              </p>
            </div>
          </div>
          <div className="split lineTop">
            <div className="commission--block-image lineRight">
              <Image
                src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_weddingBands_2.jpg?v=1741963246"
                alt="Wedding Bands in Sterling Silver and 18K gold"
                aspectRatio="4/5"
                width={850}
                height={1063}
              />
            </div>
            <div className="commission--block-image">
              <Image
                src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_weddingBands_3.jpg?v=1741963246"
                alt="Wedding Bands in Sterling Silver and 18K gold"
                aspectRatio="4/5"
                width={850}
                height={1063}
              />
            </div>
          </div>
        </div>
        <div className="commission--block-image lineLeft hide-mobile">
          <Image
            src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_weddingBands_1.jpg?v=1741963250"
            alt="Wedding Bands in Sterling Silver and 18K gold"
            aspectRatio="4/5"
            width={1500}
            height={2000}
          />
        </div>
      </div>
      {/* Fourth Block */}
      <div className="commission--block reverse lineTop lineBottom">
        <div className="commission--block-split">
          <div className="lineRight">
            <div className="commission-text">
              <h4>Contact</h4>
              <p>
                If you’re interested in a custom piece or have any questions,
                feel free to reach out at{' '}
                <a href="mailto:hello@kleinod-atelier.com">
                  hello@kleinod-atelier.com
                </a>
                —let’s create something special together.
              </p>
            </div>
          </div>
          <div className="doubleImage lineTop">
            <div>
              <Image
                src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_eardrops_2.jpg?v=1741963649"
                alt="Eardrops in Sterling Silver"
                aspectRatio="5/4"
                width={2125}
                height={1700}
              />
            </div>
          </div>
        </div>
        <div className="commission--block-image lineRight">
          <Image
            src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/bespoke_eardrops_1.jpg?v=1741963650"
            alt="Eardrops in Sterling Silver"
            aspectRatio="4/5"
            width={1500}
            height={2000}
          />
        </div>
      </div>
      <AtelierSection></AtelierSection>
      <div className="commission--block lineTop">
        <div className="commission--block-image lineRight">
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
      </div>
    </div>
  );
}
