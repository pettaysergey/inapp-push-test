import { useState } from "react";
import { InAppType } from "./types";

const MAX_NOTIFICATIONS_COUNT = 3;

export const useGetSseInfo = () => {
  const [notifications, setNotifications] = useState<InAppType[]>([]);
  const [notificationsQueue, setNotificationsQueue] = useState<string[]>([]);

  const handleRemoveNotification = (id: string) => {
    const filtered = notifications.filter(({ inAppId }) => inAppId !== id);
    setNotifications(filtered);
  };

  const handleAddNotification = (notification: InAppType) => {
    if (window.Notification.permission === "granted") {
      console.log("отсылаем в сервис-воркер");
      navigator.serviceWorker.ready.then((reg) => {
        reg.active?.postMessage({
          type: "SW:SendInApp",
          payload: notification,
        });
      });
    } else {
      setNotificationsQueue([...notificationsQueue, notification.inAppId]);
      setNotifications([{ ...notification }, ...notifications]);
    }
  };

  const handleNotificationClick = () => {
    setNotifications([]);
  };

  return {
    notifications: notifications.slice(-MAX_NOTIFICATIONS_COUNT),
    handleAddNotification,
    handleNotificationClick,
    handleRemoveNotification,
  };
};
