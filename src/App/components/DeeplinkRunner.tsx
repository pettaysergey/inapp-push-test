import React, { useEffect } from 'react';

import { readValue } from '../common/helpers/indexedDBHelper';
import { runDeeplinks } from '../common/helpers/runDeeplinks';

export const DeeplinkRunner = () => {
  useEffect(() => {
    readValue('deeplink-store').then((res: string) => runDeeplinks(res));
  }, []);

  return <div>Перебор списка диплинков...</div>;
};
