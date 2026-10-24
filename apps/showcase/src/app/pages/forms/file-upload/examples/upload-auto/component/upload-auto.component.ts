import { Component, inject } from '@angular/core';

import {
  SOLARIS_FILE_UPLOAD_DEFAULT_MAX_FILES,
  SOLARIS_FILE_UPLOAD_DEFAULT_MAX_SIZE,
  SOLARIS_FILE_UPLOAD_HANDLER,
  SolarisFileUploadComponent,
  SolarisToastService,
  SolarisTranslateService,
  type SolarisFileRejected,
} from '@solaris-ui/angular';

import { SimulatedUploadHandler } from '../../shared/simulated-upload.handler';

@Component({
  standalone: true,
  selector: 'app-upload-auto-file-upload-example',
  imports: [SolarisFileUploadComponent],
  providers: [
    { provide: SOLARIS_FILE_UPLOAD_HANDLER, useClass: SimulatedUploadHandler },
  ],
  templateUrl: './upload-auto.component.html',
})
export class UploadAutoFileUploadExample {
  private readonly toastService = inject(SolarisToastService);
  private readonly translateService = inject(SolarisTranslateService);

  protected onFileRejected(rejected: readonly SolarisFileRejected[]): void {
    for (const entry of rejected) {
      if (entry.error === 'max-size') {
        this.toastService.warning({
          title: this.translateService.translate(
            'solaris.file-upload.error.max-size',
            { size: this.formatSize(SOLARIS_FILE_UPLOAD_DEFAULT_MAX_SIZE) },
          ),
          description: entry.file.name,
        });
      } else if (entry.error === 'max-files') {
        this.toastService.warning({
          title: this.translateService.translate(
            'solaris.file-upload.error.max-files',
            { count: String(SOLARIS_FILE_UPLOAD_DEFAULT_MAX_FILES) },
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
