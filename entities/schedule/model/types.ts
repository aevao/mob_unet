export interface IScheduleItem {
  subject: string | null;
  time: string;
  teacher?: string | null;
  auditorium?: string | null;
  korpus?: number | null;
  weeks?: string | null;
  week_type?: string | null;
  class_type?: 'Лк' | 'Пр' | 'Лб' | string | null;
}

export interface ISchedule {
  monday: IScheduleItem[];
  tuesday: IScheduleItem[];
  wednesday: IScheduleItem[];
  thursday: IScheduleItem[];
  friday: IScheduleItem[];
  saturday: IScheduleItem[];
  [key: string]: IScheduleItem[];
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
};

export const DAY_KEYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

