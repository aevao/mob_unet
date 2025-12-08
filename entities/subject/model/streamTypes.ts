export interface StreamSchedule {
  id: number;
  weekday_title: string;
  week_type_title: string;
  weeks: string;
  audit: string;
  time: string;
}

export interface Stream {
  id: number;
  number: number;
  name_subject: string;
  semester: string;
  stream_type: 'Лекционный' | 'Практический' | 'Лабораторный';
  status: string;
  students_count: number;
  capacity: number;
  teacher_name: string;
  is_registered: boolean;
  schedules: StreamSchedule[];
}

