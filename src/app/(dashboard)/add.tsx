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
  Animated,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Profil fotoğrafı için URL
const PROFILE_IMAGE_URL = "https://i.pravatar.cc/150?img=10";

export default function Add() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const router = useRouter();

  const categories = ['Sanat', 'Doğa', 'Yemek', 'Dekorasyon', 'Moda', 'Teknoloji', 'Spor'];

  const openImagePicker = () => {
    setImageModalVisible(true);
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageModalVisible(false);
    }
  };

  const takePhotoWithCamera = async () => {
    // Request camera permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (cameraPermission.granted) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setImageModalVisible(false);
      }
    } else {
      Alert.alert('İzin Gerekli', 'Kamera erişimi için izin gerekiyor.');
    }
  };

  const handleSubmit = () => {
    if (!title) return alert('Lütfen bir başlık girin!');
    if (!image) return alert('Lütfen bir görsel seçin!');
    if (!category) return alert('Lütfen bir kategori seçin!');
    
    alert('Pin başarıyla yüklendi! 🎉');
    console.log('Pin yüklendi:', { title, image, category });
  };

  return (
    <SafeAreaView className="flex-1 mb-5 bg-white">
      {/* Header */}
      <View className="px-4 py-6 border-b border-gray-200 bg-gradient-to-r from-pink-500 to-purple-500 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold text-white">✨ Pin Yükle</Text>
          <Text className="text-white text-sm mt-1 opacity-80">Çarpıcı görsellerinizi paylaşın</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => router.replace('/(dashboard)/profile')}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white"
        >
          <Image 
            source={{ uri: PROFILE_IMAGE_URL }} 
            className="w-full h-full" 
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* İçerik */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="px-4 py-6">
          {/* Görsel */}
          <TouchableOpacity
            onPress={openImagePicker}
            className="bg-gray-100 rounded-2xl h-64 items-center justify-center mb-6 overflow-hidden"
            style={styles.imageContainer}
          >
            {image ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute top-3 right-3 bg-white/80 rounded-full p-2">
                  <Ionicons name="camera" size={20} color="#e11d48" />
                </View>
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

          {/* Kategori Seçimi */}
          <View className="mb-8">
            <Text className="text-gray-700 font-medium mb-3 ml-1">Kategori</Text>
            <View className="flex-row flex-wrap">
              {categories.map((cat, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setCategory(cat)}
                  className={`px-4 py-3 mr-3 mb-3 rounded-full border ${
                    category === cat ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-transparent' : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`${category === cat ? 'text-white font-medium' : 'text-gray-700'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Yükle Butonu */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="mb-10"
            style={styles.submitButton}
          >
            <Text className="text-white text-center font-bold text-lg">YÜKLE</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Image Source Modal */}
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
              style={styles.modalOption}
              onPress={pickImageFromGallery}
            >
              <View className="h-12 w-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="images" size={24} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-lg font-medium text-gray-800">Galeriden Seç</Text>
                <Text className="text-gray-500 text-sm">Cihazınızda kayıtlı görseller</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
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
            
            <TouchableOpacity 
              className="w-full py-4 mt-5 rounded-xl items-center bg-pink-600"
              onPress={() => setImageModalVisible(false)}
            >
              <Text className="text-white font-bold">İPTAL</Text>
            </TouchableOpacity>
          </View>
        </View>
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
        <Ionicons name="add-circle-outline" size={32} color="#e11d48" />
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

const styles = StyleSheet.create({
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  inputField: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  submitButton: {
    backgroundColor: '#e11d48',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#e11d48',
    shadowOffset: {
      width: 0,
      height: 5,
    },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
});
