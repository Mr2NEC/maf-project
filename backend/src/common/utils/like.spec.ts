import { containsPattern } from './like';

describe('containsPattern', () => {
  it('wraps the value for a contains search', () => {
    expect(containsPattern('don')).toBe('%don%');
  });

  it('escapes LIKE wildcards and the escape character', () => {
    expect(containsPattern('50%_off\\')).toBe('%50\\%\\_off\\\\%');
  });
});
