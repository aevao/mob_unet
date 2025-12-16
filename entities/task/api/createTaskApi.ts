import { apiClient } from '../../../shared/api/client';
import type { CreateTaskForm } from '../model/createTaskTypes';

export const createTask = async (formData: CreateTaskForm): Promise<any> => {
  const form = new FormData();
  
  // Добавляем основные поля
  form.append('task_name', formData.task_name);
  form.append('is_critical', formData.is_critical.toString());
  form.append('description', formData.description);
  form.append('allow_change_deadline', formData.allow_change_deadline.toString());
  form.append('skip_dayoffs', formData.skip_dayoffs.toString());
  form.append('check_after_finish', formData.check_after_finish.toString());
  form.append('determ_by_subtasks', formData.determ_by_subtasks.toString());
  form.append('report_after_finish', formData.report_after_finish.toString());
  
  if (formData.deadline_date) {
    form.append('deadline_date', formData.deadline_date);
  }
  
  if (formData.attached_document) {
    form.append('attached_document', formData.attached_document);
  }
  
  // Добавляем участников
  formData.members.forEach((member, index) => {
    form.append(`members[${index}][member_id]`, member.member_id.toString());
    form.append(`members[${index}][member_type]`, member.member_type);
  });
  
  // Добавляем подзадачи (если есть)
  if (formData.subtasks && formData.subtasks.length > 0) {
    form.append('subtasks', JSON.stringify(formData.subtasks));
  }
  
  // Добавляем файлы, если есть
  if (formData.files && formData.files.length > 0) {
    formData.files.forEach((fileUri) => {
      const fileName = fileUri.split('/').pop() || 'file';
      const fileType = 'application/octet-stream';
      
      form.append('files', {
        uri: fileUri,
        type: fileType,
        name: fileName,
      } as any);
    });
  }

  const { data } = await apiClient.post('/api/tasks/', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

