import { useEffect } from 'react';

import { TYPE_BROADCAST_CHANNAL_SW, TYPE_SEND_TOKEN_FB } from '@src/App/constants';

import { getCookie } from '../helpers';

export const useInitUnpPush = () => {
  const channel =
    'BroadcastChannel' in window && typeof BroadcastChannel !== 'undefined'
      ? new BroadcastChannel(TYPE_BROADCAST_CHANNAL_SW)
      : null;

  const messageHandler = async (fbToken: string) => {
    console.log(`Токен ${fbToken}, переход в пульс`);
    window.location.href = `${getCookie('scheme')}://${window.location.host}/i/vpush?correlation=${getCookie('correlation')}&address=${fbToken}`;
  };

  useEffect(() => {
    if (channel) {
      channel.onmessage = (e) => {
        // Шаг 3: Получаение из сервис-воркера актуального токена и переход в пульс
        if (e.data?.type === TYPE_SEND_TOKEN_FB && e.data.payload) {
          messageHandler(e.data.payload);
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [channel]);
};
