import { UnpPush, UnpPushData } from '../types';
import { readValue, saveValue } from './indexedDBHelper';

const statusRequest = (
  url: string,
  pushParams: {
    pushId: string;
    receiveTime: string;
    deviceId: string;
  },
) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Referrer': self.location.href,
    },
    body: JSON.stringify(pushParams),
  });

// Выполнить доп-запросы (по умолчанию 1) если первый закончился с ошибкой
const postStatusRequestWithRetry = async (
  url: string,
  pushParams: {
    pushId: string;
    receiveTime: string;
    deviceId: string;
  },
  maxRetries: number,
  delayMs = 2000,
): Promise<Response> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const logs = await readValue('webPushLogs');
      await saveValue(
        'webPushLogs',
        `${logs || ''}; ${new Date()}: Выполнен POST-запрос на статус, Попытка: ${attempt}`,
      );
      const response = await statusRequest(url, pushParams);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response; // Успех — возвращаем ответ
    } catch (error) {
      lastError = error;
      const logs = await readValue('webPushLogs');
      await saveValue('webPushLogs', `${logs || ''}; ${new Date()}: ${error}`);
      if (attempt === maxRetries) break;

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // Все попытки провалились — бросаем последнюю ошибку
  throw new Error(
    `Произведено ${maxRetries} попыток для отправки статуса доставки. Последняя ошибка: ${String(lastError)}`,
  );
};

class WebPushService {
  port = new BroadcastChannel('simple-pwa-web-push-sw');

  async sendPushStatus(dataPush: UnpPush, unpUrl: string) {
    const {
      data: { pushId, deviceId },
    } = dataPush;
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    const receiveTime = new Date(now.getTime() - offsetMinutes * 60000).toISOString().slice(0, -1);
    const pushParams = { pushId, receiveTime, deviceId };
    const url = `${unpUrl}/unppush/v1/unpchannelpush/push/status`;

    this.port.postMessage({ type: 'SW::SendReceivingPush' });

    if (unpUrl) {
      try {
        await postStatusRequestWithRetry(url, pushParams, 2);
      } catch (error) {
        const logs = await readValue('webPushLogs');
        await saveValue('webPushLogs', `${logs || ''}; ${new Date()}: ${error}`);
        this.port.postMessage({ type: 'SW::SendDeliveryStatusError', payload: error });
      }
    } else {
      this.port.postMessage({ type: 'SW::SendDeliveryStatusError', payload: 'Отсутствует unpUrl' });
    }
  }

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
