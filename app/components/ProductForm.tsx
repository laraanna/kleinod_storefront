import {Link} from '@remix-run/react';
import {type VariantOption, VariantSelector} from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {ProductPrice} from '~/components/ProductPrice';
import {useState} from 'react';
import {customEngraveID} from '~/specialProductFeatures';
import {ProductCustomization} from './ProductCustomization';

export function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const {open} = useAside();
  const [wantsCustom, setWantsCustom] = useState(false);
  const [customDescription, setCustomDescription] = useState('');

  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options.filter((option) => option.values.length > 1)}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>

      {/* <ProductCustomization
        wantsCustom={wantsCustom}
        setWantsCustom={setWantsCustom}
        customDescription={customDescription}
        setCustomDescription={setCustomDescription}
        productId={product.id}
        customEngraveID={`gid://shopify/Product/${customEngraveID}`}
      /> */}

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          if (typeof window !== 'undefined' && 'gtag' in window) {
            (window as any).gtag('event', 'add_to_cart', {
              currency: 'EUR',
              value: selectedVariant?.price?.amount || 0,
              items: [
                {
                  id: selectedVariant?.id,
                  name: selectedVariant?.product?.title || 'Unknown Product',
                  quantity: 1,
                  price: selectedVariant?.price?.amount || 0,
                },
              ],
            });
          }

          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  attributes:
                    wantsCustom && customDescription
                      ? [{key: 'Custom Description', value: customDescription}]
                      : [],
                },
              ]
            : []
        }
      >
        <div className="btn-add-to-cart">
          <div>
            {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
          </div>
          {parseFloat(selectedVariant?.price?.amount ?? '0') === 0 ? (
            <div className="product-price">Inquiry</div>
          ) : (
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          )}
        </div>
        {product.productType?.toLowerCase() !== 'wedding' && (
          <div className="product--description-info">
            <p>
              We handcraft every piece upon order with a production time of 2-3
              weeks.
            </p>
          </div>
        )}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  const {open} = useAside();
  return (
    <div className="product-options" key={option.name}>
      <h5 className="uppercase">{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                borderRadius:
                  option.name.toLowerCase() == 'ring size' ? '50%' : '5px',
                padding: '3px 6px',
                border: isActive ? '1px solid white' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      {/* Show size guide if option name is "Size" */}
      {option.name === 'Ring size' && (
        <button
          onClick={() => open('size-guide')}
          className="btn-size-guide"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              open('size-guide');
            }
          }}
        >
          <h5 className="uppercase">+ Size Guide</h5>
        </button>
      )}
      <br />
    </div>
  );
}
