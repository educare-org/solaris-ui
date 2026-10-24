import {
  type EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';

import type { SolarisCodeHighlighter } from './code-block.types';

export const SOLARIS_CODE_HIGHLIGHTER =
  new InjectionToken<SolarisCodeHighlighter>('SOLARIS_CODE_HIGHLIGHTER');

export function provideSolarisCodeHighlighter(
  highlighter: SolarisCodeHighlighter,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SOLARIS_CODE_HIGHLIGHTER,
      useValue: highlighter,
    },
  ]);
}
