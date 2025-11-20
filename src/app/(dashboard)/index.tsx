import React, { useEffect, useState, useCallback } from 'react';
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
  Alert,
  Pressable,
  RefreshControl,
  Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addImageToTodo, getTodos, saveTodos } from '@/utils/todoStorage';
import { savePin, isPinSaved, removePin } from '@/utils/savedStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUploadedPins, deleteUploadedPin } from '@/utils/uploadedStorage';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth / 2 - 20;
const API_KEY = 'jeJCgeHoNppRXxAVPHNCrwUkN5KdN82LwhA8rI8MqhSzB8H1840YqZ90';
const PROFILE_IMAGE_URL = "https://i.pravatar.cc/150?img=10";

export default function Dashboard() {
  const router = useRouter();
  const { fromTodo, todoId } = useLocalSearchParams<{ fromTodo: string, todoId: string }>();
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [pressedCardId, setPressedCardId] = useState<string | null>(null);
  const [savedPinIds, setSavedPinIds] = useState<string[]>([]);
  const [likedPins, setLikedPins] = useState<string[]>([]);

  useEffect(() => {
    loadAllPins();
    loadLikedPins();
  }, []);

  const loadAllPins = async () => {
    setLoading(true);
    try {
      const uploadedPins = await getUploadedPins();
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${search || 'nature'}&per_page=30&page=${randomPage}`,
        {
          headers: { Authorization: API_KEY },
        }
      );

      const data = await response.json();
      const pexelsPins = data.photos.map((item: any) => ({
        id: String(item.id),
        title: item.alt || 'Görsel',
        image: item.src?.medium || item.src?.original,
        category: 'pexels',
        isUploaded: false
      }));

      const allPins = [...uploadedPins, ...pexelsPins];
      setPins(allPins);
      loadSavedPinIds(allPins);
    } catch (e) {
      console.error('Pin yükleme hatası:', e);
      Alert.alert('Hata', 'Pinler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllPins();
    setRefreshing(false);
  };

  const loadSavedPinIds = useCallback(async (pinList: any[]) => {
    try {
      const savedIds: string[] = [];
      for (const pin of pinList) {
        const isSaved = await isPinSaved(pin.id);
        if (isSaved) savedIds.push(pin.id);
      }
      setSavedPinIds(savedIds);
    } catch (e) {
      console.error('Kayıtlı görseller kontrol edilirken hata:', e);
    }
  }, []);

  const loadLikedPins = async () => {
    try {
      const storedLikedPins = await AsyncStorage.getItem('likedPins');
      if (storedLikedPins) {
        setLikedPins(JSON.parse(storedLikedPins));
      }
    } catch (error) {
      console.error('Error loading liked pins:', error);
    }
  };

  const handleLike = async (pin: any) => {
    try {
      const newLikedPins = [...likedPins];
      const pinIndex = newLikedPins.indexOf(pin.id);
      
      if (pinIndex === -1) {
        newLikedPins.push(pin.id);
        const storedPins = await AsyncStorage.getItem('likedPinsData') || '{}';
        const parsedPins = JSON.parse(storedPins);
        parsedPins[pin.id] = pin;
        await AsyncStorage.setItem('likedPinsData', JSON.stringify(parsedPins));
      } else {
        newLikedPins.splice(pinIndex, 1);
        const storedPins = await AsyncStorage.getItem('likedPinsData') || '{}';
        const parsedPins = JSON.parse(storedPins);
        delete parsedPins[pin.id];
        await AsyncStorage.setItem('likedPinsData', JSON.stringify(parsedPins));
      }
      
      await AsyncStorage.setItem('likedPins', JSON.stringify(newLikedPins));
      setLikedPins(newLikedPins);
    } catch (error) {
      console.error('Error handling like:', error);
      Alert.alert('Hata', 'Beğeni işlemi sırasında bir hata oluştu.');
    }
  };

  const handleAddToTodo = async (image: string, title: string) => {
    try {
      if (fromTodo === 'true' && todoId) {
        const todos = await getTodos();
        const updated = todos.map((todo) =>
          todo.id === todoId ? { ...todo, imageUri: image } : todo
        );
        await saveTodos(updated);
        Alert.alert('Başarılı', 'Görsel, göreve eklendi.');
        router.push('/todo');
      } else {
        await addImageToTodo(image, title);
        Alert.alert('Başarılı', 'Görsel eklendi.');
        router.push('/todo');
      }
    } catch (e) {
      Alert.alert('Hata', 'Görsel eklenirken hata oluştu.');
    }
  };

  const handleSavePin = async (item: any) => {
    try {
      const isSaved = savedPinIds.includes(item.id);

      if (isSaved) {
        const removed = await removePin(item.id);
        if (removed) {
          setSavedPinIds(savedPinIds.filter(id => id !== item.id));
          Alert.alert('Bilgi', 'Görsel kayıttan silindi.');
        }
      } else {
        const added = await savePin(item);
        if (added) {
          setSavedPinIds([...savedPinIds, item.id]);
          Alert.alert('Başarılı', 'Görsel kaydedildi!');
        }
      }
    } catch (e) {
      Alert.alert('Hata', 'Kayıt işlemi başarısız.');
    }
  };

  const handleDeletePin = async (pinId: string) => {
    try {
      const success = await deleteUploadedPin(pinId);
      if (success) {
        Alert.alert('Başarılı', 'Pin başarıyla silindi.');
        loadAllPins();
      } else {
        Alert.alert('Hata', 'Pin silinirken bir hata oluştu.');
      }
    } catch (e) {
      console.error('Pin silme hatası:', e);
      Alert.alert('Hata', 'Pin silinirken bir hata oluştu.');
    }
  };

  const toggleCardPress = (id: string) => {
    setPressedCardId(prev => (prev === id ? null : id));
  };

  const renderItem = ({ item, index }: any) => {
    const isPressed = pressedCardId === item.id;
    const isSaved = savedPinIds.includes(item.id);
    const isLiked = likedPins.includes(item.id);

    return (
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
        <Pressable
          onPress={() => toggleCardPress(item.id)}
          onLongPress={() => router.push(`/pin/${item.id}`)}
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

          {item.isUploaded && (
            <View style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}>
              <Text style={{ color: '#e11d48', fontSize: 12, fontWeight: '600' }}>
                {item.category}
              </Text>
            </View>
          )}

          {isPressed && (
            <View className="absolute inset-0 bg-black/50 flex justify-center items-center">
              <View className="flex-row justify-around items-center w-full px-4">
                <TouchableOpacity 
                  className="w-12 h-12 bg-white rounded-full items-center justify-center"
                  onPress={() => handleLike(item)}
                >
                  <Ionicons 
                    name={isLiked ? "heart" : "heart-outline"} 
                    size={24} 
                    color={isLiked ? "#e11d48" : "#6b7280"} 
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-12 h-12 bg-white rounded-full items-center justify-center"
                  onPress={() => handleSavePin(item)}
                >
                  <Ionicons
                    name={isSaved ? "bookmark" : "bookmark-outline"}
                    size={24}
                    color={isSaved ? "#e11d48" : "#6b7280"}
                  />
                </TouchableOpacity>

                {item.isUploaded ? (
                  <TouchableOpacity
                    className="w-12 h-12 bg-white rounded-full items-center justify-center"
                    onPress={() => {
                      Alert.alert(
                        'Pini Sil',
                        'Bu pini silmek istediğinizden emin misiniz?',
                        [
                          { text: 'İptal', style: 'cancel' },
                          { text: 'Sil', style: 'destructive', onPress: () => handleDeletePin(item.id) }
                        ]
                      );
                    }}
                  >
                    <Ionicons name="trash-outline" size={24} color="#ef4444" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="w-12 h-12 bg-white rounded-full items-center justify-center"
                    onPress={() => handleAddToTodo(item.image, item.title)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={24} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 mb-5 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold text-pink-600"></Text>
        <TouchableOpacity
          onPress={() => router.replace('/(dashboard)/profile')}
          className="w-10 h-10 rounded-full overflow-hidden"
        >
          <Image source={{ uri: PROFILE_IMAGE_URL }} className="w-full h-full" resizeMode="cover" />
        </TouchableOpacity>
      </View>

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
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListHeaderComponent={
            <View>
              
              <View className="mx-4 mt-3 mb-2">
                <TextInput
  placeholder="Ara..."
  placeholderTextColor="#A1A1AA"
  value={search}
  onChangeText={(text) => setSearch(text)} 
  onSubmitEditing={() => {
    Keyboard.dismiss();    
    loadAllPins();          
  }}
  returnKeyType="search"
  className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-800"
/>

              </View>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white border-t border-gray-200 py-3">
        <TouchableOpacity onPress={() => router.push('/(dashboard)')}>
          <Ionicons name="home-outline" size={26} color="#e11d48" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/search')}>
          <Ionicons name="search-outline" size={26} color="#6b7280" />
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
