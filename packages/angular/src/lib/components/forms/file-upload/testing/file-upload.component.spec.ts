import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { vi, afterEach } from 'vitest';

import { SolarisFileUploadComponent } from '../component/file-upload.component';
import { SOLARIS_FILE_UPLOAD_HANDLER } from '../model/file-upload.tokens';
import {
  SolarisFileUploadHandler,
  type SolarisFileUploadOptions,
  type SolarisFileUploadResponse,
} from '../model/file-upload.types';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

function makeFile(
  name = 'doc.pdf',
  size = 100,
  type = 'application/pdf',
): File {
  return new File([new Uint8Array(Math.max(1, size))], name, { type });
}

class MockUploadHandler extends SolarisFileUploadHandler {
  calls: File[] = [];
  shouldFail = false;
  progressSteps: number[] = [];
  response: SolarisFileUploadResponse = {};
  pendingResolvers: Array<() => void> = [];

  holdUntilReleased = false;

  async upload(
    file: File,
    options: SolarisFileUploadOptions,
  ): Promise<SolarisFileUploadResponse> {
    this.calls.push(file);
    for (const step of this.progressSteps) {
      options.onProgress(step);
    }
    if (this.holdUntilReleased) {
      await new Promise<void>((resolve) => {
        this.pendingResolvers.push(resolve);
        options.signal.addEventListener('abort', () => resolve(), {
          once: true,
        });
      });
      if (options.signal.aborted) {
        throw new DOMException('Upload aborted.', 'AbortError');
      }
    }
    if (this.shouldFail) {
      throw new Error('Upload failed.');
    }
    return this.response;
  }

  release(): void {
    const resolvers = [...this.pendingResolvers];
    this.pendingResolvers = [];
    for (const resolve of resolvers) {
      resolve();
    }
  }
}

const mockHandler = new MockUploadHandler();

function setNativeFiles(input: HTMLInputElement, files: File[]): void {
  Object.defineProperty(input, 'files', {
    value: files,
    configurable: true,
  });
  input.dispatchEvent(new Event('change'));
}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload label="Attachments"></solaris-file-upload>`,
})
class BasicHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Avatar"
    variant="button"
  ></solaris-file-upload>`,
})
class ButtonVariantHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Avatar"
    variant="avatar"
    accept="image/*"
    [multiple]="false"
  ></solaris-file-upload>`,
})
class AvatarVariantHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Attachment"
    variant="field"
  ></solaris-file-upload>`,
})
class FieldVariantHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Attachments"
    [disabled]="true"
  ></solaris-file-upload>`,
})
class DisabledHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Attachments"
    [readonly]="true"
  ></solaris-file-upload>`,
})
class ReadonlyHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Photos"
    accept="image/*"
    [maxSize]="500"
    [maxFiles]="1"
  ></solaris-file-upload>`,
})
class ConstrainedHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Attachments"
    [required]="true"
  ></solaris-file-upload>`,
})
class RequiredHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Attachments"
    size="lg"
    density="compact"
  ></solaris-file-upload>`,
})
class SizeDensityHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Attachments"
    uploadUrl="/api/uploads"
  ></solaris-file-upload>`,
  providers: [{ provide: SOLARIS_FILE_UPLOAD_HANDLER, useValue: mockHandler }],
})
class UploadHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Attachments"
    uploadUrl="/api/uploads"
    [autoUpload]="false"
  ></solaris-file-upload>`,
  providers: [{ provide: SOLARIS_FILE_UPLOAD_HANDLER, useValue: mockHandler }],
})
class ManualUploadHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<solaris-file-upload
    label="Attachments"
    [allowUrl]="true"
  ></solaris-file-upload>`,
})
class UrlHost {}

@Component({
  standalone: true,
  imports: [SolarisFileUploadComponent, ReactiveFormsModule],
  template: `<form [formGroup]="form">
    <solaris-file-upload
      formControlName="attachments"
      label="Attachments"
    ></solaris-file-upload>
  </form>`,
})
class ReactiveFormsHost {
  readonly form = new FormGroup({
    attachments: new FormControl<readonly File[] | null>(null),
  });
}

function uploadInstance(
  fixture: ComponentFixture<unknown>,
): SolarisFileUploadComponent {
  return fixture.debugElement.query(By.css('solaris-file-upload'))
    .componentInstance as SolarisFileUploadComponent;
}

describe('SolarisFileUploadComponent', () => {
  beforeEach(async () => {
    mockHandler.calls = [];
    mockHandler.shouldFail = false;
    mockHandler.progressSteps = [];
    mockHandler.response = {};
    mockHandler.holdUntilReleased = false;
    mockHandler.pendingResolvers = [];
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
  });

  describe('rendering', () => {
    it('renders the dropzone trigger by default', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      expect(host.nativeElement.getAttribute('data-variant')).toBe('dropzone');
      expect(
        fixture.debugElement.query(By.css('.solaris-file-upload__dropzone')),
      ).toBeTruthy();
    });

    it('renders the button variant', () => {
      const fixture = TestBed.createComponent(ButtonVariantHost);
      fixture.detectChanges();
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      expect(host.nativeElement.getAttribute('data-variant')).toBe('button');
      expect(
        fixture.debugElement.query(By.css('.solaris-file-upload__trigger')),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('.solaris-file-upload__dropzone')),
      ).toBeNull();
    });

    it('renders the avatar variant as a photo panel', () => {
      const fixture = TestBed.createComponent(AvatarVariantHost);
      fixture.detectChanges();
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      expect(host.nativeElement.getAttribute('data-variant')).toBe('avatar');
      const avatar = fixture.debugElement.query(
        By.css('.solaris-file-upload__avatar'),
      );
      expect(avatar).toBeTruthy();
      expect(avatar.nativeElement.tagName).toBe('BUTTON');
      expect(avatar.nativeElement.getAttribute('aria-label')).toBe(
        'Profile photo',
      );
      expect(avatar.nativeElement.textContent).toContain(
        'Drop your photo here or',
      );
      expect(avatar.nativeElement.textContent).toContain('Select a file');
      expect(
        fixture.debugElement.query(
          By.css('.solaris-file-upload__avatar-circle'),
        ),
      ).toBeTruthy();
    });

    it('shows the supports hint from accept and max size', () => {
      @Component({
        standalone: true,
        imports: [SolarisFileUploadComponent, ReactiveFormsModule],
        template: `<solaris-file-upload
          label="Photo"
          variant="avatar"
          accept="image/*"
          [maxSize]="1048576"
          [multiple]="false"
        ></solaris-file-upload>`,
      })
      class AvatarHintHost {}
      const fixture = TestBed.createComponent(AvatarHintHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Supports: images');
      expect(fixture.nativeElement.textContent).toContain('Up to 1 MB');
    });

    it('swaps the avatar headline while dragging over', () => {
      const fixture = TestBed.createComponent(AvatarVariantHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(
        'Drop your photo here or',
      );
      fixture.debugElement
        .query(By.css('.solaris-file-upload__body'))
        .triggerEventHandler('dragenter', {
          preventDefault: () => undefined,
        });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Drop files here');
      expect(fixture.nativeElement.textContent).not.toContain('Select a file');
    });

    it('renders the field variant as a single-line trigger', () => {
      const fixture = TestBed.createComponent(FieldVariantHost);
      fixture.detectChanges();
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      expect(host.nativeElement.getAttribute('data-variant')).toBe('field');
      const field = fixture.debugElement.query(
        By.css('.solaris-file-upload__field'),
      );
      expect(field).toBeTruthy();
      expect(field.nativeElement.tagName).toBe('BUTTON');
      expect(field.nativeElement.textContent).toContain('Drag or browse files');
      expect(
        fixture.debugElement.query(By.css('.solaris-file-upload__dropzone')),
      ).toBeNull();
    });

    it('keeps the main shell borderless so triggers own their chrome', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const shells = fixture.debugElement.queryAll(
        By.css('solaris-form-field'),
      );
      expect(shells).toHaveLength(1);
      expect(shells[0].nativeElement.getAttribute('data-appearance')).toBe(
        'minimal',
      );
    });

    it('exposes size and density for the dropzone matrix', () => {
      const fixture = TestBed.createComponent(SizeDensityHost);
      fixture.detectChanges();
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      expect(host.nativeElement.getAttribute('data-size')).toBe('lg');
      expect(host.nativeElement.getAttribute('data-density')).toBe('compact');
    });

    it('defaults to md size with the theme density', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      expect(host.nativeElement.getAttribute('data-size')).toBe('md');
      expect(host.nativeElement.getAttribute('data-density')).toBeTruthy();
    });

    it('renders label and default dropzone texts', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Attachments');
      expect(fixture.nativeElement.textContent).toContain(
        'Drag and drop files here, or',
      );
      expect(fixture.nativeElement.textContent).toContain('Browse files');
    });

    it('shows the max size hint by default', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Up to 10 MB');
    });

    it('exposes a polite live region', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const live = fixture.debugElement.query(
        By.css('.solaris-file-upload__announcement'),
      );
      expect(live.nativeElement.getAttribute('aria-live')).toBe('polite');
      expect(live.nativeElement.getAttribute('role')).toBe('status');
    });
  });

  describe('selection', () => {
    it('adds selected files to the list and emits filesChange', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const emitted: Array<readonly File[]> = [];
      instance.filesChange.subscribe((files) => emitted.push(files));
      const file = makeFile();
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [file],
      );
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('solaris-file-list')),
      ).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('doc.pdf');
      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toEqual([file]);
    });

    it('announces added files', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile(), makeFile('b.pdf')],
      );
      fixture.detectChanges();
      const live = fixture.debugElement.query(
        By.css('.solaris-file-upload__announcement'),
      );
      expect(live.nativeElement.textContent).toContain('2 files added.');
    });

    it('opens the picker when the dropzone is clicked', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const native = fixture.debugElement.query(By.css('input[type="file"]'))
        .nativeElement as HTMLInputElement;
      const click = vi.spyOn(native, 'click');
      fixture.debugElement
        .query(By.css('.solaris-file-upload__dropzone'))
        .nativeElement.click();
      expect(click).toHaveBeenCalled();
    });

    it('opens the picker when the field variant is clicked', () => {
      const fixture = TestBed.createComponent(FieldVariantHost);
      fixture.detectChanges();
      const native = fixture.debugElement.query(By.css('input[type="file"]'))
        .nativeElement as HTMLInputElement;
      const click = vi.spyOn(native, 'click');
      fixture.debugElement
        .query(By.css('.solaris-file-upload__field'))
        .nativeElement.click();
      expect(click).toHaveBeenCalled();
    });

    it('moves focus to the field trigger via focus()', () => {
      const fixture = TestBed.createComponent(FieldVariantHost);
      fixture.detectChanges();
      uploadInstance(fixture).focus();
      const trigger = fixture.debugElement.query(
        By.css('.solaris-file-upload__field'),
      );
      expect(document.activeElement).toBe(trigger.nativeElement);
    });

    it('swaps the field text while dragging over', () => {
      const fixture = TestBed.createComponent(FieldVariantHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(
        'Drag or browse files',
      );
      fixture.debugElement
        .query(By.css('.solaris-file-upload__body'))
        .triggerEventHandler('dragenter', {
          preventDefault: () => undefined,
        });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Drop files here');
    });

    it('honours a custom field label', () => {
      @Component({
        standalone: true,
        imports: [SolarisFileUploadComponent, ReactiveFormsModule],
        template: `<solaris-file-upload
          label="Attachment"
          variant="field"
          fieldLabel="Arraste ou procure o arquivo"
        ></solaris-file-upload>`,
      })
      class CustomFieldHost {}
      const fixture = TestBed.createComponent(CustomFieldHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(
        'Arraste ou procure o arquivo',
      );
    });

    it('uses a native button trigger for keyboard support', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(
        By.css('.solaris-file-upload__dropzone'),
      );
      expect(trigger.nativeElement.tagName).toBe('BUTTON');
      expect(trigger.nativeElement.getAttribute('type')).toBe('button');
    });

    it('moves focus to the trigger via focus()', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      uploadInstance(fixture).focus();
      const trigger = fixture.debugElement.query(
        By.css('.solaris-file-upload__dropzone'),
      );
      expect(document.activeElement).toBe(trigger.nativeElement);
    });

    it('does not open the picker when disabled', () => {
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const native = fixture.debugElement.query(By.css('input[type="file"]'))
        .nativeElement as HTMLInputElement;
      const click = vi.spyOn(native, 'click');
      const trigger = fixture.debugElement.query(
        By.css('.solaris-file-upload__dropzone'),
      );
      expect(trigger.nativeElement.disabled).toBe(true);
      trigger.nativeElement.click();
      expect(click).not.toHaveBeenCalled();
    });

    it('ignores drops when readonly', () => {
      const fixture = TestBed.createComponent(ReadonlyHost);
      fixture.detectChanges();
      fixture.debugElement
        .query(By.css('.solaris-file-upload__body'))
        .triggerEventHandler('drop', {
          preventDefault: () => undefined,
          dataTransfer: { files: [makeFile()] },
        });
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('solaris-file-list')),
      ).toBeNull();
    });
  });

  describe('drag and drop', () => {
    it('sets data-dragover while dragging over', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      const body = fixture.debugElement.query(
        By.css('.solaris-file-upload__body'),
      );
      body.triggerEventHandler('dragenter', {
        preventDefault: () => undefined,
      });
      body.triggerEventHandler('dragover', { preventDefault: () => undefined });
      fixture.detectChanges();
      expect(host.nativeElement.hasAttribute('data-dragover')).toBe(true);
      body.triggerEventHandler('dragleave', {
        preventDefault: () => undefined,
      });
      fixture.detectChanges();
      expect(host.nativeElement.hasAttribute('data-dragover')).toBe(false);
    });

    it('adds dropped files', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      fixture.debugElement
        .query(By.css('.solaris-file-upload__body'))
        .triggerEventHandler('drop', {
          preventDefault: () => undefined,
          dataTransfer: { files: [makeFile('dropped.pdf')] },
        });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('dropped.pdf');
    });

    it('swaps the headline while dragging over', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(
        'Drag and drop files here, or',
      );
      fixture.debugElement
        .query(By.css('.solaris-file-upload__body'))
        .triggerEventHandler('dragenter', {
          preventDefault: () => undefined,
        });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Drop files here');
      expect(fixture.nativeElement.textContent).not.toContain('Browse files');
    });

    it('honours a custom drop-active label', () => {
      @Component({
        standalone: true,
        imports: [SolarisFileUploadComponent, ReactiveFormsModule],
        template: `<solaris-file-upload
          label="Attachments"
          dropActiveLabel="Solte aqui"
        ></solaris-file-upload>`,
      })
      class DropActiveHost {}
      const fixture = TestBed.createComponent(DropActiveHost);
      fixture.detectChanges();
      fixture.debugElement
        .query(By.css('.solaris-file-upload__body'))
        .triggerEventHandler('dragenter', {
          preventDefault: () => undefined,
        });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Solte aqui');
    });
  });

  describe('avatar variant', () => {
    beforeEach(() => {
      Object.defineProperty(URL, 'createObjectURL', {
        value: () => 'blob:avatar-preview',
        configurable: true,
      });
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: () => undefined,
        configurable: true,
      });
    });

    afterEach(() => {
      const urlRecord = URL as unknown as Record<string, unknown>;
      delete urlRecord['createObjectURL'];
      delete urlRecord['revokeObjectURL'];
    });
    it('opens the picker when the avatar is clicked', () => {
      const fixture = TestBed.createComponent(AvatarVariantHost);
      fixture.detectChanges();
      const native = fixture.debugElement.query(By.css('input[type="file"]'))
        .nativeElement as HTMLInputElement;
      const click = vi.spyOn(native, 'click');
      fixture.debugElement
        .query(By.css('.solaris-file-upload__avatar'))
        .nativeElement.click();
      expect(click).toHaveBeenCalled();
    });

    it('previews the selected image inside the circle', () => {
      const fixture = TestBed.createComponent(AvatarVariantHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      expect(
        fixture.debugElement.query(
          By.css('.solaris-file-upload__avatar-image'),
        ),
      ).toBeNull();
      instance.writeValue([
        new File(['bytes'], 'me.png', { type: 'image/png' }),
      ]);
      fixture.detectChanges();
      const preview = fixture.debugElement.query(
        By.css('.solaris-file-upload__avatar-image'),
      ).nativeElement as HTMLImageElement;
      expect(preview).toBeTruthy();
      expect(preview.getAttribute('src')).toBe('blob:avatar-preview');
      expect(preview.getAttribute('alt')).toBe('');
    });

    it('keeps the placeholder for non-image files', () => {
      const fixture = TestBed.createComponent(AvatarVariantHost);
      fixture.detectChanges();
      uploadInstance(fixture).writeValue([makeFile('doc.pdf')]);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(
          By.css('.solaris-file-upload__avatar-image'),
        ),
      ).toBeNull();
      expect(
        fixture.debugElement.query(By.css('.solaris-file-upload__avatar-icon')),
      ).toBeTruthy();
    });

    it('hides the file list since the preview circle carries the state', () => {
      const fixture = TestBed.createComponent(AvatarVariantHost);
      fixture.detectChanges();
      uploadInstance(fixture).writeValue([
        new File(['bytes'], 'me.png', { type: 'image/png' }),
      ]);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(
          By.css('.solaris-file-upload__avatar-image'),
        ),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('solaris-file-list')),
      ).toBeNull();
    });
  });

  describe('validation', () => {
    it('rejects disallowed types and oversized files', () => {
      const fixture = TestBed.createComponent(ConstrainedHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const rejected: unknown[] = [];
      instance.fileRejected.subscribe((value) => rejected.push(value));
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [
          makeFile('doc.pdf', 100, 'application/pdf'),
          makeFile('huge.png', 900, 'image/png'),
        ],
      );
      fixture.detectChanges();
      expect(rejected).toHaveLength(1);
      const groups = rejected[0] as Array<{ error: string }>;
      expect(groups.map((entry) => entry.error).sort()).toEqual([
        'max-size',
        'type-not-allowed',
      ]);
      expect(
        fixture.debugElement.query(By.css('solaris-file-list')),
      ).toBeNull();
    });

    it('rejects files beyond maxFiles', () => {
      const fixture = TestBed.createComponent(ConstrainedHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const rejected: unknown[] = [];
      instance.fileRejected.subscribe((value) => rejected.push(value));
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [
          makeFile('a.png', 10, 'image/png'),
          makeFile('b.png', 10, 'image/png'),
        ],
      );
      fixture.detectChanges();
      expect(
        fixture.debugElement.queryAll(By.css('solaris-file-list-item')),
      ).toHaveLength(1);
      expect((rejected[0] as Array<{ error: string }>)[0].error).toBe(
        'max-files',
      );
    });

    it('shows the required error after the picker is cancelled', () => {
      const fixture = TestBed.createComponent(RequiredHost);
      fixture.detectChanges();
      const native = fixture.debugElement.query(By.css('input[type="file"]'))
        .nativeElement as HTMLInputElement;
      native.dispatchEvent(new Event('cancel'));
      fixture.detectChanges();
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      expect(host.nativeElement.getAttribute('data-invalid')).not.toBeNull();
      expect(fixture.nativeElement.textContent).toContain(
        'Select at least one file.',
      );
    });
  });

  describe('ControlValueAccessor', () => {
    it('hydrates items from writeValue without uploading', () => {
      const fixture = TestBed.createComponent(UploadHost);
      fixture.detectChanges();
      uploadInstance(fixture).writeValue([makeFile('saved.pdf')]);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('saved.pdf');
      expect(mockHandler.calls).toHaveLength(0);
    });

    it('propagates selection to the registered onChange', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const seen: Array<readonly File[]> = [];
      instance.registerOnChange((value) => seen.push(value));
      const file = makeFile();
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [file],
      );
      expect(seen).toEqual([[file]]);
    });

    it('marks touched on picker cancel', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      let touched = false;
      uploadInstance(fixture).registerOnTouched(() => {
        touched = true;
      });
      const native = fixture.debugElement.query(By.css('input[type="file"]'))
        .nativeElement as HTMLInputElement;
      native.dispatchEvent(new Event('cancel'));
      expect(touched).toBe(true);
    });

    it('reflects setDisabledState', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      uploadInstance(fixture).setDisabledState(true);
      fixture.detectChanges();
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      expect(host.nativeElement.hasAttribute('data-disabled')).toBe(true);
      const native = fixture.debugElement.query(By.css('input[type="file"]'))
        .nativeElement as HTMLInputElement;
      expect(native.disabled).toBe(true);
    });

    it('works with Reactive Forms', () => {
      const fixture = TestBed.createComponent(ReactiveFormsHost);
      fixture.detectChanges();
      const host = fixture.componentInstance as ReactiveFormsHost;
      const file = makeFile('form.pdf');
      host.form.controls.attachments.setValue([file]);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('form.pdf');
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile('other.pdf')],
      );
      expect(
        host.form.controls.attachments.value?.map((file) => file.name),
      ).toEqual(['form.pdf', 'other.pdf']);
    });

    it('clears the selection via clear()', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      instance.writeValue([makeFile()]);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('solaris-file-list')),
      ).toBeTruthy();
      instance.clear();
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('solaris-file-list')),
      ).toBeNull();
    });
  });

  describe('upload flow', () => {
    it('uploads added files and reports completion', async () => {
      const fixture = TestBed.createComponent(UploadHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const completed: unknown[] = [];
      const progresses: unknown[] = [];
      instance.uploadCompleted.subscribe((value) => completed.push(value));
      instance.uploadProgress.subscribe((value) => progresses.push(value));
      mockHandler.progressSteps = [50];
      mockHandler.response = { url: 'https://cdn.example/f.pdf' };
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile('f.pdf')],
      );
      await fixture.whenStable();
      fixture.detectChanges();
      expect(mockHandler.calls).toHaveLength(1);
      expect(progresses).toEqual([
        { itemId: expect.any(String), progress: 50 },
      ]);
      expect(completed).toEqual([
        { itemId: expect.any(String), url: 'https://cdn.example/f.pdf' },
      ]);
      const item = fixture.debugElement.query(By.css('solaris-file-list-item'));
      expect(item.nativeElement.getAttribute('data-status')).toBe('success');
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      expect(host.nativeElement.getAttribute('aria-busy')).toBeNull();
    });

    it('marks failures and retries on demand', async () => {
      const fixture = TestBed.createComponent(UploadHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const failed: unknown[] = [];
      instance.uploadFailed.subscribe((value) => failed.push(value));
      mockHandler.shouldFail = true;
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile('f.pdf')],
      );
      await fixture.whenStable();
      fixture.detectChanges();
      const item = fixture.debugElement.query(By.css('solaris-file-list-item'));
      expect(item.nativeElement.getAttribute('data-status')).toBe('error');
      expect(fixture.nativeElement.textContent).toContain(
        'Could not upload f.pdf.',
      );
      expect(failed).toHaveLength(1);
      mockHandler.shouldFail = false;
      const retry = fixture.debugElement.query(
        By.css('.solaris-file-list-item__action[aria-label^="Retry"]'),
      );
      retry.nativeElement.click();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(mockHandler.calls).toHaveLength(2);
      expect(
        fixture.debugElement
          .query(By.css('solaris-file-list-item'))
          .nativeElement.getAttribute('data-status'),
      ).toBe('success');
    });

    it('removes items and aborts in-flight uploads', async () => {
      const fixture = TestBed.createComponent(UploadHost);
      fixture.detectChanges();
      mockHandler.holdUntilReleased = true;
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile('f.pdf')],
      );
      await fixture.whenStable();
      fixture.detectChanges();
      expect(mockHandler.calls).toHaveLength(1);
      const host = fixture.debugElement.query(By.css('solaris-file-upload'));
      expect(host.nativeElement.getAttribute('aria-busy')).toBe('true');
      const remove = fixture.debugElement.query(
        By.css('.solaris-file-list-item__action[aria-label^="Remove"]'),
      );
      remove.nativeElement.click();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('solaris-file-list')),
      ).toBeNull();
    });

    it('defers uploads when autoUpload is false until uploadAll()', async () => {
      const fixture = TestBed.createComponent(ManualUploadHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile('f.pdf')],
      );
      await fixture.whenStable();
      expect(mockHandler.calls).toHaveLength(0);
      instance.uploadAll();
      await fixture.whenStable();
      expect(mockHandler.calls).toHaveLength(1);
    });
  });

  describe('security hardening', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('refuses non-http(s) urls without fetching', async () => {
      const fixture = TestBed.createComponent(UrlHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const failed: unknown[] = [];
      instance.urlFailed.subscribe((value) => failed.push(value));
      const fetchSpy = vi.fn();
      vi.stubGlobal('fetch', fetchSpy);
      const urlInput = fixture.debugElement.query(By.css('input[type="url"]'));
      urlInput.nativeElement.value = 'javascript:alert(1)';
      urlInput.triggerEventHandler('input', {
        target: urlInput.nativeElement,
      });
      fixture.debugElement
        .query(By.css('button[solaris-form-suffix-action]'))
        .nativeElement.click();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(failed).toHaveLength(1);
      expect((failed[0] as { error: string }).error).toBe('invalid-url');
    });

    it('refuses remote files over the download limit', async () => {
      const fixture = TestBed.createComponent(UrlHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const added: File[] = [];
      instance.urlAdded.subscribe((file) => added.push(file));
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(new Blob(['tiny']), {
            status: 200,
            headers: { 'Content-Length': '999999999' },
          }),
        ),
      );
      const urlInput = fixture.debugElement.query(By.css('input[type="url"]'));
      urlInput.nativeElement.value = 'https://cdn.example/huge.bin';
      urlInput.triggerEventHandler('input', {
        target: urlInput.nativeElement,
      });
      fixture.debugElement
        .query(By.css('button[solaris-form-suffix-action]'))
        .nativeElement.click();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(added).toHaveLength(0);
      expect(
        fixture.debugElement.query(By.css('.solaris-file-upload__announcement'))
          .nativeElement.textContent,
      ).toContain('exceeds');
    });

    it('announces rejected files in the live region', () => {
      const fixture = TestBed.createComponent(ConstrainedHost);
      fixture.detectChanges();
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile('huge.png', 900, 'image/png')],
      );
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.solaris-file-upload__announcement'))
          .nativeElement.textContent,
      ).toContain('rejected');
    });

    it('emits cancelled when an in-flight upload is removed', async () => {
      const fixture = TestBed.createComponent(UploadHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const cancelled: unknown[] = [];
      instance.cancelled.subscribe((value) => cancelled.push(value));
      mockHandler.holdUntilReleased = true;
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile('f.pdf')],
      );
      await fixture.whenStable();
      fixture.detectChanges();
      fixture.debugElement
        .query(By.css('.solaris-file-list-item__action[aria-label^="Remove"]'))
        .nativeElement.click();
      mockHandler.release();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(cancelled).toEqual([{ itemId: expect.any(String) }]);
    });

    it('clamps out-of-range progress from custom handlers', async () => {
      const fixture = TestBed.createComponent(UploadHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const progresses: unknown[] = [];
      instance.uploadProgress.subscribe((value) => progresses.push(value));
      mockHandler.progressSteps = [150];
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile('f.pdf')],
      );
      await fixture.whenStable();
      expect(progresses).toEqual([
        { itemId: expect.any(String), progress: 100 },
      ]);
    });

    it('queues uploads beyond maxConcurrent', async () => {
      @Component({
        standalone: true,
        imports: [SolarisFileUploadComponent, ReactiveFormsModule],
        template: `<solaris-file-upload
          label="Attachments"
          uploadUrl="/api/uploads"
          [maxConcurrent]="1"
        ></solaris-file-upload>`,
        providers: [
          { provide: SOLARIS_FILE_UPLOAD_HANDLER, useValue: mockHandler },
        ],
      })
      class QueuedHost {}
      const fixture = TestBed.createComponent(QueuedHost);
      fixture.detectChanges();
      mockHandler.holdUntilReleased = true;
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile('a.pdf'), makeFile('b.pdf')],
      );
      await fixture.whenStable();
      fixture.detectChanges();
      expect(mockHandler.calls).toHaveLength(1);
      mockHandler.release();
      await new Promise((resolve) => setTimeout(resolve, 0));
      await fixture.whenStable();
      fixture.detectChanges();
      expect(mockHandler.calls).toHaveLength(2);
    });

    it('ignores retry for items that are not failed', async () => {
      const fixture = TestBed.createComponent(UploadHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      mockHandler.holdUntilReleased = true;
      setNativeFiles(
        fixture.debugElement.query(By.css('input[type="file"]'))
          .nativeElement as HTMLInputElement,
        [makeFile('f.pdf')],
      );
      await fixture.whenStable();
      expect(mockHandler.calls).toHaveLength(1);
      const peek = instance as unknown as {
        items(): Array<{ id: string }>;
        onItemRetried(id: string): void;
      };
      const id = peek.items()[0]?.id ?? '';
      peek.onItemRetried(id);
      await fixture.whenStable();
      expect(mockHandler.calls).toHaveLength(1);
      mockHandler.release();
      await fixture.whenStable();
    });
  });

  describe('url section', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('hides the url section unless allowUrl is set', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('solaris-divider'))).toBeNull();
      expect(
        fixture.debugElement.queryAll(By.css('solaris-form-field')),
      ).toHaveLength(1);
    });

    it('renders a labelled url field with a divider and ghost action', () => {
      const fixture = TestBed.createComponent(UrlHost);
      fixture.detectChanges();
      const divider = fixture.debugElement.query(By.css('solaris-divider'));
      expect(divider).toBeTruthy();
      expect(divider.nativeElement.textContent).toContain('or');
      expect(divider.nativeElement.getAttribute('role')).toBe('separator');
      const fields = fixture.debugElement.queryAll(
        By.css('solaris-form-field'),
      );
      expect(fields).toHaveLength(2);
      expect(fixture.nativeElement.textContent).toContain('File URL');
      const urlInput = fixture.debugElement.query(By.css('input[type="url"]'));
      expect(urlInput).toBeTruthy();
      const add = fixture.debugElement.query(
        By.css('button[solaris-form-suffix-action]'),
      );
      expect(add.nativeElement.textContent).toContain('Add');
      expect(add.nativeElement.getAttribute('data-appearance')).toBe('ghost');
    });

    it('fetches the url into a file and emits urlAdded', async () => {
      const fixture = TestBed.createComponent(UrlHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const added: File[] = [];
      instance.urlAdded.subscribe((file) => added.push(file));
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(new Blob(['image-bytes'], { type: 'image/png' }), {
            status: 200,
          }),
        ),
      );
      const urlInput = fixture.debugElement.query(By.css('input[type="url"]'));
      urlInput.nativeElement.value = 'https://cdn.example/photos/cat.png';
      urlInput.triggerEventHandler('input', {
        target: urlInput.nativeElement,
      });
      fixture.debugElement
        .query(By.css('button[solaris-form-suffix-action]'))
        .nativeElement.click();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(added).toHaveLength(1);
      expect(added[0].name).toBe('cat.png');
      expect(fixture.nativeElement.textContent).toContain('cat.png');
    });

    it('submits the url with the Enter key', async () => {
      const fixture = TestBed.createComponent(UrlHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const added: File[] = [];
      instance.urlAdded.subscribe((file) => added.push(file));
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(new Blob(['x'], { type: 'text/plain' }), {
            status: 200,
          }),
        ),
      );
      const urlInput = fixture.debugElement.query(By.css('input[type="url"]'));
      urlInput.nativeElement.value = 'https://cdn.example/note.txt';
      urlInput.triggerEventHandler('input', {
        target: urlInput.nativeElement,
      });
      urlInput.triggerEventHandler('keydown.enter', {});
      await fixture.whenStable();
      expect(added).toHaveLength(1);
      expect(added[0].name).toBe('note.txt');
    });

    it('reports fetch failures through urlFailed and the live region', async () => {
      const fixture = TestBed.createComponent(UrlHost);
      fixture.detectChanges();
      const instance = uploadInstance(fixture);
      const failed: unknown[] = [];
      instance.urlFailed.subscribe((value) => failed.push(value));
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
      );
      const urlInput = fixture.debugElement.query(By.css('input[type="url"]'));
      urlInput.nativeElement.value = 'https://cdn.example/missing.png';
      urlInput.triggerEventHandler('input', {
        target: urlInput.nativeElement,
      });
      fixture.debugElement
        .query(By.css('button[solaris-form-suffix-action]'))
        .nativeElement.click();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(failed).toHaveLength(1);
      expect(
        fixture.debugElement.query(By.css('.solaris-file-upload__announcement'))
          .nativeElement.textContent,
      ).toContain('Could not load a file from this URL.');
      expect(
        fixture.debugElement.query(By.css('solaris-file-list')),
      ).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('uses list semantics with labelled controls', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      uploadInstance(fixture).writeValue([makeFile('a.pdf')]);
      fixture.detectChanges();
      const list = fixture.debugElement.query(By.css('solaris-file-list'));
      expect(list.nativeElement.getAttribute('role')).toBe('list');
      expect(list.nativeElement.getAttribute('aria-label')).toBe(
        'Selected files',
      );
      const item = fixture.debugElement.query(By.css('solaris-file-list-item'));
      expect(item.nativeElement.getAttribute('role')).toBe('listitem');
      const remove = fixture.debugElement.query(
        By.css('.solaris-file-list-item__action[aria-label^="Remove"]'),
      );
      expect(remove.nativeElement.getAttribute('aria-label')).toContain(
        'a.pdf',
      );
    });

    it('links hint text through aria-describedby', () => {
      @Component({
        standalone: true,
        imports: [SolarisFileUploadComponent, ReactiveFormsModule],
        template: `<solaris-file-upload
          label="Attachments"
          hint="PDF only."
        ></solaris-file-upload>`,
      })
      class HintHost {}
      const fixture = TestBed.createComponent(HintHost);
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(
        By.css('.solaris-file-upload__dropzone'),
      );
      const describedBy =
        trigger.nativeElement.getAttribute('aria-describedby') ?? '';
      expect(describedBy.length).toBeGreaterThan(0);
    });
  });
});

describe('XhrFileUploadHandler', () => {
  it('rejects immediately when the signal is already aborted', async () => {
    const handler = new MockUploadHandler();
    void handler;
    const { XhrFileUploadHandler } = await import(
      '../service/xhr-file-upload.handler'
    );
    const xhr = new XhrFileUploadHandler();
    const controller = new AbortController();
    controller.abort();
    await expect(
      xhr.upload(makeFile(), {
        url: 'https://example.com/uploads',
        signal: controller.signal,
        onProgress: () => undefined,
      }),
    ).rejects.toThrow();
  });
});
