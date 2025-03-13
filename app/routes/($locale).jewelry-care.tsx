import {PageBanner} from '~/components/PageBanner';
import {SplitBox} from '~/components/SplitBox';

export default function JewelryCare() {
  return (
    <div className="jewelry-care--container">
      <PageBanner
        ImageSource="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/banner-jewelry-cleaning.jpg?v=1740993960"
        title="Jewelry Care"
      />
      <SplitBox
        ImageSource="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/material-silver.jpg?v=1740995305"
        title="Sterling Silver"
        paragraph="Sterling Silver is known for its durability and timeless allure. While sturdy enough for everyday wear, it still deserves a touch of care. To keep your sterling silver radiant, gently polish it with a soft cloth to remove any tarnish that may develop over time. For a deeper clean, use warm water, a mild natural soap, and a soft toothbrush to restore its brilliance."
      ></SplitBox>
      <SplitBox
        ImageSource="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/material-gold.jpg?v=1740995670"
        title="18k Gold"
        paragraph="Ah, 18K gold—classic, elegant, and incredibly durable. This precious metal is built to withstand daily wear, yet regular care is essential to preserve its shine. To maintain its luster, gently clean your 18K gold jewelry with warm, soapy water and a soft brush. Avoid harsh chemicals and abrasive materials, and your gold will continue to sparkle for years to come."
      ></SplitBox>
      <div className="jewelry-care--container--services">
        <h4>
          Paris-based? Reach out to us at{' '}
          <a href="mailto:hello@atelier-kleinod.com">
            hello@kleinod-atelier.com
          </a>{' '}
          for occasional cleaning and polishing services to maintain brilliance
          over time.
        </h4>
      </div>
    </div>
  );
}
