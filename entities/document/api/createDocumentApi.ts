import { apiClient } from '../../../shared/api/client';
import type { CreateDocumentForm } from '../model/createDocumentTypes';

export const createDocument = async (formData: CreateDocumentForm): Promise<any> => {
  const form = new FormData();
  
  form.append('type_doc', formData.type_doc);
  if (formData.recipient_id) {
    form.append('addressee', formData.recipient_id.toString());
  }
  form.append('type', formData.subject);
  form.append('text', formData.content);
  form.append('very_urgent', formData.is_urgent.toString());
  
  // Добавляем файлы, если есть
  if (formData.files && formData.files.length > 0) {
    formData.files.forEach((fileUri, index) => {
      // Получаем имя файла из URI
      const fileName = fileUri.split('/').pop() || `file_${index}`;
      const fileType = 'application/octet-stream';
      
      form.append('files', {
        uri: fileUri,
        type: fileType,
        name: fileName,
      } as any);
    });
  }

  const { data } = await apiClient.post('/api/conversion/raportsforpost/', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

