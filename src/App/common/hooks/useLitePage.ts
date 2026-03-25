import { matchPath, useLocation } from 'react-router';

export const useLitePage = () => {
  const { pathname: currentLocation } = useLocation();

  return { isLitePage: Boolean(matchPath(currentLocation, { path: '/lite' })) };
};
