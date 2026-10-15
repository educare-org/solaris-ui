import { Injectable } from '@angular/core';

import type {
  SolarisFileUploadHandler,
  SolarisFileUploadOptions,
  SolarisFileUploadResponse,
} from '../model/file-upload.types';

@Injectable({
  providedIn: 'root',
})
export class XhrFileUploadHandler implements SolarisFileUploadHandler {
  upload(
    file: File,
    options: SolarisFileUploadOptions,
  ): Promise<SolarisFileUploadResponse> {
    return new Promise<SolarisFileUploadResponse>((resolve, reject) => {
      const request = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file, file.name);

      const onAbort = (): void => {
        request.abort();
      };

      if (options.signal.aborted) {
        reject(new DOMException('Upload aborted.', 'AbortError'));
        return;
      }
      options.signal.addEventListener('abort', onAbort, { once: true });

      request.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && event.total > 0) {
          options.onProgress(
            Math.min(
              100,
              Math.max(0, Math.round((event.loaded * 100) / event.total)),
            ),
          );
        }
      });
      request.addEventListener('load', () => {
        options.signal.removeEventListener('abort', onAbort);
        if (request.status >= 200 && request.status < 300) {
          options.onProgress(100);
          resolve(this.readUrl(request));
        } else {
          reject(new Error(`Upload failed with status ${request.status}.`));
        }
      });
      request.addEventListener('error', () => {
        options.signal.removeEventListener('abort', onAbort);
        reject(new Error('Upload failed due to a network error.'));
      });
      request.addEventListener('abort', () => {
        options.signal.removeEventListener('abort', onAbort);
        reject(new DOMException('Upload aborted.', 'AbortError'));
      });

      request.open('POST', options.url);
      request.send(formData);
    });
  }

  private readUrl(request: XMLHttpRequest): SolarisFileUploadResponse {
    const contentType = request.getResponseHeader('Content-Type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        const payload = JSON.parse(request.responseText) as unknown;
        if (
          typeof payload === 'object' &&
          payload !== null &&
          'url' in payload &&
          typeof (payload as { url: unknown }).url === 'string'
        ) {
          return { url: (payload as { url: string }).url };
        }
      } catch {
        return {};
      }
    }
    return {};
  }
}
