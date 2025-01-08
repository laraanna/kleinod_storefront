import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import icon from '~/assets/logo-icon.svg';
import {Image} from '@shopify/hydrogen';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div
              className="elfsight-app-877e0166-f90c-432f-95ae-8b8040844e0e"
              data-elfsight-app-lazy
            ></div>
            {footer?.menu && header.shop.primaryDomain?.url && (
              <FooterMenu
                menu={footer.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            )}
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {menu.items.map((item) => {
        // Skip if no subitems
        if (!item.items || item.items.length === 0) return null;

        return (
          <div key={item.id} className="subitems-wrapper">
            {item.items.map((subitem) => {
              if (!subitem.url) return null;

              // Strip domain if the URL is internal
              const subitemUrl =
                subitem.url.includes('myshopify.com') ||
                subitem.url.includes(publicStoreDomain) ||
                subitem.url.includes(primaryDomainUrl)
                  ? new URL(subitem.url).pathname
                  : subitem.url;

              const isSubitemExternal = !subitemUrl.startsWith('/');

              return isSubitemExternal ? (
                <a
                  href={subitemUrl}
                  key={subitem.id}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {subitem.title}
                </a>
              ) : (
                <NavLink end key={subitem.id} prefetch="intent" to={subitemUrl}>
                  {subitem.title}
                </NavLink>
              );
            })}
          </div>
        );
      })}
      <div className="logo--wrapper">
        <Image src={icon} sizes="65px 65px" />
      </div>
    </nav>
  );
}
