import axios from 'axios';
import { useQuery } from 'react-query';

import { QUERY_OPTIONS } from '@app/constants';
import { hcmsFallback } from '@app/hcmsFallback';
import type { TextData, TransformedHcmsTexts } from '@app/types';
import { mergeJSON, transformHcmsFormatToObject } from '@app/utils';

import { getHcmsUrl } from '../helpers';

const getHcmsApi = async (): Promise<TransformedHcmsTexts> => {
  const hcmsUrl = `${getHcmsUrl()}/projects/notification/models/texts/items/UI__ru`;

  try {
    const hcmsResponse = await axios.get(hcmsUrl);

    return transformHcmsFormatToObject(hcmsResponse?.data);
  } catch (e) {
    console.log('Запрос hcms упал с ошибкой');

    return transformHcmsFormatToObject(hcmsFallback as TextData);
  }
};

const getHcmsTexts = ({ connectionData, hcmsData }: any) => {
  if (!connectionData && !hcmsData) {
    return null;
  }

  const { screen_pushs } = hcmsData || {};

  const texts: { [index: string]: any } = {
    settingsTexts:
      mergeJSON(connectionData?.screenDetails?.screen_settings?.parameters, hcmsData ?? {}, 'screen_settings') ?? {},
    settingsTexts2:
      mergeJSON(connectionData?.screenDetails?.screen_settings2?.parameters, hcmsData ?? {}, 'screen_settings2') ?? {},
    screenPopup:
      mergeJSON(connectionData?.screenDetails?.screen_pop_up?.parameters, hcmsData ?? {}, 'screen_pop_up') ?? {},
    formTexts: mergeJSON(connectionData?.screenDetails?.screen_form?.parameters, hcmsData ?? {}, 'screen_form') ?? {},
    checkSettingsTexts:
      mergeJSON(
        connectionData?.screenDetails?.screen_check_settings?.parameters,
        hcmsData ?? {},
        'screen_check_settings',
      ) ?? {},
    pushsTexts:
      {
        ...(mergeJSON(connectionData?.screenDetails?.screen_pushs?.parameters, hcmsData ?? {}, 'screen_pushs') ?? {}),
        text_enable_push_loona: screen_pushs?.text_enable_push_loona,
        text_enable_push_safari: screen_pushs?.text_enable_push_safari,
      } ?? {},
  };

  return texts;
};

export const useNotificationsTextsQuery = () => {
  const {
    data: hcmsData,
    isLoading,
    refetch: refetchHcms,
    isError,
  } = useQuery('hcms', () => getHcmsApi(), {
    ...QUERY_OPTIONS,
    retry: false,
  });

  const texts = getHcmsTexts({
    hcmsData: hcmsData ?? transformHcmsFormatToObject(hcmsFallback as TextData),
    screenErrors: hcmsData?.screen_errors ?? {},
  });

  return {
    texts,
    hcmsData,
    isLoading,
    isError,
    refetchHcms,
  };
};
