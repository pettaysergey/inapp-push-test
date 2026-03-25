import { useEffect, useState } from 'react';

import { getHcmsUrl } from '../helpers';

const PREFIX_URL = `${getHcmsUrl()}/projects/notification/files/`;

export const useIcon = (path?: string) => {
  const [icon, setIcon] = useState('');

  useEffect(() => {
    if (path) {
      // ссылка вида projects/pfm/files
      const isFullPath = path.includes('/');

      if (isFullPath) {
        setIcon(`${getHcmsUrl()}/${path}.png`);
      } else {
        setIcon(`${PREFIX_URL}${path}.png`);
      }
    }
  }, [path]);

  return icon;
};
