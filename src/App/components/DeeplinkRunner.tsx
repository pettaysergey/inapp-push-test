import { Typography } from '@omega/ui-retail';
import React, { useEffect, useState } from 'react';

import { readValue } from '../common/helpers/indexedDBHelper';
import { runDeeplinks } from '../common/helpers/runDeeplinks';

export const DeeplinkRunner = () => {
  const [deeplinkStore, setDeeplinkStore] = useState('');

  useEffect(() => {
    const ulrParams = new URLSearchParams(window.location.search);
    const deviceId = ulrParams.get('deviceId');

    readValue('deeplink-store').then((res: string) => {
      setDeeplinkStore(res);
      runDeeplinks(res, deviceId);
    });
  }, []);

  return (
    <div>
      <Typography typography="bodyM_paragraph_normal">Перебор списка диплинков...</Typography>
      <Typography typography="bodyS_paragraph_semiBold">{`deeplink-store: ${deeplinkStore}`}</Typography>
    </div>
  );
};
