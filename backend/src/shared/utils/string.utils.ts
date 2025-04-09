import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtils {
  /**
   * Generates a random string of specified length
   * @param length Length of the random string
   * @returns Random string
   */
  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  /**
   * Converts a string to title case
   * @param str String to convert
   * @returns Title case string
   */
  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Truncates a string to a specified length
   * @param str String to truncate
   * @param length Maximum length
   * @param suffix Suffix to add if truncated (default: '...')
   * @returns Truncated string
   */
  truncate(str: string, length: number, suffix = '...'): string {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  }
}
