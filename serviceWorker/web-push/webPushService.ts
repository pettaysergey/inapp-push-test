import { UnpPushData } from '../types';

class WebPushService {
  port = new BroadcastChannel('simple-pwa-web-push-sw');

  getTarget = async (unpPushData: UnpPushData): Promise<string> => {
    const { UnP__enrichedData, link } = unpPushData;
    const defaultTarget = link;

    if (UnP__enrichedData) {
      try {
        const extendedInfo = JSON.parse(UnP__enrichedData)['extendedInfo'];

        if (extendedInfo && extendedInfo.link) {
          console.log('extendedInfo.link: ', extendedInfo.link);
          return extendedInfo.link;
        }

        return defaultTarget;
      } catch (error) {
        return defaultTarget;
      }
    }

    return defaultTarget;
  };
}

export const webPushService = new WebPushService();
