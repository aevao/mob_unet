import { apiClient } from '../../../shared/api/client';
import type { DocumentDetail } from '../model/detailTypes';

export const fetchDocumentDetail = async (documentId: number): Promise<DocumentDetail> => {
  const { data } = await apiClient.get<DocumentDetail>(`/api/conversion/raport/${documentId}/`);
  return data;
};

