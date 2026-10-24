import type {
  SolarisCodeBlockLanguage,
  SolarisCodeHighlightContext,
  SolarisCodeHighlightLine,
  SolarisCodeHighlightResult,
  SolarisCodeHighlightToken,
  SolarisCodeHighlightTokenKind,
  SolarisCodeHighlighter,
} from '../model/code-block.types';

interface SolarisCodeTokenRule {
  readonly kind: Exclude<SolarisCodeHighlightTokenKind, 'plain'>;
  readonly pattern: RegExp;
}

interface SolarisCodeTokenMatch {
  readonly start: number;
  readonly end: number;
  readonly token: SolarisCodeHighlightToken;
}

const QUOTED_STRING = String.raw`"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'`;
const TEMPLATE_STRING = String.raw`\`[^\`\\]*(?:\\.[^\`\\]*)*\``;
const TEMPLATE_OR_QUOTED = `${TEMPLATE_STRING}|${QUOTED_STRING}`;
const LINE_OR_BLOCK_COMMENT = String.raw`\/\/.*$|\/\*.*?\*\/`;
const MARKUP_ATTRIBUTE = String.raw`(?:\*|#|\[\(|\[|\()?[A-Za-z_:][-A-Za-z0-9_:.]*(?:\)\]|\]|\))?(?==)`;
const STYLE_NUMBER = String.raw`\b\d+(?:\.\d+)?(?:px|em|%|vh|vw|ms|s|deg)?\b`;
const JSON_STRING = String.raw`"[^"\\]*(?:\\.[^"\\]*)*"\s*:|"[^"\\]*(?:\\.[^"\\]*)*"`;
const SHELL_OPERATOR = String.raw`\|\||&&|\||>|<|=|--?[A-Za-z-]+`;

function globalOf(source: string): RegExp {
  return new RegExp(source, 'g');
}

const QUOTED_STRING_REGEX = globalOf(QUOTED_STRING);
const TEMPLATE_OR_QUOTED_REGEX = globalOf(TEMPLATE_OR_QUOTED);
const LINE_OR_BLOCK_COMMENT_REGEX = globalOf(LINE_OR_BLOCK_COMMENT);
const MARKUP_ATTRIBUTE_REGEX = globalOf(MARKUP_ATTRIBUTE);
const STYLE_NUMBER_REGEX = globalOf(STYLE_NUMBER);
const JSON_STRING_REGEX = globalOf(JSON_STRING);
const SHELL_OPERATOR_REGEX = globalOf(SHELL_OPERATOR);

const SCRIPT_KEYWORDS = [
  'arguments',
  'async',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'from',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'null',
  'private',
  'protected',
  'public',
  'readonly',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'type',
  'typeof',
  'undefined',
  'var',
  'void',
  'while',
  'yield',
].join('|');

const JAVA_KEYWORDS = [
  'abstract',
  'boolean',
  'class',
  'extends',
  'final',
  'implements',
  'import',
  'interface',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'static',
  'super',
  'this',
  'throw',
  'throws',
  'true',
  'false',
  'void',
].join('|');

const SHELL_BUILTINS = [
  'pnpm',
  'npm',
  'npx',
  'yarn',
  'bun',
  'git',
  'nx',
  'ng',
  'node',
  'java',
  'javac',
  'cd',
  'ls',
  'dir',
  'cp',
  'mv',
  'rm',
  'mkdir',
].join('|');

const SCRIPT_KEYWORD_REGEX = new RegExp(
  String.raw`\b(?:${SCRIPT_KEYWORDS})\b`,
  'g',
);
const JAVA_KEYWORD_REGEX = new RegExp(
  String.raw`\b(?:${JAVA_KEYWORDS})\b`,
  'g',
);
const SHELL_BUILTIN_REGEX = new RegExp(
  String.raw`\b(?:${SHELL_BUILTINS})\b`,
  'g',
);

const MARKUP_RULES: readonly SolarisCodeTokenRule[] = [
  { kind: 'comment', pattern: /<!--.*?-->/g },
  { kind: 'tag', pattern: /<\/?[A-Za-z][^\s>/]*/g },
  { kind: 'attribute', pattern: MARKUP_ATTRIBUTE_REGEX },
  { kind: 'string', pattern: QUOTED_STRING_REGEX },
];

const STYLE_RULES: readonly SolarisCodeTokenRule[] = [
  { kind: 'comment', pattern: LINE_OR_BLOCK_COMMENT_REGEX },
  { kind: 'keyword', pattern: /@[A-Za-z-]+/g },
  { kind: 'property', pattern: /--[A-Za-z0-9-]+|[A-Za-z-]+(?=\s*:)/g },
  { kind: 'number', pattern: STYLE_NUMBER_REGEX },
  { kind: 'string', pattern: QUOTED_STRING_REGEX },
];

const JAVA_RULES: readonly SolarisCodeTokenRule[] = [
  { kind: 'comment', pattern: LINE_OR_BLOCK_COMMENT_REGEX },
  { kind: 'string', pattern: QUOTED_STRING_REGEX },
  { kind: 'number', pattern: /\b\d+(?:\.\d+)?\b/g },
  { kind: 'keyword', pattern: JAVA_KEYWORD_REGEX },
  { kind: 'annotation', pattern: /@[A-Za-z_]\w*/g },
];

const JSON_RULES: readonly SolarisCodeTokenRule[] = [
  { kind: 'string', pattern: JSON_STRING_REGEX },
  { kind: 'number', pattern: /\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g },
  { kind: 'keyword', pattern: /\b(?:true|false|null)\b/g },
  { kind: 'operator', pattern: /[{}[\],:]/g },
];

const SHELL_RULES: readonly SolarisCodeTokenRule[] = [
  { kind: 'comment', pattern: /#.*$/g },
  { kind: 'string', pattern: QUOTED_STRING_REGEX },
  { kind: 'variable', pattern: /\$[A-Za-z_][A-Za-z0-9_:-]*/g },
  { kind: 'builtin', pattern: SHELL_BUILTIN_REGEX },
  { kind: 'operator', pattern: SHELL_OPERATOR_REGEX },
];

const SCRIPT_RULES: readonly SolarisCodeTokenRule[] = [
  { kind: 'comment', pattern: LINE_OR_BLOCK_COMMENT_REGEX },
  { kind: 'string', pattern: TEMPLATE_OR_QUOTED_REGEX },
  { kind: 'number', pattern: /\b\d+(?:\.\d+)?\b/g },
  { kind: 'keyword', pattern: SCRIPT_KEYWORD_REGEX },
  { kind: 'variable', pattern: /\$[A-Za-z_]\w*/g },
];

const EMPTY_RULES: readonly SolarisCodeTokenRule[] = [];

const RULES_BY_LANGUAGE: Readonly<
  Record<string, readonly SolarisCodeTokenRule[]>
> = {
  angular: MARKUP_RULES,
  bash: SHELL_RULES,
  css: STYLE_RULES,
  html: MARKUP_RULES,
  java: JAVA_RULES,
  javascript: SCRIPT_RULES,
  json: JSON_RULES,
  powershell: SHELL_RULES,
  scss: STYLE_RULES,
  shell: SHELL_RULES,
  typescript: SCRIPT_RULES,
};

const IDENTITY_ALIASES: Readonly<Record<string, string>> = {
  cli: 'cli',
  js: 'javascript',
  plaintext: 'text',
  ps: 'powershell',
  ps1: 'powershell',
  sh: 'shell',
  'text/plain': 'text',
  ts: 'typescript',
  txt: 'text',
};

const HIGHLIGHT_ALIASES: Readonly<Record<string, string>> = {
  angular: 'typescript',
  bash: 'bash',
  cli: 'bash',
  css: 'css',
  html: 'html',
  java: 'java',
  javascript: 'javascript',
  json: 'json',
  powershell: 'powershell',
  scss: 'scss',
  shell: 'bash',
  text: 'text',
  typescript: 'typescript',
};

const DISPLAY_LABELS: Readonly<Record<string, string>> = {
  angular: 'Angular',
  bash: 'Bash',
  cli: 'CLI',
  css: 'CSS',
  html: 'HTML',
  javascript: 'JavaScript',
  json: 'JSON',
  powershell: 'PowerShell',
  scss: 'SCSS',
  shell: 'Shell',
  text: 'Text',
  typescript: 'TypeScript',
};

const BADGE_LABELS: Readonly<Record<string, string>> = {
  angular: 'NG',
  bash: 'SH',
  cli: 'CLI',
  css: 'CSS',
  html: 'HTML',
  javascript: 'JS',
  json: 'JSON',
  powershell: 'PS',
  scss: 'SCSS',
  shell: 'CLI',
  text: 'TXT',
  typescript: 'TS',
};

export const DEFAULT_CODE_HIGHLIGHTER: SolarisCodeHighlighter = {
  highlight(code, language) {
    return createFallbackHighlight(code, language);
  },
};

export function normalizeCodeBlockLanguage(
  language: SolarisCodeBlockLanguage | null,
): string {
  const normalized = (language ?? 'text').trim().toLowerCase();
  return IDENTITY_ALIASES[normalized] ?? normalized ?? 'text';
}

export function resolveHighlightLanguage(
  language: SolarisCodeBlockLanguage | null,
): string {
  const normalized = normalizeCodeBlockLanguage(language);
  return HIGHLIGHT_ALIASES[normalized] ?? normalized;
}

export function splitIntoLines(code: string): readonly string[] {
  return code.split(/\r\n|\r|\n/);
}

export function countLines(code: string): number {
  return splitIntoLines(code).length;
}

export function createPlainHighlight(
  code: string,
  language: SolarisCodeBlockLanguage | null,
): SolarisCodeHighlightResult {
  return {
    language: normalizeCodeBlockLanguage(language),
    lines: splitIntoLines(code).map((line) => ({
      tokens: [plainToken(line)],
    })),
  };
}

export function createFallbackHighlight(
  code: string,
  language: SolarisCodeBlockLanguage | null,
): SolarisCodeHighlightResult {
  const highlightLanguage = resolveHighlightLanguage(language);
  const rules = RULES_BY_LANGUAGE[highlightLanguage] ?? EMPTY_RULES;
  return {
    language: normalizeCodeBlockLanguage(language),
    lines: splitIntoLines(code).map((line) =>
      tokenizeLine(line, rules, highlightLanguage),
    ),
  };
}

export function normalizeHighlightResult(
  result: SolarisCodeHighlightResult,
  code: string,
  language: SolarisCodeBlockLanguage | null,
): SolarisCodeHighlightResult {
  const lines = result.lines.filter((line) => line.tokens.length > 0);
  if (lines.length === 0) {
    return createPlainHighlight(code, language);
  }
  return {
    language: result.language ?? normalizeCodeBlockLanguage(language),
    lines,
  };
}

export function getLanguageDisplayLabel(
  language: SolarisCodeBlockLanguage | null,
): string {
  const normalized = normalizeCodeBlockLanguage(language);
  return (
    DISPLAY_LABELS[normalized] ??
    normalized
      .split(/[-_\s]+/)
      .filter((segment) => segment.length > 0)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ')
  );
}

export function getLanguageBadgeText(
  language: SolarisCodeBlockLanguage | null | undefined,
): string {
  const normalized = normalizeCodeBlockLanguage(language ?? null);
  const badge =
    BADGE_LABELS[normalized] ?? normalized.slice(0, 4).toUpperCase();
  return badge || 'TXT';
}

export function createHighlightContext(
  colorScheme: SolarisCodeHighlightContext['colorScheme'],
): SolarisCodeHighlightContext {
  return { colorScheme };
}

export function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return value instanceof Promise;
}

function plainToken(text: string): SolarisCodeHighlightToken {
  return { text, kind: 'plain' };
}

function clonePattern(pattern: RegExp): RegExp {
  return new RegExp(pattern.source, pattern.flags);
}

function collectRuleMatches(
  matches: SolarisCodeTokenMatch[],
  line: string,
  rule: SolarisCodeTokenRule,
  language: string,
): void {
  const pattern = clonePattern(rule.pattern);
  let match: RegExpExecArray | null = pattern.exec(line);
  while (match) {
    const text = match[0];
    if (text.length > 0) {
      const start = match.index;
      matches.push({
        start,
        end: start + text.length,
        token: { text, kind: resolveTokenKind(rule.kind, text, language) },
      });
    }
    if (!pattern.global) {
      return;
    }
    match = pattern.exec(line);
  }
}

function resolveTokenKind(
  kind: Exclude<SolarisCodeHighlightTokenKind, 'plain'>,
  text: string,
  language: string,
): Exclude<SolarisCodeHighlightTokenKind, 'plain'> {
  if (language === 'json' && kind === 'string' && /"\s*:/.test(text)) {
    return 'property';
  }
  return kind;
}

function toLineTokens(
  line: string,
  matches: readonly SolarisCodeTokenMatch[],
): SolarisCodeHighlightToken[] {
  const tokens: SolarisCodeHighlightToken[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start < cursor) {
      continue;
    }
    if (match.start > cursor) {
      tokens.push(plainToken(line.slice(cursor, match.start)));
    }
    tokens.push(match.token);
    cursor = match.end;
  }
  if (cursor < line.length) {
    tokens.push(plainToken(line.slice(cursor)));
  }
  return tokens;
}

function tokenizeLine(
  line: string,
  rules: readonly SolarisCodeTokenRule[],
  language: string,
): SolarisCodeHighlightLine {
  if (line.length === 0) {
    return { tokens: [plainToken('')] };
  }
  const matches: SolarisCodeTokenMatch[] = [];
  for (const rule of rules) {
    collectRuleMatches(matches, line, rule, language);
  }
  matches.sort((left, right) =>
    left.start !== right.start
      ? left.start - right.start
      : right.end - left.end,
  );
  const tokens = toLineTokens(line, matches);
  return { tokens: tokens.length > 0 ? tokens : [plainToken(line)] };
}
