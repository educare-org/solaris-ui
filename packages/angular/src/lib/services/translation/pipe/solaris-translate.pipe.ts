import { Pipe, type PipeTransform, inject } from '@angular/core';

import { SolarisTranslateService } from '../service/solaris-translate.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class SolarisTranslatePipe implements PipeTransform {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  transform(
    key: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    return this.translateService?.translate(key, params) ?? key;
  }
}
