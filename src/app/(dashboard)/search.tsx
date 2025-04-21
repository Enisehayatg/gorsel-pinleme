import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const trends = [
  { id: '1', title: 'Doğa', image: 'https://picsum.photos/id/1018/400/300' },
  { id: '2', title: 'Sanat', image: 'https://picsum.photos/id/1025/400/300' },
  { id: '3', title: 'Yemek', image: 'https://picsum.photos/id/1043/400/300' },
];

const tags = ['Dekorasyon', 'Sokak Sanatı', 'Moda', 'İç Mekan', 'Pastel', 'Vintage', 'Yaz'];

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filteredTrends = trends.filter((pin) =>
    pin.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 mb-5 bg-white">
      {/* Header */}
      <View className="px-4 pt-5 pb-2 bg-white border-b border-gray-200">
        <Text className="text-3xl font-bold text-pink-600">Keşfet 🔍</Text>
        <View className="mt-3 flex-row items-center bg-gray-100 px-4 py-2 rounded-full">
          <Ionicons name="search-outline" size={20} color="#A1A1AA" />
          <TextInput
            placeholder="Sanat, sokak, renkler..."
            value={query}
            onChangeText={setQuery}
            className="ml-2 flex-1 text-sm text-gray-800"
            placeholderTextColor="#A1A1AA"
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
        {/* Etiketler */}
        <Text className="text-base font-semibold text-gray-800 mb-2">Popüler Etiketler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {tags.map((tag, i) => (
            <TouchableOpacity
              key={i}
              className="bg-pink-100 px-4 py-2 rounded-full mr-3"
              onPress={() => setQuery(tag)}
            >
              <Text className="text-pink-700 font-medium text-sm">#{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trend pinler */}
        <Text className="text-base font-semibold text-gray-800 mb-2">Trendler</Text>
        {filteredTrends.length > 0 ? (
          <FlatList
            data={filteredTrends}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/pin/${item.id}`)}
                className="mr-4"
                style={{ width: 240 }}
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-40 rounded-xl mb-2"
                  resizeMode="cover"
                />
                <Text className="text-sm font-medium text-gray-700">{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text className="text-sm text-gray-400 mb-6">Eşleşen içerik bulunamadı.</Text>
        )}

        {/* Öneri kutusu */}
        <Text className="text-base font-semibold text-gray-800 mt-6 mb-2">Senin İçin</Text>
        <View className="flex-row justify-between gap-3 mb-20">
          <View className="flex-1 h-32 bg-gray-100 rounded-xl items-center justify-center">
            <Ionicons name="sparkles-outline" size={36} color="#a1a1aa" />
            <Text className="text-sm text-gray-600 mt-1">Rastgele İlham</Text>
          </View>
          <View className="flex-1 h-32 bg-gray-100 rounded-xl items-center justify-center">
            <Ionicons name="color-palette-outline" size={36} color="#a1a1aa" />
            <Text className="text-sm text-gray-600 mt-1">Renk Odaklı</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white border-t border-gray-200 py-3">
        <TouchableOpacity onPress={() => router.push('/(dashboard)')}>
          <Ionicons name="home-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/search')}>
          <Ionicons name="search-outline" size={26} color="#e11d48" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/add')}>
          <Ionicons name="add-circle-outline" size={32} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/saved')}>
          <Ionicons name="bookmark-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/profile')}>
          <Ionicons name="person-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
