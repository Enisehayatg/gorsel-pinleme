import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const userData = await AsyncStorage.getItem('accessUser');
        
        setIsAuthenticated(true);
        
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          const defaultUser = {
            id: 1,
            name: 'Demo Kullanıcı',
            email: 'demo@example.com'
          };
          setUser(defaultUser);
          await AsyncStorage.setItem('accessUser', JSON.stringify(defaultUser));
          await AsyncStorage.setItem('accessToken', 'default-token-123');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('accessUser');
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { isAuthenticated, isLoading, user, logout };
}; 