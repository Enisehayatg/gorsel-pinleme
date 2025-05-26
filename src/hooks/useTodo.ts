import { useState, useEffect } from 'react';
import { getTodos, saveTodos, TodoItem } from '@/utils/todoStorage';

export function useTodo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos();
      setTodos(loadedTodos);
    } catch (error) {
      console.error('Todo yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (item: Omit<TodoItem, 'id'>) => {
    try {
      const newTodo: TodoItem = {
        ...item,
        id: Date.now().toString(),
      };
      
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);
      return true;
    } catch (error) {
      console.error('Todo eklenirken hata:', error);
      return false;
    }
  };

  const toggleTodoComplete = async (id: string) => {
    try {
      const updatedTodos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);
      return true;
    } catch (error) {
      console.error('Todo güncellenirken hata:', error);
      return false;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);
      return true;
    } catch (error) {
      console.error('Todo silinirken hata:', error);
      return false;
    }
  };

  const updateTodoImage = async (id: string, imageUri: string) => {
    try {
      const updatedTodos = todos.map(todo => 
        todo.id === id ? { ...todo, imageUri } : todo
      );
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);
      return true;
    } catch (error) {
      console.error('Todo resmi güncellenirken hata:', error);
      return false;
    }
  };

  return { 
    todos, 
    loading,
    addTodo, 
    loadTodos,
    toggleTodoComplete,
    deleteTodo,
    updateTodoImage
  };
}
