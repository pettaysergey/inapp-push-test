import { Button, Container, Flex, Typography } from '@omega/ui-retail';
import React from 'react';

export const ErrorPage = () => {
  const handleGoToLogin = () => {
    window.location.href = window.location.origin;
  };

  return (
    <Container
      css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', paddingTop: '200px' }}
    >
      <Flex css={{ width: '600px', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Typography typography="headlineM">Страница не найдена</Typography>
        <Typography typography="bodyM_paragraph_normal">Ошибка в адресе или страница удалена.</Typography>
        <Button css={{ width: '100%', marginTop: '32px' }} onClick={handleGoToLogin}>
          Вернуться ко входу
        </Button>
      </Flex>
    </Container>
  );
};
