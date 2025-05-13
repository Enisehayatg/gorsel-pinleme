import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export function useTodo() {
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('todos').then((data) => {
      if (data) setTodos(JSON.parse(data));
    });
  }, []);

  const addTodo = async (item: any) => {
    const updated = [...todos, item];
    setTodos(updated);
    await AsyncStorage.setItem('todos', JSON.stringify(updated));
  };

  return { todos, addTodo };
}
