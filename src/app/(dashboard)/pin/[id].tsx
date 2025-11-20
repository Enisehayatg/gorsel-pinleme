// pin/[id].tsx - Pexels API'den veri alan Pin Detay Sayfası
import React, { useEffect, useState } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = 'jeJCgeHoNppRXxAVPHNCrwUkN5KdN82LwhA8rI8MqhSzB8H1840YqZ90';

export default function PinDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [pin, setPin] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPinById(id);
  }, [id]);

  const fetchPinById = async (pinId: string | string[]) => {
    try {
      setLoading(true);
      const searchResponse = await fetch(`https://api.pexels.com/v1/photos/${pinId}`, {
        headers: { Authorization: API_KEY },
      });

      if (!searchResponse.ok) {
        throw new Error('Pin bulunamadı');
      }

      const pinData = await searchResponse.json();
      setPin(pinData);

      const recommendedRes = await fetch('https://api.pexels.com/v1/curated?per_page=10', {
        headers: { Authorization: API_KEY },
      });
      const recommendedData = await recommendedRes.json();
      setRecommended(recommendedData.photos);
    } catch (e) {
      console.error('Hata:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    setComments([...comments, comment.trim()]);
    setComment('');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Bak bu pini çok beğendim! \n\n${pin?.alt} \n${pin?.url}`,
      });
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
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
          source={{ uri: pin.src.original }}
          className="w-full h-96"
          resizeMode="cover"
        />

        <View className="px-5 py-4">
          <Text className="text-xl font-bold text-gray-800 mb-1">{pin.alt || 'Görsel'}</Text>
          <Text className="text-sm text-gray-400 mb-2">Fotoğraflayan: {pin.photographer}</Text>

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

        <View className="px-5 mt-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Benzer Pinler</Text>
          <FlatList
            data={recommended}
            horizontal
            keyExtractor={(item) => String(item.id)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/pin/${item.id}`)}
                className="mr-4"
                style={{ width: 160 }}
              >
                <Image
                  source={{ uri: item.src.medium }}
                  className="w-full h-36 rounded-xl mb-2"
                  resizeMode="cover"
                />
                <Text className="text-sm text-gray-600">{item.alt || 'Görsel'}</Text>
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
