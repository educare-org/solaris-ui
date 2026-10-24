import { Component, inject } from '@angular/core';

import {
  SOLARIS_FILE_UPLOAD_DEFAULT_MAX_FILES,
  SOLARIS_FILE_UPLOAD_DEFAULT_MAX_SIZE,
  SolarisFileUploadComponent,
  SolarisToastService,
  SolarisTranslateService,
  type SolarisFileRejected,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-file-upload-example',
  imports: [SolarisFileUploadComponent],
  templateUrl: './basic.component.html',
})
export class BasicFileUploadExample {
  private readonly toastService = inject(SolarisToastService);
  private readonly translateService = inject(SolarisTranslateService);

  // Para alterar o limite, mude este valor (em bytes) — ex.: 5 * 1024 * 1024 = 5 MB.
  // `undefined` = sem limite. O mesmo valor é usado no `[maxSize]` e no toast.
  protected readonly maxSize = SOLARIS_FILE_UPLOAD_DEFAULT_MAX_SIZE;
  protected readonly maxFiles = SOLARIS_FILE_UPLOAD_DEFAULT_MAX_FILES;

  protected onFileRejected(rejected: readonly SolarisFileRejected[]): void {
    for (const entry of rejected) {
      if (entry.error === 'max-size') {
        this.toastService.warning({
          title: this.translateService.translate(
            'solaris.file-upload.error.max-size',
            { size: this.formatSize(this.maxSize) },
          ),
          description: entry.file.name,
        });
      } else if (entry.error === 'max-files') {
        this.toastService.warning({
          title: this.translateService.translate(
            'solaris.file-upload.error.max-files',
            { count: String(this.maxFiles) },
          ),
          description: entry.file.name,
        });
      } else {
        this.toastService.warning({
          title: this.translateService.translate(
            'solaris.file-upload.error.type-not-allowed',
          ),
          description: entry.file.name,
        });
      }
    }
  }

  private formatSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes < 0) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    const rounded = Math.round(value * 10) / 10;
    return `${rounded} ${units[unitIndex]}`;
  }
}
