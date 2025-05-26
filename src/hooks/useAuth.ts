import apiClient from '@/libs/apiClient';
import { API } from "@/constants";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  reference: string;
  message: string;
  code: number;
  status: boolean;
  data?: {
    token: string;
    user: any;
  };
}

export const useAuth = () => {
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(API.ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(API.ENDPOINTS.AUTH.REGISTER, credentials);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  return { login, register };
};
