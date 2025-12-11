export interface TaskCreator {
  id: number;
  user: number;
  first_name: string;
  surname: string;
  number_phone: string | null;
  imeag: string;
  email: string | null;
  division?: string;
  position: string;
  is_online: boolean;
}

export interface TaskMember {
  id: number;
  member: TaskCreator;
  member_type: 'Ответственный' | 'Соисполнитель' | 'Наблюдатель';
}

export interface Task {
  id: number;
  task_name: string;
  creator: TaskCreator;
  status: string;
  attached_document: string;
  create_date: string;
  deadline_date: string | null;
  members: TaskMember[];
}

export type TaskCategory = 'OVERDUE' | 'TODAY' | 'WEEK' | 'MONTH' | 'LONGRANGE' | 'INDEFINITE';

export interface TasksByCategory {
  OVERDUE: Task[];
  TODAY: Task[];
  WEEK: Task[];
  MONTH: Task[];
  LONGRANGE: Task[];
  INDEFINITE: Task[];
}

export interface TasksResponse {
  ALL: TasksByCategory;
  INSTRUCTED: TasksByCategory;
  DOING: TasksByCategory;
  HELPING: TasksByCategory;
  WATCHING: TasksByCategory;
  COMPLETED: Task[];
}

export interface TaskFile {
  file: string;
  create_date: string;
}

export interface TaskDetail {
  id: number;
  creator: TaskCreator;
  members: TaskMember[];
  subtasks: any[];
  resources: any[];
  files: TaskFile[];
  deadline_date: string | null;
  task_name: string;
  create_date: string;
  status: string;
  edit_status_date: string | null;
  attached_document: string;
  report: string | null;
  report_file: string | null;
  description: string;
  is_critical: boolean;
  allow_change_deadline: boolean;
  skip_dayoffs: boolean;
  check_after_finish: boolean;
  determ_by_subtasks: boolean;
  report_after_finish: boolean;
  is_archived: boolean;
}

