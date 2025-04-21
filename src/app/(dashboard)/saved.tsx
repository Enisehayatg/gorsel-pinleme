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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth / 2 - 20;

const savedPins = [
  { id: '101', title: 'Modern Tasarım', image: 'https://picsum.photos/300/410' },
  { id: '102', title: 'Yaratıcı Fikir', image: 'https://picsum.photos/300/450' },
  { id: '103', title: 'Soft Tonlar', image: 'https://picsum.photos/300/400' },
];

export default function Saved() {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setPins(savedPins);
      setLoading(false);
    }, 800);
  }, []);

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() => router.push(`/pin/${item.id}`)}
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
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: '600', color: '#333' }}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 mb-5 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-pink-600">📌 Kaydedilenler</Text>
      </View>

      {/* İçerik */}
      <View className="flex-1 px-3 mt-2">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#e11d48" />
          </View>
        ) : (
          <FlatList
            data={pins}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>

      {/* Footer */}
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
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/profile')}>
          <Ionicons name="person-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
