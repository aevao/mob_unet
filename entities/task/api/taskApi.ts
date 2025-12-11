import { apiClient } from '../../../shared/api/client';
import type { TasksResponse, TaskDetail } from '../model/types';

export const fetchEmployeeTasks = async (userId: string | number): Promise<TasksResponse> => {
  const { data } = await apiClient.get<TasksResponse>(`/api/employee-tasks/${userId}/`);
  return data;
};

export const fetchTaskDetail = async (taskId: number): Promise<TaskDetail> => {
  const { data } = await apiClient.get<TaskDetail>(`/api/tasks/${taskId}/`);
  return data;
};

