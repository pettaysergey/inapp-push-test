class WebPushService {
  port = new BroadcastChannel('simple-pwa-web-push-sw');
}

export const webPushService = new WebPushService();
