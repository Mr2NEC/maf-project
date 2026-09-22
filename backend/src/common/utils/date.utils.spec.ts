import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 22, 15, 30));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('formatDate', () => {
    it('formats with the default YYYY-MM-DD pattern', () => {
      expect(DateUtils.formatDate(new Date(2026, 0, 5))).toBe('2026-01-05');
    });

    it('supports a custom pattern', () => {
      expect(DateUtils.formatDate(new Date(2026, 0, 5), 'DD.MM.YYYY')).toBe(
        '05.01.2026',
      );
    });
  });

  describe('isToday', () => {
    it('returns true for another moment of the current day', () => {
      expect(DateUtils.isToday(new Date(2026, 8, 22, 1, 0))).toBe(true);
    });

    it('returns false for yesterday', () => {
      expect(DateUtils.isToday(new Date(2026, 8, 21, 23, 59))).toBe(false);
    });
  });

  describe('addDays', () => {
    it('does not mutate the original date', () => {
      const base = new Date(2026, 8, 30);

      const result = DateUtils.addDays(base, 1);

      expect(result).toEqual(new Date(2026, 9, 1));
      expect(base).toEqual(new Date(2026, 8, 30));
    });
  });

  describe('isTodayOrFuture', () => {
    it('accepts an earlier time on the current day', () => {
      expect(DateUtils.isTodayOrFuture(new Date(2026, 8, 22, 9, 0))).toBe(true);
    });

    it('accepts a future date', () => {
      expect(DateUtils.isTodayOrFuture(new Date(2026, 8, 23))).toBe(true);
    });

    it('rejects a past date', () => {
      expect(DateUtils.isTodayOrFuture(new Date(2026, 8, 21, 23, 59))).toBe(
        false,
      );
    });
  });
});
