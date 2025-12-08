import { apiClient } from '../../../shared/api/client';
import type { Stream } from '../model/streamTypes';

export const fetchSubjectStreams = async (subjectId: number): Promise<Stream[]> => {
  const { data } = await apiClient.get<Stream[]>(`/api/students/subjects/${subjectId}/streams/`);
  return data;
};

