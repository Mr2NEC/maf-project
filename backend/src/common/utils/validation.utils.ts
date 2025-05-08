import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationUtils {
  /**
   * Validates an email address
   * @param email Email to validate
   * @returns True if email is valid
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates a password strength
   * @param password Password to validate
   * @param minLength Minimum length required
   * @returns True if password meets requirements
   */
  static isValidPassword(password: string, minLength = 8): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }

  /**
   * Validates a phone number
   * @param phone Phone number to validate
   * @returns True if phone number is valid
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  }

  static isSuccessResult(result: any): boolean {
    return (result.affected ?? 0) > 0;
  }
}
