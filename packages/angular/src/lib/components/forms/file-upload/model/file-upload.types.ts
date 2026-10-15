import type {
  SolarisFormFieldAppearance,
  SolarisFormFieldDensity,
  SolarisFormFieldRadius,
  SolarisFormFieldSize,
} from '../../form-field';

export type SolarisFileUploadAppearance = SolarisFormFieldAppearance;
export type SolarisFileUploadDensity = SolarisFormFieldDensity;
export type SolarisFileUploadRadius = SolarisFormFieldRadius;
export type SolarisFileUploadSize = SolarisFormFieldSize;

export type SolarisFileUploadVariant =
  | 'dropzone'
  | 'button'
  | 'avatar'
  | 'field';

export type SolarisFileUploadStatus =
  | 'ready'
  | 'uploading'
  | 'success'
  | 'error';

export type SolarisFileUploadError =
  | 'max-size'
  | 'max-files'
  | 'type-not-allowed'
  | 'upload-failed'
  | 'aborted';

export interface SolarisFileUploadItem {
  readonly id: string;
  readonly file: File;
  readonly status: SolarisFileUploadStatus;
  readonly progress: number;
  readonly error?: SolarisFileUploadError;
  readonly url?: string;
}

export interface SolarisFileRejected {
  readonly file: File;
  readonly error: Extract<
    SolarisFileUploadError,
    'max-size' | 'max-files' | 'type-not-allowed'
  >;
}

export interface SolarisFileUploadOptions {
  readonly url: string;
  readonly signal: AbortSignal;
  readonly onProgress: (percent: number) => void;
  readonly headers?: Readonly<Record<string, string>>;
  readonly withCredentials?: boolean;
  readonly timeoutMs?: number;
  readonly fieldName?: string;
}

export interface SolarisFileUploadResponse {
  readonly url?: string;
}

export interface SolarisFileUploadCompleted {
  readonly itemId: string;
  readonly url?: string;
}

export interface SolarisFileUploadFailed {
  readonly itemId: string;
  readonly error: Extract<SolarisFileUploadError, 'upload-failed' | 'aborted'>;
}

export interface SolarisFileUploadCancelled {
  readonly itemId: string;
}

export interface SolarisFileUrlFailed {
  readonly url: string;
  readonly error: string;
}

export interface SolarisFileUploadProgress {
  readonly itemId: string;
  readonly progress: number;
}

export interface SolarisFileUrlFetchOptions {
  readonly signal: AbortSignal;
  readonly maxBytes: number;
  readonly timeoutMs: number;
}

export abstract class SolarisFileUploadHandler {
  abstract upload(
    file: File,
    options: SolarisFileUploadOptions,
  ): Promise<SolarisFileUploadResponse>;

  fetchUrl?(url: string, options: SolarisFileUrlFetchOptions): Promise<File>;
}
