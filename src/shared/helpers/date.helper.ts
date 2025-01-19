import { add } from 'date-fns';

export function getDateFormat(date: Date) {
  if (date.toString().includes('T05')) return date;

  return add(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0), {
    months: 0,
    days: 1,
  });
}

export function getDateFormatT05(date: Date) {
  return add(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0), {
    months: 0,
    days: 0,
  });
}
