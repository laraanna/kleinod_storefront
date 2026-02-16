import {Suspense, useState, useEffect} from 'react';
import {Await, useAsyncValue} from '@remix-run/react';
import {NavLink} from '~/components/Link';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {categories, materials} from '~/filterData';
import useMediaQuery from '../helper/matchMedia';
import {LanguageSelector} from './LanguageSelector';

type Viewport = 'desktop' | 'mobile';

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

// @TODO: Decide if we set up user profile, otherwise remove login args
export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  // State to track viewport size (desktop or mobile)
  const [viewport, setViewport] = useState<Viewport>('desktop');

  useEffect(() => {
    // Function to update viewport based on window size
    const updateViewport = () => {
      if (window.innerWidth <= 768) {
        setViewport('mobile');
      } else {
        setViewport('desktop');
      }
    };

    // Initialize the viewport state on mount
    updateViewport();

    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []); // Empty array ensures this effect runs once on mount
  const [activeSubmenu, setActiveSubmenu] = useState<MenuItem | null>(null);

  return (
    <div className="header--wrapper">
      <header className={`header font-header ${activeSubmenu ? 'active' : ''}`}>
        <HeaderMenuMobileToggle />
        {/* Link to home */}
        <NavLink prefetch="intent" to="/" reloadDocument end>
          <h1 className="header--logo">Kleinod</h1>
        </NavLink>
        {/* Menu */}
        <HeaderMenu
          menu={menu}
          viewport={viewport}
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
          setActiveSubmenu={setActiveSubmenu}
          activeSubmenu={activeSubmenu}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>

      {/* Submenu for desktop */}
      {activeSubmenu && viewport === 'desktop' && (
        <>
          {/* Submenu */}
          <div
            className="submenu--wrapper"
            onMouseEnter={() => {
              // Keep submenu open when hovering over it
            }}
            onMouseLeave={() => {
              setActiveSubmenu(null);
            }}
          >
            {/* to have the same distance as underlay */}
            <h1 className="header--logo invisible">Kleinod</h1>
            <Submenu
              subItems={activeSubmenu.items}
              onClose={() => setActiveSubmenu(null)}
            />
          </div>
          <div
            className="nav-overlay"
            role="button"
            tabIndex={0}
            onClick={() => {
              setActiveSubmenu(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveSubmenu(null);
              }
            }}
          ></div>
        </>
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
          onMouseEnter={() => {
            if (hasSubmenu && viewport === 'desktop') {
              setActiveSubmenu(item as MenuItem);
            }
          }}
          onMouseLeave={() => {
            // Only close if not hovering over submenu - handled by submenu wrapper
          }}
        >
          <div className="menu-item--circle"></div>
          <NavLink
            className="header-menu-link"
            end
            onMouseEnter={() => {
              if (hasSubmenu && viewport === 'desktop') {
                setActiveSubmenu(item as MenuItem);
              }
            }}
            onClick={(e) => {
              if (
                hasSubmenu &&
                viewport === 'desktop' &&
                item.title.toLowerCase() === 'jewelry'
              ) {
                e.preventDefault(); // Prevent link navigation
                setActiveSubmenu((current: MenuItem | null) =>
                  current?.id === item.id ? null : (item as MenuItem),
                );
              } else {
                setActiveSubmenu(null);
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

  const renderMobileMenuAndSubMenuItems = (
    items: typeof menu.items | undefined,
  ) => {
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
        <div key={item.id} className="menu-item">
          <NavLink
            className="header-menu-link"
            end
            onClick={(e) => {
              setActiveSubmenu(null);
              // e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              setActiveSubmenu(null);
            }}
            // prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>

          {/* Check if the title is "Shop" and render the categories */}
          {item.title === 'Shop' && categories?.length > 0 && (
            <div>
              {renderSubmenuItems(categories, 'category', close)}
              {renderSubmenuItems(materials, 'material', close)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <nav
      className={`header-menu-${viewport} ${activeSubmenu ? 'active' : ''}`}
      role="navigation"
    >
      {viewport === 'desktop' &&
        renderMenuItems(menu?.items || FALLBACK_HEADER_MENU.items)}
      {/* Conditionally render submenus for mobile */}
      {viewport === 'mobile' &&
        renderMobileMenuAndSubMenuItems(
          menu?.items || FALLBACK_HEADER_MENU.items,
        )}
    </nav>
  );
}

// Helper function to render submenu lists
const renderSubmenuItems = (
  items: Array<{id: string; name: string}>,
  type: string,
  onClose: () => void,
) => {
  return (
    <div className="submenu-list">
      <h3 className="submenu-list--title">{type}</h3>
      {items.map((item) => (
        <div key={item.id} className="submenu-item">
          <NavLink
            className="header-menu-link"
            end
            prefetch="intent"
            to={`/collections/all?${type}=${item.id}` || '#'}
            onClick={() => onClose()}
          >
            {item.name}
          </NavLink>
        </div>
      ))}
    </div>
  );
};

const renderMobileMenuSubMenuItems = (
  items: Array<{id: string; name: string}>,
  type: string,
  onClose: () => void,
) => {
  return (
    <div className="submenu-list">
      <h3 className="submenu-list--title">{type}</h3>
      {items.map((item) => (
        <div key={item.id} className="submenu-item">
          <NavLink
            className="header-menu-link"
            end
            prefetch="intent"
            to={`/collections/all?${type}=${item.id}` || '#'}
            onClick={() => onClose()}
          >
            {item.name}
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export function Submenu({
  subItems,
  onClose,
}: {
  subItems: MenuItem[];
  onClose: () => void;
}) {
  return (
    <div className="submenu">
      {/* Render categories */}
      {renderSubmenuItems(categories, 'category', onClose)}
      {/* Render materials */}
      {renderSubmenuItems(materials, 'material', onClose)}

      <div className="submenu-list">
        <NavLink
          className="header-menu-link"
          end
          prefetch="intent"
          to="/collections/all"
          onClick={() => onClose()}
        >
          Discover All Designs
        </NavLink>
      </div>
    </div>
  );
}

function HeaderCtas({
  // isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  const isDesktop = useMediaQuery('(min-width: 45em)');
  return (
    <nav className="header-ctas" role="navigation">
      <CartToggle cart={cart} />
      {isDesktop && <LanguageSelector />}
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
      ☰
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  const isLargeScreen = useMediaQuery('(min-width: 45em)');

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
      {isLargeScreen ? (
        <span>Cart ({count === null ? <span>&nbsp;</span> : count})</span>
      ) : (
        <span>({count === null ? <span>&nbsp;</span> : count})</span>
      )}
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
