import { Firebase, FirebaseConfig } from './web-push/firebase.types';

type SendCDNOriginEvent = {
  type: 'SW::SendCDNOrigin';
  payload: string;
};

type SendUnpEvent = {
  type: 'SW::SendUnpEvent';
  payload: FirebaseConfig;
};

type SendTokenFB = {
  type: 'SW::SendTokenFB';
  payload: string;
};

type SendRemovingTokenFB = {
  type: 'SW::SendRemovingTokenFB';
  payload: string;
};

type SendAppVersion = {
  type: 'SW::SendAppVersion';
  payload: string;
};

type SendUnpUrl = {
  type: 'SW::SendUnpUrl';
  payload: string;
};

type SendTestPush = {
  type: 'SW::SendTestPush';
  payload: string;
};

export type PushStatus = {
  pushId: string;
  receiveTime: string;
  deviceId: string;
};

type FromHostEvents =
  | SendUnpEvent
  | SendTokenFB
  | SendRemovingTokenFB
  | SendCDNOriginEvent
  | SendAppVersion
  | SendUnpUrl
  | SendTestPush;

export interface MessageEvent extends ExtendableMessageEvent {
  data: FromHostEvents;
}

export type SelfSW = ServiceWorkerGlobalScope & { cdnURL: URL; firebase: Firebase; vtbOnlineUIVersion: string };

export type UnpPushData = {
  pushType: string;
  title: string;
  body: string;
  unp_sdk: string;
  bellGroup: string;
  deviceId: string;
  link: string;
  UnP__enrichedData: string;
  pushId: string;
};

export type UnpPush = {
  data: UnpPushData;
  from: string;
  priority: string;
  fcmMessageId: string;
};
