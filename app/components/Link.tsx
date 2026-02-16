import {
  Link as RemixLink,
  NavLink as RemixNavLink,
  useMatches,
} from '@remix-run/react';
import type {Locale} from '~/lib/utils';

type RootMatchData = {selectedLocale?: Locale};

/**
/**
 * Custom Link component that automatically prepends the locale
 */
export function Link(props: any) {
  const {to, className, ...resOfProps} = props;
  const localizedPath = usePrefixPathWithLocale(to);

  return <RemixLink to={localizedPath} className={className} {...resOfProps} />;
}

/**
/**
 * Custom NavLink component that automatically prepends the locale
 */
export function NavLink(props: any) {
  const {to, className, ...resOfProps} = props;
  const localizedPath = usePrefixPathWithLocale(to);

  return (
    <RemixNavLink to={localizedPath} className={className} {...resOfProps} />
  );
}

/**
 * Hook/Helper to handle the logic of prefixing paths
 */
export function usePrefixPathWithLocale(to: any) {
  const matches = useMatches();
  const rootMatch = matches.find((match) => match.id === 'root');
  const selectedLocale = (rootMatch?.data as RootMatchData)?.selectedLocale;

  if (typeof to !== 'string' || !to.startsWith('/') || to.startsWith('http')) {
    return to;
  }

  const prefix = selectedLocale?.pathPrefix || ''; 
  if (!prefix) return to;

  // FIX: Check if 'to' is exactly the prefix OR starts with prefix + '/'
  // This prevents accidentally matching words like "/fresh" when the prefix is "/fr"
  if (to === prefix || to.startsWith(`${prefix}/`)) {
    return to;
  }

  const cleanTo = to === '/' ? '' : to;
  return `${prefix}${cleanTo}`;
}
