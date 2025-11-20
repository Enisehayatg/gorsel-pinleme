import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'uploadedPins';

export const getUploadedPins = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUploadedPin = async (pin: any): Promise<boolean> => {
  try {
    const existing = await getUploadedPins();
    existing.push(pin);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return true; 
  } catch (e) {
    console.error('saveUploadedPin error:', e);
    return false; 
  }
};

export const deleteUploadedPin = async (pinId: string): Promise<boolean> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    const pins = JSON.parse(stored);
    const updated = pins.filter((pin: any) => pin.id !== pinId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return true; 
  } catch (e) {
    console.error('deleteUploadedPin error:', e);
    return false; 
  }
};
