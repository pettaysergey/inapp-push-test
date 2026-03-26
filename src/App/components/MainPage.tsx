import {
  Button,
  Container,
  Flex,
  Loader,
  ModalOnboarding,
  styled,
  theme,
  Typography,
  VisuallyHidden,
} from '@omega/ui-retail';
import React, { useEffect, useState } from 'react';

import { useIcon, useNotificationsTextsQuery } from '@common/hooks';

const APP_ROOT_ID = 'my-app-root';
const PORTAL_ID = 'portal-root';
const MOCK_IMAGE = 'projects/notification/files/illustrations/ios-pwa-push-on';

const StyledImage = styled('img', {
  width: '100%',
  height: '184px',
  objectFit: 'cover',
  borderRadius: '24px',
  marginBottom: theme.sizes.x9,
});

const StyledImageOnboarding = styled('img', {
  width: '100%',
  height: '240px',
  objectFit: 'cover',
  borderRadius: '24px',
});

const renderList = (itemsForRender: string[]) => (
  <Flex direction="column" gap="16px">
    {itemsForRender.map((el, i) => (
      <Flex align="baseline" gap="8px" key={i}>
        <Typography aria-hidden typography="bodyM_paragraph_normal">
          {i + 1}.
        </Typography>
        <Typography aria-hidden css={{ fontWeight: 'normal' }} typography="bodyM_paragraph_normal">
          {el}
        </Typography>
        <VisuallyHidden as="p">{`${i + 1}. ${el}`}</VisuallyHidden>
      </Flex>
    ))}
  </Flex>
);

export const MainPage = () => {
  const { hcmsData, isLoading } = useNotificationsTextsQuery();
  const [isOpen, setIsOpen] = useState(false);
  const allowList = [
    hcmsData?.screen_pushs.push_pwa_onboarding_text_1 || '',
    hcmsData?.screen_pushs.push_pwa_onboarding_text_2 || '',
    hcmsData?.screen_pushs.push_pwa_onboarding_text_3 || '',
  ];
  const icon = useIcon(MOCK_IMAGE);
  const contentForOnboarding = [
    {
      title: 'Как установить ВТБ Онлайн как ярлык',
      text: `1. ${hcmsData?.screen_pushs.push_pwa_onboarding_text_1 || ''}`,
      buttonText: 'Дальше',
      image: <StyledImageOnboarding alt="Изображение онбординга" src={icon} />,
    },
    {
      title: 'Как установить ВТБ Онлайн как ярлык',
      text: `2. ${hcmsData?.screen_pushs.push_pwa_onboarding_text_2 || ''}`,
      buttonText: 'Дальше',
      image: <StyledImageOnboarding alt="Изображение онбординга" src={icon} />,
    },
    {
      title: 'Как установить ВТБ Онлайн как ярлык',
      text: `3. ${hcmsData?.screen_pushs.push_pwa_onboarding_text_3 || ''}`,
      buttonText: 'Понятно',
      image: <StyledImageOnboarding alt="Изображение онбординга" src={icon} />,
      onClick: () => setIsOpen(false),
    },
  ];

  useEffect(() => {
    const ulrParams = new URLSearchParams(window.location.search);
    const correlation = ulrParams.get('correlation');
    const scheme = ulrParams.get('scheme');

    document.cookie = `scheme=${scheme}; max-age=7200`;
    document.cookie = `correlation=${correlation}; max-age=7200`;
  }, []);

  if (isLoading) return <Loader />;

  return (
    <>
      <Container css={{ display: 'flex', flexDirection: 'column', height: '90dvh', padding: `0 ${theme.sizes.x5}` }}>
        <StyledImage alt="Изображение онбординга" src={icon} />
        <Typography css={{ marginBottom: theme.sizes.x6 }} typography="headlineM">
          Установите ВТБ Онлайн как ярлык, чтобы продолжать получать уведомления
        </Typography>
        {renderList(allowList)}
        <Container css={{ marginTop: 'auto' }}>
          <Button colorScheme="primary" onClick={() => setIsOpen(true)} type="button">
            Как установить
          </Button>
        </Container>
      </Container>
      <ModalOnboarding
        isOpen={isOpen}
        items={contentForOnboarding}
        onClose={() => setIsOpen(false)}
        portalRoot={document.getElementById(PORTAL_ID)}
        rootId={APP_ROOT_ID}
      />
    </>
  );
};
