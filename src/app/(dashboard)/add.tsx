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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Add() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const router = useRouter();

  const categories = ['Sanat', 'Doğa', 'Yemek', 'Dekorasyon','Moda'];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!title || !image || !category) return alert('Başlık, görsel ve kategori gerekli!');
    console.log('Pin yüklendi:', { title, image, category });
  };

  return (
    <SafeAreaView className="flex-1 mb-5 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-pink-600">📤 Pin Yükle</Text>
      </View>

      {/* İçerik */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="px-4 py-4">
          {/* Görsel */}
          <TouchableOpacity
            onPress={pickImage}
            className="bg-gray-100 rounded-xl h-48 items-center justify-center mb-4"
          >
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-full h-full rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="image-outline" size={48} color="#A1A1AA" />
            )}
          </TouchableOpacity>

          {/* Başlık */}
          <TextInput
            placeholder="Başlık"
            value={title}
            onChangeText={setTitle}
            className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800 mb-4"
            placeholderTextColor="#A1A1AA"
          />

          {/* Kategori Seçimi */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Kategori Seç:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setCategory(cat)}
                  className={`px-4 py-2 mr-2 rounded-full border ${
                    category === cat ? 'bg-pink-600 border-pink-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`${category === cat ? 'text-white' : 'text-gray-700'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Yükle Butonu */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-pink-600 py-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">Yükle</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
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
        <TouchableOpacity onPress={() => router.replace('/(dashboard)/profile')}>
          <Ionicons name="person-outline" size={26} color="#e11d48" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
