export interface Certificate {
  id: number;
  service_name: string;
  division_name: string;
  signer_name: string;
  relevant: boolean;
  division: number;
  signer: number;
  description: string;
}

export interface CertificateDetail {
  id: string;
  created_at: string;
  file: string;
  number_reference: string | null;
  organ: string;
  service: number;
  service_name: string;
  user: number;
  user_fullname: string;
}

