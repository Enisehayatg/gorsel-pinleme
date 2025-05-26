import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getSavedPins, removePin, SavedPin } from '@/utils/savedStorage';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth / 2 - 20;

// Profil fotoğrafı için URL
const PROFILE_IMAGE_URL = "https://i.pravatar.cc/150?img=10";

export default function Saved() {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState<SavedPin[]>([]);
  const router = useRouter();

  // Load saved pins when screen is focused
  useEffect(() => {
    loadSavedPins();
  }, []);

  const loadSavedPins = async () => {
    try {
      setLoading(true);
      const savedPins = await getSavedPins();
      setPins(savedPins);
    } catch (e) {
      Alert.alert('Hata', 'Kaydedilen görseller yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePin = async (id: string) => {
    try {
      const success = await removePin(id);
      if (success) {
        // Yeniden yükle
        loadSavedPins();
        Alert.alert('Başarılı', 'Görsel kaydedilenlerden kaldırıldı.');
      }
    } catch (e) {
      Alert.alert('Hata', 'Görsel kaldırılırken bir hata oluştu.');
    }
  };

  const renderItem = ({ item, index }: { item: SavedPin, index: number }) => (
    <View
      style={{
        width: CARD_WIDTH,
        marginBottom: 16,
        marginRight: index % 2 === 0 ? 8 : 0,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2,
      }}
    >
      <TouchableOpacity onPress={() => router.push(`/pin/${item.id}`)}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: '100%',
            height: 200 + (index % 2) * 30,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={{ padding: 10 }}>
        <View className="flex-row justify-between items-center">
          <Text style={{ fontWeight: '600', color: '#333', flex: 1 }}>{item.title}</Text>
          <TouchableOpacity 
            className="p-2" 
            onPress={() => handleRemovePin(item.id)}
          >
            <Ionicons name="bookmark" size={18} color="#e11d48" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 mb-5 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-pink-600">📌 Kaydedilenler</Text>
        <TouchableOpacity 
          onPress={() => router.replace('/(dashboard)/profile')}
          className="w-10 h-10 rounded-full overflow-hidden"
        >
          <Image 
            source={{ uri: PROFILE_IMAGE_URL }} 
            className="w-full h-full" 
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* İçerik */}
      <View className="flex-1 px-3 mt-2">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#e11d48" />
          </View>
        ) : (
          <>
            {pins.length > 0 ? (
              <FlatList
                data={pins}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Ionicons name="bookmark-outline" size={60} color="#e2e8f0" />
                <Text className="text-gray-500 text-lg mt-3">Henüz kaydedilen görsel yok</Text>
                <Text className="text-gray-400 mt-2">Görselleri kaydetmek için ana sayfaya dönün</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Alt Menü */}
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white border-t border-gray-200 py-3">
        <TouchableOpacity onPress={() => router.push('/(dashboard)')}>
          <Ionicons name="home-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/search')}>
          <Ionicons name="search-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/add')}>
          <Ionicons name="add-circle-outline" size={32} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/saved')}>
          <Ionicons name="bookmark-outline" size={26} color="#e11d48" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/todo')}>
          <Ionicons name="checkmark-circle-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
