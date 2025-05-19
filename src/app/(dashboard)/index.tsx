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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addImageToTodo } from '@/utils/todoStorage';
import { savePin, isPinSaved, removePin } from '@/utils/savedStorage';

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
  const [pressedCardId, setPressedCardId] = useState<string | null>(null);
  const [savedPinIds, setSavedPinIds] = useState<string[]>([]);

  // Load pins and check which ones are saved
  useEffect(() => {
    const loadData = async () => {
      setTimeout(() => {
        setPins(fakePins);
        setLoading(false);
      }, 1000);
      
      // Check which pins are saved
      loadSavedPinIds();
    };
    
    loadData();
  }, []);

  const loadSavedPinIds = useCallback(async () => {
    try {
      const savedIds: string[] = [];
      
      for (const pin of fakePins) {
        const isSaved = await isPinSaved(pin.id);
        if (isSaved) {
          savedIds.push(pin.id);
        }
      }
      
      setSavedPinIds(savedIds);
    } catch (e) {
      console.error("Error checking saved pins:", e);
    }
  }, []);

  const handleAddToTodo = async (image: string, title: string) => {
    try {
      await addImageToTodo(image, title);
      Alert.alert('Başarılı', 'Görsel, görev listenize eklendi.');
      // Görseli ekledikten sonra todo sayfasına yönlendirme
      router.push('/todo');
    } catch (e) {
      Alert.alert('Hata', 'Görseli eklerken bir hata oluştu.');
    }
  };

  const handleSavePin = async (item: any) => {
    try {
      const isSaved = savedPinIds.includes(item.id);
      
      if (isSaved) {
        // Remove from saved
        const removed = await removePin(item.id);
        if (removed) {
          setSavedPinIds(savedPinIds.filter(id => id !== item.id));
          Alert.alert('Bilgi', 'Görsel kaydedilenlerden çıkarıldı.');
        }
      } else {
        // Add to saved
        const added = await savePin({
          id: item.id,
          title: item.title,
          image: item.image
        });
        
        if (added) {
          setSavedPinIds([...savedPinIds, item.id]);
          Alert.alert('Başarılı', 'Görsel kaydedildi!');
        }
      }
    } catch (e) {
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
    }
  };

  const toggleCardPress = (id: string) => {
    if (pressedCardId === id) {
      setPressedCardId(null);
    } else {
      setPressedCardId(id);
    }
  };

  const renderItem = ({ item, index }: any) => {
    const isPressed = pressedCardId === item.id;
    const isSaved = savedPinIds.includes(item.id);
    
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
          style={{ position: 'relative' }}
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
          
          {isPressed && (
            <View className="absolute inset-0 bg-black/50 flex justify-center items-center">
              <View className="flex-row justify-around items-center w-full px-4">
                <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center">
                  <Ionicons name="heart-outline" size={24} color="#6b7280" />
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
                
                <TouchableOpacity 
                  className="w-12 h-12 bg-white rounded-full items-center justify-center"
                  onPress={() => handleAddToTodo(item.image, item.title)}
                >
                  <Ionicons name="checkmark-circle-outline" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Pressable>
        
        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: '600', color: '#333' }}>{item.title}</Text>
        </View>
      </View>
    );
  };

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
              <View className="flex-row items-center">
                <TextInput
                  placeholder="Ara..."
                  placeholderTextColor="#A1A1AA"
                  value={search}
                  onChangeText={setSearch}
                  className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-800 flex-1 mr-3"
                />
                <TouchableOpacity 
                  onPress={() => router.replace('/(dashboard)/profile')}
                  className="w-10 h-10 rounded-full justify-center items-center border border-gray-200"
                >
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=10' }}
                    className="w-9 h-9 rounded-full"
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Alt Menü */}
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
