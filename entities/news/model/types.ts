export interface NewsFile {
  id: number;
  file: string;
  news: number;
}

export interface News {
  id: number;
  title: string;
  description: string;
  date_publication: string;
  employee: number;
  employee_name: string;
  user_id: string;
  files_news: NewsFile[];
}

