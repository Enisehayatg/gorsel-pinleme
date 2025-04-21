import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      router.replace('/(dashboard)');

      const res = await login({ email, password });

      if (res.status && res.data?.token) {
        await AsyncStorage.setItem('accessToken', res.data.token);
        await AsyncStorage.setItem('accessUser', JSON.stringify(res.data.user));
        router.replace('/(dashboard)');
      } else {
        Alert.alert('Giriş Başarısız', res.message || 'Geçersiz bilgiler');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Hata', 'Bir sorun oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            <View className="items-center mb-10">
              <Image
                source={require('../../assets/icon.png')}
                className="w-28 h-28"
                resizeMode="contain"
              />
              <Text className="text-xl font-bold text-pink-600">Görsel Pinleme</Text>
            </View>

            <Text className="text-3xl font-semibold text-gray-900 text-center mb-2">
              Merhaba 👋
            </Text>
            <Text className="text-base text-gray-500 text-center mb-8">
              İlham dolu dünyana giriş yap
            </Text>

            <TextInput
              className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 mb-4 text-gray-800"
              placeholder="E-posta"
              placeholderTextColor="#A1A1AA"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 mb-6 text-gray-800"
              placeholder="Şifre"
              placeholderTextColor="#A1A1AA"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              className="bg-pink-600 rounded-xl py-4 items-center justify-center"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-medium text-base">Giriş Yap</Text>
              )}
            </TouchableOpacity>

            <Text className="text-center text-gray-500 mt-6 mb-8">
              Hesabın yok mu?{' '}
              <Text
                className="text-pink-600 font-semibold"
                onPress={() => router.push('/(auth)/register')}
              >
                Kayıt Ol
              </Text>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
