export type SolarisRichTextVariant = 'document' | 'composer';

export type SolarisRichTextAppearance = 'outline' | 'surface' | 'filled';

export type SolarisRichTextSize = 'sm' | 'md' | 'lg';

export type SolarisRichTextDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisRichTextInlineTag =
  | 'strong'
  | 'em'
  | 'u'
  | 's'
  | 'code'
  | 'sub'
  | 'sup';

export type SolarisRichTextCodeLanguage =
  | 'auto'
  | 'text'
  | 'typescript'
  | 'javascript'
  | 'html'
  | 'scss'
  | 'css'
  | 'json'
  | 'shell'
  | 'bash'
  | 'powershell'
  | 'java'
  | 'angular';

export interface SolarisRichTextCodeLanguageOption {
  readonly id: SolarisRichTextCodeLanguage;
  readonly name: string;
}

export type SolarisRichTextActiveMark =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'link'
  | 'bulletList'
  | 'orderedList';

export type SolarisRichTextRadius = 'none' | 'sm' | 'md' | 'lg';

export type SolarisRichTextToolbarDisplay =
  | 'fixed'
  | 'floating'
  | 'both'
  | 'hidden';

export interface SolarisRichTextToolbarContrast {
  readonly level: 'ok' | 'partial' | 'fail';
}

export interface SolarisRichTextLinkDraft {
  readonly url: string;
  readonly text: string;
}

export type SolarisRichTextToolbarPreset = 'full' | 'minimal' | 'custom';

export type SolarisRichTextContentFormat = 'rich' | 'plain';

export type SolarisRichTextSubmitTrigger =
  | 'enter'
  | 'ctrl-enter'
  | 'both'
  | 'none';

export type SolarisRichTextBlockType =
  | 'paragraph'
  | 'heading'
  | 'quote'
  | 'code'
  | 'bullet-list'
  | 'ordered-list'
  | 'list-item'
  | 'mention'
  | 'table'
  | 'image'
  | 'divider';

export interface SolarisRichTextMention {
  readonly id: string;
  readonly label: string;
  readonly key: string;
}

export type SolarisRichTextField = SolarisRichTextMention;

export interface SolarisRichTextBlock {
  readonly id: string;
  readonly blockType: SolarisRichTextBlockType;
  readonly level?: 1 | 2 | 3;
  readonly text?: string;
  readonly mention?: SolarisRichTextMention;
  readonly children?: readonly SolarisRichTextBlock[];
}

export interface SolarisRichTextValue {
  readonly html: string;
  readonly text: string;
  readonly blocks: readonly SolarisRichTextBlock[];
  readonly version: 1;
}

export interface SolarisRichTextImageOptions {
  readonly accept?: string;
  readonly maxSizeBytes?: number;
}

export type SolarisRichTextImagePreset = 'S' | 'M' | 'L' | 'original';

export type SolarisRichTextEditorValueInput =
  | SolarisRichTextValue
  | string
  | null
  | undefined;
