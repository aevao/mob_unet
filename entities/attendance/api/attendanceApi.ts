import { apiClient } from '../../../shared/api/client';
import type { TabelRecord } from '../model/types';

export const fetchMyTabel = async (): Promise<TabelRecord[]> => {
  const { data } = await apiClient.get<TabelRecord[]>('/api/mytabel/');
  return data;
};

export interface LastTabelRecord {
  auditorium: string;
  auditorium_end: string;
  employee: number | null;
  geo: string;
  geo_end: string;
  image: string | null;
  image_end: string | null;
  status_info: string;
  time: string | null;
  time_end: string | null;
  working_time: string;
}

export const fetchMyTabelLast = async (): Promise<LastTabelRecord> => {
  const { data } = await apiClient.get<LastTabelRecord>('/api/mytabellast/');
  return data;
};

export interface PostTabelData {
  auditorium: string;
  geo: string;
  image: {
    uri: string;
    type: string;
    name: string;
  };
}

export const postTabel = async (formData: FormData): Promise<any> => {
  const { data } = await apiClient.post('/api/tabel/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export interface FinishTabelData {
  tabelId: number;
  auditorium: string;
  latitude: number;
  longitude: number;
  photo: {
    uri: string;
    type: string;
    name: string;
  };
}

export const finishTabel = async (formData: FormData): Promise<any> => {
  // Используем тот же endpoint, но с данными для завершения (tabel_id, auditorium, geo_end, image_end)
  const { data } = await apiClient.post('/api/tabel/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000, // Увеличиваем таймаут для загрузки фото
  });
  return data;
};

