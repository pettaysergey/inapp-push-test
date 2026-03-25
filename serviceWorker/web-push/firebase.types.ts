export type FirebaseConfig = {
  apiKey: string;
  appId: string;
  messagingSenderId: string;
  projectId: string;
  authDomain: string;
  databaseURL: string;
  storageBucket: string;
  measurementId: string;
  vapidKey: string;
};

export type FirebaseInit = {
  messagingSenderId: string;
  projectId: string;
  apiKey: string;
  appId: string;
};

export type FirebaseApps = {
  options_: FirebaseConfig;
};

export type Firebase = {
  apps: FirebaseApps[];
  initializeApp: (initData: FirebaseInit) => FirebaseApps;
  messaging: (initData?: FirebaseApps) => FirebaseMessaging;
};

export interface FirebaseMessaging {
  /** window controller */
  deleteToken(): Promise<boolean>;
  getToken(options?: { vapidKey?: string; serviceWorkerRegistration?: ServiceWorkerRegistration }): Promise<string>;

  /** @deprecated */
  deleteToken(token: string): Promise<boolean>;
}
