import {Image} from '@shopify/hydrogen';
import {type MetaFunction} from '@remix-run/react';
import {useEffect} from 'react';
import logoVisual from '~/assets/logo-invert-shadow.svg';

export const meta: MetaFunction = () => {
  return [{title: `Atelier Kleinod | About`}];
};

export default function About() {
  useEffect(() => {
    const handleImageLoad = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img) {
        img.classList.add('loaded');
      }
    };

    const timeoutId = setTimeout(() => {
      const aboutImageElements =
        document.querySelectorAll<HTMLImageElement>(
          '.about--banner-split-left img',
        );

      aboutImageElements.forEach((img) => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', handleImageLoad);
        }
      });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      const aboutImageElements =
        document.querySelectorAll<HTMLImageElement>(
          '.about--banner-split-left img',
        );
      aboutImageElements.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, []);

  return (
    <div className="about--container">
      <section className="about--banner-split">
        <div className="about--banner-split-left">
          <Image
            src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/landscape-texture.jpg?v=1766405282"
            aspectRatio="4/5"
            width={1080}
            height={1350}
          />
          <img
            src={logoVisual}
            // src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/atelier-kleinod-name.svg?v=1765127458"
            alt="Atelier Kleinod Logo"
            className="about--banner-split-logo"
          />
        </div>
        <div className="about--banner-split-right">
          <div>
            <h4>Our Story</h4>
            <p>
              Atelier Kleinod grew from a simple idea. Jewelry should feel personal. Something you keep close. Something that settles naturally into your life. From her workbench in Paris, Lara Anna Wagner shapes each piece with a quiet, intentional hand. Her practice is rooted in clarity. A form begins as a thought, then becomes a small object with presence and soul. 
            </p>
            <p>
              Kleinod works with noble materials and lets them speak for themselves. Each piece is made to feel familiar from the start and grow more intimate over time. There is no rush, no ornament, no noise. Just the slow rhythm of shaping metal into something that holds meaning. The atelier blends the sensitivity of traditional handwork with a contemporary eye. 
            </p>
            <p>
              The result is jewelry that feels calm and grounded. Pieces that accompany a life rather than perform for it. Objects that stay close, gather presence and become part of the person who wears them.
            </p>
          </div>
        </div>
        </section>
        <div className="about--content">
        {/* <div className="about--content-info">
          <h3>Noble Materials That Move with You</h3>
          <p>
            Blending traditional craftsmanship with a forward-thinking approach,
            each piece is carefully crafted to honor the beauty of the materials
            and the emotions they carry.
          </p>
        </div>
        <div className="about--content-blocks">
          <div className="about--content-block-left">
            <h4>Behind atelier kleinod</h4>
            <p>
              Atelier Kleinod is the creative vision of Lara-Anna Wagner, who
              designs and handcrafts each piece in Paris at her workbench. With
              a background in digital sciences and a career spent writing lines
              of code, her path to jewelry-making took an unconventional route.
              Just as coding is not confined to a single linear approach, she
              applies the same philosophy to her craft—where the idea and design
              come first, and the techniques and tools adapt to bring them to
              life.
            </p>
            <p>
              Each piece is a modern heirloom, thoughtfully designed to honor
              the beauty of noble materials and the emotions they hold. While
              the innovation and processes behind the work may remain unseen,
              they are intentionally chosen to uphold the highest quality,
              blending traditional craftsmanship with a forward-thinking
              approach.
            </p>
          </div>
          <div className="about--content-block-right custom">
            <p>
              for custom inquries, <br /> please contact us at <br />
              <a href="mailto:hello@kleinod-atelier.com">
                hello@kleinod-atelier.com
              </a>
            </p>
          </div>
        </div>
        <div className="about--content-blocks">
          <div className="about--content-block-left">
            <h4>MADE-TO-ORDER</h4>
            <p>
              All of our jewelry is made to order, meaning each piece is crafted
              specifically for the customer who purchases it. This process helps
              minimize waste and eliminates excess inventory since we only
              produce what is needed.
            </p>
            <p>
              By adopting a made-to-order approach, we can efficiently manage
              production and inventory, promoting a more sustainable and
              eco-friendly business model. This method prevents overproduction,
              reduces waste, and conserves valuable resources.
            </p>
            <p>
              Because every piece is made upon request, production and delivery
              require some lead time. Orders generally ship within 7 to 14
              business days, depending on the item and order volume. This
              ensures that each piece is carefully crafted and undergoes
              thorough quality checks before being shipped.
            </p>
          </div>
          <div className="about--content-block-right">
            <h4>RESPONSIBILITY MARK</h4>
            <p>
              Each piece at Atelier Kleinod is crafted from 925 silver and 18K
              gold—noble materials that undergo strict production and quality
              control. To guarantee authenticity, every piece is stamped with my
              goldsmith&apos;s mark, alongside the official hallmark of the
              precious metal from which it is made.
            </p>
            <div className="about--content-block-right-gurantee">
              <div>
                <Image
                  src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/poincon_argent.png?v=1741942975"
                  alt="Silver guarantee"
                />
                <p>
                  Silver <br />
                  925/1000
                </p>
              </div>
              <div>
                <Image
                  src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/poincon_or.png?v=1741942975"
                  alt="Gold guarantee"
                />
                <p>
                  Gold <br />
                  725/1000
                </p>
              </div>
              <div>
                <Image
                  src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/poincon_fabricant.png?v=1741942975"
                  alt="Fabricant guarantee"
                />
                <p>
                  Atelier <br />
                  Kleinod
                </p>
              </div>
            </div>
          </div>
        </div> */}
        </div>
        <div className="about--marquee">
          <div className="about--marquee-content">
            <span>noble materials that move with you</span>
            <span>noble materials that move with you</span>
            <span>noble materials that move with you</span>
            <span>noble materials that move with you</span>
            <span>noble materials that move with you</span>
          </div>
        </div>
      </div>
  );
}
