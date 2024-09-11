import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const slugify = (input: string): string => {
   return input
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^a-z0-9-]/g, '');
};
