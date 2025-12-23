export interface TabelRecord {
  id: number;
  time: string; // "14.06.2024 13:24"
  date_day: string; // "14.06.2024"
  image: string; // URL фото начала
  image_end: string | null; // URL фото окончания
  employee: number;
  employee_name: string;
  user_id: string;
  auditorium: string;
  auditorium_end: string | null;
  time_end: string | null;
  geo: string; // "42.8440547, 74.5865404"
  geo_end: string | null;
  working_time: string | null; // "00:00:26"
  status_info: 'Начат' | 'Завершен';
}

