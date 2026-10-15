import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

import { SolarisProgressComponent } from '../../../feedback/progress';
import { SolarisIconComponent } from '../../../icon';
import { SolarisTranslateService } from '../../../../services/translation';
import { formatFileSize } from '../model/upload-state';

import type { SolarisFileUploadItem } from '../model/file-upload.types';

@Component({
  selector: 'solaris-file-list-item',
  standalone: true,
  imports: [SolarisProgressComponent, SolarisIconComponent],
  templateUrl: './file-list-item.component.html',
  styleUrls: ['./file-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-file-list-item',
    role: 'listitem',
    '[attr.data-status]': 'item().status',
  },
})
export class SolarisFileListItemComponent {
  private readonly translateService = inject(SolarisTranslateService);

  readonly item = input.required<SolarisFileUploadItem>();
  readonly maxSize = input<number | undefined>(undefined);
  readonly removeLabel = input<string>();
  readonly removeLabelKey = input<string>();
  readonly retryLabel = input<string>();
  readonly retryLabelKey = input<string>();

  readonly removed = output<string>();
  readonly retried = output<string>();

  protected readonly sizeText = computed(() =>
    formatFileSize(this.item().file.size),
  );

  protected readonly iconName = computed(() => {
    const mime = this.item().file.type.toLowerCase();
    if (mime.startsWith('image/')) {
      return 'image';
    }
    if (mime.startsWith('video/')) {
      return 'video';
    }
    if (mime.startsWith('audio/')) {
      return 'mic';
    }
    return 'file-text';
  });

  protected readonly statusText = computed(() => {
    return this.translateService.translate(
      `solaris.file-upload.status.${this.item().status}`,
    );
  });

  protected readonly errorText = computed<string | null>(() => {
    const error = this.item().error;
    if (this.item().status !== 'error' || !error) {
      return null;
    }
    if (error === 'max-size') {
      return this.translateService.translate(
        'solaris.file-upload.error.max-size',
        { size: formatFileSize(this.maxSize() ?? 0) },
      );
    }
    if (error === 'max-files') {
      return this.translateService.translate(
        'solaris.file-upload.error.max-files',
        { count: 0 },
      );
    }
    if (error === 'type-not-allowed') {
      return this.translateService.translate(
        'solaris.file-upload.error.type-not-allowed',
      );
    }
    return this.translateService.translate(
      'solaris.file-upload.error.upload-failed',
      { name: this.item().file.name },
    );
  });

  protected readonly progressAriaLabel = computed(() => {
    return `${this.item().file.name}, ${this.item().progress}%`;
  });

  protected readonly canRetry = computed(
    () =>
      this.item().status === 'error' &&
      this.item().error !== 'max-size' &&
      this.item().error !== 'max-files' &&
      this.item().error !== 'type-not-allowed',
  );

  protected readonly removeText = computed(() => {
    const direct = this.removeLabel();
    if (direct) {
      return direct;
    }
    const key = this.removeLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.file-upload.remove', {
      name: this.item().file.name,
    });
  });

  protected readonly retryText = computed(() => {
    const direct = this.retryLabel();
    if (direct) {
      return direct;
    }
    const key = this.retryLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.file-upload.retry', {
      name: this.item().file.name,
    });
  });
}
