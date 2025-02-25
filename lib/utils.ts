import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

export function formatDate(dateString: string, includeTime: boolean = false): string {
  try {
    const date = new Date(dateString)
    return format(date, includeTime ? 'MMM d, yyyy, h:mm a' : 'MMM d, yyyy')
  } catch (error) {
    return dateString
  }
}
