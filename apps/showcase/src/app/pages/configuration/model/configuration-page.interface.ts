export interface FontSizeSample {
  token: string;
  cssVar: string;
  size: string;
  className: string;
}

export interface FontFamilySample {
  label: string;
  cssVar: string;
  fontName: string;
  className: string;
}

export interface TokenGroup {
  label: string;
  tokens: { name: string; cssVar: string }[];
  type: 'color' | 'border' | 'spacing' | 'radius';
}

export interface IconItem {
  name: string;
}
