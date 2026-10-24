const ALLOWED_TAGS = new Set([
  'g',
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
]);

const ALLOWED_ATTRS = new Set([
  'd',
  'points',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'width',
  'height',
  'fill',
  'fill-rule',
  'fill-opacity',
  'clip-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-opacity',
  'opacity',
  'transform',
]);

const BANNED_PAIRED_RE =
  /<\s*(script|foreignObject|use|animate|animateTransform|style|iframe|embed|object|a|image|text|tspan)[^<>]*>[\s\S]*?<\/\s*\1\s*>/gi;

const BANNED_SINGLE_RE =
  /<\s*(script|foreignObject|use|animate|animateTransform|style|iframe|embed|object|a|image|text|tspan)[^<>]*(?:\/>|>)/gi;

const TAG_RE = /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9-]*)([^<>]*)(\/?)\s*>/g;

const ATTR_RE =
  /([a-zA-Z_:][a-zA-Z0-9_.:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function isUnsafeValue(value: string): boolean {
  const v = value.trim().toLowerCase();
  return (
    v.includes('javascript:') ||
    v.includes('data:text/html') ||
    v.includes('<script') ||
    v.includes('expression(') ||
    /url\s*\(\s*['"]?\s*javascript:/.test(v)
  );
}

function sanitizeAttrs(raw: string): string {
  const out: string[] = [];
  ATTR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ATTR_RE.exec(raw)) !== null) {
    const name = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    if (name.startsWith('on')) continue;
    if (name === 'href' || name === 'xlink:href' || name === 'style') continue;
    if (!ALLOWED_ATTRS.has(name)) continue;
    if (isUnsafeValue(value)) continue;
    out.push(`${name}="${value.replace(/"/g, '&quot;')}"`);
  }
  return out.length > 0 ? ' ' + out.join(' ') : '';
}

export function sanitizeIconSvgInner(inner: string): string {
  if (!inner) return '';
  const withoutComments = inner.replace(/<!--[\s\S]*?-->/g, '');
  const withoutBanned = withoutComments
    .replace(BANNED_PAIRED_RE, '')
    .replace(BANNED_SINGLE_RE, '');
  TAG_RE.lastIndex = 0;
  return withoutBanned.replace(
    TAG_RE,
    (_full, close: string, tag: string, attrs: string) => {
      const tagName = tag.toLowerCase();
      if (close) {
        return ALLOWED_TAGS.has(tagName) ? `</${tagName}>` : '';
      }
      if (!ALLOWED_TAGS.has(tagName)) return '';
      if (tagName === 'svg') return '';
      const trimmed = attrs.trimEnd();
      const selfClosing = trimmed.endsWith('/');
      const clean = sanitizeAttrs(selfClosing ? trimmed.slice(0, -1) : attrs);
      return `<${tagName}${clean}${selfClosing ? '/' : ''}>`;
    },
  );
}

export function isSafeIconSvgInner(inner: string): boolean {
  return sanitizeIconSvgInner(inner) === inner;
}
