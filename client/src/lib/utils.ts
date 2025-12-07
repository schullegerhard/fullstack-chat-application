import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, first = 6, last = 4): string {
  if (!address) return "";
  return `${address.slice(0, first)}...${address.slice(-last)}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;
  
  if (secondsPast < 60) {
    return `${Math.floor(secondsPast)} seconds ago`;
  }
  
  const minutesPast = secondsPast / 60;
  if (minutesPast < 60) {
    return `${Math.floor(minutesPast)} ${Math.floor(minutesPast) === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const hoursPast = minutesPast / 60;
  if (hoursPast < 24) {
    return `${Math.floor(hoursPast)} ${Math.floor(hoursPast) === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const daysPast = hoursPast / 24;
  if (daysPast < 30) {
    return `${Math.floor(daysPast)} ${Math.floor(daysPast) === 1 ? 'day' : 'days'} ago`;
  }
  
  const monthsPast = daysPast / 30;
  return `${Math.floor(monthsPast)} ${Math.floor(monthsPast) === 1 ? 'month' : 'months'} ago`;
}

export function generateRandomHash(): string {
  return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}
