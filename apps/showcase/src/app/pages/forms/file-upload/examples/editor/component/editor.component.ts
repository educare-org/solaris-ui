import { Component, inject, input, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisDialogService,
  SolarisImageEditorComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisImageEditorAspect,
  type SolarisImageEditorShape,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-file-upload-editor-example',
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './editor.component.html',
})
export class FileUploadEditorExample {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly dialogService = inject(SolarisDialogService);

  readonly aspect = input<SolarisImageEditorAspect>('free');
  readonly shape = input<SolarisImageEditorShape>('rect');

  protected readonly savedInfo = signal<string | null>(null);

  protected openEditor(): void {
    const image = this.generateDemoImage();
    const ref = this.dialogService.openComponent(SolarisImageEditorComponent, {
      title: this.translateService.translate('file-upload.editor.dialog-title'),
      width: 'fit-content',
      data: { image, aspect: this.aspect(), shape: this.shape() },
    });
    ref.afterClosed().subscribe((edited) => {
      if (edited instanceof File) {
        this.savedInfo.set(
          this.translateService.translate('file-upload.editor.saved', {
            name: edited.name,
            size: edited.size,
          }),
        );
      }
    });
  }

  private generateDemoImage(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const context = canvas.getContext('2d');
    if (!context) {
      return '';
    }
    const gradient = context.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#3f5dca');
    gradient.addColorStop(1, '#7a3fd1');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 800, 600);
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(400, 300, 140, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#f1d008';
    context.beginPath();
    context.arc(250, 200, 60, 0, Math.PI * 2);
    context.fill();
    return canvas.toDataURL('image/png');
  }
}
