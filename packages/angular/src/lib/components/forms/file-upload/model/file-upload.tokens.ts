import { InjectionToken } from '@angular/core';

import type { SolarisFileUploadHandler } from './file-upload.types';

export const SOLARIS_FILE_UPLOAD_HANDLER =
  new InjectionToken<SolarisFileUploadHandler | null>(
    'SOLARIS_FILE_UPLOAD_HANDLER',
    {
      factory: () => null,
    },
  );
