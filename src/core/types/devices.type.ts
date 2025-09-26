export const APP_ID = {
  Desktop: 1,
  Tablet: 2,
} as const;

export type AppId = typeof APP_ID[keyof typeof APP_ID];
export type DeviceType = keyof typeof APP_ID;