import { FormControl, ValidatorFn } from '@angular/forms';
import { solarisPasswordValidator } from '../validators/password.validator';
import { SolarisPasswordPolicy } from '../model/password-policy.types';

function runValidator(
  value: string,
  policy: SolarisPasswordPolicy,
): ReturnType<ValidatorFn> {
  const validator = solarisPasswordValidator(policy);
  const control = new FormControl(value);
  return validator(control);
}

describe('solarisPasswordValidator', () => {
  const policy: SolarisPasswordPolicy = {
    minLength: 8,
    maxLength: 20,
    requireLowercase: true,
    requireUppercase: true,
    requireNumber: true,
    requireSymbol: true,
    disallowWhitespace: true,
    forbiddenValues: ['password', '123456'],
  };

  it('returns null for valid password', () => {
    const result = runValidator('Abcd1234!', policy);
    expect(result).toBeNull();
  });

  it('returns null for null value', () => {
    const validator = solarisPasswordValidator(policy);
    const control = new FormControl(null);
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('returns null for undefined value', () => {
    const validator = solarisPasswordValidator(policy);
    const control = new FormControl(undefined);
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('returns null for non-string value', () => {
    const validator = solarisPasswordValidator(policy);
    const control = new FormControl(12345);
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('detects minLength violation', () => {
    const result = runValidator('Ab1!', policy);
    expect(result).not.toBeNull();
    expect(result!['solarisPasswordMinLength']).toBeTruthy();
  });

  it('detects maxLength violation', () => {
    const result = runValidator('Abcdef1234!@#$%^&*()extra', policy);
    expect(result).not.toBeNull();
    expect(result!['solarisPasswordMaxLength']).toBeTruthy();
  });

  it('detects missing lowercase', () => {
    const policy2: SolarisPasswordPolicy = { requireLowercase: true };
    const result = runValidator('ABCDEF123!', policy2);
    expect(result).not.toBeNull();
    expect(result!['solarisPasswordLowercase']).toBe(true);
  });

  it('detects missing uppercase', () => {
    const policy2: SolarisPasswordPolicy = { requireUppercase: true };
    const result = runValidator('abcdef123!', policy2);
    expect(result).not.toBeNull();
    expect(result!['solarisPasswordUppercase']).toBe(true);
  });

  it('detects missing number', () => {
    const policy2: SolarisPasswordPolicy = { requireNumber: true };
    const result = runValidator('Abcdefgh!', policy2);
    expect(result).not.toBeNull();
    expect(result!['solarisPasswordNumber']).toBe(true);
  });

  it('detects missing symbol', () => {
    const policy2: SolarisPasswordPolicy = { requireSymbol: true };
    const result = runValidator('Abcdefgh1', policy2);
    expect(result).not.toBeNull();
    expect(result!['solarisPasswordSymbol']).toBe(true);
  });

  it('detects whitespace when disallowed', () => {
    const policy2: SolarisPasswordPolicy = { disallowWhitespace: true };
    const result = runValidator('Abc def1!', policy2);
    expect(result).not.toBeNull();
    expect(result!['solarisPasswordWhitespace']).toBe(true);
  });

  it('detects forbidden values', () => {
    const result = runValidator('MyPassword123!', policy);
    expect(result).not.toBeNull();
    expect(result!['solarisPasswordForbiddenValue']).toBe(true);
  });

  it('detects multiple violations', () => {
    const result = runValidator('short', policy);
    expect(result).not.toBeNull();
    expect(Object.keys(result!).length).toBeGreaterThan(1);
  });
});
