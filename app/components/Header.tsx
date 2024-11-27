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

interface MenuItem {
  id: string;
  url: string | undefined;
  resourceId: string | null;
  tags: string[];
  title: string;
  type: string;
  items: (Pick<
    MenuItem,
    'id' | 'url' | 'resourceId' | 'tags' | 'title' | 'type'
  > & {items: MenuItem[]})[];
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
  const [activeSubmenu, setActiveSubmenu] = useState<MenuItem | null>(null);

  return (
    <div className="header--wrapper">
      <header className={`header font-header ${activeSubmenu ? 'active' : ''}`}>
        {/* Link to home */}
        <NavLink prefetch="intent" to="/" end>
          <h1 className="header--logo">Kleinod</h1>
        </NavLink>
        {/* Menu */}
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
          setActiveSubmenu={setActiveSubmenu}
          activeSubmenu={activeSubmenu}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>
      {/* Submenu */}
      {activeSubmenu && (
        <div className="submenu--wrapper">
          <h1 className="header--logo invisible">Kleinod</h1>
          <Submenu
            subItems={activeSubmenu.items}
            onClose={() => setActiveSubmenu(null)}
          />
        </div>
      )}
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  setActiveSubmenu,
  activeSubmenu,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  setActiveSubmenu: React.Dispatch<React.SetStateAction<MenuItem | null>>;
  activeSubmenu: MenuItem | null;
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  // Handle submenu toggle
  if (!menu) return null;

  // Recursively render menu items
  const renderMenuItems = (items: typeof menu.items | undefined) => {
    if (!Array.isArray(items)) {
      console.error('Menu items is not an array:', items);
      return null;
    }

    return items.map((item, index) => {
      if (!item.url) return null;

      const hasSubmenu = item.items?.length > 0;
      const url =
        item.url.includes('myshopify.com') ||
        item.url.includes(publicStoreDomain) ||
        item.url.includes(primaryDomainUrl)
          ? new URL(item.url).pathname
          : item.url;

      return (
        <div
          key={item.id}
          className={`menu-item ${
            activeSubmenu?.id === item.id ? 'active' : ''
          }`}
        >
          <div className="menu-item--circle"></div>
          <NavLink
            className="header-menu-link"
            end
            onClick={(e) => {
              e.preventDefault(); // Prevent link navigation
              if (hasSubmenu) {
                setActiveSubmenu((current: MenuItem | null) =>
                  current?.id === item.id ? null : (item as MenuItem),
                );
              } else {
                close();
              }
            }}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        </div>
      );
    });
  };

  return (
    <nav
      className={`header-menu-${viewport} ${activeSubmenu ? 'active' : ''}`}
      role="navigation"
    >
      {viewport === 'mobile' && (
        <NavLink end onClick={close} prefetch="intent" to="/">
          Home
        </NavLink>
      )}
      {renderMenuItems(menu?.items || FALLBACK_HEADER_MENU.items)}
    </nav>
  );
}

export function Submenu({
  subItems,
  onClose,
}: {
  subItems: MenuItem[];
  onClose: () => void;
}) {
  return (
    <div className="submenu">
      {subItems.map((subItem) => (
        <div key={subItem.id} className="submenu-item">
          <NavLink
            className="header-menu-link"
            end
            prefetch="intent"
            to={subItem.url || '#'}
          >
            {subItem.title}
          </NavLink>
          {subItem.items && subItem.items.length > 0 && (
            <Submenu subItems={subItem.items} onClose={onClose} />
          )}
        </div>
      ))}
      <div className="submenu-item">
        <NavLink
          className="header-menu-link"
          end
          prefetch="intent"
          to="/collections/all"
        >
          View all
        </NavLink>
      </div>
    </div>
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
