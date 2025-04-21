import { API } from "@/constants/api";
import apiClient from "@/libs/apiClient";

export const Auth = {
  login: async (credentials: { email: string; password: string }) => {
    return await apiClient.post(API.ENDPOINTS.AUTH.LOGIN, credentials);
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    return await apiClient.post(API.ENDPOINTS.AUTH.REGISTER, userData);
  },

  refreshToken: async (refreshToken: string) => {
    return await apiClient.post(API.ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refresh_token: refreshToken,
    });
  },
};
