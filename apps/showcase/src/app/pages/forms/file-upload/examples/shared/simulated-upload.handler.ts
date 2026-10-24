import {
  SolarisFileUploadHandler,
  type SolarisFileUploadOptions,
  type SolarisFileUploadResponse,
} from '@solaris-ui/angular';

const PROGRESS_STEPS = [15, 40, 65, 85, 100];
const STEP_DELAY_MS = 180;

export class SimulatedUploadHandler extends SolarisFileUploadHandler {
  override async upload(
    file: File,
    options: SolarisFileUploadOptions,
  ): Promise<SolarisFileUploadResponse> {
    for (const progress of PROGRESS_STEPS) {
      await new Promise((resolve) => setTimeout(resolve, STEP_DELAY_MS));
      if (options.signal.aborted) {
        throw new DOMException('Upload aborted.', 'AbortError');
      }
      options.onProgress(progress);
    }
    return { url: URL.createObjectURL(file) };
  }
}
