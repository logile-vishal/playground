import { APP_ID, type DeviceType } from "@/core/types/devices.type";

export function getDeviceType(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();

  const isTabletUA = /ipad|android(?!.*mobile)|tablet/.test(ua);
  const isDesktopUA = /macintosh|windows|linux/.test(ua);

  return (isDesktopUA && !isTabletUA) ? 'Desktop' : 'Tablet';
}

export function getAppId() {
  const appId = getDeviceType() === 'Desktop' ? APP_ID.Desktop : APP_ID.Tablet;
  return appId;
}