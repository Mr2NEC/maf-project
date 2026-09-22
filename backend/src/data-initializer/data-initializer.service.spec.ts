import { toSafeFileName } from './data-initializer.service';

describe('toSafeFileName', () => {
  it('keeps simple names readable', () => {
    expect(toSafeFileName('Mafia Club 1')).toBe('Mafia_Club_1');
  });

  it('removes path traversal and separators', () => {
    const name = toSafeFileName('../../etc/passwd');

    expect(name).toBe('etc_passwd');
    expect(name).not.toMatch(/[./\\]/);
  });

  it('keeps Cyrillic letters', () => {
    expect(toSafeFileName('Мафія Клуб')).toBe('Мафія_Клуб');
  });

  it('falls back to a default for names without safe characters', () => {
    expect(toSafeFileName('../..')).toBe('club');
  });

  it('limits the length', () => {
    expect(toSafeFileName('a'.repeat(200))).toHaveLength(80);
  });
});
