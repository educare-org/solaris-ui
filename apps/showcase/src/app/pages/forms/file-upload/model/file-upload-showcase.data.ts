import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const FILE_UPLOAD_SHOWCASE_SLUG = 'file-upload';
export const FILE_UPLOAD_TRANSLATION_PREFIX = 'file-upload';

export const FILE_UPLOAD_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.file-upload' },
  ];

export const FILE_UPLOAD_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.otp-input',
  route: '/forms/otp-input',
};

export const FILE_UPLOAD_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.checkbox',
  route: '/forms/checkbox',
};

export const FILE_UPLOAD_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'file-upload.section.examples' },
  { anchor: 'modes', labelKey: 'file-upload.section.modes' },
  { anchor: 'upload', labelKey: 'file-upload.section.upload' },
  { anchor: 'url', labelKey: 'file-upload.section.url' },
  { anchor: 'editor', labelKey: 'file-upload.section.editor' },
  { anchor: 'installation', labelKey: 'file-upload.section.installation' },
  { anchor: 'props', labelKey: 'file-upload.section.props' },
];

export const FILE_UPLOAD_SHOWCASE_IMPORT_CODE =
  "import { SolarisFileUploadComponent, SolarisImageEditorComponent } from '@solaris-ui/angular';";

export const FILE_UPLOAD_SHOWCASE_BASIC_CODE = [
  '<solaris-file-upload',
  '  label="Attachments"',
  '  [maxSize]="maxSize"',
  '  [maxFiles]="maxFiles"',
  '  (fileRejected)="onFileRejected($event)"',
  '>',
  '</solaris-file-upload>',
  '',
  '// component: maxSize em bytes (ex.: 5 * 1024 * 1024), undefined = sem limite.',
  '// use o mesmo valor no toast para não truncar a mensagem.',
].join('\n');

export function fileUploadModeCode(
  variant: string,
  size = 'md',
  density = 'normal',
): string {
  if (variant === 'avatar') {
    return [
      '<solaris-file-upload',
      '  label="Profile photo"',
      '  variant="avatar"',
      '  accept="image/*"',
      '  [multiple]="false"',
      `  size="${size}"`,
      `  density="${density}"`,
      '  (filesChange)="onPhotoSelected($event)"',
      '  (fileRejected)="onFileRejected($event)"',
      '>',
      '</solaris-file-upload>',
      '',
      '// consumer: open SolarisImageEditorComponent in a dialog',
      '// with { image: photo, aspect: "1:1", shape: "circle" },',
      '// then writeValue([edited]) to replace the selection.',
    ].join('\n');
  }
  if (variant === 'field') {
    return [
      '<solaris-file-upload',
      '  label="Attachment"',
      '  variant="field"',
      `  size="${size}"`,
      `  density="${density}"`,
      '  (fileRejected)="onFileRejected($event)"',
      '>',
      '</solaris-file-upload>',
    ].join('\n');
  }
  const label = variant === 'button' ? 'Avatar photo' : 'Attachments';
  const extra = variant === 'button' ? '\n  variant="button"' : '';
  return [
    `<solaris-file-upload label="${label}"${extra}`,
    `  size="${size}"`,
    `  density="${density}"`,
    '  (fileRejected)="onFileRejected($event)"',
    '>',
    '</solaris-file-upload>',
  ].join('\n');
}

export const FILE_UPLOAD_SHOWCASE_UPLOAD_AUTO_CODE = [
  '<solaris-file-upload',
  '  label="Documents"',
  '  uploadUrl="https://uploads.example.com"',
  '  (fileRejected)="onFileRejected($event)"',
  '>',
  '</solaris-file-upload>',
].join('\n');

export const FILE_UPLOAD_SHOWCASE_UPLOAD_MANUAL_CODE = [
  '<solaris-file-upload',
  '  label="Documents"',
  '  uploadUrl="https://uploads.example.com"',
  '  [autoUpload]="false"',
  '  (fileRejected)="onFileRejected($event)"',
  '  #uploader',
  '>',
  '</solaris-file-upload>',
  '<button type="button" (click)="uploader.uploadAll()">Send</button>',
].join('\n');

export const FILE_UPLOAD_SHOWCASE_URL_CODE = [
  '<solaris-file-upload',
  '  label="Attachments"',
  '  [allowUrl]="true"',
  '  (fileRejected)="onFileRejected($event)"',
  '>',
  '</solaris-file-upload>',
].join('\n');

export function fileUploadEditorCode(shape: string, aspect: string): string {
  return [
    'dialogService.openComponent(SolarisImageEditorComponent, {',
    "  title: 'Edit photo',",
    "  width: 'fit-content',",
    `  data: { image, aspect: '${aspect}', shape: '${shape}' },`,
    '});',
  ].join('\n');
}

export { SHOWCASE_INSTALL_COMMANDS as FILE_UPLOAD_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
