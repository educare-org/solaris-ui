import {
  Component,
  input,
  computed,
  signal,
  output,
  forwardRef,
  inject,
  viewChild,
  ElementRef,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import type {
  SolarisFileRejected,
  SolarisFileUploadAppearance,
  SolarisFileUploadCancelled,
  SolarisFileUploadCompleted,
  SolarisFileUploadDensity,
  SolarisFileUploadFailed,
  SolarisFileUploadItem,
  SolarisFileUploadProgress,
  SolarisFileUploadRadius,
  SolarisFileUploadSize,
  SolarisFileUploadVariant,
  SolarisFileUrlFailed,
} from '../model/file-upload.types';
import {
  SOLARIS_FILE_UPLOAD_DEFAULT_MAX_FILES,
  SOLARIS_FILE_UPLOAD_DEFAULT_MAX_SIZE,
} from '../model/file-upload.defaults';
import { SOLARIS_FILE_UPLOAD_HANDLER } from '../model/file-upload.tokens';
import {
  appendFiles,
  clampProgress,
  createUploadItem,
  formatFileSize,
  isHttpUrl,
  removeUploadItem,
  updateUploadItem,
} from '../model/upload-state';
import {
  SOLARIS_REMOTE_FILE_DEFAULT_TIMEOUT_MS,
  fetchRemoteFile,
} from '../model/remote-file';
import { XhrFileUploadHandler } from '../service/xhr-file-upload.handler';
import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { resolveElementId } from '../../../../core';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import {
  SolarisFormFieldComponent,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
} from '../../form-field';
import { SolarisInputDirective } from '../../input';
import type { SolarisInputAppearance } from '../../input';
import { SolarisButtonDirective } from '../../../actions/button';
import { SolarisDividerComponent } from '../../../data-display/divider';
import { SolarisIconComponent } from '../../../icon';

import { SolarisFileListComponent } from './file-list.component';

@Component({
  selector: 'solaris-file-upload',
  standalone: true,
  imports: [
    SolarisFormFieldComponent,
    SolarisFileListComponent,
    SolarisIconComponent,
    SolarisInputDirective,
    SolarisButtonDirective,
    SolarisDividerComponent,
    SolarisFormSuffixDirective,
    SolarisFormSuffixActionDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisFileUploadComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisFileUploadComponent),
    },
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-file-upload',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-dragover]': 'dragOver() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-invalid]': 'isFieldInvalid() ? "" : null',
    '[attr.aria-busy]': 'isUploading() ? "true" : null',
  },
})
export class SolarisFileUploadComponent
  extends SolarisFormControl
  implements ControlValueAccessor, OnDestroy
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  protected readonly themeService = inject(SolarisThemeService);
  private readonly customHandler = inject(SOLARIS_FILE_UPLOAD_HANDLER, {
    optional: true,
  });
  private readonly xhrHandler = inject(XhrFileUploadHandler);

  protected readonly fileInputRef =
    viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly fieldId = input<string>(undefined, { alias: 'id' });
  readonly name = input<string>();
  readonly variant = input<SolarisFileUploadVariant>('dropzone');
  readonly accept = input<string>();
  readonly multiple = input<boolean>(true);
  readonly maxFiles = input<number | undefined>(
    SOLARIS_FILE_UPLOAD_DEFAULT_MAX_FILES,
  );
  readonly maxSize = input<number | undefined>(
    SOLARIS_FILE_UPLOAD_DEFAULT_MAX_SIZE,
  );
  readonly uploadUrl = input<string>();
  readonly autoUpload = input<boolean>(true);
  readonly maxConcurrent = input<number>(3);
  readonly allowUrl = input<boolean>(false);
  readonly allowHttp = input<boolean>(false);
  readonly maxDownloadSize = input<number | undefined>(undefined);
  readonly urlTimeoutMs = input<number>(SOLARIS_REMOTE_FILE_DEFAULT_TIMEOUT_MS);
  readonly hintKey = input<string>();
  readonly hint = input<string>('');
  readonly labelKey = input<string>();
  readonly label = input<string>('');
  readonly errorKey = input<string>();
  readonly error = input<string>('');
  readonly requiredError = input<string>();
  readonly requiredErrorKey = input<string>();
  readonly requiredInput = input<boolean>(false, { alias: 'required' });
  readonly optional = input<boolean>(false);
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly readonlyInput = input<boolean>(false, { alias: 'readonly' });
  readonly loading = input<boolean>(false);
  readonly invalidInput = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly dropzoneLabel = input<string>();
  readonly dropzoneLabelKey = input<string>();
  readonly dropzoneHint = input<string>();
  readonly dropzoneHintKey = input<string>();
  readonly browseLabel = input<string>();
  readonly browseLabelKey = input<string>();
  readonly dropActiveLabel = input<string>();
  readonly dropActiveLabelKey = input<string>();
  readonly listLabel = input<string>();
  readonly listLabelKey = input<string>();
  readonly removeLabel = input<string>();
  readonly removeLabelKey = input<string>();
  readonly retryLabel = input<string>();
  readonly retryLabelKey = input<string>();
  readonly urlLabel = input<string>();
  readonly urlLabelKey = input<string>();
  readonly urlPlaceholder = input<string>();
  readonly urlPlaceholderKey = input<string>();
  readonly urlAddLabel = input<string>();
  readonly urlAddLabelKey = input<string>();
  readonly avatarLabel = input<string>();
  readonly avatarLabelKey = input<string>();
  readonly avatarHeadline = input<string>();
  readonly avatarHeadlineKey = input<string>();
  readonly avatarBrowse = input<string>();
  readonly avatarBrowseKey = input<string>();
  readonly fieldLabel = input<string>();
  readonly fieldLabelKey = input<string>();
  readonly density = input<SolarisFileUploadDensity>();
  readonly size = input<SolarisFileUploadSize>('md');
  readonly radius = input<SolarisFileUploadRadius>('sm');
  readonly appearance = input<SolarisFileUploadAppearance>('outline');

  readonly filesChange = output<readonly File[]>();
  readonly fileRejected = output<readonly SolarisFileRejected[]>();
  readonly uploadProgress = output<SolarisFileUploadProgress>();
  readonly uploadCompleted = output<SolarisFileUploadCompleted>();
  readonly uploadFailed = output<SolarisFileUploadFailed>();
  readonly cancelled = output<SolarisFileUploadCancelled>();
  readonly urlAdded = output<File>();
  readonly urlFailed = output<SolarisFileUrlFailed>();

  protected readonly items = signal<SolarisFileUploadItem[]>([]);
  protected readonly dragOver = signal(false);
  protected readonly announcement = signal('');
  protected readonly urlValue = signal('');
  protected readonly urlLoading = signal(false);
  protected readonly avatarPreview = signal<string | null>(null);
  protected readonly internalDisabled = signal(false);
  protected readonly internalFocused = signal(false);
  protected readonly touched = signal(false);
  protected readonly dirty = signal(false);

  private dragDepth = 0;
  private readonly abortControllers = new Map<string, AbortController>();
  private urlAbortController: AbortController | null = null;

  protected readonly effectiveDensity = computed<SolarisFileUploadDensity>(
    () => {
      return this.density() ?? this.themeService.density;
    },
  );

  protected readonly elementId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-file-upload');
  });

  protected readonly _describedByIds = signal<string[]>([]);

  protected readonly ariaDescribedBy = computed(() => {
    const ids = this._describedByIds();
    return ids.length > 0 ? ids.join(' ') : null;
  });

  protected readonly files = computed<readonly File[]>(() =>
    this.items().map((item) => item.file),
  );

  protected readonly isUploading = computed(() =>
    this.items().some((item) => item.status === 'uploading'),
  );

  get id(): string {
    return this.fieldId() ?? this.elementId();
  }

  get focused(): boolean {
    return this.internalFocused();
  }

  get disabled(): boolean {
    return this.isEffectivelyDisabled();
  }

  get readonly(): boolean {
    return this.readonlyInput();
  }

  get invalid(): boolean {
    return this.isFieldInvalid();
  }

  get required(): boolean {
    return this.requiredInput();
  }

  get describedByIds(): string[] {
    return this._describedByIds();
  }

  setDescribedByIds(ids: string[]): void {
    this._describedByIds.set([...ids]);
  }

  focus(): void {
    // SECURITY_EXCEPTION: resolving the trigger requires a scoped querySelector on the own host element; read-only, no global lookup; covered by focus() specs.
    const trigger = this.elementRef.nativeElement.querySelector<HTMLElement>(
      '.solaris-file-upload__dropzone, .solaris-file-upload__trigger, .solaris-file-upload__avatar, .solaris-file-upload__field',
    );
    if (trigger) {
      // SECURITY_EXCEPTION: programmatic focus requires the native method; no declarative alternative exists.
      trigger.focus();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: readonly File[]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.internalDisabled();
  });

  protected readonly dropzoneLabelText = computed(() => {
    const direct = this.dropzoneLabel();
    if (direct) {
      return direct;
    }
    const key = this.dropzoneLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.file-upload.dropzone');
  });

  protected readonly browseLabelText = computed(() => {
    const direct = this.browseLabel();
    if (direct) {
      return direct;
    }
    const key = this.browseLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.file-upload.browse');
  });

  protected readonly dropActiveLabelText = computed(() => {
    const direct = this.dropActiveLabel();
    if (direct) {
      return direct;
    }
    const key = this.dropActiveLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateWithDefault(
      'solaris.file-upload.drop-active',
      'Drop files here',
    );
  });

  protected readonly dropzoneHintText = computed<string | null>(() => {
    const direct = this.dropzoneHint();
    if (direct) {
      return direct;
    }
    const key = this.dropzoneHintKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const parts: string[] = [];
    const accept = this.accept();
    if (accept && accept.trim().length > 0) {
      parts.push(accept);
    }
    const maxSize = this.maxSize();
    if (maxSize !== undefined) {
      parts.push(
        this.translateService.translate('solaris.file-upload.up-to', {
          size: formatFileSize(maxSize),
        }),
      );
    }
    return parts.length > 0 ? parts.join(' · ') : null;
  });

  protected readonly urlControlsDisabled = computed(() => {
    return (
      this.isEffectivelyDisabled() || this.readonlyInput() || this.urlLoading()
    );
  });

  protected readonly urlInputAppearance = computed(
    (): SolarisInputAppearance => {
      const appearance = this.appearance();
      return appearance === 'minimal' ? 'outline' : appearance;
    },
  );

  protected readonly urlLabelText = computed(() => {
    const direct = this.urlLabel();
    if (direct) {
      return direct;
    }
    const key = this.urlLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.file-upload.url.label');
  });

  protected readonly urlPlaceholderText = computed(() => {
    const direct = this.urlPlaceholder();
    if (direct) {
      return direct;
    }
    const key = this.urlPlaceholderKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate(
      'solaris.file-upload.url.placeholder',
    );
  });

  protected readonly urlAddText = computed(() => {
    const direct = this.urlAddLabel();
    if (direct) {
      return direct;
    }
    const key = this.urlAddLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.file-upload.url.add');
  });

  protected readonly avatarLabelText = computed(() => {
    const direct = this.avatarLabel();
    if (direct) {
      return direct;
    }
    const key = this.avatarLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.file-upload.avatar');
  });

  protected readonly avatarHeadlineText = computed(() => {
    const direct = this.avatarHeadline();
    if (direct) {
      return direct;
    }
    const key = this.avatarHeadlineKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateWithDefault(
      'solaris.file-upload.avatar.drop',
      'Drop your photo here or',
    );
  });

  protected readonly avatarBrowseText = computed(() => {
    const direct = this.avatarBrowse();
    if (direct) {
      return direct;
    }
    const key = this.avatarBrowseKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateWithDefault(
      'solaris.file-upload.avatar.browse',
      'Select a file',
    );
  });

  protected readonly avatarSupportsText = computed<string | null>(() => {
    const direct = this.dropzoneHint();
    if (direct) {
      return direct;
    }
    const key = this.dropzoneHintKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const parts: string[] = [];
    const accept = this.accept();
    if (accept && accept.trim().length > 0) {
      const types = accept
        .split(',')
        .map((entry) => {
          const cleaned = entry.trim().replace(/^\./, '');
          const wildcard = new RegExp(/^([A-Za-z0-9-]+)\/\*$/).exec(cleaned);
          if (wildcard) {
            const family = wildcard[1].toLowerCase();
            if (family === 'image') {
              return this.translateService.translate(
                'solaris.file-upload.avatar.images',
              );
            }
            return `${family}s`;
          }
          return cleaned.toUpperCase();
        })
        .filter((entry) => entry.length > 0)
        .join(', ');
      if (types.length > 0) {
        parts.push(
          this.translateService.translate(
            'solaris.file-upload.avatar.supports',
            { types },
          ),
        );
      }
    }
    const maxSize = this.maxSize();
    if (maxSize !== undefined) {
      parts.push(
        this.translateService.translate('solaris.file-upload.up-to', {
          size: formatFileSize(maxSize),
        }),
      );
    }
    return parts.length > 0 ? parts.join(' · ') : null;
  });

  protected readonly fieldLabelText = computed(() => {
    const direct = this.fieldLabel();
    if (direct) {
      return direct;
    }
    const key = this.fieldLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateWithDefault(
      'solaris.file-upload.field',
      'Drag or browse files',
    );
  });

  protected readonly computedError = computed(() => {
    const manual = this.error() || this.translateKey(this.errorKey());
    if (manual) {
      return manual;
    }
    if (
      (this.touched() || this.dirty()) &&
      this.requiredInput() &&
      this.items().length === 0
    ) {
      return this.buildError(
        this.requiredError(),
        this.requiredErrorKey(),
        'solaris.file-upload.required',
        'Select at least one file.',
      );
    }
    return '';
  });

  protected readonly isFieldInvalid = computed(() => {
    const manual = this.invalidInput();
    if (manual !== undefined) {
      return manual;
    }
    if (this.internalFocused()) {
      return false;
    }
    if (!this.touched() && !this.dirty()) {
      return false;
    }
    return !!this.computedError();
  });

  writeValue(files: readonly File[] | null): void {
    this.urlAbortController?.abort();
    this.urlAbortController = null;
    this.cancelAllUploads();
    this.items.set((files ?? []).map((file) => createUploadItem(file)));
    this.syncAvatarPreview();
  }

  registerOnChange(fn: (value: readonly File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  uploadAll(): void {
    const url = this.uploadUrl();
    if (!url) {
      return;
    }
    for (const item of this.items()) {
      if (item.status === 'ready' || item.status === 'error') {
        this.items.set(
          updateUploadItem(this.items(), item.id, {
            status: 'ready',
            progress: item.status === 'error' ? 0 : item.progress,
            error: undefined,
            url: undefined,
          }),
        );
      }
    }
    this.pumpQueue();
  }

  clear(): void {
    const uploading = this.items()
      .filter((item) => item.status === 'uploading')
      .map((item) => item.id);
    this.urlAbortController?.abort();
    this.urlAbortController = null;
    this.cancelAllUploads();
    this.resetNativeInput();
    this.items.set([]);
    this.syncAvatarPreview();
    for (const itemId of uploading) {
      this.cancelled.emit({ itemId });
    }
    this.emitFiles();
  }

  protected openPicker(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) {
      return;
    }
    // SECURITY_EXCEPTION: reading the file input ref requires nativeElement; scoped to this component's template ref; covered by picker specs.
    const native = this.fileInputRef()?.nativeElement;
    if (native) {
      // SECURITY_EXCEPTION: opening the native file picker requires the click() method; no declarative alternative exists.
      native.click();
    }
  }

  protected onFileSelected(event: Event): void {
    this.markTouched();
    const target = event.target as HTMLInputElement;
    this.handleFiles(target.files ? Array.from(target.files) : []);
    this.resetNativeInput();
  }

  protected onPickerCancelled(): void {
    this.markTouched();
  }

  protected onUrlInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.urlValue.set(target.value);
  }

  protected async addFromUrl(): Promise<void> {
    const rawUrl = this.urlValue().trim();
    if (rawUrl.length === 0 || this.urlLoading()) {
      return;
    }
    if (this.isEffectivelyDisabled() || this.readonlyInput()) {
      return;
    }
    this.markTouched();
    if (!isHttpUrl(rawUrl, this.allowHttp())) {
      this.announcement.set(
        this.translateService.translate('solaris.file-upload.url.invalid'),
      );
      this.urlFailed.emit({ url: rawUrl, error: 'invalid-url' });
      return;
    }
    this.urlAbortController?.abort();
    const controller = new AbortController();
    this.urlAbortController = controller;
    this.urlLoading.set(true);
    try {
      const handler = this.customHandler?.fetchUrl?.bind(this.customHandler);
      const maxBytes =
        this.maxDownloadSize() ??
        this.maxSize() ??
        SOLARIS_FILE_UPLOAD_DEFAULT_MAX_SIZE;
      const file = handler
        ? await handler(rawUrl, {
            signal: controller.signal,
            maxBytes,
            timeoutMs: this.urlTimeoutMs(),
          })
        : await fetchRemoteFile(rawUrl, {
            signal: controller.signal,
            maxBytes,
            timeoutMs: this.urlTimeoutMs(),
            allowHttp: this.allowHttp(),
          });
      if (controller.signal.aborted) {
        return;
      }
      this.handleFiles([file]);
      this.urlValue.set('');
      this.urlAdded.emit(file);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }
      const message = error instanceof Error ? error.message : String(error);
      const tooLarge = message.includes('exceeds');
      this.announcement.set(
        this.translateService.translate(
          tooLarge
            ? 'solaris.file-upload.url.too-large'
            : 'solaris.file-upload.url.error',
          tooLarge
            ? {
                size: formatFileSize(
                  this.maxDownloadSize() ??
                    this.maxSize() ??
                    SOLARIS_FILE_UPLOAD_DEFAULT_MAX_SIZE,
                ),
              }
            : undefined,
        ),
      );
      this.urlFailed.emit({ url: rawUrl, error: message });
    } finally {
      if (this.urlAbortController === controller) {
        this.urlAbortController = null;
      }
      this.urlLoading.set(false);
    }
  }

  protected onTriggerFocus(): void {
    this.internalFocused.set(true);
  }

  protected onTriggerBlur(): void {
    this.internalFocused.set(false);
    this.markTouched();
  }

  protected onDragEnter(event: DragEvent): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) {
      return;
    }
    event.preventDefault();
    this.dragDepth += 1;
    this.dragOver.set(true);
  }

  protected onDragOver(event: DragEvent): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) {
      return;
    }
    event.preventDefault();
    this.dragOver.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (this.dragDepth === 0) {
      this.dragOver.set(false);
    }
  }

  protected onDragEnd(): void {
    this.dragDepth = 0;
    this.dragOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = 0;
    this.dragOver.set(false);
    if (this.isEffectivelyDisabled() || this.readonlyInput()) {
      return;
    }
    this.markTouched();
    this.handleFiles(
      event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [],
    );
  }

  protected onItemRemoved(id: string): void {
    const target = this.items().find((item) => item.id === id);
    const wasUploading = target?.status === 'uploading';
    this.abortUpload(id);
    this.items.set(removeUploadItem(this.items(), id));
    this.syncAvatarPreview();
    if (wasUploading && target) {
      this.cancelled.emit({ itemId: id });
    }
    if (target) {
      this.announcement.set(
        this.translateService.translate(
          'solaris.file-upload.announce.removed',
          { name: target.file.name },
        ),
      );
    }
    this.emitFiles();
    this.pumpQueue();
  }

  protected onItemRetried(id: string): void {
    const target = this.items().find((item) => item.id === id);
    if (target?.status !== 'error' || !this.uploadUrl()) {
      return;
    }
    this.items.set(
      updateUploadItem(this.items(), id, {
        status: 'ready',
        progress: 0,
        error: undefined,
        url: undefined,
      }),
    );
    this.pumpQueue();
  }

  private handleFiles(incoming: File[]): void {
    if (incoming.length === 0) {
      return;
    }
    if (!this.dirty()) {
      this.dirty.set(true);
    }
    const previousCount = this.items().length;
    const result = appendFiles(this.items(), incoming, {
      accept: this.accept(),
      maxSize: this.maxSize(),
      multiple: this.multiple(),
      maxFiles: this.maxFiles(),
    });
    this.items.set(result.items);
    this.syncAvatarPreview();
    if (result.rejected.length > 0) {
      this.fileRejected.emit(result.rejected);
      this.announcement.set(this.rejectedAnnouncement(result.rejected));
    }
    const added = result.items.length - previousCount;
    if (added === 1) {
      this.announcement.set(
        this.translateService.translate(
          'solaris.file-upload.announce.addedSingular',
        ),
      );
    } else if (added > 1) {
      this.announcement.set(
        this.translateService.translate(
          'solaris.file-upload.announce.addedPlural',
          { count: added },
        ),
      );
    }
    this.emitFiles();
    if (this.uploadUrl() && this.autoUpload()) {
      this.pumpQueue();
    }
  }

  private rejectedAnnouncement(
    rejected: readonly SolarisFileRejected[],
  ): string {
    if (rejected.length === 1 && rejected[0]) {
      return this.translateService.translate(
        'solaris.file-upload.announce.rejectedSingular',
        { name: rejected[0].file.name },
      );
    }
    return this.translateService.translate(
      'solaris.file-upload.announce.rejectedPlural',
      { count: rejected.length },
    );
  }

  private pumpQueue(): void {
    const url = this.uploadUrl();
    if (!url) {
      return;
    }
    const limit = Math.max(1, Math.floor(this.maxConcurrent() || 1));
    for (;;) {
      const active = this.items().filter(
        (item) => item.status === 'uploading',
      ).length;
      if (active >= limit) {
        return;
      }
      const next = this.items().find((item) => item.status === 'ready');
      if (!next) {
        return;
      }
      this.items.set(
        updateUploadItem(this.items(), next.id, {
          status: 'uploading',
          progress: 0,
          error: undefined,
          url: undefined,
        }),
      );
      this.runUpload(next);
    }
  }

  private runUpload(item: SolarisFileUploadItem): void {
    const url = this.uploadUrl();
    if (!url) {
      return;
    }
    const handler = this.customHandler ?? this.xhrHandler;
    const controller = new AbortController();
    this.abortControllers.set(item.id, controller);
    handler
      .upload(item.file, {
        url,
        signal: controller.signal,
        onProgress: (progress) => {
          if (!this.hasItem(item.id)) {
            return;
          }
          const safe = clampProgress(progress);
          this.items.set(
            updateUploadItem(this.items(), item.id, { progress: safe }),
          );
          this.uploadProgress.emit({ itemId: item.id, progress: safe });
        },
      })
      .then((response) => {
        this.abortControllers.delete(item.id);
        if (!this.hasItem(item.id)) {
          return;
        }
        this.items.set(
          updateUploadItem(this.items(), item.id, {
            status: 'success',
            progress: 100,
            url: response.url,
          }),
        );
        this.uploadCompleted.emit({ itemId: item.id, url: response.url });
        this.announcement.set(
          this.translateService.translate(
            'solaris.file-upload.announce.uploaded',
            { name: item.file.name },
          ),
        );
        this.pumpQueue();
      })
      .catch(() => {
        this.abortControllers.delete(item.id);
        if (!this.hasItem(item.id)) {
          return;
        }
        const error = controller.signal.aborted ? 'aborted' : 'upload-failed';
        this.items.set(
          updateUploadItem(this.items(), item.id, {
            status: 'error',
            error,
          }),
        );
        this.uploadFailed.emit({ itemId: item.id, error });
        this.announcement.set(
          this.translateService.translate(
            'solaris.file-upload.announce.failed',
            { name: item.file.name },
          ),
        );
        this.pumpQueue();
      });
  }

  private abortUpload(id: string): void {
    const controller = this.abortControllers.get(id);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(id);
    }
  }

  private cancelAllUploads(): void {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }
    this.abortControllers.clear();
  }

  private hasItem(id: string): boolean {
    return this.items().some((item) => item.id === id);
  }

  private emitFiles(): void {
    const files = this.files();
    this.filesChange.emit(files);
    this.onChange(files);
  }

  private markTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
    }
    this.onTouched();
  }

  ngOnDestroy(): void {
    this.urlAbortController?.abort();
    this.urlAbortController = null;
    this.cancelAllUploads();
    this.revokeAvatarPreview();
  }

  private syncAvatarPreview(): void {
    this.revokeAvatarPreview();
    if (this.variant() !== 'avatar') {
      return;
    }
    const image = this.items().find((item) =>
      item.file.type.startsWith('image/'),
    );
    if (
      image &&
      typeof URL !== 'undefined' &&
      typeof URL.createObjectURL === 'function'
    ) {
      this.avatarPreview.set(URL.createObjectURL(image.file));
    }
  }

  private revokeAvatarPreview(): void {
    const preview = this.avatarPreview();
    if (preview && typeof URL !== 'undefined') {
      URL.revokeObjectURL(preview);
    }
    this.avatarPreview.set(null);
  }

  private resetNativeInput(): void {
    // SECURITY_EXCEPTION: reading the file input ref requires nativeElement; scoped to this component's template ref; covered by selection specs.
    const native = this.fileInputRef()?.nativeElement;
    if (native) {
      try {
        // SECURITY_EXCEPTION: resetting the native file input so the same file can be selected again requires a direct value write.
        native.value = '';
      } catch {
        // Native reset is best-effort; selection state already propagated.
      }
    }
  }

  private translateKey(key: string | undefined): string | undefined {
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return undefined;
  }

  private buildError(
    direct: string | undefined,
    key: string | undefined,
    fallbackKey: string,
    fallbackDefault: string,
  ): string {
    return (
      direct ??
      this.translateKey(key) ??
      this.translateWithDefault(fallbackKey, fallbackDefault)
    );
  }

  private translateWithDefault(key: string, defaultText: string): string {
    const result = this.translateService.translate(key);
    return result !== key ? result : defaultText;
  }
}
