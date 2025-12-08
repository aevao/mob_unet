import { apiClient } from '../../../shared/api/client';
import type { Employee } from '../model/types';

export const fetchEmployees = async (userType: string = 'E'): Promise<Employee[]> => {
  const { data } = await apiClient.get<Employee[]>(`/api/employees/all-employees/?user_type=${userType}`);
  return data;
};

