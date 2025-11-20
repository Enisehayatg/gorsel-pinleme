import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { saveUploadedPin } from '@/utils/uploadedStorage'; 
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');

const PROFILE_IMAGE_URL = "https://i.pravatar.cc/150?img=10";

export default function Add() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories = ['Sanat', 'Doğa', 'Yemek', 'Dekorasyon', 'Moda', 'Teknoloji', 'Spor'];

  const openImagePicker = () => setImageModalVisible(true);

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        setImageModalVisible(false);
      }
    } catch (error) {
      console.error('Galeri hatası:', error);
      Alert.alert('Hata', 'Görsel seçilirken bir hata oluştu.');
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      // 1. Kamera iznini kontrol et
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Kamera izni vermeniz gerekiyor.');
        return;
      }

      // 2. Fotoğraf çek
      console.log('Kamera açılıyor...');
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Kamera sonucu:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        console.log('Çekilen fotoğraf URI:', photoUri);

        // 3. Fotoğrafı state'e kaydet
        setImage(photoUri);
        setImageModalVisible(false);

        // 4. Kullanıcıya bilgi ver
        Alert.alert('Başarılı', 'Fotoğraf başarıyla çekildi. Şimdi başlık ve kategori seçebilirsiniz.');
      }
    } catch (error) {
      console.error('Kamera hatası:', error);
      Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.');
    }
  };

  const handleCategorySelect = (selectedCategory: string) => {
    console.log('Seçilen kategori:', selectedCategory);
    setCategory(selectedCategory);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir başlık girin!');
      return;
    }
    if (!image) {
      Alert.alert('Uyarı', 'Lütfen bir görsel seçin!');
      return;
    }
    if (!category) {
      Alert.alert('Uyarı', 'Lütfen bir kategori seçin!');
      return;
    }

    setLoading(true);

    try {
      // Yeni pin objesi oluştur
      const newPin = {
        id: Date.now().toString(),
        title: title.trim(),
        image: image,
        category: category,
        createdAt: new Date().toISOString(),
        isUploaded: true
      };

      console.log('Kaydedilecek pin:', newPin);

      // Pin'i kaydet
      const success = await saveUploadedPin(newPin);
      
      if (success) {
        Alert.alert(
          'Başarılı',
          'Pin başarıyla kaydedildi!',
          [
            {
              text: 'Tamam',
              onPress: () => {
                // Formu temizle
                setTitle('');
                setImage(null);
                setCategory('');
                // Pin detay sayfasına yönlendir
                router.replace(`/pin/uploaded/${newPin.id}`);
              },
            },
          ]
        );
      } else {
        Alert.alert('Hata', 'Pin kaydedilirken bir hata oluştu.');
      }
    } catch (e) {
      console.error('Pin kaydedilirken hata:', e);
      Alert.alert('Hata', 'Pin kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 mb-5 bg-white">
      <View className="px-4 py-6 border-b border-gray-200 bg-gradient-to-r from-pink-500 to-purple-500 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold text-white">✨ Pin Yükle</Text>
          <Text className="text-white text-sm mt-1 opacity-80">Çarpıcı görsellerinizi paylaşın</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.replace('/(dashboard)/profile')}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white"
        >
          <Image source={{ uri: PROFILE_IMAGE_URL }} className="w-full h-full" resizeMode="cover" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView className="px-4 py-6">
          {/* Görsel seçimi */}
          <TouchableOpacity
            onPress={openImagePicker}
            className="bg-gray-100 rounded-2xl h-64 items-center justify-center mb-6 overflow-hidden"
            style={styles.imageContainer}
          >
            {image ? (
              <View style={[styles.imageWrapper, { width: '100%', height: '100%' }]}>
                <Image 
                  source={{ uri: image }} 
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: 4,
                }}>
                  <Text style={{ color: 'white', fontSize: 10 }} numberOfLines={1}>
                    URI: {image}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={openImagePicker}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 20,
                    padding: 8,
                  }}
                >
                  <Ionicons name="camera" size={24} color="#e11d48" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center">
                <Ionicons name="image-outline" size={64} color="#e11d48" />
                <Text className="text-gray-500 mt-2 font-medium">Görsel Eklemek İçin Dokun</Text>
                <Text className="text-gray-400 text-xs mt-1">Galeriden veya kameradan</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Başlık */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2 ml-1">Başlık</Text>
            <TextInput
              placeholder="Görseli tanımlayan bir başlık girin"
              value={title}
              onChangeText={setTitle}
              className="bg-gray-100 px-4 py-4 rounded-xl text-gray-800"
              placeholderTextColor="#A1A1AA"
              style={styles.inputField}
            />
          </View>

          {/* Kategori seçimi */}
          <View className="mb-8">
            <Text className="text-gray-700 font-medium mb-3 ml-1">Kategori</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {categories.map((cat, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleCategorySelect(cat)}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextSelected
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Yükle butonu */}
          <TouchableOpacity 
            onPress={handleSubmit} 
            className="mb-10" 
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">YÜKLE</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alt Menü */}
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white border-t border-gray-200 py-3">
        <TouchableOpacity onPress={() => router.push('/(dashboard)')}>
          <Ionicons name="home-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/search')}>
          <Ionicons name="search-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/add')}>
          <Ionicons name="add-circle-outline" size={32} color="#e11d48" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/saved')}>
          <Ionicons name="bookmark-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/profile')}>
          <Ionicons name="person-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/todo')}>
          <Ionicons name="checkmark-circle-outline" size={26} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Görsel kaynak modalı */}
      <Modal
        transparent={true}
        visible={imageModalVisible}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View style={styles.modalContainer}>
            <View className="items-center mb-5">
              <View className="w-12 h-1 bg-gray-300 rounded-full mb-5" />
              <Text className="text-xl font-bold text-gray-800">Görsel Seç</Text>
            </View>

            <TouchableOpacity 
              style={[styles.modalOption, { marginBottom: 15 }]} 
              onPress={takePhotoWithCamera}
            >
              <View className="h-12 w-12 bg-green-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="camera" size={24} color="#10b981" />
              </View>
              <View>
                <Text className="text-lg font-medium text-gray-800">Kamera ile Çek</Text>
                <Text className="text-gray-500 text-sm">Yeni bir fotoğraf çek</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={pickImageFromGallery}>
              <View className="h-12 w-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="images" size={24} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-lg font-medium text-gray-800">Galeriden Seç</Text>
                <Text className="text-gray-500 text-sm">Cihazınızda kayıtlı görseller</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full py-4 mt-5 rounded-xl items-center bg-pink-600"
              onPress={() => setImageModalVisible(false)}
            >
              <Text className="text-white font-bold">İPTAL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputField: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  submitButton: {
    backgroundColor: '#e11d48',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryButtonSelected: {
    backgroundColor: '#e11d48',
    borderColor: '#e11d48',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
});
