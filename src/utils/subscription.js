import { getCookie } from "./cookie";
import apiSubscription from "./api/modules/subscription.api";

const PUBLIC_VAPID_KEY =
  "BJ4cOeLeruKeGJ7pkoYDOrnGl_rDMvObWmWh8urklnZjnye00efE3v99iZCX3jE5X6aDGZa0JyWaeBW3lzd_oOw";
export const subscription = async () => {
  const swUrl = "/work.js";
  const register = await navigator.serviceWorker.register(swUrl);
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
  });

  const email = getCookie("Email");
  const dataSubscription = {
    userEmail: decodeURIComponent(email),
    subscription: subscription,
  };

  try {
    await apiSubscription.createSubscription(dataSubscription);
  } catch (error) {
    console.error(error);
  }
};

export const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
