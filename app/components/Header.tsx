import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

// @TODO: Decide if we set up user profile, otherwise remove login args
export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;

  // State for active submenu
  // @TODO: Check if it is needed for NavLink otherwise move into Headermenu directly
  const [isActiveSubmenu, setIsActiveSubmenu] = useState<boolean>(false);

  return (
    <div className="header--wrapper">
      <header className="header">
        {/* Link to home */}
        <NavLink prefetch="intent" to="/" end>
          <h1 className="header--logo">Kleinod</h1>
        </NavLink>
        {/* Links from menu set in Shopify */}
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
          //Pass down the setter for the submenu handling
          setIsActiveSubmenu={setIsActiveSubmenu}
          isActiveSubmenu={isActiveSubmenu}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  setIsActiveSubmenu,
  isActiveSubmenu,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  setIsActiveSubmenu: React.Dispatch<React.SetStateAction<boolean>>;
  isActiveSubmenu: boolean;
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  // Handle submenu toggle
  const toggleSubmenu = (item: (typeof menu.items)[number]) => {
    setIsActiveSubmenu((prev) => !prev);
  };

  // Recursively render menu items
  const renderMenuItems = (items: typeof menu.items | undefined) => {
    if (!Array.isArray(items)) {
      console.error('Menu items is not an array:', items);
      return null;
    }

    return items.map((item,index) => {
      if (!item.url) return null;

      const url =
        item.url.includes('myshopify.com') ||
        item.url.includes(publicStoreDomain) ||
        item.url.includes(primaryDomainUrl)
          ? new URL(item.url).pathname
          : item.url;

      const hasSubmenu = Array.isArray(item.items) && item.items.length > 0;

      return (
        <div key={item.id} className="menu-item">
          <NavLink
            aria-expanded={isActiveSubmenu}
            className="header-menu-link"
            end
            onClick={() => {
              close();
              // @TODO: OR operator necessary or handling closing of non submenu items differenlty?
              if (isActiveSubmenu || hasSubmenu) toggleSubmenu(item);
            }}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>

          {hasSubmenu && isActiveSubmenu && (
            <div className={`submenu-${index}`}>{renderMenuItems(item.items)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {renderMenuItems(menu?.items || FALLBACK_HEADER_MENU.items)}
    </nav>
  );
}

function HeaderCtas({
  // isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Cart ({count === null ? <span>&nbsp;</span> : count})
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

// @TODO: Create prper fallback header menu matching Kleinod data
const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
  ],
};

// @TODO: Update activeLinkStyle or remove if done in css or inline
function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    // fontWeight: isActive ? 'bold' : undefined,
    // color: isPending ? 'grey' : 'black',
  };
}
