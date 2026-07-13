import { FormControl } from '@angular/forms';
import {
  solarisEmailValidator,
  solarisAllowedDomainsValidator,
  solarisBlockedDomainsValidator,
  isValidEmailFormat,
  extractDomain,
  isDomainAllowed,
  isDomainBlocked,
} from '../validators/email-field.validators';

describe('isValidEmailFormat', () => {
  it('returns true for valid email', () => {
    expect(isValidEmailFormat('user@example.com')).toBe(true);
  });

  it('returns true for email with plus', () => {
    expect(isValidEmailFormat('user+tag@example.com')).toBe(true);
  });

  it('returns true for email with dots', () => {
    expect(isValidEmailFormat('first.last@example.com')).toBe(true);
  });

  it('returns false for missing @', () => {
    expect(isValidEmailFormat('userexample.com')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidEmailFormat('')).toBe(false);
  });

  it('returns true for valid subdomain email', () => {
    expect(isValidEmailFormat('user@sub.example.com')).toBe(true);
  });

  it('returns false for email with no domain', () => {
    expect(isValidEmailFormat('user@')).toBe(false);
  });

  it('returns false for email with no local part', () => {
    expect(isValidEmailFormat('@example.com')).toBe(false);
  });
});

describe('extractDomain', () => {
  it('extracts domain from email', () => {
    expect(extractDomain('user@example.com')).toBe('example.com');
  });

  it('extracts domain from email with subdomain', () => {
    expect(extractDomain('user@sub.example.com')).toBe('sub.example.com');
  });

  it('returns null for email without @', () => {
    expect(extractDomain('userexample.com')).toBeNull();
  });

  it('trims whitespace before extracting domain', () => {
    expect(extractDomain('  user@example.com  ')).toBe('example.com');
  });
});

describe('isDomainAllowed', () => {
  it('returns true if domain is in allowed list', () => {
    expect(isDomainAllowed('example.com', ['example.com'])).toBe(true);
  });

  it('returns false if domain is not in allowed list', () => {
    expect(isDomainAllowed('other.com', ['example.com'])).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(isDomainAllowed('EXAMPLE.COM', ['example.com'])).toBe(true);
    expect(isDomainAllowed('example.com', ['EXAMPLE.COM'])).toBe(true);
  });
});

describe('isDomainBlocked', () => {
  it('returns true if domain is in blocked list', () => {
    expect(isDomainBlocked('spam.com', ['spam.com'])).toBe(true);
  });

  it('returns false if domain is not in blocked list', () => {
    expect(isDomainBlocked('good.com', ['spam.com'])).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(isDomainBlocked('SPAM.COM', ['spam.com'])).toBe(true);
    expect(isDomainBlocked('spam.com', ['SPAM.COM'])).toBe(true);
  });
});

describe('solarisEmailValidator', () => {
  const validator = solarisEmailValidator();

  it('returns null for valid email', () => {
    const control = new FormControl('user@example.com');
    expect(validator(control)).toBeNull();
  });

  it('returns error for invalid email', () => {
    const control = new FormControl('invalid');
    expect(validator(control)).toEqual({ solarisEmail: true });
  });

  it('returns null for empty value', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('returns null for null', () => {
    const control = new FormControl(null);
    expect(validator(control)).toBeNull();
  });

  it('returns null for undefined', () => {
    const control = new FormControl(undefined);
    expect(validator(control)).toBeNull();
  });
});

describe('solarisAllowedDomainsValidator', () => {
  it('returns null when domain is allowed', () => {
    const validator = solarisAllowedDomainsValidator(['example.com']);
    const control = new FormControl('user@example.com');
    expect(validator(control)).toBeNull();
  });

  it('returns error when domain is not allowed', () => {
    const validator = solarisAllowedDomainsValidator(['example.com']);
    const control = new FormControl('user@other.com');
    expect(validator(control)).toEqual({
      solarisEmailAllowedDomain: true,
    });
  });

  it('is case-insensitive', () => {
    const validator = solarisAllowedDomainsValidator(['EXAMPLE.COM']);
    const control = new FormControl('user@example.com');
    expect(validator(control)).toBeNull();
  });

  it('returns null for empty value', () => {
    const validator = solarisAllowedDomainsValidator(['example.com']);
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });
});

describe('solarisBlockedDomainsValidator', () => {
  it('returns null when domain is not blocked', () => {
    const validator = solarisBlockedDomainsValidator(['spam.com']);
    const control = new FormControl('user@example.com');
    expect(validator(control)).toBeNull();
  });

  it('returns error when domain is blocked', () => {
    const validator = solarisBlockedDomainsValidator(['spam.com']);
    const control = new FormControl('user@spam.com');
    expect(validator(control)).toEqual({
      solarisEmailBlockedDomain: true,
    });
  });

  it('is case-insensitive', () => {
    const validator = solarisBlockedDomainsValidator(['SPAM.COM']);
    const control = new FormControl('user@spam.com');
    expect(validator(control)).toEqual({
      solarisEmailBlockedDomain: true,
    });
  });

  it('returns null for empty value', () => {
    const validator = solarisBlockedDomainsValidator(['spam.com']);
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });
});
