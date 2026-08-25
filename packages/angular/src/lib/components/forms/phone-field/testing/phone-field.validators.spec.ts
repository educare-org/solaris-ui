import { FormControl } from '@angular/forms';
import { solarisPhoneValidator } from '../validators/phone-field.validators';

describe('solarisPhoneValidator', () => {
  const validator = solarisPhoneValidator();

  it('returns null for empty and null values', () => {
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl(undefined))).toBeNull();
  });

  it('accepts a valid international number', () => {
    expect(validator(new FormControl('+5511999998888'))).toBeNull();
    expect(validator(new FormControl('+14155552671'))).toBeNull();
  });

  it('rejects an invalid number', () => {
    const result = validator(new FormControl('123'));
    expect(result).toEqual({ solarisPhoneInvalid: true });
  });

  it('validates against a specific country when provided', () => {
    const brValidator = solarisPhoneValidator('BR');
    expect(brValidator(new FormControl('11999998888'))).toBeNull();
    expect(brValidator(new FormControl('11999'))).toEqual({
      solarisPhoneInvalid: true,
    });
  });
});
