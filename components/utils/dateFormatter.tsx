import moment from 'moment';

export const isDate = (d: Date | null | string | undefined) => d instanceof Date;

const dateFormatter = (date: string | Date | undefined, format: string = 'DD.MM.YYYY'): string => {
  const transformDate = isDate(date) ? date as Date : new Date(date || '');
  const formatDate = moment(transformDate).format(format);
  return formatDate;
};

export default dateFormatter;
