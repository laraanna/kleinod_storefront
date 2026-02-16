import { useState } from 'react'; // Add this
import { useLocation, Link as BaseLink, useRouteLoaderData } from '@remix-run/react';
import { LANGUAGES } from '~/lib/utils';
import type { RootLoader } from '~/root';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const {pathname, search} = useLocation();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const selectedLocale = rootData?.selectedLocale;

  return (
    <div className="language-selector" onMouseLeave={() => setIsOpen(false)}>
      <button 
        type="button" 
        className="lang-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Only show current language on the button */}
        {selectedLocale?.language || 'EN'} 
        <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▾</span>
      </button>

      {isOpen && (
        <ul className="lang-dropdown">
          {LANGUAGES
            // FILTER: Only show languages that ARE NOT the current one
            .filter((lang) => lang.language !== selectedLocale?.language)
            .map((lang) => {
              const allPrefixes = LANGUAGES.map((l) =>
                l.path.replace('/', ''),
              ).filter(Boolean);
              const segments = pathname.split('/').filter(Boolean);

              if (allPrefixes.includes(segments[0])) {
                segments.shift();
              }

              const cleanPath = segments.join('/');
              let newPath = lang.path;
              if (cleanPath) {
                newPath = `${newPath}/${cleanPath}`;
              }

              if (!newPath) newPath = '/';

              return (
                <li key={lang.label}>
                  <BaseLink
                    to={`${newPath}${search}`}
                    reloadDocument
                    onClick={() => setIsOpen(false)}
                  >
                    {lang.label}
                  </BaseLink>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}