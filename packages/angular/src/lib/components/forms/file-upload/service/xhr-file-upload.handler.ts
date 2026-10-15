import { Injectable } from '@angular/core';

import type {
  SolarisFileUploadHandler,
  SolarisFileUploadOptions,
  SolarisFileUploadResponse,
} from '../model/file-upload.types';
import { isHttpUrl, sanitizeFileName } from '../model/upload-state';

@Injectable({
  providedIn: 'root',
})
export class XhrFileUploadHandler implements SolarisFileUploadHandler {
  upload(
    file: File,
    options: SolarisFileUploadOptions,
  ): Promise<SolarisFileUploadResponse> {
    return new Promise<SolarisFileUploadResponse>((resolve, reject) => {
      if (!isHttpUrl(options.url, true)) {
        reject(new Error('Upload URLs must use the http or https protocol.'));
        return;
      }
      const request = new XMLHttpRequest();
      const formData = new FormData();
      formData.append(
        options.fieldName ?? 'file',
        file,
        sanitizeFileName(file.name),
      );

      const onAbort = (): void => {
        request.abort();
      };

      if (options.signal.aborted) {
        reject(new DOMException('Upload aborted.', 'AbortError'));
        return;
      }
      options.signal.addEventListener('abort', onAbort, { once: true });

      if (options.timeoutMs !== undefined) {
        request.timeout = options.timeoutMs;
      }
      if (options.withCredentials === true) {
        request.withCredentials = true;
      }

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
      request.addEventListener('timeout', () => {
        options.signal.removeEventListener('abort', onAbort);
        reject(new DOMException('Upload timed out.', 'TimeoutError'));
      });
      request.addEventListener('abort', () => {
        options.signal.removeEventListener('abort', onAbort);
        reject(new DOMException('Upload aborted.', 'AbortError'));
      });

      request.open('POST', options.url);
      if (options.headers) {
        for (const [name, value] of Object.entries(options.headers)) {
          request.setRequestHeader(name, value);
        }
      }
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
          const url = (payload as { url: string }).url;
          if (isHttpUrl(url, true)) {
            return { url };
          }
        }
      } catch {
        return {};
      }
    }
    return {};
  }
}
