export type SolarisCodeBlockLayout = 'inline' | 'block';

export type SolarisCodeBlockVariant = 'code' | 'command';

export type SolarisCodeBlockAppearance = 'surface' | 'outline';

export type SolarisCodeBlockSize = 'sm' | 'md' | 'lg';

export type SolarisCodeBlockDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisCodeBlockRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export type SolarisCodeBlockLanguage =
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
  | 'angular'
  | 'text'
  | string;

export interface SolarisCodeBlockCommand {
  readonly id: string;
  readonly label: string;
  readonly labelKey?: string;
  readonly code: string;
  readonly language?: SolarisCodeBlockLanguage;
  readonly icon?: string;
}

export interface SolarisCodeBlockResolvedCommand
  extends SolarisCodeBlockCommand {
  readonly resolvedLabel: string;
}

export type SolarisCodeHighlightColorScheme = 'light' | 'dark';

export type SolarisCodeHighlightTokenKind =
  | 'plain'
  | 'annotation'
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'tag'
  | 'attribute'
  | 'property'
  | 'operator'
  | 'builtin'
  | 'variable';

export interface SolarisCodeHighlightToken {
  readonly text: string;
  readonly kind: SolarisCodeHighlightTokenKind;
  readonly color?: string | null;
  readonly fontStyle?: string | null;
  readonly fontWeight?: string | null;
  readonly textDecoration?: string | null;
}

export interface SolarisCodeHighlightLine {
  readonly tokens: readonly SolarisCodeHighlightToken[];
}

export interface SolarisCodeHighlightResult {
  readonly language: SolarisCodeBlockLanguage | null;
  readonly lines: readonly SolarisCodeHighlightLine[];
}

export interface SolarisCodeHighlightContext {
  readonly colorScheme: SolarisCodeHighlightColorScheme;
}

export interface SolarisCodeHighlighter {
  highlight(
    code: string,
    language: SolarisCodeBlockLanguage | null,
    context?: SolarisCodeHighlightContext,
  ): SolarisCodeHighlightResult | Promise<SolarisCodeHighlightResult>;
}
