import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedPin {
  id: string;
  title: string;
  image: string;
  isUploaded?: boolean;
  category?: string;
}

const SAVED_PINS_KEY = '@saved_pins';

export const getSavedPins = async (): Promise<SavedPin[]> => {
  try {
    const savedPinsData = await AsyncStorage.getItem(SAVED_PINS_KEY);
    if (savedPinsData !== null) {
      return JSON.parse(savedPinsData);
    }
    return [];
  } catch (e) {
    console.error('Error loading saved pins:', e);
    return [];
  }
};

export const savePins = async (pins: SavedPin[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SAVED_PINS_KEY, JSON.stringify(pins));
  } catch (e) {
    console.error('Error saving pins:', e);
  }
};

export const savePin = async (pin: SavedPin): Promise<boolean> => {
  try {
    const currentPins = await getSavedPins();
    
    // Check if pin already exists
    const pinExists = currentPins.some(p => p.id === pin.id);
    
    if (!pinExists) {
      const updatedPins = [...currentPins, pin];
      await savePins(updatedPins);
      return true; // Pin was added
    }
    
    return false; // Pin already exists
  } catch (e) {
    console.error('Error saving pin:', e);
    return false;
  }
};

export const removePin = async (id: string): Promise<boolean> => {
  try {
    const currentPins = await getSavedPins();
    const updatedPins = currentPins.filter(pin => pin.id !== id);
    
    if (updatedPins.length !== currentPins.length) {
      await savePins(updatedPins);
      return true; // Pin was removed
    }
    
    return false; // Pin wasn't found
  } catch (e) {
    console.error('Error removing pin:', e);
    return false;
  }
};

export const isPinSaved = async (id: string): Promise<boolean> => {
  try {
    const currentPins = await getSavedPins();
    return currentPins.some(pin => pin.id === id);
  } catch (e) {
    console.error('Error checking if pin is saved:', e);
    return false;
  }
}; 