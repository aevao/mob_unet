// Преобразование даты из формата DD.MM.YYYY в YYYY-MM-DD
export const convertDateToISO = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('.');
  return `${year}-${month}-${day}`;
};

