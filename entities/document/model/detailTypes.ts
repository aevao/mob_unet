import type { Employee } from './types';

export interface DocumentDetail {
  id: number;
  employee: Employee;
  secretary: Employee | null;
  user_id_prorector: number;
  addressee: number;
  number_addressee: string;
  division: string;
  position: string;
  photo: string;
  type_doc: string;
  prorector: string;
  prorector_name: string;
  number: string;
  type: string;
  podtypezayavki: string | null;
  status: string;
  text: string;
  date_zayavki: string;
  prich_pr_otkaz: string | null;
  prorectorcheck: string | null;
  prorectorsign: string | null;
  has_tasks: boolean;
  prorector_date_check: string | null;
  rukovpodcheck: string | null;
  rukovpodsign: string | null;
  rukovpod_date_check: string | null;
  ispolnpodcheck: string | null;
  ispolnpodsign: string | null;
  agreement: string;
  agreement_comment: string | null;
  file: string;
  files: string[];
  applicationmember: any[];
  application_status: Array<{
    id: number;
    status: boolean;
    application: number;
    employee: number;
  }>;
  tasks: any[];
  very_urgent: boolean;
  service: string | null;
  service_id: number | null;
  is_watched: boolean;
}

