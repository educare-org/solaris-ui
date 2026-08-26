import { FormControl } from '@angular/forms';
import { solarisOtpValidator } from '../validators/otp-input.validators';

describe('solarisOtpValidator', () => {
  const validator = solarisOtpValidator(4, 6);

  it('returns null for empty and null values', () => {
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl(null))).toBeNull();
  });

  it('accepts a value within the length range', () => {
    expect(validator(new FormControl('1234'))).toBeNull();
    expect(validator(new FormControl('123456'))).toBeNull();
  });

  it('rejects a value shorter than minLength', () => {
    const result = validator(new FormControl('123'));
    expect(result).toEqual({
      solarisOtpLength: { requiredLength: 6, actualLength: 3 },
    });
  });

  it('rejects a value longer than maxLength', () => {
    const result = validator(new FormControl('1234567'));
    expect(result).toEqual({
      solarisOtpLength: { requiredLength: 6, actualLength: 7 },
    });
  });
});
