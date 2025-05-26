// Search.tsx (Güncellenmiş versiyon - Pexels API entegrasyonu ile)
import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth / 2 - 24;
const API_KEY = 'jeJCgeHoNppRXxAVPHNCrwUkN5KdN82LwhA8rI8MqhSzB8H1840YqZ90';
const PROFILE_IMAGE_URL = "https://i.pravatar.cc/150?img=10";

const COLORS = {
  primary: '#e11d48',
  secondary: '#9D72FF',
  accent: '#00D2FF',
  accentGreen: '#22c55e',
  dark: '#1f2937',
  bg: '#f9fafb',
  light: '#f3f4f6',
};

const tags = [
  { name: 'Sanat', color: COLORS.primary },
  { name: 'Doğa', color: COLORS.primary },
  { name: 'Yemek', color: COLORS.primary },
  { name: 'Dekorasyon', color: COLORS.primary },
  { name: 'Moda', color: COLORS.primary },
];

const categoryMap: Record<string, string> = {
  'Sanat': 'art',
  'Doğa': 'nature',
  'Yemek': 'food',
  'Dekorasyon': 'home decor',
  'Moda': 'fashion',
};

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('nature');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pins, setPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPins(query);
  }, [query]);

  const fetchPins = async (q: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=30`, {
        headers: {
          Authorization: API_KEY,
        },
      });
      const data = await response.json();
      const mapped = data.photos.map((item: any) => ({
        id: String(item.id),
        title: item.alt || 'Görsel',
        image: item.src?.medium || item.src?.original,
        category: q,
        trending: Math.random() > 0.5
      }));
      setPins(mapped);
    } catch (err) {
      Alert.alert('Hata', 'Veri alınırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );
    blinkLoop.start();
    return () => blinkLoop.stop();
  }, []);

  const handleCategorySelect = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCategory(category);
    const translated = categoryMap[category] || category;
    setQuery(translated);
  };

  const trendingPins = pins.filter(pin => pin.trending);

  return (
    <SafeAreaView className="flex-1 mb-5 bg-white">
 <View className="px-4 pt-6 pb-4 bg-white border-b border-gray-200 shadow-sm">
  {/* Üst satır: Başlık ve Profil */}
  <View className="flex-row justify-between items-center mb-3">
    <Animated.View style={{ transform: [{ translateX: headerAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }] }}>
      <Text className="text-2xl font-bold text-gray-800">
        Keşf
        <Animated.Text style={{ opacity: blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }}>
          e
        </Animated.Text>
        t
      </Text>
      <Text className="text-sm text-gray-500 mt-1">İlham verici fikirleri keşfet</Text>
    </Animated.View>

    <TouchableOpacity
      onPress={() => router.replace('/(dashboard)/profile')}
      className="w-10 h-10 rounded-full overflow-hidden border border-gray-300"
    >
      <Image source={{ uri: PROFILE_IMAGE_URL }} className="w-full h-full" resizeMode="cover" />
    </TouchableOpacity>
  </View>

  {/* Arama kutusu */}
  <View className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full">
    <Ionicons name="search-outline" size={20} color="#6b7280" />
    <TextInput
      placeholder="Sanat, moda, dekorasyon..."
      value={query}
      onChangeText={setQuery}
      className="ml-2 flex-1 text-base text-gray-800"
      placeholderTextColor="#9ca3af"
    />
  </View>
</View>


<View className="mt-3 mb-3">
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
      paddingHorizontal: 12,
      alignItems: 'center',
      paddingVertical: 6
    }}
    style={{ maxHeight: 50 }}
  >
    {tags.map((tag, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => handleCategorySelect(tag.name)}
        className="mr-2 px-4 py-2 rounded-full"
        style={{
          backgroundColor: selectedCategory === tag.name ? tag.color : COLORS.light,
          minHeight: 40,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: selectedCategory === tag.name ? 'white' : COLORS.dark,
            fontWeight: '600',
            fontSize: 14
          }}
        >
          {tag.name}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>


      <FlatList
        data={pins}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => router.push(`/pin/${item.id}`)}
            style={{
              width: CARD_WIDTH,
              marginBottom: 16,
              marginLeft: index % 2 === 0 ? 8 : 4,
              marginRight: index % 2 === 0 ? 4 : 8,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: '#fff',
              elevation: 3,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: '100%',
                height: 160 + (index % 4) * 30,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : (
            <View className="mt-10 items-center">
              <Text className="text-gray-400 mb-2">Sonuç bulunamadı 🕵️</Text>
              <Text className="text-gray-500 text-sm">Farklı bir kategori veya kelime dene.</Text>
            </View>
          )
        }
      />

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