export { SolarisCodeBlockComponent } from './component/code-block.component';

export { SOLARIS_CODE_HIGHLIGHTER } from './model/code-block.tokens';
export { provideSolarisCodeHighlighter } from './model/code-block.tokens';
export { provideSolarisShikiHighlighter } from './shiki/code-block-shiki.provider';
export type { SolarisShikiHighlighterConfig } from './shiki/code-block-shiki.provider';
export type {
  SolarisCodeBlockAppearance,
  SolarisCodeBlockCommand,
  SolarisCodeBlockDensity,
  SolarisCodeBlockLanguage,
  SolarisCodeBlockLayout,
  SolarisCodeBlockRadius,
  SolarisCodeBlockResolvedCommand,
  SolarisCodeBlockSize,
  SolarisCodeBlockVariant,
  SolarisCodeHighlightColorScheme,
  SolarisCodeHighlightContext,
  SolarisCodeHighlightLine,
  SolarisCodeHighlightResult,
  SolarisCodeHighlightToken,
  SolarisCodeHighlightTokenKind,
  SolarisCodeHighlighter,
} from './model/code-block.types';
export type {
  SIZES,
  LAYOUTS,
  VARIANTS,
  APPEARANCES,
  RADII,
} from './model/code-block.defaults';
