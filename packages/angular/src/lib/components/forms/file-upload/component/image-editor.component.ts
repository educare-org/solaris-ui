import {
  Component,
  ChangeDetectionStrategy,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';

import {
  SOLARIS_DIALOG_DATA,
  SOLARIS_DIALOG_REF,
  SolarisDialogFooterComponent,
  SolarisDialogRef,
} from '../../../overlay/dialog';
import { SolarisIconComponent } from '../../../icon';
import { SolarisBadgeComponent } from '../../../data-display/badge';
import { SolarisTranslateService } from '../../../../services/translation';

import type {
  SolarisImageEditorAspect,
  SolarisImageEditorData,
  SolarisImageEditorFormat,
  SolarisImageEditorRotation,
  SolarisImageEditorShape,
} from '../model/image-editor.types';
import {
  SOLARIS_IMAGE_EDITOR_DEFAULT_ASPECTS,
  SOLARIS_IMAGE_EDITOR_DEFAULT_FORMAT,
  SOLARIS_IMAGE_EDITOR_DEFAULT_MAX_DIMENSION,
  SOLARIS_IMAGE_EDITOR_DEFAULT_MAX_SOURCE_DIMENSION,
  SOLARIS_IMAGE_EDITOR_DEFAULT_MAX_SOURCE_PIXELS,
  SOLARIS_IMAGE_EDITOR_DEFAULT_QUALITY,
  SOLARIS_IMAGE_EDITOR_DEFAULT_SHAPE,
  SOLARIS_IMAGE_EDITOR_PAN_KEYBOARD_FAST_STEP,
  SOLARIS_IMAGE_EDITOR_PAN_KEYBOARD_STEP,
  SOLARIS_IMAGE_EDITOR_VIEW_MAX_HEIGHT,
  SOLARIS_IMAGE_EDITOR_VIEW_MAX_WIDTH,
  SOLARIS_IMAGE_EDITOR_VIEW_MIN_HEIGHT,
  SOLARIS_IMAGE_EDITOR_VIEW_MIN_WIDTH,
  SOLARIS_IMAGE_EDITOR_ZOOM_MAX,
  SOLARIS_IMAGE_EDITOR_ZOOM_MIN,
  SOLARIS_IMAGE_EDITOR_ZOOM_STEP,
} from '../model/image-editor.defaults';
import {
  baseScale,
  clampOffset,
  clampZoom,
  cropSourceSize,
  drawPreview,
  editedFileName,
  fitViewSize,
  loadImageElement,
  nextRotation,
  objectUrlFor,
  renderEditedImage,
  rotatedSize,
} from '../model/image-editor.utils';
import type { SolarisPanOffset } from '../model/image-editor.utils';
import { validateSourceDimensions } from '../model/upload-state';
import { SolarisButtonDirective } from '../../../actions/button';
import { SolarisIconButtonDirective } from '../../../actions/icon-button';

interface SolarisPanGesture {
  readonly pointerId: number;
  readonly startX: number;
  readonly startY: number;
  readonly origin: SolarisPanOffset;
}

@Component({
  selector: 'solaris-image-editor',
  standalone: true,
  imports: [
    SolarisIconComponent,
    SolarisBadgeComponent,
    SolarisDialogFooterComponent,
    SolarisButtonDirective,
    SolarisIconButtonDirective,
  ],
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-image-editor',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.data-error]': 'loadError() ? "" : null',
    '[attr.data-shape]': 'shape()',
    '[attr.data-panning]': 'panning() ? "" : null',
  },
})
export class SolarisImageEditorComponent implements OnDestroy {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly dialogData = inject(SOLARIS_DIALOG_DATA, {
    optional: true,
  }) as SolarisImageEditorData | null;
  private readonly dialogRef = inject(SOLARIS_DIALOG_REF, {
    optional: true,
  }) as SolarisDialogRef<File> | null;

  private readonly previewRef =
    viewChild<ElementRef<HTMLCanvasElement>>('preview');

  readonly image = input<string | File | undefined>(undefined);
  readonly aspectInput = input<SolarisImageEditorAspect>('free', {
    alias: 'aspect',
  });
  /**
   * @deprecated Aspect and shape are now fixed via the `aspect` / `shape`
   * inputs (or dialog data). The option list is kept for API compatibility
   * and no longer renders a toolbar.
   */
  readonly aspects = input<readonly SolarisImageEditorAspect[]>(
    SOLARIS_IMAGE_EDITOR_DEFAULT_ASPECTS,
  );
  readonly shapeInput = input<SolarisImageEditorShape>(
    SOLARIS_IMAGE_EDITOR_DEFAULT_SHAPE,
    { alias: 'shape' },
  );
  readonly format = input<SolarisImageEditorFormat>(
    SOLARIS_IMAGE_EDITOR_DEFAULT_FORMAT,
  );
  readonly quality = input<number>(SOLARIS_IMAGE_EDITOR_DEFAULT_QUALITY);
  readonly maxDimension = input<number>(
    SOLARIS_IMAGE_EDITOR_DEFAULT_MAX_DIMENSION,
  );
  readonly maxSourceDimension = input<number>(
    SOLARIS_IMAGE_EDITOR_DEFAULT_MAX_SOURCE_DIMENSION,
  );
  readonly maxSourcePixels = input<number>(
    SOLARIS_IMAGE_EDITOR_DEFAULT_MAX_SOURCE_PIXELS,
  );
  readonly title = input<string>();
  readonly titleKey = input<string>();
  readonly saveLabel = input<string>();
  readonly saveLabelKey = input<string>();
  readonly cancelLabel = input<string>();
  readonly cancelLabelKey = input<string>();

  readonly saved = output<File>();
  readonly cancelled = output<void>();

  protected readonly zoom = signal(SOLARIS_IMAGE_EDITOR_ZOOM_MIN);
  protected readonly rotation = signal<SolarisImageEditorRotation>(0);
  protected readonly aspect = signal<SolarisImageEditorAspect>('free');
  protected readonly shape = signal<SolarisImageEditorShape>(
    SOLARIS_IMAGE_EDITOR_DEFAULT_SHAPE,
  );
  protected readonly offset = signal<SolarisPanOffset>({ x: 0, y: 0 });
  protected readonly viewWidth = signal(SOLARIS_IMAGE_EDITOR_VIEW_MAX_WIDTH);
  protected readonly viewHeight = signal(SOLARIS_IMAGE_EDITOR_VIEW_MAX_HEIGHT);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly loadError = signal(false);
  protected readonly panning = signal(false);

  private nativeImage: HTMLImageElement | null = null;
  private sourceName: string | undefined;
  private gesture: SolarisPanGesture | null = null;
  private revokeObjectUrl: (() => void) | null = null;
  private loadToken = 0;

  protected readonly zoomMin = SOLARIS_IMAGE_EDITOR_ZOOM_MIN;
  protected readonly zoomMax = SOLARIS_IMAGE_EDITOR_ZOOM_MAX;
  protected readonly zoomStep = SOLARIS_IMAGE_EDITOR_ZOOM_STEP;

  protected readonly titleText = computed(() => {
    const direct = this.title();
    if (direct) {
      return direct;
    }
    const key = this.titleKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.image-editor.title');
  });

  protected readonly saveText = computed(() => {
    const direct = this.saveLabel();
    if (direct) {
      return direct;
    }
    const key = this.saveLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.image-editor.save');
  });

  protected readonly cancelText = computed(() => {
    const direct = this.cancelLabel();
    if (direct) {
      return direct;
    }
    const key = this.cancelLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.translateService.translate('solaris.image-editor.cancel');
  });

  protected readonly zoomInLabel = computed(() =>
    this.translateService.translate('solaris.image-editor.zoom-in'),
  );

  protected readonly zoomOutLabel = computed(() =>
    this.translateService.translate('solaris.image-editor.zoom-out'),
  );

  protected readonly zoomLabel = computed(() =>
    this.translateService.translate('solaris.image-editor.zoom'),
  );

  protected readonly rotateLabel = computed(() =>
    this.translateService.translate('solaris.image-editor.rotate'),
  );

  protected readonly panLabel = computed(() =>
    this.translateService.translate('solaris.image-editor.pan'),
  );

  protected readonly loadErrorText = computed(() =>
    this.translateService.translate('solaris.image-editor.load-error'),
  );

  protected readonly resetText = computed(() =>
    this.translateService.translate('solaris.image-editor.reset'),
  );

  protected readonly dragHintText = computed(() =>
    this.translateService.translate('solaris.image-editor.drag-to-reposition'),
  );

  protected readonly zoomPercent = computed(
    () => `${Math.round(this.zoom() * 100)}%`,
  );

  protected readonly canZoomIn = computed(
    () => this.zoom() < SOLARIS_IMAGE_EDITOR_ZOOM_MAX && !this.loadError(),
  );

  protected readonly canZoomOut = computed(
    () => this.zoom() > SOLARIS_IMAGE_EDITOR_ZOOM_MIN && !this.loadError(),
  );

  protected readonly canReset = computed(
    () =>
      !this.loadError() &&
      (this.zoom() !== SOLARIS_IMAGE_EDITOR_ZOOM_MIN ||
        this.rotation() !== 0 ||
        this.offset().x !== 0 ||
        this.offset().y !== 0),
  );

  constructor() {
    this.aspect.set(this.aspectInput());
    this.shape.set(this.shapeInput());
    effect(() => {
      const source = this.image() ?? this.dialogData?.image;
      const initialAspect = this.dialogData?.aspect ?? this.aspectInput();
      const initialShape = this.dialogData?.shape ?? this.shapeInput();
      void this.load(source, initialAspect, initialShape);
    });
    effect(() => {
      this.zoom();
      this.rotation();
      this.aspect();
      this.shape();
      this.offset();
      this.panning();
      this.viewWidth();
      this.viewHeight();
      this.paintPreview();
    });
  }

  ngOnDestroy(): void {
    this.loadToken += 1;
    this.gesture = null;
    this.panning.set(false);
    this.revokeObjectUrl?.();
    this.revokeObjectUrl = null;
  }

  protected reset(): void {
    this.zoom.set(SOLARIS_IMAGE_EDITOR_ZOOM_MIN);
    this.rotation.set(0);
    this.recenter();
    this.updateView();
  }

  protected zoomIn(): void {
    this.zoom.update((value) =>
      clampZoom(
        value + SOLARIS_IMAGE_EDITOR_ZOOM_STEP,
        SOLARIS_IMAGE_EDITOR_ZOOM_MIN,
        SOLARIS_IMAGE_EDITOR_ZOOM_MAX,
      ),
    );
  }

  protected zoomOut(): void {
    this.zoom.update((value) =>
      clampZoom(
        value - SOLARIS_IMAGE_EDITOR_ZOOM_STEP,
        SOLARIS_IMAGE_EDITOR_ZOOM_MIN,
        SOLARIS_IMAGE_EDITOR_ZOOM_MAX,
      ),
    );
  }

  protected onZoomInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.zoom.set(
      clampZoom(
        Number(target.value),
        SOLARIS_IMAGE_EDITOR_ZOOM_MIN,
        SOLARIS_IMAGE_EDITOR_ZOOM_MAX,
      ),
    );
  }

  protected rotate(): void {
    this.rotation.update((value) => nextRotation(value));
    this.recenter();
    this.updateView();
  }

  protected onZoomWheel(event: WheelEvent): void {
    if (this.loading() || this.loadError() || !this.nativeImage) {
      return;
    }
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else if (event.deltaY > 0) {
      this.zoomOut();
    }
  }

  protected onPanStart(event: PointerEvent): void {
    if (this.loading() || this.loadError() || !this.nativeImage) {
      return;
    }
    event.preventDefault();
    const target = event.currentTarget as HTMLElement | null;
    try {
      target?.setPointerCapture?.(event.pointerId);
    } catch {
      // jsdom and some browsers lack pointer capture; dragging still works.
    }
    this.gesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: this.offset(),
    };
    this.panning.set(true);
  }

  protected onPanMove(event: PointerEvent): void {
    const gesture = this.gesture;
    const native = this.nativeImage;
    if (gesture?.pointerId !== event.pointerId || !native) {
      return;
    }
    event.preventDefault();
    const source = rotatedSize(
      native.naturalWidth || native.width,
      native.naturalHeight || native.height,
      this.rotation(),
    );
    const scale =
      baseScale(
        this.viewWidth(),
        this.viewHeight(),
        source.width,
        source.height,
      ) * this.zoom();
    if (scale <= 0) {
      return;
    }
    const crop = cropSourceSize(
      source.width,
      source.height,
      this.zoom(),
      this.aspect(),
      this.shape(),
    );
    this.offset.set(
      clampOffset(
        {
          x: gesture.origin.x + (event.clientX - gesture.startX) / scale,
          y: gesture.origin.y + (event.clientY - gesture.startY) / scale,
        },
        source.width,
        source.height,
        crop.width,
        crop.height,
      ),
    );
  }

  protected onPanEnd(event: PointerEvent): void {
    if (this.gesture?.pointerId === event.pointerId) {
      this.gesture = null;
    }
    this.panning.set(false);
  }

  protected onViewportKeydown(event: KeyboardEvent): void {
    const native = this.nativeImage;
    if (this.loading() || this.loadError() || !native) {
      return;
    }
    const step = event.shiftKey
      ? SOLARIS_IMAGE_EDITOR_PAN_KEYBOARD_FAST_STEP
      : SOLARIS_IMAGE_EDITOR_PAN_KEYBOARD_STEP;
    const current = this.offset();
    let next: SolarisPanOffset | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        next = { x: current.x - step, y: current.y };
        break;
      case 'ArrowRight':
        next = { x: current.x + step, y: current.y };
        break;
      case 'ArrowUp':
        next = { x: current.x, y: current.y - step };
        break;
      case 'ArrowDown':
        next = { x: current.x, y: current.y + step };
        break;
      case '+':
      case '=':
        this.zoomIn();
        break;
      case '-':
      case '_':
        this.zoomOut();
        break;
      default:
        return;
    }
    event.preventDefault();
    if (!next) {
      return;
    }
    const source = rotatedSize(
      native.naturalWidth || native.width,
      native.naturalHeight || native.height,
      this.rotation(),
    );
    const crop = cropSourceSize(
      source.width,
      source.height,
      this.zoom(),
      this.aspect(),
      this.shape(),
    );
    this.offset.set(
      clampOffset(next, source.width, source.height, crop.width, crop.height),
    );
  }

  protected async save(): Promise<void> {
    const native = this.nativeImage;
    if (!native || this.loadError() || this.saving()) {
      return;
    }
    this.saving.set(true);
    try {
      const file = await renderEditedImage(native, {
        rotation: this.rotation(),
        zoom: this.zoom(),
        aspect: this.aspect(),
        shape: this.shape(),
        offset: this.offset(),
        viewWidth: this.viewWidth(),
        viewHeight: this.viewHeight(),
        format: this.format(),
        quality: this.quality(),
        maxDimension: this.maxDimension(),
        fileName: editedFileName(this.sourceName, this.format()),
      });
      this.saved.emit(file);
      this.dialogRef?.close(file);
    } catch {
      this.loadError.set(true);
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.cancelled.emit();
    this.dialogRef?.close();
  }

  private recenter(): void {
    this.offset.set({ x: 0, y: 0 });
  }

  private updateView(): void {
    const native = this.nativeImage;
    if (!native) {
      return;
    }
    const source = rotatedSize(
      native.naturalWidth || native.width,
      native.naturalHeight || native.height,
      this.rotation(),
    );
    const fitted = fitViewSize(
      source.width,
      source.height,
      SOLARIS_IMAGE_EDITOR_VIEW_MAX_WIDTH,
      SOLARIS_IMAGE_EDITOR_VIEW_MAX_HEIGHT,
      SOLARIS_IMAGE_EDITOR_VIEW_MIN_WIDTH,
      SOLARIS_IMAGE_EDITOR_VIEW_MIN_HEIGHT,
    );
    this.viewWidth.set(fitted.width);
    this.viewHeight.set(fitted.height);
  }

  protected onOverlayPointerDown(event: Event): void {
    event.stopPropagation();
  }

  private async load(
    source: string | File | undefined,
    initialAspect: SolarisImageEditorAspect,
    initialShape: SolarisImageEditorShape,
  ): Promise<void> {
    const token = ++this.loadToken;
    this.revokeObjectUrl?.();
    this.revokeObjectUrl = null;
    this.nativeImage = null;
    this.gesture = null;
    this.panning.set(false);
    this.sourceName = typeof source === 'string' ? undefined : source?.name;
    this.aspect.set(initialAspect);
    this.shape.set(initialShape);
    if (source === undefined) {
      this.loading.set(false);
      this.loadError.set(true);
      return;
    }
    if (
      typeof source !== 'string' &&
      (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function')
    ) {
      this.loading.set(false);
      this.loadError.set(true);
      return;
    }
    this.loading.set(true);
    this.loadError.set(false);
    try {
      const { url, revoke } = objectUrlFor(source);
      if (token !== this.loadToken) {
        revoke();
        return;
      }
      this.revokeObjectUrl = revoke;
      const native = await loadImageElement(url);
      if (token !== this.loadToken) {
        return;
      }
      const decodedWidth = native.naturalWidth || native.width;
      const decodedHeight = native.naturalHeight || native.height;
      if (
        validateSourceDimensions(
          decodedWidth,
          decodedHeight,
          this.maxSourceDimension(),
          this.maxSourcePixels(),
        ) !== null
      ) {
        this.loading.set(false);
        this.loadError.set(true);
        return;
      }
      this.nativeImage = native;
      this.zoom.set(SOLARIS_IMAGE_EDITOR_ZOOM_MIN);
      this.rotation.set(0);
      this.recenter();
      this.updateView();
      this.loading.set(false);
      this.paintPreview();
    } catch {
      if (token !== this.loadToken) {
        return;
      }
      this.loading.set(false);
      this.loadError.set(true);
    }
  }

  private paintPreview(): void {
    // SECURITY_EXCEPTION: reading the preview canvas ref requires nativeElement; scoped to this component's template ref; covered by image-editor specs.
    const canvas = this.previewRef()?.nativeElement;
    const native = this.nativeImage;
    if (!canvas || !native || this.loadError()) {
      return;
    }
    try {
      drawPreview(canvas, native, {
        rotation: this.rotation(),
        zoom: this.zoom(),
        aspect: this.aspect(),
        shape: this.shape(),
        offset: this.offset(),
        viewWidth: this.viewWidth(),
        viewHeight: this.viewHeight(),
        active: this.panning(),
      });
    } catch {
      // Preview is best-effort; export validates the pipeline on save.
    }
  }
}
