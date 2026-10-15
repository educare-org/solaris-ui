# Solaris File Upload

## Purpose

Solaris File Upload is a form control for selecting local files via a dropzone, a trigger button, or drag and drop. It validates files (type, size, count), tracks per-file upload state with progress, and delegates the actual transfer to a `SolarisFileUploadHandler` (XHR by default, replaceable).

## Component

```txt
selector: <solaris-file-upload>
```

Supporting components:

```txt
selector: <solaris-file-list>        (list of selected files)
selector: <solaris-file-list-item>   (single file row with progress and actions)
```

## When to use

- Forms that need file attachments (documents, images, spreadsheets).
- Avatar/profile photo selection (button variant).
- Anywhere a native `<input type="file">` would be used, with Solaris styling, validation, and accessibility.

## When not to use

- When you need a plain text input — use `input[solaris-input]` directly.
- `input[solaris-input]` explicitly does not support `type="file"` (see `UNSUPPORTED_TYPES`); use this component instead.

## API

### Inputs

| Input                                    | Type                                              | Default      | Description                                                                           |
| ---------------------------------------- | ------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| `variant`                                | `'dropzone' \| 'button' \| 'avatar' \| 'field'`   | `'dropzone'` | Visual trigger: dropzone panel, compact button, circular avatar, or single-line field |
| `fieldLabel` / `fieldLabelKey`           | `string`                                          | —            | Field variant text override (default: `solaris.file-upload.field`)                    |
| `accept`                                 | `string`                                          | —            | Native accept filter (e.g. `'image/*,.pdf'`)                                          |
| `multiple`                               | `boolean`                                         | `true`       | Allow selecting more than one file                                                    |
| `maxFiles`                               | `number`                                          | `10`         | Maximum number of files (`undefined` = unlimited)                                     |
| `maxSize`                                | `number`                                          | `10485760`   | Maximum size per file in bytes, 10 MB (`undefined` = unlimited)                       |
| `uploadUrl`                              | `string`                                          | —            | POST target for automatic upload; when absent, files stay selected                    |
| `autoUpload`                             | `boolean`                                         | `true`       | Start uploading to `uploadUrl` as soon as files are added                             |
| `allowUrl`                               | `boolean`                                         | `false`      | Show a URL row to attach remote files via download                                    |
| `urlLabel` / `urlLabelKey`               | `string`                                          | —            | Accessible label override for the URL input                                           |
| `urlPlaceholder` / `urlPlaceholderKey`   | `string`                                          | —            | Placeholder override for the URL input                                                |
| `urlAddLabel` / `urlAddLabelKey`         | `string`                                          | —            | Add button text override for the URL row                                              |
| `label`                                  | `string`                                          | `''`         | Label text                                                                            |
| `labelKey`                               | `string`                                          | —            | Translation key for label                                                             |
| `hint`                                   | `string`                                          | `''`         | Hint text                                                                             |
| `hintKey`                                | `string`                                          | —            | Translation key for hint                                                              |
| `error`                                  | `string`                                          | `''`         | Manual error text                                                                     |
| `errorKey`                               | `string`                                          | —            | Translation key for manual error                                                      |
| `requiredError`                          | `string`                                          | —            | Custom required error text                                                            |
| `requiredErrorKey`                       | `string`                                          | —            | Translation key for required error                                                    |
| `required`                               | `boolean`                                         | `false`      | Marks field as required                                                               |
| `optional`                               | `boolean`                                         | `false`      | Marks field as optional                                                               |
| `readonly`                               | `boolean`                                         | `false`      | Makes field read-only                                                                 |
| `disabled`                               | `boolean`                                         | `false`      | Disables the field                                                                    |
| `loading`                                | `boolean`                                         | `false`      | Shows a spinner overlay via the inner Form Field                                      |
| `dropzoneLabel` / `dropzoneLabelKey`     | `string`                                          | —            | Dropzone headline override                                                            |
| `dropzoneHint` / `dropzoneHintKey`       | `string`                                          | —            | Dropzone hint override (default: accept + max size)                                   |
| `browseLabel` / `browseLabelKey`         | `string`                                          | —            | Browse button text override                                                           |
| `dropActiveLabel` / `dropActiveLabelKey` | `string`                                          | —            | Dropzone headline while dragging (`solaris.file-upload.drop-active`)                  |
| `listLabel` / `listLabelKey`             | `string`                                          | —            | Accessible label override for the file list                                           |
| `removeLabel` / `removeLabelKey`         | `string`                                          | —            | Accessible label override for remove buttons                                          |
| `retryLabel` / `retryLabelKey`           | `string`                                          | —            | Accessible label override for retry buttons                                           |
| `avatarLabel` / `avatarLabelKey`         | `string`                                          | —            | Accessible label override for the avatar trigger                                      |
| `avatarHeadline` / `avatarHeadlineKey`   | `string`                                          | —            | Avatar panel headline override (default: `solaris.file-upload.avatar.drop`)           |
| `avatarBrowse` / `avatarBrowseKey`       | `string`                                          | —            | Avatar panel link override (default: `solaris.file-upload.avatar.browse`)             |
| `appearance`                             | `'outline' \| 'surface' \| 'filled' \| 'minimal'` | `'outline'`  | Dropzone surface treatment + URL field appearance (main shell is borderless)          |
| `density`                                | `'compact' \| 'normal' \| 'comfortable'`          | —            | Inherited from theme; fallback `normal`                                               |
| `size`                                   | `'sm' \| 'md' \| 'lg'`                            | `'md'`       | Control size                                                                          |
| `radius`                                 | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'`          | `'sm'`       | Border radius                                                                         |
| `name`                                   | `string`                                          | —            | Native name attribute of the hidden file input                                        |
| `id`                                     | `string`                                          | —            | Native id attribute                                                                   |

### Outputs

| Output            | Type                             | Description                                                               |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------- |
| `filesChange`     | `readonly File[]`                | Current file selection after every add/remove/clear                       |
| `fileRejected`    | `readonly SolarisFileRejected[]` | Files refused by validation (`max-size`, `max-files`, `type-not-allowed`) |
| `uploadProgress`  | `SolarisFileUploadProgress`      | `{ itemId, progress }` (0–100) during upload                              |
| `uploadCompleted` | `SolarisFileUploadCompleted`     | `{ itemId, url? }` when an upload finishes                                |
| `uploadFailed`    | `SolarisFileUploadFailed`        | `{ itemId, error }` (`upload-failed` or `aborted`)                        |
| `urlAdded`        | `File`                           | File downloaded from a URL and added to the selection                     |
| `urlFailed`       | `SolarisFileUrlFailed`           | `{ url, error }` when a URL download fails                                |

### Public methods

| Method        | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| `uploadAll()` | Start uploading every `ready`/`error` item (for `autoUpload=false`) |
| `clear()`     | Abort pending uploads, empty the selection, propagate the change    |
| `focus()`     | Move focus to the dropzone/trigger button                           |

## Appearances

| Value     | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| `outline` | Clear border, neutral background. Default, good for traditional forms. |
| `surface` | Card/panel surface, subtle border.                                     |
| `filled`  | Subtle filled background, modern style.                                |
| `minimal` | Borderless, for dense layouts.                                         |

Default: `outline`

## Variants

| Value      | Description                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `dropzone` | Full panel with icon, headline, hint, and drag-and-drop support.                                                           |
| `button`   | Compact trigger button styled like a button, with hover/active states.                                                     |
| `avatar`   | Photo panel: dashed row (2× the form-field control height) with a preview circle, photo headline, link, and supports hint. |
| `field`    | Single-line full-width row with the form-field control height; same `size`/`density`, for forms.                           |

Default: `dropzone`

The main shell (`solaris-form-field`) is intentionally borderless (`minimal`): triggers own their chrome, so no double borders. `appearance` tunes the dropzone surface and the URL field.

## Modes

### Trigger modes

`variant` selects the trigger: `dropzone` (panel + drag-and-drop), `button` (compact), `avatar` (photo panel with live preview circle; pair with `accept="image/*"` and `[multiple]="false"`), `field` (single-line dashed row at the form-field control height with short text + drag-and-drop; pair with `fieldLabel` for custom text).

The avatar panel is a full-width dashed row with `min-height: calc(var(--solaris-form-field-control-height) * 2)`, so it tracks `size`/`density` like any field. The preview circle is `1.5×` the control height with a `solaris-primary-soft` wash; the headline (`avatarHeadline`) and link (`avatarBrowse`) sit beside it, with a supports hint built from `accept` + `maxSize` (`solaris.file-upload.avatar.supports`). The file list is hidden for `avatar`: the preview circle carries the single-file state (pair with `[multiple]="false"`); re-selecting replaces the photo.

### Upload modes

| Mode      | Setup                                                | Description                                                   |
| --------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| Automatic | `uploadUrl` (+ `autoUpload`, default `true`)         | Every added file uploads immediately with progress.           |
| Manual    | `uploadUrl` + `[autoUpload]="false"` + `uploadAll()` | Files wait as `ready` until the consumer starts the transfer. |
| Local     | no `uploadUrl`                                       | Files stay selected; the form value carries the `File[]`.     |

Transfers run through `SolarisFileUploadHandler` (override with `SOLARIS_FILE_UPLOAD_HANDLER`).

### URL mode

With `[allowUrl]="true"`, a translated `solaris-divider` ("ou"/"or") separates a full URL form field: `solaris-input` plus an `Adicionar` ghost button in the suffix action slot. Downloads run through the same validation and emit `urlAdded` / `urlFailed`.

```html
<solaris-file-upload label="Attachments" [allowUrl]="true"></solaris-file-upload>
```

## Image editor

`solaris-image-editor` (see `image-editor.md`) prepares images before upload: zoom slider/buttons, drag-to-pan under a fixed crop window with a translucent mask, 90° rotation, rectangular aspect crops or a circular mask, exported as PNG/JPEG `File`. Prefer opening it in a dialog via `openComponent` (inline works too):

```typescript
const ref = dialogs.openComponent(SolarisImageEditorComponent, {
  title: 'Edit photo',
  width: 'fit-content',
  data: { image: photoFile, aspect: '1:1', shape: 'circle' },
});
ref.afterClosed().subscribe((edited) => {
  if (edited) this.send(edited as File);
});
```

## Density

| Value         | Description                             |
| ------------- | --------------------------------------- |
| `compact`     | Reduced vertical spacing and typography |
| `normal`      | Balanced vertical spacing. Default      |
| `comfortable` | Increased vertical spacing              |

When not provided, density is inherited from the theme.

## Dropzone size x density

The dropzone panel follows a 3×3 `size` × `density` matrix (same pattern as Form Field), so the drag-over state never resizes the panel: `min-height` always fits the full idle content (icon + headline + hint + browse, headline wrapped once), and the shorter drop-active text just centers in the same box.

| Size | Density       | Padding | Min height | Headline | Hint  | Browse | Icon  |
| ---- | ------------- | ------- | ---------- | -------- | ----- | ------ | ----- |
| `sm` | `compact`     | 12px    | 144px      | `xs`     | `2xs` | `xs`   | `lg`  |
| `sm` | `normal`      | 20px    | 160px      | `xs`     | `2xs` | `xs`   | `lg`  |
| `sm` | `comfortable` | 32px    | 176px      | `xs`     | `2xs` | `xs`   | `lg`  |
| `md` | `compact`     | 12px    | 160px      | `sm`     | `xs`  | `sm`   | `xl`  |
| `md` | `normal`      | 20px    | 176px      | `sm`     | `xs`  | `sm`   | `xl`  |
| `md` | `comfortable` | 32px    | 192px      | `sm`     | `xs`  | `sm`   | `xl`  |
| `lg` | `compact`     | 12px    | 176px      | `md`     | `sm`  | `md`   | `2xl` |
| `lg` | `normal`      | 20px    | 192px      | `md`     | `sm`  | `md`   | `2xl` |
| `lg` | `comfortable` | 32px    | 208px      | `md`     | `sm`  | `md`   | `2xl` |

Override per instance with `--solaris-file-upload-dropzone-padding`, `--solaris-file-upload-dropzone-min-height`, `--solaris-file-upload-dropzone-icon-size`, `--solaris-file-upload-headline-font-size`, `--solaris-file-upload-hint-font-size`, `--solaris-file-upload-browse-font-size`.

The host itself is `width: 100%`, so the panel keeps the same size even inside centered flex/grid parents (e.g. docs preview surfaces): as a flex item its width would otherwise resolve from content and the shorter drop-active text would visibly shrink the panel.

> Consumer layout note: in a centered flex row (`display: flex; justify-content: center`), any block-level child — including `solaris-file-upload` — sizes to its content unless stretched. Give the immediate wrapper `width: 100%` (or `flex: 1`) so the panel fills the available width like in a regular form column.

## Radius

| Value  | Description             |
| ------ | ----------------------- |
| `none` | Sharp corners           |
| `sm`   | Small rounding. Default |
| `md`   | Medium rounding         |
| `lg`   | Large rounding          |
| `xl`   | Extra rounding          |

Default: `sm`

## CSS Variables

File Upload declares its own `--solaris-file-upload-*` and `--solaris-file-list-*` custom properties (dropzone, dragover, item). All values reference Solaris tokens; dark and high-contrast themes adapt automatically through the semantic tokens.

## CVA (ControlValueAccessor)

File Upload implements `ControlValueAccessor` with a `File[]` value, so it works with Reactive Forms and template-driven forms. `writeValue` hydrates the list as `ready` items without starting uploads.

```html
<form [formGroup]="form">
  <solaris-file-upload formControlName="attachments" label="Attachments"></solaris-file-upload>
</form>
```

## Upload handler

Transfers run through `SolarisFileUploadHandler`:

```typescript
abstract class SolarisFileUploadHandler {
  abstract upload(file: File, options: SolarisFileUploadOptions): Promise<SolarisFileUploadResponse>;
}
```

- Without `uploadUrl`, no transfer runs: files stay `ready` and the form value carries the `File[]`.
- With `uploadUrl`, the default `XhrFileUploadHandler` (XHR + `FormData`, progress events, `AbortSignal` support) POSTs each file and reads an optional `{ url }` JSON response.
- Override per component tree:

```typescript
{ provide: SOLARIS_FILE_UPLOAD_HANDLER, useClass: MyUploadHandler }
```

## Form Field integration

File Upload delegates to `solaris-form-field`: the main shell is borderless (`minimal`) and provides label, hint, error text, required/optional markers, density, radius, invalid/disabled/readonly state, and `aria-describedby` management. The URL section is a second, full field that owns the `appearance` input.

## Accessibility

- Trigger is a native `<button>`: full keyboard support (Enter/Space), `:focus-visible` ring via `--solaris-focus-ring-*` tokens.
- Native file input is visually hidden (`tabindex="-1"`, `aria-hidden`) and opened only through the labelled trigger.
- File list uses `role="list"` / `role="listitem"`; per-file progress uses `role="progressbar"` with `aria-valuenow`.
- Status changes (added, removed, uploaded, failed) are announced through a polite `role="status"` live region.
- Remove/retry are icon buttons with translated `aria-label` including the file name.
- File icons vary by kind (`image`, `video`, `mic`, `file-text`) and tint by status (info while uploading, success when done); status is always paired with text, never color alone.
- The URL divider is a labelled `separator`; the URL field is a real labelled field with a ghost action button.
- Uploading sets `aria-busy="true"` on the host.
- Drag-and-drop is pointer-only enhancement; the browse button provides a keyboard-equivalent path.
- Respects `prefers-reduced-motion`.

## Limitations (v1)

- No upload queue or concurrency control: with `autoUpload`, all files start at once (follow-up).
- No chunked/resumable uploads (follow-up).
- No clipboard paste support (follow-up).
- URL download requires the remote server to allow CORS.
- The form value carries `File` objects, not server ids/URLs; read `uploadCompleted` for remote references.

## Examples

### Basic

```html
<solaris-file-upload label="Attachments"></solaris-file-upload>
```

### Images only, 5 MB limit

```html
<solaris-file-upload label="Photos" accept="image/*" [maxSize]="5242880" [maxFiles]="5"></solaris-file-upload>
```

### Button variant

```html
<solaris-file-upload variant="button" label="Avatar photo"></solaris-file-upload>
```

### Avatar variant with image editor

```html
<solaris-file-upload variant="avatar" label="Profile photo" accept="image/*" [multiple]="false" (filesChange)="onPhotoSelected($event)"></solaris-file-upload>
```

The component never opens dialogs itself. Wire `filesChange` to the editor in the consumer (same rule as toasts):

```typescript
readonly dialogService = inject(SolarisDialogService);

onPhotoSelected(files: readonly File[]): void {
  const photo = files.find((file) => file.type.startsWith('image/'));
  if (!photo) return;
  const ref = this.dialogService.openComponent(SolarisImageEditorComponent, {
    title: 'Edit photo',
    width: 'fit-content',
    data: { image: photo, aspect: '1:1', shape: 'circle' },
  });
  ref.afterClosed().subscribe((edited) => {
    if (edited instanceof File) this.uploader.writeValue([edited]);
  });
}
```

### Field variant

```html
<solaris-file-upload variant="field" label="Attachment"></solaris-file-upload>
```

### Automatic upload

```html
<solaris-file-upload label="Documents" uploadUrl="/api/uploads" (uploadCompleted)="onUploaded($event)" (uploadFailed)="onFailed($event)"></solaris-file-upload>
```

### Manual upload with custom handler

```html
<solaris-file-upload label="Documents" uploadUrl="/api/uploads" [autoUpload]="false" #uploader></solaris-file-upload> <button type="button" (click)="uploader.uploadAll()">Send</button>
```

### Reactive Forms

```html
<form [formGroup]="form">
  <solaris-file-upload formControlName="attachments" label="Attachments" [required]="true"></solaris-file-upload>
</form>
```

### Rejection feedback with toast

File Upload never shows toasts itself (`forms -> feedback` is forbidden). Subscribe to `fileRejected` and notify with `SolarisToastService`:

```html
<solaris-file-upload label="Attachments" (fileRejected)="onRejected($event)"></solaris-file-upload>
```

```typescript
readonly toast = inject(SolarisToastService);

onRejected(rejected: readonly SolarisFileRejected[]) {
  for (const entry of rejected) {
    if (entry.error === 'max-size') {
      this.toast.warning({ title: 'File exceeds the maximum size.', description: entry.file.name });
    }
  }
}
```
