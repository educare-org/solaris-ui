import type {
  SolarisImageEditorAspect,
  SolarisImageEditorFormat,
  SolarisImageEditorRotation,
  SolarisImageEditorShape,
} from './image-editor.types';

export interface SolarisPanOffset {
  readonly x: number;
  readonly y: number;
}

export interface SolarisImageDimensions {
  readonly width: number;
  readonly height: number;
}

export interface SolarisViewCrop {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly diameter: number;
}

export interface SolarisSceneOptions {
  readonly rotation: SolarisImageEditorRotation;
  readonly zoom: number;
  readonly aspect: SolarisImageEditorAspect;
  readonly shape: SolarisImageEditorShape;
  readonly offset: SolarisPanOffset;
  readonly viewWidth: number;
  readonly viewHeight: number;
  readonly active?: boolean;
}

export interface SolarisRenderOptions extends SolarisSceneOptions {
  readonly format: SolarisImageEditorFormat;
  readonly quality: number;
  readonly maxDimension: number;
  readonly fileName: string;
}

export function aspectRatioValue(
  aspect: SolarisImageEditorAspect,
): number | null {
  switch (aspect) {
    case '1:1':
      return 1;
    case '4:3':
      return 4 / 3;
    case '3:4':
      return 3 / 4;
    case '16:9':
      return 16 / 9;
    case '9:16':
      return 9 / 16;
    case 'free':
      return null;
  }
}

export function rotatedSize(
  width: number,
  height: number,
  rotation: SolarisImageEditorRotation,
): SolarisImageDimensions {
  if (rotation === 90 || rotation === 270) {
    return { width: height, height: width };
  }
  return { width, height };
}

export function nextRotation(
  rotation: SolarisImageEditorRotation,
): SolarisImageEditorRotation {
  switch (rotation) {
    case 0:
      return 90;
    case 90:
      return 180;
    case 180:
      return 270;
    case 270:
      return 0;
  }
}

export function clampZoom(zoom: number, min: number, max: number): number {
  if (!Number.isFinite(zoom)) {
    return min;
  }
  return Math.min(max, Math.max(min, zoom));
}

export function baseScale(
  viewWidth: number,
  viewHeight: number,
  sourceWidth: number,
  sourceHeight: number,
): number {
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    return 1;
  }
  return Math.min(viewWidth / sourceWidth, viewHeight / sourceHeight);
}

export function cropSourceSize(
  sourceWidth: number,
  sourceHeight: number,
  zoom: number,
  aspect: SolarisImageEditorAspect,
  shape: SolarisImageEditorShape,
): SolarisImageDimensions {
  if (shape === 'circle') {
    const edge = Math.max(1, Math.min(sourceWidth, sourceHeight) / zoom);
    return { width: edge, height: edge };
  }
  const ratio = aspectRatioValue(aspect) ?? sourceWidth / sourceHeight;
  const width = Math.min(sourceWidth, sourceHeight * ratio) / zoom;
  const height = width / ratio;
  return {
    width: Math.max(1, Math.min(width, sourceWidth)),
    height: Math.max(1, Math.min(height, sourceHeight)),
  };
}

export function clampOffset(
  offset: SolarisPanOffset,
  sourceWidth: number,
  sourceHeight: number,
  cropWidth: number,
  cropHeight: number,
): SolarisPanOffset {
  const limitX = Math.max(0, (sourceWidth - cropWidth) / 2);
  const limitY = Math.max(0, (sourceHeight - cropHeight) / 2);
  // The `+ 0` normalizes -0 to +0 so clamped origins stay strictly zero.
  return {
    x: Math.min(limitX, Math.max(-limitX, offset.x)) + 0,
    y: Math.min(limitY, Math.max(-limitY, offset.y)) + 0,
  };
}

export function cropViewRect(
  viewWidth: number,
  viewHeight: number,
  cropWidth: number,
  cropHeight: number,
  displayScale: number,
): SolarisViewCrop {
  const width = cropWidth * displayScale;
  const height = cropHeight * displayScale;
  return {
    x: (viewWidth - width) / 2,
    y: (viewHeight - height) / 2,
    width,
    height,
    diameter: Math.min(width, height),
  };
}

export function fitViewSize(
  sourceWidth: number,
  sourceHeight: number,
  maxWidth: number,
  maxHeight: number,
  minWidth: number,
  minHeight: number,
): SolarisImageDimensions {
  if (
    sourceWidth <= 0 ||
    sourceHeight <= 0 ||
    maxWidth <= 0 ||
    maxHeight <= 0
  ) {
    return { width: Math.max(1, maxWidth), height: Math.max(1, maxHeight) };
  }
  const fit = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
  const fittedWidth = sourceWidth * fit;
  const fittedHeight = sourceHeight * fit;
  const floor = Math.max(minWidth / fittedWidth, minHeight / fittedHeight, 1);
  const ceiling = Math.min(maxWidth / fittedWidth, maxHeight / fittedHeight);
  const scale = fit * Math.min(floor, ceiling);
  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
  };
}

export function outputSize(
  cropWidth: number,
  cropHeight: number,
  maxDimension: number,
): SolarisImageDimensions {
  const longest = Math.max(cropWidth, cropHeight);
  const scale =
    longest > maxDimension && longest > 0 ? maxDimension / longest : 1;
  return {
    width: Math.max(1, Math.round(cropWidth * scale)),
    height: Math.max(1, Math.round(cropHeight * scale)),
  };
}

export function editedFileName(
  originalName: string | undefined,
  format: SolarisImageEditorFormat,
): string {
  const extension = format === 'image/jpeg' ? 'jpg' : 'png';
  if (!originalName || originalName.trim().length === 0) {
    return `edited-image.${extension}`;
  }
  const stem = originalName.split('/').pop() ?? originalName;
  const dot = stem.lastIndexOf('.');
  const base = dot > 0 ? stem.slice(0, dot) : stem;
  return `${base || 'edited-image'}.${extension}`;
}

export function objectUrlFor(source: string | File): {
  readonly url: string;
  readonly revoke: () => void;
} {
  if (typeof source === 'string') {
    if (!isLoadableImageUrl(source)) {
      throw new Error(
        'Only http(s), blob: or data:image: sources can be edited.',
      );
    }
    return { url: source, revoke: () => undefined };
  }
  const url = URL.createObjectURL(source);
  return { url, revoke: () => URL.revokeObjectURL(url) };
}

function isLoadableImageUrl(rawUrl: string): boolean {
  const trimmed = rawUrl.trim().toLowerCase();
  if (trimmed.startsWith('blob:')) {
    return true;
  }
  if (trimmed.startsWith('data:image/')) {
    return true;
  }
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function loadImageElement(
  url: string,
  options: { readonly crossOrigin?: boolean } = {},
): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    if (options.crossOrigin ?? true) {
      image.crossOrigin = 'anonymous';
    }
    image.referrerPolicy = 'no-referrer';
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error('Could not load the image element.'));
    image.src = url;
  });
}

function rotatedSource(
  image: HTMLImageElement,
  rotation: SolarisImageEditorRotation,
): SolarisImageDimensions {
  const naturalWidth = image.naturalWidth || image.width;
  const naturalHeight = image.naturalHeight || image.height;
  return rotatedSize(naturalWidth, naturalHeight, rotation);
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: SolarisImageEditorFormat,
  quality: number,
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    if (typeof canvas.toBlob !== 'function') {
      reject(new Error('Canvas export is not available.'));
      return;
    }
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas export produced an empty image.'));
        }
      },
      format,
      quality,
    );
  });
}

function createCanvas(): HTMLCanvasElement {
  // SECURITY_EXCEPTION: offscreen canvas is the only raster pipeline available; no Angular abstraction exists; SSR-safe via the undefined guard (server has no document); covered by image-editor utils specs.
  const doc = typeof document !== 'undefined' ? document : undefined;
  const canvas = doc?.createElement('canvas');
  if (!canvas) {
    throw new Error('Canvas 2D is not available.');
  }
  return canvas;
}

const MASK_DIM_COLOR = 'rgba(0, 0, 0, 0.35)';
const MASK_GRID_COLOR = 'rgba(255, 255, 255, 0.75)';

function traceCropPath(
  context: CanvasRenderingContext2D,
  crop: SolarisViewCrop,
  shape: SolarisImageEditorShape,
): void {
  if (shape === 'circle') {
    context.arc(
      crop.x + crop.width / 2,
      crop.y + crop.height / 2,
      crop.diameter / 2,
      0,
      Math.PI * 2,
    );
  } else {
    context.rect(crop.x, crop.y, crop.width, crop.height);
  }
}

function paintMask(
  context: CanvasRenderingContext2D,
  viewWidth: number,
  viewHeight: number,
  crop: SolarisViewCrop,
  shape: SolarisImageEditorShape,
  active: boolean,
): void {
  context.save();
  context.beginPath();
  context.rect(0, 0, viewWidth, viewHeight);
  traceCropPath(context, crop, shape);
  context.fillStyle = MASK_DIM_COLOR;
  context.fill('evenodd');
  context.restore();

  if (!active) {
    return;
  }

  context.save();
  if (shape === 'circle') {
    context.beginPath();
    traceCropPath(context, crop, shape);
    context.clip();
  } else {
    context.beginPath();
    context.rect(crop.x, crop.y, crop.width, crop.height);
    context.clip();
  }
  context.beginPath();
  for (let step = 1; step <= 2; step += 1) {
    const x = crop.x + (crop.width * step) / 3;
    context.moveTo(x, crop.y);
    context.lineTo(x, crop.y + crop.height);
    const y = crop.y + (crop.height * step) / 3;
    context.moveTo(crop.x, y);
    context.lineTo(crop.x + crop.width, y);
  }
  context.strokeStyle = MASK_GRID_COLOR;
  context.lineWidth = 1;
  context.stroke();
  context.restore();
}

export function drawPreview(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  options: SolarisSceneOptions,
): void {
  const source = rotatedSource(image, options.rotation);
  if (source.width <= 0 || source.height <= 0) {
    return;
  }
  const fit = baseScale(
    options.viewWidth,
    options.viewHeight,
    source.width,
    source.height,
  );
  const displayScale = fit * options.zoom;
  const cropSize = cropSourceSize(
    source.width,
    source.height,
    options.zoom,
    options.aspect,
    options.shape,
  );
  const crop = cropViewRect(
    options.viewWidth,
    options.viewHeight,
    cropSize.width,
    cropSize.height,
    displayScale,
  );
  canvas.width = options.viewWidth;
  canvas.height = options.viewHeight;
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }
  const naturalWidth = image.naturalWidth || image.width;
  const naturalHeight = image.naturalHeight || image.height;
  context.save();
  context.translate(
    options.viewWidth / 2 + options.offset.x * displayScale,
    options.viewHeight / 2 + options.offset.y * displayScale,
  );
  context.rotate((options.rotation * Math.PI) / 180);
  context.scale(displayScale, displayScale);
  context.drawImage(image, -naturalWidth / 2, -naturalHeight / 2);
  context.restore();
  paintMask(
    context,
    options.viewWidth,
    options.viewHeight,
    crop,
    options.shape,
    options.active ?? false,
  );
}

export async function renderEditedImage(
  image: HTMLImageElement,
  options: SolarisRenderOptions,
): Promise<File> {
  const source = rotatedSource(image, options.rotation);
  if (source.width <= 0 || source.height <= 0) {
    throw new Error('The image has no readable dimensions.');
  }
  const cropSize = cropSourceSize(
    source.width,
    source.height,
    options.zoom,
    options.aspect,
    options.shape,
  );
  const offset = clampOffset(
    options.offset,
    source.width,
    source.height,
    cropSize.width,
    cropSize.height,
  );
  const out = outputSize(cropSize.width, cropSize.height, options.maxDimension);

  const naturalWidth = image.naturalWidth || image.width;
  const naturalHeight = image.naturalHeight || image.height;
  const staging = createCanvas();
  staging.width = source.width;
  staging.height = source.height;
  const stagingCtx = staging.getContext('2d');
  if (!stagingCtx) {
    throw new Error('Canvas 2D is not available.');
  }
  stagingCtx.translate(source.width / 2, source.height / 2);
  stagingCtx.rotate((options.rotation * Math.PI) / 180);
  stagingCtx.drawImage(image, -naturalWidth / 2, -naturalHeight / 2);

  const result = createCanvas();
  result.width = out.width;
  result.height = out.height;
  const resultCtx = result.getContext('2d');
  if (!resultCtx) {
    throw new Error('Canvas 2D is not available.');
  }
  const sx = (source.width - cropSize.width) / 2 + offset.x;
  const sy = (source.height - cropSize.height) / 2 + offset.y;
  if (options.format === 'image/jpeg') {
    resultCtx.fillStyle = '#ffffff';
    resultCtx.fillRect(0, 0, out.width, out.height);
  }
  if (options.shape === 'circle') {
    resultCtx.save();
    resultCtx.beginPath();
    resultCtx.arc(
      out.width / 2,
      out.height / 2,
      Math.min(out.width, out.height) / 2,
      0,
      Math.PI * 2,
    );
    resultCtx.clip();
    resultCtx.drawImage(
      staging,
      sx,
      sy,
      cropSize.width,
      cropSize.height,
      0,
      0,
      out.width,
      out.height,
    );
    resultCtx.restore();
  } else {
    resultCtx.drawImage(
      staging,
      sx,
      sy,
      cropSize.width,
      cropSize.height,
      0,
      0,
      out.width,
      out.height,
    );
  }
  const blob = await canvasToBlob(result, options.format, options.quality);
  return new File([blob], options.fileName, { type: options.format });
}
