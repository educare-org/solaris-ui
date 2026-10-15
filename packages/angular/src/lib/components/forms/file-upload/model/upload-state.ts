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
    const last = segments[segments.length - 1];
    if (last) {
      return decodeURIComponent(last);
    }
  } catch {
    // Invalid URLs fall through to the default name below.
  }
  return 'remote-file';
}
