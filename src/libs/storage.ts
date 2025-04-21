import AsyncStorage from "@react-native-async-storage/async-storage";

export const Storage = {
  setItem: async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error("AsyncStorage Save Error:", e);
    }
  },

  getItem: async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("AsyncStorage Read Error:", e);
    }
  },

  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error("AsyncStorage Remove Error:", e);
    }
  },

  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error("AsyncStorage Clear Error:", e);
    }
  },
};
