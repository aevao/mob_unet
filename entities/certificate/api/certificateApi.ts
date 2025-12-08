import { apiClient } from '../../../shared/api/client';
import type { Certificate } from '../model/types';

export const fetchCertificates = async (): Promise<Certificate[]> => {
  const { data } = await apiClient.get<Certificate[]>('/api/service-reference/');
  return data;
};

