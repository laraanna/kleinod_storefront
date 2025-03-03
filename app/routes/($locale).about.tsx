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
          <h3>Sculptural fine jewelry</h3>
          <p>
            Seamlessly blending traditional artistry with innovative techniques
            to create timeless beauty.
          </p>
        </div>
        <div className="about--content-blocks">
          <div className="about--content-block-left">
            <p>
              Ateliers Kleinod jewelry and objects are designed and handmade in
              our atelier in Paris, France, by artist Lara-Anna Wagner.
            </p>
            <p>
              All of our pieces are crafted in 18k yellow gold and solid
              sterling silver to ensure the highest quality, thanks to their
              purity in alloy. On demand, we can offer variations in materials.
            </p>

            <p>
              Founded in 2024, the atelier embraces timeless and intrinsic
              design, creating pieces that transcend traditional collections.
              Each work is the result of an ongoing exploration of techniques in
              design and casting. Guided by challenges, the atelier welcomes
              unique requests, crafting bespoke pieces that capture special
              moments.
            </p>
          </div>
          <div className="about--content-block-right">
            <p>
              for custom inquries, <br /> please contact us at <br />
              <a href="mailto:hello@atelier-kleinod.com">
                hello@kleinod-atelier.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
