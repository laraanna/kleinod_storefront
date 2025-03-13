import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import icon from '~/assets/logo-icon.svg';
import {Image} from '@shopify/hydrogen';
import useMediaQuery from '../helper/matchMedia';

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
  const trademark = <p className="trademark">Atelier Kleinod © 2025</p>;
  const isLargeScreen = useMediaQuery('(min-width: 45em)');

  if (!menu) return null;

  return (
    <nav className="footer-menu" role="navigation">
      <div className="footer-menu--wrapper">
        {menu.items.map((item, index) => {
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

                return (
                  <div key={subitem.id}>
                    {isSubitemExternal ? (
                      <a
                        href={subitemUrl}
                        key={subitem.id}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {subitem.title}
                      </a>
                    ) : (
                      <NavLink
                        end
                        key={subitem.id}
                        prefetch="intent"
                        to={subitemUrl}
                      >
                        {subitem.title}
                      </NavLink>
                    )}
                  </div>
                );
              })}
              {index === 0 && isLargeScreen && trademark}
            </div>
          );
        })}
        <div className="logo--wrapper">
          {!isLargeScreen && trademark}
          <Image src={icon} width="65px" height="65px" />
        </div>
      </div>
      {/* <p>Atelier Kleinod © 2025</p> */}
    </nav>
  );
}
