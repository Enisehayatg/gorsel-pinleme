import { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, Animated, Image, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { TodoItem, getTodos, saveTodos } from '@/utils/todoStorage';

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

  // Pick an image from the device's gallery
  const pickImageForTodo = async (id: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
  
      if (!result.canceled) {
        // Görevi bulup image'ı güncelle
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, imageUri: result.assets[0].uri } : todo
        );
        updateTodos(updatedTodos);
      }
    } catch (e) {
      Alert.alert('Hata', 'Görsel seçilirken bir hata oluştu.');
    }
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

  const SwipeButtons = ({id}: {id: string}) => (
    <View style={{ flexDirection: 'row', width: 160 }}>
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
        <Ionicons name="image-outline" size={24} color="white" />
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
                  className="w-full h-32 rounded-lg"
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
            contentContainerStyle={{ paddingBottom: 80 }}
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
        <TouchableOpacity>
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