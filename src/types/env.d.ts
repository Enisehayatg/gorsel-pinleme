declare module '@env' {
  export const API_URL: string;
  export const API_VERSION: string;
  export const AUTH_TOKEN_HEADER: string;
  export const AUTH_TOKEN_PREFIX: string;
  export const APP_NAME: string;
  export const APP_ENV: 'development' | 'production';
  export const APP_LANG: string;
  export const APP_COUNTRY: string;
  export const APP_LOCALE: string;
  export const APP_CURRENCY: string;
  export const PRIMARY_COLOR: string;
  export const ACCENT_COLOR: string;
  export const DARK_MODE: 'true' | 'false';
  export const MIN_PASSWORD_LENGTH: string;
  export const ENABLE_2FA: 'true' | 'false';
}
