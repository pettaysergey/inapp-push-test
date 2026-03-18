export type InAppType = {
  inAppId: string;
  title: string;
  body: string;
  inAppParameters: {
    timeKeep: string;
    link: string;
    expiredTime: string;
  };
};
