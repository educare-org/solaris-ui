import { nextIdFor } from '../../../../core';

import type {
  SolarisFileRejected,
  SolarisFileUploadError,
  SolarisFileUploadItem,
  SolarisFileUploadStatus,
} from './file-upload.types';

export interface SolarisFileValidationOptions {
  readonly accept?: string;
  readonly maxSize?: number;
}

export interface SolarisAppendFilesOptions
  extends SolarisFileValidationOptions {
  readonly multiple?: boolean;
  readonly maxFiles?: number;
}

export interface SolarisAppendFilesResult {
  readonly items: SolarisFileUploadItem[];
  readonly rejected: SolarisFileRejected[];
}

export function createUploadItem(file: File): SolarisFileUploadItem {
  return {
    id: nextIdFor('solaris-file-upload-item'),
    file,
    status: 'ready',
    progress: 0,
  };
}

export function matchesAccept(file: File, accept?: string): boolean {
  if (!accept || accept.trim().length === 0) {
    return true;
  }
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  const entries = accept
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
  if (entries.length === 0) {
    return true;
  }
  return entries.some((entry) => {
    if (entry.startsWith('.')) {
      return fileName.endsWith(entry);
    }
    if (entry.includes('/')) {
      if (fileType.length === 0) {
        return false;
      }
      if (entry.endsWith('/*')) {
        return fileType.startsWith(entry.slice(0, -1));
      }
      return fileType === entry;
    }
    return false;
  });
}

export function validateIncomingFile(
  file: File,
  options: SolarisFileValidationOptions,
): Extract<SolarisFileUploadError, 'max-size' | 'type-not-allowed'> | null {
  if (!matchesAccept(file, options.accept)) {
    return 'type-not-allowed';
  }
  if (options.maxSize !== undefined && file.size > options.maxSize) {
    return 'max-size';
  }
  return null;
}

export function appendFiles(
  current: readonly SolarisFileUploadItem[],
  incoming: readonly File[],
  options: SolarisAppendFilesOptions,
): SolarisAppendFilesResult {
  const rejected: SolarisFileRejected[] = [];
  const items: SolarisFileUploadItem[] = [];
  const allowMultiple = options.multiple ?? true;
  const maxFiles = options.maxFiles;

  if (!allowMultiple && incoming.length > 0) {
    const kept = incoming[0];
    const error = validateIncomingFile(kept, options);
    if (error) {
      for (const file of incoming) {
        const fileError = validateIncomingFile(file, options) ?? error;
        rejected.push({ file, error: fileError });
      }
      return { items: [...current], rejected };
    }
    for (const extra of incoming.slice(1)) {
      rejected.push({ file: extra, error: 'max-files' });
    }
    return { items: [createUploadItem(kept)], rejected };
  }

  let next = [...current];
  for (const file of incoming) {
    const error = validateIncomingFile(file, options);
    if (error) {
      rejected.push({ file, error });
      continue;
    }
    if (maxFiles !== undefined && next.length + items.length >= maxFiles) {
      rejected.push({ file, error: 'max-files' });
      continue;
    }
    items.push(createUploadItem(file));
  }
  next = [...next, ...items];
  return { items: next, rejected };
}

export function removeUploadItem(
  items: readonly SolarisFileUploadItem[],
  id: string,
): SolarisFileUploadItem[] {
  return items.filter((item) => item.id !== id);
}

export interface SolarisUploadItemPatch {
  readonly status?: SolarisFileUploadStatus;
  readonly progress?: number;
  readonly error?: SolarisFileUploadError;
  readonly url?: string;
}

export function updateUploadItem(
  items: readonly SolarisFileUploadItem[],
  id: string,
  patch: SolarisUploadItemPatch,
): SolarisFileUploadItem[] {
  return items.map((item) => {
    if (item.id !== id) {
      return item;
    }
    return {
      ...item,
      ...(patch.status !== undefined ? { status: patch.status } : null),
      ...(patch.progress !== undefined ? { progress: patch.progress } : null),
      ...('error' in patch ? { error: patch.error } : null),
      ...('url' in patch ? { url: patch.url } : null),
    };
  });
}

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'];

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 B';
  }
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < FILE_SIZE_UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const rounded = Math.round(value * 10) / 10;
  const display = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `${display} ${FILE_SIZE_UNITS[unitIndex]}`;
}

export function fileNameFromUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const segments = parsed.pathname.split('/').filter((part) => part !== '');
    const last = segments.at(-1);
    if (last) {
      return sanitizeFileName(decodeURIComponent(last));
    }
  } catch {
    // Invalid URLs fall through to the default name below.
  }
  return 'remote-file';
}

export const SOLARIS_SAFE_FILE_NAME_MAX_LENGTH = 120;

export function sanitizeFileName(
  rawName: string,
  maxLength = SOLARIS_SAFE_FILE_NAME_MAX_LENGTH,
): string {
  const noSeparators = rawName.replace(/[/\\]+/g, '-');
  // eslint-disable-next-line no-control-regex
  const noControls = noSeparators.replace(/[\x00-\x1f\x7f]+/g, '');
  const trimmed = noControls
    .trim()
    .replace(/^[.\- ]+/, '')
    .trim();
  const fallback = trimmed.length > 0 ? trimmed : 'file';
  if (fallback.length <= maxLength) {
    return fallback;
  }
  const dot = fallback.lastIndexOf('.');
  const stem = dot > 0 ? fallback.slice(0, dot) : fallback;
  const extension = dot > 0 ? fallback.slice(dot) : '';
  const cappedExtension = extension.slice(0, 16);
  const stemBudget = Math.max(1, maxLength - cappedExtension.length);
  return `${stem.slice(0, stemBudget)}${cappedExtension}`;
}

export function isHttpUrl(rawUrl: string, allowHttp: boolean): boolean {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }
  if (parsed.username.length > 0 || parsed.password.length > 0) {
    return false;
  }
  if (parsed.protocol === 'https:') {
    return true;
  }
  return allowHttp && parsed.protocol === 'http:';
}

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(value)));
}

const FILE_MAGIC_SIGNATURES: ReadonlyArray<{
  readonly kind: string;
  readonly bytes: readonly number[];
  readonly offset?: number;
}> = [
  { kind: 'png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { kind: 'jpeg', bytes: [0xff, 0xd8, 0xff] },
  { kind: 'gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { kind: 'pdf', bytes: [0x25, 0x50, 0x44, 0x46] },
  { kind: 'zip', bytes: [0x50, 0x4b, 0x03, 0x04] },
];

export async function sniffFileKind(file: File): Promise<string | null> {
  const bytes = await readHeadBytes(file, 12);
  if (!bytes) {
    return null;
  }
  for (const signature of FILE_MAGIC_SIGNATURES) {
    const offset = signature.offset ?? 0;
    if (
      signature.bytes.every((value, index) => bytes[offset + index] === value)
    ) {
      return signature.kind;
    }
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'webp';
  }
  return null;
}

async function readHeadBytes(
  file: File,
  length: number,
): Promise<Uint8Array | null> {
  const slice = file.slice(0, length);
  if (typeof slice.arrayBuffer !== 'function') {
    return null;
  }
  try {
    return new Uint8Array(await slice.arrayBuffer());
  } catch {
    return null;
  }
}

export function validateSourceDimensions(
  width: number,
  height: number,
  maxDimension: number,
  maxPixels: number,
): 'too-large' | null {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return 'too-large';
  }
  if (width > maxDimension || height > maxDimension) {
    return 'too-large';
  }
  if (width * height > maxPixels) {
    return 'too-large';
  }
  return null;
}
