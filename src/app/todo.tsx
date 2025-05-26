import { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, Animated, Image, StyleSheet, ScrollView, Modal, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { TodoItem, getTodos, saveTodos } from '@/utils/todoStorage';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_HEIGHT = 160; // Sabit image yüksekliği

// Profil fotoğrafı için URL
const PROFILE_IMAGE_URL = "https://i.pravatar.cc/150?img=10";

interface DayType {
  date: Date;
  day: number;
  month: number;
  year: number;
  isToday: boolean;
}

export default function TodoScreen() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const swipeableRefs = useRef<Swipeable[]>([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const bottomSheetAnimation = useRef(new Animated.Value(0)).current;
  
  // Düzenleme modu için
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  
  // Takvim için state'ler
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<DayType[]>([]);
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const dayNames = ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cts"];
  
  // Takvim hesaplamaları - hafta görünümü için
  useEffect(() => {
    generateWeekDays(selectedDate);
  }, [selectedDate]);
  
  // Mevcut hafta için günleri oluşturur
  const generateWeekDays = (baseDate: Date) => {
    const days: DayType[] = [];
    const today = new Date();
    
    // Bugünün gününden 3 gün öncesini başlangıç olarak alıyoruz
    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() - 3);
    
    // Toplam 7 gün gösteriyoruz
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      days.push({
        date: currentDate,
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isToday: isSameDay(currentDate, today)
      });
    }
    
    setWeekDays(days);
  };
  
  // İki tarihin aynı gün olup olmadığını kontrol et
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };
  
  // Önceki ve sonraki gün grupları arasında geçiş
  const goToPreviousWeek = () => {
    const previousWeek = new Date(selectedDate);
    previousWeek.setDate(previousWeek.getDate() - 7);
    setSelectedDate(previousWeek);
  };
  
  const goToNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(nextWeek);
  };
  
  // Gün seçme
  const selectDay = (day: DayType) => {
    setSelectedDate(day.date);
    loadTodos();
  };

  // Load todos from AsyncStorage on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos();
      setTodos(loadedTodos);
    } catch (e) {
      Alert.alert('Hata', 'Görevler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Save todos whenever they change
  const updateTodos = async (updatedTodos: TodoItem[]) => {
    try {
      await saveTodos(updatedTodos);
      setTodos(updatedTodos);
    } catch (e) {
      Alert.alert('Hata', 'Görevler kaydedilirken bir hata oluştu.');
    }
  };

  // Görev düzenleme modunu başlat
  const startEditing = (todo: TodoItem) => {
    setIsEditing(true);
    setEditingTodoId(todo.id);
    setEditingText(todo.text);
  };

  // Görev düzenlemesini kaydet
  const saveEditing = () => {
    if (editingText.trim() === '') {
      Alert.alert('Uyarı', 'Görev açıklaması boş olamaz.');
      return;
    }

    const updatedTodos = todos.map((todo) =>
      todo.id === editingTodoId ? { ...todo, text: editingText } : todo
    );
    
    updateTodos(updatedTodos);
    setIsEditing(false);
    setEditingTodoId(null);
    setEditingText('');
  };

  // Görev düzenleme modunu iptal et
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingTodoId(null);
    setEditingText('');
  };

  // Show image selection modal
  const showImageSelectionModal = (id: string) => {
    setSelectedTodoId(id);
    setImageModalVisible(true);
    Animated.timing(bottomSheetAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  // Hide image selection modal
  const hideImageSelectionModal = () => {
    Animated.timing(bottomSheetAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setImageModalVisible(false);
      setSelectedTodoId(null);
    });
  };

  // Pick an image from the device's gallery
  const pickFromGallery = async () => {
    if (!selectedTodoId) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9], // 16:9 aspect ratio for consistency
        quality: 0.8,
      });
  
      if (!result.canceled) {
        // Görevi bulup image'ı güncelle
        const updatedTodos = todos.map((todo) =>
          todo.id === selectedTodoId ? { ...todo, imageUri: result.assets[0].uri } : todo
        );
        updateTodos(updatedTodos);
        hideImageSelectionModal();
      }
    } catch (e) {
      Alert.alert('Hata', 'Görsel seçilirken bir hata oluştu.');
    }
  };

  // Take a photo with the camera
  const takePhoto = async () => {
    if (!selectedTodoId) return;
    
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.granted) {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [16, 9], // 16:9 aspect ratio for consistency
          quality: 0.8,
        });
    
        if (!result.canceled) {
          // Görevi bulup image'ı güncelle
          const updatedTodos = todos.map((todo) =>
            todo.id === selectedTodoId ? { ...todo, imageUri: result.assets[0].uri } : todo
          );
          updateTodos(updatedTodos);
          hideImageSelectionModal();
        }
      } else {
        Alert.alert('İzin Gerekli', 'Kamera erişimi için izin gerekiyor.');
      }
    } catch (e) {
      Alert.alert('Hata', 'Kamera kullanılırken bir hata oluştu.');
    }
  };

  // Navigate to dashboard to select an image
  const selectFromDashboard = () => {
    if (!selectedTodoId) return;
    
    hideImageSelectionModal();
    router.push({
      pathname: '/(dashboard)',
      params: { fromTodo: 'true', todoId: selectedTodoId }
    });
  };

  // Pick an image for todo - shows modal now
  const pickImageForTodo = (id: string) => {
    showImageSelectionModal(id);
  };

  const addTodo = () => {
    if (inputText.trim() !== '') {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
        date: selectedDate.toISOString() // Seçili tarihi todo'ya ekliyoruz
      };
      const updatedTodos = [...todos, newTodo];
      updateTodos(updatedTodos);
      setInputText('');
    }
  };

  const toggleTodoComplete = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    updateTodos(updatedTodos);
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Görevi Sil',
      'Bu görevi kalıcı olarak silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          onPress: () => {
            const updatedTodos = todos.filter((todo) => todo.id !== id);
            updateTodos(updatedTodos);
          },
          style: 'destructive'
        }
      ]
    );
  };

  const closeAllOpenSwipeables = (indexToKeepOpen?: number) => {
    swipeableRefs.current?.forEach((ref, i) => {
      if (ref && typeof indexToKeepOpen === 'number' && i !== indexToKeepOpen) {
        ref.close();
      }
    });
  };

  const SwipeButtons = ({id}: {id: string}) => {
    const todo = todos.find(t => t.id === id);
    return (
      <View style={{ flexDirection: 'row', width: 240 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#10b981', // Yeşil
            justifyContent: 'center',
            alignItems: 'center',
            width: 80,
            height: '100%'
          }}
          onPress={() => todo && startEditing(todo)}
        >
          <Ionicons name="pencil" size={24} color="white" />
          <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 4, fontSize: 12 }}>DÜZENLE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#60a5fa', // Mavi
            justifyContent: 'center',
            alignItems: 'center',
            width: 80,
            height: '100%'
          }}
          onPress={() => pickImageForTodo(id)}
        >
          <Ionicons name="images-outline" size={24} color="white" />
          <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 4, fontSize: 12 }}>GÖRSEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#ef4444', // Kırmızı
            justifyContent: 'center',
            alignItems: 'center',
            width: 80,
            height: '100%'
          }}
          onPress={() => confirmDelete(id)}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
          <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 4, fontSize: 12 }}>SİL</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRightActions = (id: string) => {
    return <SwipeButtons id={id} />;
  };
  
  // Seçili tarihe göre todoları filtreleme
  const filteredTodos = todos.filter(todo => {
    // Eğer todo.date varsa ve seçili güne aitse göster
    if (todo.date) {
      const todoDate = new Date(todo.date);
      return isSameDay(todoDate, selectedDate);
    }
    // Tarihi olmayan görevleri gösterme
    return false;
  });

  const renderTodoItem = ({ item, index }: { item: TodoItem; index: number }) => (
    <Swipeable
      ref={(ref) => {
        if (ref && swipeableRefs.current) {
          swipeableRefs.current[index] = ref;
        }
      }}
      friction={1.5}
      overshootRight={false}
      renderRightActions={() => renderRightActions(item.id)}
      onSwipeableOpen={() => closeAllOpenSwipeables(index)}
      rightThreshold={40}
    >
      <View className="flex-row items-center p-4 bg-white rounded-lg mb-2 shadow-sm">
        {/* Sol taraf - Görev ve işaretleme */}
        <TouchableOpacity
          onPress={() => toggleTodoComplete(item.id)}
          activeOpacity={0.7}
          className="flex-row flex-1 items-center"
        >
          <View className={`w-6 h-6 rounded-full mr-3 border ${item.completed ? 'bg-pink-600 border-pink-600' : 'bg-white border-gray-300'} justify-center items-center`}>
            {item.completed && <Text className="text-white font-bold">✓</Text>}
          </View>
          <View className="flex-1">
            <Text className={`text-lg ${item.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
              {item.text}
            </Text>
            {item.imageUri && (
              <View className="mt-2 rounded-lg overflow-hidden">
                <Image
                  source={{ uri: item.imageUri }}
                  style={{
                    width: '100%', 
                    height: IMAGE_HEIGHT,
                    borderRadius: 8
                  }}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView className="flex-1 mb-5 bg-white">
      <StatusBar style="auto" />
      
      {/* Header with profile link in top right */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold text-pink-600">Görevler</Text>
        <TouchableOpacity 
          onPress={() => router.replace('/(dashboard)/profile')}
          className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
        >
          <Image
            source={{ uri: PROFILE_IMAGE_URL }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        </TouchableOpacity>
      </View>
      
      {/* Yatay çizgi halinde takvim */}
      <View style={styles.calendarContainer}>
        {/* Ay ve yıl gösterimi */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={goToPreviousWeek}>
            <Ionicons name="chevron-back" size={24} color="#4b5563" />
          </TouchableOpacity>
          
          <Text style={styles.monthYearText}>
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          
          <TouchableOpacity onPress={goToNextWeek}>
            <Ionicons name="chevron-forward" size={24} color="#4b5563" />
          </TouchableOpacity>
        </View>
        
        {/* Günlerin yatay listesi */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysScrollContainer}
        >
          {weekDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayItem,
                isSameDay(day.date, selectedDate) && styles.selectedDayItem
              ]}
              onPress={() => selectDay(day)}
            >
              <Text style={[
                styles.dayName,
                isSameDay(day.date, selectedDate) && styles.selectedDayText
              ]}>
                {dayNames[day.date.getDay()]}
              </Text>
              <View style={[
                styles.dayNumber,
                day.isToday && styles.todayCircle,
                isSameDay(day.date, selectedDate) && styles.selectedDayCircle
              ]}>
                <Text style={[
                  styles.dayNumberText,
                  day.isToday && styles.todayText,
                  isSameDay(day.date, selectedDate) && styles.selectedDayText
                ]}>
                  {day.day}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Seçili tarih ve görevler başlığı */}
      <View className="px-4 py-2 border-b border-gray-200">
        <Text className="text-xl font-bold text-pink-600">
          {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()} Görevleri
        </Text>
      </View>
      
      {!loading && (
        <View className="px-5 pt-2">
          <Text className="text-gray-500 text-sm">👈 Sola kaydırarak görev üzerinde işlem yapabilirsiniz</Text>
        </View>
      )}
      
      <View className="p-5 flex-1">
        <View className="mb-5">
          <View className="flex-row">
            <TextInput
              className="flex-1 h-12 px-4 bg-gray-100 rounded-l-lg border border-gray-200 text-gray-800"
              placeholder={`${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} için yeni görev ekle...`}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={addTodo}
            />
            <TouchableOpacity 
              className="h-12 px-6 bg-pink-600 rounded-r-lg justify-center" 
              onPress={addTodo}
            >
              <Text className="text-white font-bold">Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#e11d48" />
          </View>
        ) : (
          <FlatList
            data={filteredTodos}
            renderItem={renderTodoItem}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerClassName="pb-24"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="justify-center items-center py-10">
                <Ionicons name="calendar-outline" size={60} color="#e2e8f0" />
                <Text className="text-gray-500 text-lg mt-3">Bu tarih için görev eklenmedi</Text>
                <Text className="text-gray-400 mt-2">Yeni görev eklemek için yukarıdaki kutuyu kullanın</Text>
              </View>
            }
          />
        )}
      </View>
      
      {/* Edit Task Modal */}
      <Modal
        transparent={true}
        visible={isEditing}
        animationType="fade"
        onRequestClose={cancelEditing}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white w-full rounded-xl p-5">
            <Text className="text-lg font-bold text-gray-800 mb-3">Görevi Düzenle</Text>
            
            <TextInput
              className="bg-gray-100 rounded-lg p-3 mb-4"
              value={editingText}
              onChangeText={setEditingText}
              multiline
            />
            
            <View className="flex-row justify-end">
              <TouchableOpacity 
                className="bg-gray-200 px-4 py-2 rounded-lg mr-2"
                onPress={cancelEditing}
              >
                <Text className="font-medium">İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-green-500 px-4 py-2 rounded-lg"
                onPress={saveEditing}
              >
                <Text className="font-medium text-white">Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Selection Modal */}
      <Modal
        transparent={true}
        visible={imageModalVisible}
        animationType="none"
        onRequestClose={hideImageSelectionModal}
      >
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1} 
          onPress={hideImageSelectionModal}
        >
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              transform: [{
                translateY: bottomSheetAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0]
                })
              }]
            }}
          >
            <View className="items-center mb-6">
              <View className="w-16 h-1 bg-gray-300 rounded-full mb-4" />
              <Text className="text-xl font-bold text-gray-800">Görsel Ekle</Text>
            </View>
            
            <TouchableOpacity 
              className="flex-row items-center p-4 mb-3 bg-gray-100 rounded-xl"
              onPress={pickFromGallery}
            >
              <View className="h-12 w-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="images-outline" size={24} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-lg font-medium text-gray-800">Galeriden Seç</Text>
                <Text className="text-gray-500 text-sm">Cihazınızdaki görsellerden seçin</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center p-4 mb-3 bg-gray-100 rounded-xl"
              onPress={takePhoto}
            >
              <View className="h-12 w-12 bg-green-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="camera-outline" size={24} color="#22c55e" />
              </View>
              <View>
                <Text className="text-lg font-medium text-gray-800">Kamera ile Çek</Text>
                <Text className="text-gray-500 text-sm">Yeni bir fotoğraf çekin</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center p-4 mb-6 bg-gray-100 rounded-xl"
              onPress={selectFromDashboard}
            >
              <View className="h-12 w-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="grid-outline" size={24} color="#8b5cf6" />
              </View>
              <View>
                <Text className="text-lg font-medium text-gray-800">Dashboard'dan Seç</Text>
                <Text className="text-gray-500 text-sm">Uygulama içindeki görsellerden seçin</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-full py-4 bg-pink-600 rounded-xl items-center"
              onPress={hideImageSelectionModal}
            >
              <Text className="text-white font-bold text-lg">KAPAT</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

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
          <Ionicons name="bookmark-outline" size={26} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/todo')}>
          <Ionicons name="checkmark-circle-outline" size={26} color="#e11d48" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  daysScrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  dayItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 8,
  },
  selectedDayItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#db2777',
  },
  dayName: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  dayNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  todayCircle: {
    borderWidth: 1,
    borderColor: '#e11d48',
  },
  todayText: {
    color: '#e11d48',
  },
  selectedDayCircle: {
    backgroundColor: '#fce7f3',
  },
  selectedDayText: {
    color: '#db2777',
    fontWeight: 'bold',
  },
}); 