import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtils {
  /**
   * Formats a date to a string in the specified format
   * @param date The date to format
   * @param format The format string (default: 'YYYY-MM-DD')
   * @returns Formatted date string
   */
  formatDate(date: Date, format = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }

  /**
   * Checks if a date is today
   * @param date The date to check
   * @returns True if the date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Adds days to a date
   * @param date The base date
   * @param days Number of days to add
   * @returns New date with days added
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Checks if a date is today or in the future
   * @param date The date to check
   * @returns True if the date is today or in the future
   */
  isTodayOrFuture(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return targetDate >= today;
  }
}
