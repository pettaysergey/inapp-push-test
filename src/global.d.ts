type VTB = {
  allowFunctionSettings: boolean;
  asyncServer: Record<string, string>;
  authSSO: Record<string, string>;
  cmsUrl: string;
  forceUseFocusGroupCheck: boolean;
  forceUseLoginMode: boolean;
  integrationServer: Record<string, string>;
  messengers: Record<string, string>;
  oldIbAddress: string;
  recaptcha: Record<string, string>;
  salaryForm: Record<string, Record<string, string>>;
  webChat: Record<string, string | number | boolean>;
  webPushUnp: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
    vapidKey: string;
  };
};

declare global {
  interface Window {
    _coreSettings: Record<string, Record<string, string>>;
    _VTB: VTB;
    mf_1488_legacy: {
      get(modulePath: string): Promise<() => any>;
      // @ts-ignore
      init: (shareScope?: { default?: typeof __webpack_share_scopes__ }) => Promise<void>;
    };
  }
}

export {};
