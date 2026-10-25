import type { SvgElement } from '../model/solaris-icon-definition.interface';
import { sanitizeIconSvgInner } from './solaris-icon-sanitizer';

export type SolarisIconSvgNodeTag =
  | 'g'
  | 'mask'
  | 'path'
  | 'circle'
  | 'rect'
  | 'line'
  | 'polyline'
  | 'polygon'
  | 'ellipse';

export interface SolarisIconSvgNode {
  tag: SolarisIconSvgNodeTag;
  attrs: Record<string, string>;
  children: SolarisIconSvgNode[];
}

const CONTAINER_TAGS: ReadonlySet<string> = new Set(['g', 'mask']);

const KEBAB: Record<string, string> = {
  fillRule: 'fill-rule',
  clipRule: 'clip-rule',
  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  fillOpacity: 'fill-opacity',
  strokeOpacity: 'stroke-opacity',
  vectorEffect: 'vector-effect',
};

function toKebab(key: string): string {
  return KEBAB[key] ?? key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

export function iconElementsToNodes(
  elements: SvgElement[],
): SolarisIconSvgNode[] {
  return elements.map((el) => {
    const { type, ...rest } = el as unknown as Record<
      string,
      string | number | undefined
    >;
    const attrs: Record<string, string> = {};
    for (const [key, value] of Object.entries(rest)) {
      if (value === undefined || value === null) continue;
      attrs[toKebab(key)] = String(value);
    }
    return { tag: type as SolarisIconSvgNodeTag, attrs, children: [] };
  });
}

const TAG_RE = /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9-]*)([^<>]*?)(\/?)\s*>/g;

const ATTR_RE =
  /([a-zA-Z_:][a-zA-Z0-9_.:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

export function sanitizedInnerToNodes(inner: string): SolarisIconSvgNode[] {
  const clean = sanitizeIconSvgInner(inner);
  if (!clean) return [];
  const root: SolarisIconSvgNode[] = [];
  const stack: SolarisIconSvgNode[] = [];
  TAG_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TAG_RE.exec(clean)) !== null) {
    const isClose = m[1] === '/';
    const tag = m[2].toLowerCase() as SolarisIconSvgNodeTag;
    const rawAttrs = m[3] ?? '';
    const selfClosing = m[4] === '/';
    if (isClose) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    const attrs: Record<string, string> = {};
    ATTR_RE.lastIndex = 0;
    let am: RegExpExecArray | null;
    while ((am = ATTR_RE.exec(rawAttrs)) !== null) {
      const name = am[1].toLowerCase();
      const value = am[2] ?? am[3] ?? am[4] ?? '';
      attrs[name] = value;
    }
    const node: SolarisIconSvgNode = { tag, attrs, children: [] };
    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node);
    } else {
      root.push(node);
    }
    if (!selfClosing && CONTAINER_TAGS.has(tag)) {
      stack.push(node);
    }
  }
  return root;
}
