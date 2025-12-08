export interface Employee {
  id: number;
  user: number;
  first_name: string;
  surname: string;
  number_phone: string;
  imeag: string;
  email: string;
  division: string;
  position: string;
  is_online: boolean;
}

export interface ApplicationStatus {
  id: number;
  status: boolean;
  application: number;
  employee: number;
}

export interface Document {
  id: number;
  number: string;
  employee: Employee;
  type_doc: string;
  type: string;
  status: string;
  date_zayavki: string;
  application_status: ApplicationStatus[];
  is_watched: boolean;
}

export interface DocumentsResponse {
  Raports: Document[];
}

export type DocumentType = 'inbox' | 'outbox' | 'history';

