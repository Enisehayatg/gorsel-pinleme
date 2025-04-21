import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth / 2 - 20;

const fakePins = [
  { id: '1', title: 'Doğa', image: 'https://picsum.photos/300/420' },
  { id: '2', title: 'Minimal', image: 'https://picsum.photos/300/380' },
  { id: '3', title: 'Sanat', image: 'https://picsum.photos/300/500' },
  { id: '4', title: 'İlham', image: 'https://picsum.photos/300/460' },
  { id: '5', title: 'Dekor', image: 'https://picsum.photos/300/340' },
  { id: '6', title: 'Lezzet', image: 'https://picsum.photos/300/470' },
];

export default function Dashboard() {
  const router = useRouter();
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setPins(fakePins);
      setLoading(false);
    }, 1000);
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
          height: 200 + (index % 3) * 40,
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
          ListHeaderComponent={
            <View className="mx-4 mt-3 mb-2">
              <TextInput
                placeholder="Ara..."
                placeholderTextColor="#A1A1AA"
                value={search}
                onChangeText={setSearch}
                className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-800"
              />
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Alt Menü */}
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white border-t border-gray-200 py-3">
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
        <Ionicons name="home-outline" size={26} color="#e11d48" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/search')}>
        <Ionicons name="search-outline" size={26} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/add')}>
        <Ionicons name="add-circle-outline" size={32} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/saved')}>
        <Ionicons name="bookmark-outline" size={26} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/profile')}>
        <Ionicons name="person-outline" size={26} color="#6b7280" />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
