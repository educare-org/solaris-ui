import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DomainCheckFn } from '../model/email-field.types';

const BASIC_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function solarisEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') {
      return null;
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }
    if (!BASIC_EMAIL_REGEX.test(trimmed)) {
      return { solarisEmail: true };
    }
    return null;
  };
}

function solarisDomainValidator(
  domains: string[],
  checkFn: DomainCheckFn,
  errorKey: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') {
      return null;
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const atIndex = trimmed.lastIndexOf('@');
    if (atIndex < 0) {
      return null;
    }
    const domain = trimmed.slice(atIndex + 1).toLowerCase();
    if (!domain) {
      return null;
    }
    const normalizedDomains = domains.map((d) => d.toLowerCase().trim());
    if (checkFn(normalizedDomains, domain)) {
      return { [errorKey]: true };
    }
    return null;
  };
}

export function solarisAllowedDomainsValidator(
  allowedDomains: string[],
): ValidatorFn {
  return solarisDomainValidator(
    allowedDomains,
    (normalized, domain) => !normalized.includes(domain),
    'solarisEmailAllowedDomain',
  );
}

export function solarisBlockedDomainsValidator(
  blockedDomains: string[],
): ValidatorFn {
  return solarisDomainValidator(
    blockedDomains,
    (normalized, domain) => normalized.includes(domain),
    'solarisEmailBlockedDomain',
  );
}

export function extractDomain(value: string): string | null {
  const trimmed = value.trim();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex < 0) {
    return null;
  }
  const domain = trimmed.slice(atIndex + 1);
  return domain || null;
}

export function isValidEmailFormat(value: string): boolean {
  if (!value) return false;
  return BASIC_EMAIL_REGEX.test(value.trim());
}

export function isDomainAllowed(
  domain: string,
  allowedDomains: string[],
): boolean {
  return allowedDomains
    .map((d) => d.toLowerCase().trim())
    .includes(domain.toLowerCase().trim());
}

export function isDomainBlocked(
  domain: string,
  blockedDomains: string[],
): boolean {
  return blockedDomains
    .map((d) => d.toLowerCase().trim())
    .includes(domain.toLowerCase().trim());
}
