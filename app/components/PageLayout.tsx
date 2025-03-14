import {Await, Link} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import sizeChart from '~/assets/sizeChartData';
import ringSizeGuide from '~/assets/ringSizeGuide.pdf';

import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      {/* <SearchAside /> */}
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      <SizeGuideAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

// function SearchAside() {
//   return (
//     <Aside type="search" heading="SEARCH">
//       <div className="predictive-search">
//         <br />
//         <SearchFormPredictive>
//           {({fetchResults, goToSearch, inputRef}) => (
//             <>
//               <input
//                 name="q"
//                 onChange={fetchResults}
//                 onFocus={fetchResults}
//                 placeholder="Search"
//                 ref={inputRef}
//                 type="search"
//               />
//               &nbsp;
//               <button onClick={goToSearch}>Search</button>
//             </>
//           )}
//         </SearchFormPredictive>

//         <SearchResultsPredictive>
//           {({items, total, term, state, inputRef, closeSearch}) => {
//             const {articles, collections, pages, products, queries} = items;

//             if (state === 'loading' && term.current) {
//               return <div>Loading...</div>;
//             }

//             if (!total) {
//               return <SearchResultsPredictive.Empty term={term} />;
//             }

//             return (
//               <>
//                 <SearchResultsPredictive.Queries
//                   queries={queries}
//                   inputRef={inputRef}
//                 />
//                 <SearchResultsPredictive.Products
//                   products={products}
//                   closeSearch={closeSearch}
//                   term={term}
//                 />
//                 <SearchResultsPredictive.Collections
//                   collections={collections}
//                   closeSearch={closeSearch}
//                   term={term}
//                 />
//                 <SearchResultsPredictive.Pages
//                   pages={pages}
//                   closeSearch={closeSearch}
//                   term={term}
//                 />
//                 <SearchResultsPredictive.Articles
//                   articles={articles}
//                   closeSearch={closeSearch}
//                   term={term}
//                 />
//                 {term.current && total ? (
//                   <Link
//                     onClick={closeSearch}
//                     to={`${SEARCH_ENDPOINT}?q=${term.current}`}
//                   >
//                     <p>
//                       View all results for <q>{term.current}</q>
//                       &nbsp; →
//                     </p>
//                   </Link>
//                 ) : null}
//               </>
//             );
//           }}
//         </SearchResultsPredictive>
//       </div>
//     </Aside>
//   );
// }

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="Kleinod">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
          isActiveSubmenu={false}
          setIsActiveSubmenu={() => {}}
        />
      </Aside>
    )
  );
}

function SizeGuideAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="size-guide" heading="Size Guide">
        <div className="size-guide">
          <h3 className="uppercase">Method - Use a ring set</h3>
          <p>
            If you already have rings, but want to be sure of your size, you can
            use our ring gauge.
            <br />
            <br />
            To do so, print this document on an A4 sheet and place your ring on
            the hoop that best suits it. Ensure that the printed chart is to
            scale for the most accurate measurement.
            <br />
            <br />
            The circle that best fits your ring is your size!
          </p>
          <p>
            For the best fit, measure your ring size when your hands are at a
            normal temperature, as fingers can expand or shrink in extreme
            temperatures. If you’re between sizes, we recommend choosing the
            larger size for a more comfortable fit.
          </p>
          <br />
          <a
            href={ringSizeGuide}
            // download
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof window !== 'undefined' && 'gtag' in window) {
                (window as any).gtag('event', 'size_guide_download', {
                  event_category: 'Engagement',
                  event_label: 'Ring Gauge Download',
                  file_name: ringSizeGuide, // Capture the file URL
                });
              }
            }}
          >
            Download our ring gauge
          </a>
          <div className="size-chart">
            <div className="size-chart-row">
              {sizeChart[0]?.headers?.map((header: string) => (
                <span key={header}>{header}</span>
              ))}
            </div>
            {sizeChart[1]?.values?.map(
              (value: {eu: number; us: number; uk: string; circum: number}) => (
                <div className="size-chart-row" key={value.circum}>
                  <span>{value.eu}</span>
                  <span>{value.us}</span>
                  <span>{value.uk}</span>
                  <span>{value.circum}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </Aside>
    )
  );
}
