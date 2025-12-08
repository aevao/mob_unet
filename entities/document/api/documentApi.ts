import { apiClient } from '../../../shared/api/client';
import type { Document } from '../model/types';

export const fetchInboxDocuments = async (): Promise<Document[]> => {
  const { data } = await apiClient.get<Document[]>('/api/conversion/inbox-raports/');
  return data;
};

export const fetchOutboxDocuments = async (): Promise<Document[]> => {
  const { data } = await apiClient.get<Document[]>('/api/conversion/raports/');
  return data;
};

export const fetchHistoryDocuments = async (): Promise<Document[]> => {
  const { data } = await apiClient.get<Document[]>('/api/conversion/history-raports/');
  return data;
};

