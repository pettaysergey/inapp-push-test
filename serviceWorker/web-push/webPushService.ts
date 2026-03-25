class WebPushService {
  port = new BroadcastChannel('web-push-sw');
}

export const webPushService = new WebPushService();
