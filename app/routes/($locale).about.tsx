import {Image} from '@shopify/hydrogen';
import {PageBanner} from '~/components/PageBanner';

export default function About() {
  return (
    <div className="about--container">
      <PageBanner
        ImageSource="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/behind-the-scenes.jpg?v=1740778573"
        title="Atelier Kleinod"
      />
      <div className="about--content">
        <div className="about--content-info">
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
              <a href="mailto:hello@atelier-kleinod.com">
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
              goldsmith&apos;s mark, alongside the official hallmark of the precious
              metal from which it is made.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
