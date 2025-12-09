import { apiClient } from '../../../shared/api/client';
import type { Certificate, CertificateDetail } from '../model/types';

export const fetchCertificates = async (): Promise<Certificate[]> => {
  const { data } = await apiClient.get<Certificate[]>('/api/service-reference/');
  return data;
};

export const fetchCertificateDetail = async (referenceId: number): Promise<CertificateDetail> => {
  const { data } = await apiClient.post<CertificateDetail>(`/api/reference/${referenceId}/`);
  return data;
};

