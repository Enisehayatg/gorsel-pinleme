import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  imageUri?: string;
  date?: string; // ISO-8601 format tarih string'i olarak saklayacağız
}

const STORAGE_KEY = '@todo_items';

export const getTodos = async (): Promise<TodoItem[]> => {
  try {
    const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedTodos !== null) {
      return JSON.parse(storedTodos);
    }
    return [];
  } catch (e) {
    console.error('Error loading todos:', e);
    return [];
  }
};

export const saveTodos = async (todos: TodoItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error('Error saving todos:', e);
  }
};

export const addImageToTodo = async (imageUri: string, title?: string): Promise<void> => {
  try {
    const todos = await getTodos();
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: title || 'Görev',
      completed: false,
      imageUri,
      date: new Date().toISOString(), // Bugünün tarihini ekle
    };
    todos.push(newTodo);
    await saveTodos(todos);
  } catch (e) {
    console.error('Error adding image to todo:', e);
  }
}; 