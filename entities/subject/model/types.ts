export interface SubjectStream {
  stream_id: number;
  number: number;
  teacher_name: string;
  [key: string]: unknown;
}

export interface Subject {
  id: number;
  semester: string;
  name_subject: string;
  credit: number;
  control_form: string;
  active: boolean;
  lab: SubjectStream | null;
  lecture: SubjectStream | null;
  practice: SubjectStream | null;
}

