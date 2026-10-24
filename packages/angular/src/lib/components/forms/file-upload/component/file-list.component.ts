import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';

import { SolarisFileListItemComponent } from './file-list-item.component';

import type { SolarisFileUploadItem } from '../model/file-upload.types';

@Component({
  selector: 'solaris-file-list',
  standalone: true,
  imports: [SolarisFileListItemComponent],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-file-list',
    role: 'list',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
})
export class SolarisFileListComponent {
  private readonly translateService = inject(SolarisTranslateService);

  readonly items = input<readonly SolarisFileUploadItem[]>([]);
  readonly maxSize = input<number | undefined>(undefined);
  readonly label = input<string>();
  readonly labelKey = input<string>();
  readonly removeLabel = input<string>();
  readonly removeLabelKey = input<string>();
  readonly retryLabel = input<string>();
  readonly retryLabelKey = input<string>();

  readonly removed = output<string>();
  readonly retried = output<string>();

  protected readonly resolvedAriaLabel = computed<string | null>(() => {
    const direct = this.label();
    if (direct) {
      return direct;
    }
    const key = this.labelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.file-upload.list');
  });
}
