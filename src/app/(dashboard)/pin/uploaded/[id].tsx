import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Share,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUploadedPins, deleteUploadedPin, Pin } from '@/utils/uploadedStorage';

export default function UploadedPinDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [pin, setPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadPin();
  }, [id]);

  const loadPin = async () => {
    try {
      setLoading(true);
      const pins = await getUploadedPins();
      const foundPin = pins.find(p => p.id === id);
      setPin(foundPin || null);
    } catch (e) {
      console.error('Pin yükleme hatası:', e);
      Alert.alert('Hata', 'Pin yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!pin) return;
    try {
      await Share.share({
        message: `Bak bu pini çok beğendim! \n\n${pin.title}`,
      });
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Pini Sil',
      'Bu pini silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!pin?.id) return;
              const success = await deleteUploadedPin(pin.id);
              if (success) {
                Alert.alert('Başarılı', 'Pin başarıyla silindi.');
                router.replace('/(dashboard)');
              } else {
                Alert.alert('Hata', 'Pin silinirken bir hata oluştu.');
              }
            } catch (e) {
              console.error('Silme hatası:', e);
              Alert.alert('Hata', 'Pin silinirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#e11d48" />
      </SafeAreaView>
    );
  }

  if (!pin) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Pin bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-4 z-10 bg-white/80 px-3 py-2 rounded-full flex-row items-center"
        >
          <Ionicons name="arrow-back" size={20} color="#333" />
          <Text className="ml-1 text-gray-800">Geri</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: pin.image }}
          className="w-full h-96"
          resizeMode="cover"
        />

        <View className="px-5 py-4">
          <Text className="text-xl font-bold text-gray-800 mb-1">{pin.title}</Text>
          <Text className="text-sm text-gray-400 mb-2">
            Kategori: {pin.category} • {new Date(pin.createdAt).toLocaleDateString('tr-TR')}
          </Text>

          <View className="mt-4 flex-row gap-4">
            <TouchableOpacity
              onPress={handleShare}
              className="flex-row items-center gap-2"
            >
              <Ionicons name="share-social-outline" size={22} color="#6b7280" />
              <Text className="text-gray-600">Paylaş</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="flex-row items-center gap-2"
            >
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
              <Text className="text-red-500">Sil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 mt-6 mb-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl"
          >
            <Ionicons name="arrow-back-outline" size={20} color="#333" />
            <Text className="ml-2 text-gray-700 font-medium">Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 