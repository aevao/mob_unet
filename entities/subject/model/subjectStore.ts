import { create } from 'zustand';
import { fetchSubjects } from '../api/subjectApi';
import type { Subject } from './types';

interface SubjectState {
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;
  fetchSubjects: () => Promise<void>;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: [],
  isLoading: false,
  error: null,

  fetchSubjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchSubjects();
      set({ subjects: data, isLoading: false, error: null });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Не удалось загрузить дисциплины';
      set({ error: message, isLoading: false, subjects: [] });
    }
  },
}));

