export type DocumentTypeOption = 'Рапорт' | 'Заявление' | 'Письмо';

export interface CreateDocumentForm {
  type_doc: DocumentTypeOption;
  recipient_id: number | null;
  subject: string;
  content: string;
  is_urgent: boolean;
  files: string[];
}

