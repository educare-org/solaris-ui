export type SolarisImageEditorAspect =
  | 'free'
  | '1:1'
  | '4:3'
  | '3:4'
  | '16:9'
  | '9:16';

export type SolarisImageEditorShape = 'rect' | 'circle';

export type SolarisImageEditorRotation = 0 | 90 | 180 | 270;

export type SolarisImageEditorFormat = 'image/png' | 'image/jpeg';

export interface SolarisImageEditorData {
  readonly image: string | File;
  readonly aspect?: SolarisImageEditorAspect;
  readonly shape?: SolarisImageEditorShape;
}
