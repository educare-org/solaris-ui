import type { SolarisFileUrlFetchOptions } from './file-upload.types';
import { fileNameFromUrl, isHttpUrl } from './upload-state';

export interface SolarisRemoteFileRequest extends SolarisFileUrlFetchOptions {
  readonly allowHttp: boolean;
}

export const SOLARIS_REMOTE_FILE_DEFAULT_TIMEOUT_MS = 15_000;

export async function fetchRemoteFile(
  rawUrl: string,
  request: SolarisRemoteFileRequest,
): Promise<File> {
  if (!isHttpUrl(rawUrl, request.allowHttp)) {
    throw new Error(
      'Only http(s) URLs can be imported. Enable allowHttp for local development.',
    );
  }
  const timeout = linkTimeout(request.signal, request.timeoutMs);
  try {
    const response = await fetch(rawUrl, {
      signal: timeout.signal,
      credentials: 'omit',
      redirect: 'follow',
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }
    const declared = contentLengthOf(response);
    if (declared !== null && declared > request.maxBytes) {
      throw new Error(
        `The remote file exceeds the ${request.maxBytes} byte limit.`,
      );
    }
    const blob = await readBoundedBlob(response, request.maxBytes, rawUrl);
    return new File([blob], fileNameFromUrl(rawUrl), {
      type: blob.type,
    });
  } finally {
    timeout.dispose();
  }
}

function contentLengthOf(response: Response): number | null {
  const header = response.headers.get('Content-Length');
  if (!header) {
    return null;
  }
  const value = Number(header.trim());
  return Number.isInteger(value) && value >= 0 ? value : null;
}

async function readBoundedBlob(
  response: Response,
  maxBytes: number,
  rawUrl: string,
): Promise<Blob> {
  if (!response.body) {
    const blob = await response.blob();
    if (blob.size > maxBytes) {
      throw new Error(`The remote file exceeds the ${maxBytes} byte limit.`);
    }
    return blob;
  }
  const reader = response.body.getReader();
  const chunks: BlobPart[] = [];
  let received = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      received += value.byteLength;
      if (received > maxBytes) {
        throw new Error(
          `The remote file at ${fileNameFromUrl(rawUrl)} exceeds the ${maxBytes} byte limit.`,
        );
      }
      chunks.push(value as BlobPart);
    }
  } finally {
    reader.releaseLock();
  }
  return new Blob(chunks, {
    type: response.headers.get('Content-Type') ?? '',
  });
}

function linkTimeout(
  outer: AbortSignal,
  timeoutMs: number,
): { readonly signal: AbortSignal; dispose(): void } {
  const controller = new AbortController();
  const onOuterAbort = (): void => controller.abort(outer.reason);
  const timer = setTimeout(() => {
    controller.abort(
      new DOMException('The request timed out.', 'TimeoutError'),
    );
  }, timeoutMs);
  if (outer.aborted) {
    controller.abort(outer.reason);
  } else {
    outer.addEventListener('abort', onOuterAbort, { once: true });
  }
  const cleanupTimer = (): void => clearTimeout(timer);
  return {
    signal: controller.signal,
    dispose(): void {
      cleanupTimer();
      outer.removeEventListener('abort', onOuterAbort);
    },
  };
}
