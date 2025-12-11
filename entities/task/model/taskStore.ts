import { create } from 'zustand';
import { fetchEmployeeTasks } from '../api/taskApi';
import type { TasksByCategory, Task } from './types';

interface TaskState {
  allTasks: TasksByCategory;
  isLoading: boolean;
  error: string | null;
  fetchTasks: (userId: string | number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  allTasks: {
    OVERDUE: [],
    TODAY: [],
    WEEK: [],
    MONTH: [],
    LONGRANGE: [],
    INDEFINITE: [],
  },
  isLoading: false,
  error: null,

  fetchTasks: async (userId: string | number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchEmployeeTasks(userId);
      set({ 
        allTasks: data.ALL, 
        isLoading: false, 
        error: null 
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Не удалось загрузить задачи';
      set({ 
        error: message, 
        isLoading: false,
        allTasks: {
          OVERDUE: [],
          TODAY: [],
          WEEK: [],
          MONTH: [],
          LONGRANGE: [],
          INDEFINITE: [],
        },
      });
    }
  },
}));

