import type { SvgElement } from '../model/solaris-icon-definition.interface';

const KEBAB: Record<string, string> = {
  fillRule: 'fill-rule',
  clipRule: 'clip-rule',
  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
};

export function iconElementsToInner(elements: SvgElement[]): string {
  return elements
    .map((el) => {
      const { type, ...attrs } = el as unknown as Record<
        string,
        string | number
      >;
      const parts: string[] = [];
      for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null) continue;
        parts.push(
          `${KEBAB[key] ?? key}="${String(value).replace(/"/g, '&quot;')}"`,
        );
      }
      return `<${type}${parts.length > 0 ? ' ' + parts.join(' ') : ''}/>`;
    })
    .join('');
}
