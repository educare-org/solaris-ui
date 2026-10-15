import { Component, inject, input, viewChild } from '@angular/core';

import {
  SolarisDialogService,
  SolarisFileUploadComponent,
  SolarisImageEditorComponent,
  SolarisToastService,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisFileRejected,
  type SolarisFileUploadDensity,
  type SolarisFileUploadSize,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-avatar-file-upload-example',
  imports: [SolarisFileUploadComponent, SolarisTranslatePipe],
  templateUrl: './avatar.component.html',
})
export class AvatarFileUploadExample {
  private readonly dialogService = inject(SolarisDialogService);
  private readonly toastService = inject(SolarisToastService);
  private readonly translateService = inject(SolarisTranslateService);

  readonly size = input<SolarisFileUploadSize>('md');
  readonly density = input<SolarisFileUploadDensity>();

  private readonly uploader = viewChild<SolarisFileUploadComponent>('uploader');

  protected onPhotoSelected(files: readonly File[]): void {
    const photo = files.find((file) => file.type.startsWith('image/'));
    if (!photo) {
      return;
    }
    const ref = this.dialogService.openComponent(SolarisImageEditorComponent, {
      title: this.translateService.translate('file-upload.editor.dialog-title'),
      width: 'fit-content',
      data: { image: photo, aspect: '1:1', shape: 'circle' },
    });
    ref.afterClosed().subscribe((edited) => {
      if (edited instanceof File) {
        this.uploader()?.writeValue([edited]);
        this.toastService.success({
          title: this.translateService.translate(
            'file-upload.modes.avatar-saved',
            { name: edited.name },
          ),
        });
      }
    });
  }

  protected onFileRejected(rejected: readonly SolarisFileRejected[]): void {
    for (const entry of rejected) {
      this.toastService.warning({
        title: this.translateService.translate(
          'solaris.file-upload.error.type-not-allowed',
        ),
        description: entry.file.name,
      });
    }
  }
}
