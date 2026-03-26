import { Button, Container, styled, theme, Typography } from '@omega/ui-retail';
import React from 'react';

import { initFireBaseForPushUnp } from '../common/helpers';
import { useIcon, useInitUnpPush } from '../common/hooks';

const MOCK_IMAGE = 'projects/notification/files/illustrations/ios-simple-pwa-picture';

const StyledImage = styled('img', {
  width: '100%',
  height: '184px',
  objectFit: 'cover',
  borderRadius: '24px',
  marginBottom: theme.sizes.x9,
});

export const PwaInitPage = () => {
  useInitUnpPush();
  const icon = useIcon(MOCK_IMAGE);

  const handleOpenWeb = () => window.open(`${window.location.origin}/login`);

  const handleRequestPermission = () => {
    // Шаг 1: Инициализация FB если пользователь дал разрешение
    window.Notification?.requestPermission().then((permission) => {
      if (permission === 'granted') {
        initFireBaseForPushUnp();
      }
    });
  };

  return (
    <Container css={{ display: 'flex', flexDirection: 'column', height: '90dvh', padding: `0 ${theme.sizes.x5}` }}>
      <StyledImage alt="Изображение онбординга" src={icon} />
      <Typography css={{ marginBottom: theme.sizes.x6 }} typography="headlineM">
        Подключите на этом экране уведомления
      </Typography>
      <Typography typography="bodyM_paragraph_normal">Разрешите отправку уведомлений</Typography>
      <Container css={{ display: 'flex', flexDirection: 'column', gap: theme.sizes.x4, marginTop: 'auto' }}>
        <Button colorScheme="primary" onClick={handleRequestPermission} type="button">
          Подключить уведомления
        </Button>
        <Button colorScheme="primary" onClick={handleOpenWeb} type="button" variant="tonned">
          Перейти в веб-версию
        </Button>
      </Container>
    </Container>
  );
};
