import { Container, Loader, Typography } from '@omega/ui-retail';
import React, { useEffect, useState } from 'react';

import { readValue } from '../common/helpers/indexedDBHelper';
import { runDeeplinks } from '../common/helpers/runDeeplinks';

export const DeeplinkRunner = () => {
  const [deeplinkStore, setDeeplinkStore] = useState('');
  const isTest = localStorage.getItem('test-push');

  useEffect(() => {
    const ulrParams = new URLSearchParams(window.location.search);
    const deviceId = ulrParams.get('deviceId');

    readValue('deeplink-store').then((res: string) => {
      setDeeplinkStore(res);
      console.log('deeplink-store: ', res);

      if (res) {
        console.log('Зашел в перебор');
        runDeeplinks(res, deviceId);
      }
    });
  }, []);

  return (
    <Container
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        gap: '24',
      }}
    >
      <Typography typography="bodyM_paragraph_normal">Перебор списка диплинков...</Typography>
      <Loader />
      {isTest && <Typography typography="bodyS_paragraph_semiBold">{`deeplink-store: ${deeplinkStore}`}</Typography>}
    </Container>
  );
};
