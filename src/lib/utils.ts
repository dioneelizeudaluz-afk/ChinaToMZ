import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMT(value: number): string {
  return new Intl.NumberFormat('pt-MZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' MT';
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-MZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('pt-MZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}