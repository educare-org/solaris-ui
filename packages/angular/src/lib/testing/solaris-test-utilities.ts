import { type TestModuleMetadata, TestBed } from '@angular/core/testing';

import {
  provideSolarisTesting,
  type SolarisTestingOptions,
} from './provide-solaris-testing';

export function configureSolarisTesting(
  options?: SolarisTestingOptions,
  extraConfig?: Partial<TestModuleMetadata>,
): void {
  TestBed.configureTestingModule({
    ...extraConfig,
    providers: [
      ...provideSolarisTesting(options),
      ...(extraConfig?.providers ?? []),
    ],
  });
}

export function assertPresent<T>(
  value: T | null | undefined,
  message: string,
): T {
  if (value === null || value === undefined) {
    throw new Error(`expected ${message} to be present`);
  }
  return value;
}
