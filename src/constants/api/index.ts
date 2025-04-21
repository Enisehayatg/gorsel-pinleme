import { API_URL } from "@env";

export const API_CONFIG = {
  BASE_URL: API_URL,
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const API = {
  BASE_URL: API_URL,

  ENDPOINTS: {
    AUTH: {
      BASE: "/auth",
      LOGIN: "/auth/login", // Kullanıcı girişi
      REGISTER: "/auth/register", // Yeni kullanıcı kaydı
      VERIFY: "/auth/verify", // Email/telefon doğrulama
      FORGOT_PASSWORD: "/auth/forgot-password", // Şifremi unuttum
      RESET_PASSWORD: "/auth/reset-password", // Şifre sıfırlama
      REFRESH_TOKEN: "/auth/refresh-token", // Token yenileme
    },
  },
};
