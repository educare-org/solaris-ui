import { calculatePasswordStrength } from '../model/password-strength';

describe('calculatePasswordStrength', () => {
  describe('empty', () => {
    it('returns empty for empty string', () => {
      expect(calculatePasswordStrength('')).toBe('empty');
    });
  });

  describe('weak (score <= 2)', () => {
    it('returns weak for single character', () => {
      expect(calculatePasswordStrength('a')).toBe('weak');
    });

    it('returns weak for short single-type password', () => {
      expect(calculatePasswordStrength('abc')).toBe('weak');
    });

    it('returns weak for 7-char single-type', () => {
      expect(calculatePasswordStrength('abcdefg')).toBe('weak');
    });

    it('returns weak for 8-char single-type with seq alphabet penalty', () => {
      expect(calculatePasswordStrength('abcdefgh')).toBe('weak');
    });

    it('returns weak for repeated chars', () => {
      expect(calculatePasswordStrength('aaabbb')).toBe('weak');
    });

    it('returns weak for short diverse password', () => {
      expect(calculatePasswordStrength('a1B')).toBe('weak');
    });

    it('returns weak with both seq alphabet and digit penalties', () => {
      expect(calculatePasswordStrength('abcd1234')).toBe('weak');
    });

    it('returns weak with repeat and seq alphabet penalties', () => {
      expect(calculatePasswordStrength('1111abcd')).toBe('weak');
    });

    it('returns weak for 8-char 3-type with repeat penalty', () => {
      expect(calculatePasswordStrength('1111BC$%')).toBe('weak');
    });
  });

  describe('medium (score 3-4)', () => {
    it('returns medium for 8-char with 3 types no penalties', () => {
      expect(calculatePasswordStrength('aB1cD2eF')).toBe('medium');
    });

    it('returns medium for 8-char 4-type with repeat penalty', () => {
      expect(calculatePasswordStrength('1111aC$%')).toBe('medium');
    });

    it('returns medium for 8-char 4-type with alphabet penalty', () => {
      expect(calculatePasswordStrength('abcd1C$%')).toBe('medium');
    });

    it('returns medium for 8-char 4-type with digit penalty', () => {
      expect(calculatePasswordStrength('1234aC$%')).toBe('medium');
    });

    it('returns medium for 16-char single-type no penalties', () => {
      expect(calculatePasswordStrength('abdeghjkmnpqstuw')).toBe('medium');
    });

    it('returns medium for 12-char 2-type no penalties', () => {
      expect(calculatePasswordStrength('a1b2c3d4e5f6')).toBe('medium');
    });
  });

  describe('strong (score >= 5)', () => {
    it('returns strong for 12-char 4-type no penalties', () => {
      expect(calculatePasswordStrength('aB1$cD2$eF3#')).toBe('strong');
    });

    it('returns strong for 16-char 3-type no penalties', () => {
      expect(calculatePasswordStrength('a1b2C3d4E5f6G7h8')).toBe('strong');
    });

    it('returns strong for 16-char 4-type no penalties', () => {
      expect(calculatePasswordStrength('a1b$C3d$E5f$G7h$')).toBe('strong');
    });
  });

  describe('scoreLength', () => {
    it('gives length 0 for 0-7 chars', () => {
      expect(calculatePasswordStrength('abc')).toBe('weak');
    });

    it('gives length 1 for 8-11 chars', () => {
      expect(calculatePasswordStrength('aB1cD2eF')).toBe('medium');
    });

    it('gives length 2 for 12-15 chars', () => {
      expect(calculatePasswordStrength('a1b2c3d4e5f6')).toBe('medium');
    });

    it('gives length 3 for 16+ chars', () => {
      expect(calculatePasswordStrength('a1b2C3d4E5f6G7h8')).toBe('strong');
    });
  });

  describe('scoreDiversity', () => {
    it('adds 0 for single type', () => {
      expect(calculatePasswordStrength('abcdefgh')).toBe('weak');
    });

    it('adds 1 for two types', () => {
      expect(calculatePasswordStrength('a1b2c3d4e5f6')).toBe('medium');
    });
  });

  describe('repeat penalty', () => {
    it('penalizes for 3+ repeated characters', () => {
      expect(calculatePasswordStrength('1111aC$%')).toBe('medium');
    });

    it('does not penalize for 2 repeated characters', () => {
      expect(calculatePasswordStrength('aabbccdd')).toBe('weak');
    });
  });

  describe('sequential alphabet penalty', () => {
    it('penalizes for 4 consecutive alphabet chars', () => {
      expect(calculatePasswordStrength('abcd1$C2')).toBe('medium');
    });

    it('penalizes for sequential at end of string', () => {
      expect(calculatePasswordStrength('A1B2wxyz')).toBe('weak');
    });

    it('detects sequential case-insensitively', () => {
      expect(calculatePasswordStrength('ABCD1a2b')).toBe('weak');
    });

    it('does not penalize for 3 sequential chars', () => {
      expect(calculatePasswordStrength('aB1$cD2$eF3#')).toBe('strong');
    });
  });

  describe('sequential digits penalty', () => {
    it('penalizes for 4 consecutive digits', () => {
      expect(calculatePasswordStrength('1234aC$%')).toBe('medium');
    });

    it('does not penalize for 3 consecutive digits', () => {
      expect(calculatePasswordStrength('123aB3$x')).toBe('medium');
    });
  });

  describe('combined penalties', () => {
    it('applies both alphabet and digit seq penalties', () => {
      expect(calculatePasswordStrength('abcd1234')).toBe('weak');
    });

    it('applies repeat and seq alphabet penalties', () => {
      expect(calculatePasswordStrength('1111abcd')).toBe('weak');
    });
  });

  describe('edge cases', () => {
    it('handles only special chars', () => {
      expect(calculatePasswordStrength('!@#$%^&*()')).not.toBe('empty');
    });

    it('handles only digits', () => {
      expect(calculatePasswordStrength('12345678')).toBe('weak');
    });

    it('handles very long diverse password', () => {
      expect(calculatePasswordStrength('aB3$eFg2WxYaLmNp')).toBe('strong');
    });
  });
});
