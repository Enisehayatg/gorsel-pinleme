import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth / 2 - 24;

const pins = [
  {
    id: '1',
    category: 'Sanat',
    title: 'Modern Tablo',
    image: 'https://images.unsplash.com/photo-1581093588401-02d986a04979?auto=format&fit=crop&w=800&q=80',
    description: 'Renkli modern sanat tablosu, soyut bir anlatım tarzıyla oluşturulmuştur.',
  },
  {
    id: '2',
    category: 'Doğa',
    title: 'Orman Yolu',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Sabah sisinde bir orman yolu, huzur verici manzara.',
  },
  {
    id: '3',
    category: 'Yemek',
    title: 'Spagetti Tabağı',
    image: 'https://images.unsplash.com/photo-1604908178060-5f320116553d?auto=format&fit=crop&w=800&q=80',
    description: 'Lezzetli domates soslu spagetti tabağı.',
  },
  {
    id: '4',
    category: 'Dekorasyon',
    title: 'Salon Dizaynı',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Minimal ve şık salon dekorasyon fikri.',
  },
  {
    id: '5',
    category: 'Moda',
    title: 'Sokak Stili',
    image: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=800&q=80',
    description: 'Günlük kombin ve rahat sokak stilinden ilham.',
  },
];

export default function PinDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  const pin = pins.find((p) => p.id === id);
  const recommendedPins = pins.filter((p) => p.id !== id && p.category === pin?.category);

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    setComments([...comments, comment.trim()]);
    setComment('');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Bak bu pini çok beğendim! 📌\n\n${pin?.title} (${pin?.category})\n${pin?.image}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

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
        <Image
          source={{ uri: pin.image }}
          className="w-full h-96"
          resizeMode="cover"
        />

        <View className="px-5 py-4">
          <Text className="text-xl font-bold text-gray-800 mb-1">{pin.title}</Text>
          <Text className="text-sm text-gray-400 mb-2">Kategori: {pin.category}</Text>
          <Text className="text-base text-gray-700 leading-relaxed">
            {pin.description}
          </Text>

          {/* Beğen & Paylaş Butonları */}
          <View className="mt-4 flex-row gap-4">
            <TouchableOpacity
              onPress={() => setLiked(!liked)}
              className="flex-row items-center gap-2"
            >
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#e11d48' : '#6b7280'} />
              <Text className={liked ? 'text-pink-600' : 'text-gray-600'}>{liked ? 'Beğenildi' : 'Beğen'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="flex-row items-center gap-2"
            >
              <Ionicons name="share-social-outline" size={22} color="#6b7280" />
              <Text className="text-gray-600">Paylaş</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Yorumlar */}
        <View className="px-5 mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Yorumlar</Text>
          {comments.length === 0 ? (
            <Text className="text-sm text-gray-400">Henüz yorum yapılmamış.</Text>
          ) : (
            comments.map((c, i) => (
              <View key={i} className="mb-2 bg-gray-100 p-3 rounded-lg">
                <Text className="text-gray-800 text-sm">{c}</Text>
              </View>
            ))
          )}
          <View className="mt-4 flex-row items-center">
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Yorum ekle..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800"
              placeholderTextColor="#A1A1AA"
            />
            <TouchableOpacity onPress={handleCommentSubmit} className="ml-2 px-4 py-2 bg-pink-600 rounded-lg">
              <Text className="text-white text-sm">Gönder</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Önerilenler */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Benzer Pinler</Text>
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
                  className="w-full h-36 rounded-xl mb-2"
                  resizeMode="cover"
                />
                <Text className="text-sm text-gray-600">{item.title}</Text>
              </TouchableOpacity>
            )}
          />
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
