import { format } from 'date-fns';

export function formatCurrency(amount: number, currencyCode: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });
  return formatter.format(amount);
}

export function formatDate(date: Date | string, formatString: string): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  return format(dateObject, formatString);
}

export function formatPercentage(value: number, decimalPlaces: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
  return formatter.format(value);
}