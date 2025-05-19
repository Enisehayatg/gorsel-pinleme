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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth / 2 - 24;

const pins = [
  {
    id: '1',
    category: 'Sanat',
    image: 'https://images.unsplash.com/photo-1581091870627-3cbe2242b6b8?auto=format&fit=crop&w=800&q=80',
    views: 1200,
  },
  {
    id: '2',
    category: 'Doğa',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    views: 2300,
  },
  {
    id: '3',
    category: 'Yemek',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
    views: 800,
  },
  {
    id: '4',
    category: 'Dekorasyon',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    views: 1500,
  },
  {
    id: '5',
    category: 'Moda',
    image: 'https://images.unsplash.com/photo-1602810319220-b5d14f02e500?auto=format&fit=crop&w=800&q=80',
    views: 1900,
  },
];

const tags = ['Sanat', 'Doğa', 'Yemek', 'Dekorasyon', 'Moda'];

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredPins = pins.filter((pin) => {
    const matchesQuery = pin.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory ? pin.category === selectedCategory : true;
    return matchesQuery && matchesCategory;
  });

  const popularPins = [...pins].sort((a, b) => b.views - a.views).slice(0, 4);
  const recommendedPins = pins.filter((pin) => ['Moda', 'Sanat'].includes(pin.category));

  return (
    <SafeAreaView className="flex-1 mb-5 bg-white">
      {/* Header */}
      <View className="px-4 pt-5 pb-2 border-b border-gray-200 bg-white">
        <Text className="text-3xl font-bold text-pink-600">Keşfet 🔍</Text>
        <View className="mt-3 flex-row items-center bg-gray-100 px-4 py-2 rounded-full">
          <Ionicons name="search-outline" size={20} color="#A1A1AA" />
          <TextInput
            placeholder="Sanat, doğa, moda..."
            value={query}
            onChangeText={setQuery}
            className="ml-2 flex-1 text-sm text-gray-800"
            placeholderTextColor="#A1A1AA"
          />
        </View>
      </View>

      {/* Etiketler */}
      <View className="px-4 pt-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => setSelectedCategory('')}
            className={`px-4 py-2 mr-2 rounded-full border ${
              selectedCategory === '' ? 'bg-pink-600 border-pink-600' : 'bg-white border-gray-300'
            }`}
          >
            <Text className={selectedCategory === '' ? 'text-white' : 'text-gray-700'}>Hepsi</Text>
          </TouchableOpacity>
          {tags.map((tag, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedCategory(tag)}
              className={`px-4 py-2 mr-2 rounded-full border ${
                selectedCategory === tag ? 'bg-pink-600 border-pink-600' : 'bg-white border-gray-300'
              }`}
            >
              <Text className={selectedCategory === tag ? 'text-white' : 'text-gray-700'}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popüler */}
      <View className="mt-4 px-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Popüler 🔥</Text>
        <FlatList
          data={popularPins}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/pin/${item.id}`)}
              className="mr-4"
              style={{ width: 160 }}
            >
              <Image
                source={{ uri: item.image }}
                className="w-full h-40 rounded-xl mb-1"
                resizeMode="cover"
              />
              <Text className="text-sm text-gray-600">{item.category}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Senin İçin */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Senin İçin 💡</Text>
        <FlatList
          data={recommendedPins}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/pin/${item.id}`)}
              className="mr-4"
              style={{ width: 160 }}
            >
              <Image
                source={{ uri: item.image }}
                className="w-full h-40 rounded-xl mb-1"
                resizeMode="cover"
              />
              <Text className="text-sm text-gray-600">{item.category}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Filtrelenmiş içerikler */}
      <View className="flex-1 px-3 mt-6">
        {filteredPins.length > 0 ? (
          <FlatList
            data={filteredPins}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => router.push(`/pin/${item.id}`)}
                style={{
                  width: CARD_WIDTH,
                  marginBottom: 16,
                  marginRight: index % 2 === 0 ? 8 : 0,
                  borderRadius: 16,
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  elevation: 2,
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: '100%',
                    height: 200 + (index % 3) * 40,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                  resizeMode="cover"
                />
                <View style={{ padding: 8 }}>
                  <Text style={{ fontSize: 12, color: '#888' }}>{item.category}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View className="mt-10 items-center">
            <Text className="text-gray-400 mb-2">Sonuç bulunamadı 🕵️</Text>
            <Text className="text-gray-500 text-sm">Farklı bir kategori veya kelime dene.</Text>
          </View>
        )}
      </View>

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
        <TouchableOpacity onPress={() => router.push('/todo')}>
          <Ionicons name="checkmark-circle-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
