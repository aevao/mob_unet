import { create } from 'zustand';
import { apiClient } from '../../../shared/api/client';

export interface StudentTicket {
  code_stud: string;
  photo: string;
  gender: 'M' | 'F' | string;
  surname: string;
  first_name: string;
  last_name: string;
  faculty: string;
  abbreviation_faculty: string;
  group: string;
  cource: string;
  year_study: string;
}

interface StudentTicketState {
  ticket: StudentTicket | null;
  isLoading: boolean;
  error: string | null;
  fetchTicket: () => Promise<void>;
}

export const useStudentTicketStore = create<StudentTicketState>((set) => ({
  ticket: null,
  isLoading: false,
  error: null,

  fetchTicket: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<StudentTicket>('/api/students/v2/stud-ticket/');
      set({ ticket: response.data, isLoading: false });
    } catch (error: any) {
      let message = 'Не удалось загрузить данные студенческого билета.';
      if (error?.response?.data?.detail) {
        message = error.response.data.detail;
      }
      set({ error: message, isLoading: false });
    }
  },
}));


