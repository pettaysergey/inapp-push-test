import axios from 'axios';

const PUBLIC_GATEWAY_URL = '/msa/api-gw';
const UNP_PUSH_DEVICE = '/unp/unp-push-device/';

export const deletePushDeviceApi = async ({ deviceId }: { deviceId: string }) => {
  return axios.request({
    method: 'PUT',
    url: `${PUBLIC_GATEWAY_URL}${UNP_PUSH_DEVICE}v1/unppushdevice/token/block`,
    data: { deviceId },
  });
};
