export interface CreateTaskMember {
  member_id: number;
  member_type: 'Ответственный' | 'Соисполнитель' | 'Наблюдатель';
}

export interface CreateTaskForm {
  task_name: string;
  is_critical: boolean;
  description: string;
  members: CreateTaskMember[];
  deadline_date: string | null;
  allow_change_deadline: boolean;
  skip_dayoffs: boolean;
  check_after_finish: boolean;
  determ_by_subtasks: boolean;
  report_after_finish: boolean;
  subtasks: any[];
  attached_document: string;
  files?: string[];
}

