export const formatTeacherName = (teacher: string | null | undefined): string => {
  if (!teacher) return '—';
  return teacher.trim();
};

