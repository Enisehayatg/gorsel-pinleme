import apiClient from '@/libs/apiClient';
import {API} from "@/constants";

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    reference: string;
    message: string;
    code: number;
    status: boolean;
    data: {
        token: string;
        user: any;
    };
}

export const useAuth = () => {
    const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
        try {
            const response: any = await apiClient.post(API.ENDPOINTS.AUTH.LOGIN, credentials);
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };
    return { login }
};