import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-6 justify-between"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View className="flex-1 justify-center items-center">
        <Image
          source={require('../assets/icon.png')}
          className="w-32 h-32 mb-6"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-gray-900 text-center">
          Hoş Geldin!
        </Text>
        <Text className="text-2xl font-semibold text-pink-600 mt-1">
          Görsel Pinleme
        </Text>
        <Text className="text-base text-gray-500 text-center mt-4 px-4">
          İlhamını keşfet, fikirlerini pinle ve görsellerle dolu kendi dünyanı oluştur.
        </Text>
      </View>

      <TouchableOpacity
        className="bg-pink-600 py-4 rounded-xl mb-10"
        onPress={() => router.replace('/(auth)/login')}
      >
        <Text className="text-white text-center font-medium text-base">
          Başla
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
