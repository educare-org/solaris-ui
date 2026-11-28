import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

import {
  SOLARIS_RICH_TEXT_ALLOWED_ATTRIBUTES,
  SOLARIS_RICH_TEXT_ALLOWED_TAGS,
} from '../../model/rich-text-editor.defaults';
import {
  isEmptyValue,
  normalizeEditorValue,
} from '../../functions/rich-text-editor.utils';
import {
  isQuoteEdgeLineEmpty,
  quoteCloseMarkReference,
} from '../../functions/rich-text-editor.dom';
import { SOLARIS_RICH_TEXT_QUOTE_CLOSE_MARK_CLASS } from '../../model/rich-text-editor.defaults';

import type { SolarisRichTextValue } from '../../model/rich-text-editor.types';

const VIEW_EXTRA_TAGS: readonly string[] = ['div'];

const VIEW_DENY_TAGS: ReadonlySet<string> = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'applet',
  'base',
  'link',
  'meta',
  'title',
  'svg',
  'math',
  'template',
  'slot',
  'canvas',
  'video',
  'audio',
  'source',
  'track',
  'frame',
  'frameset',
  'noembed',
  'noframes',
  'noscript',
]);

const VIEW_ALLOWED_TAGS: ReadonlySet<string> = new Set([
  ...SOLARIS_RICH_TEXT_ALLOWED_TAGS,
  ...VIEW_EXTRA_TAGS,
]);

const VIEW_ALLOWED_ATTRIBUTES: ReadonlySet<string> = new Set([
  ...SOLARIS_RICH_TEXT_ALLOWED_ATTRIBUTES,
]);

@Component({
  selector: 'solaris-rich-text-view',
  standalone: true,
  imports: [],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-rich-text-view',
    '[attr.data-empty]': 'isEmpty() ? "" : null',
    '[attr.role]': 'regionRole()',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class SolarisRichTextViewComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly value = input<SolarisRichTextValue | string | null | undefined>(
    undefined,
  );
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly normalized = computed(() =>
    normalizeEditorValue(this.value()),
  );

  protected readonly isEmpty = computed(() => isEmptyValue(this.normalized()));

  protected readonly regionRole = computed(() =>
    this.ariaLabel() ? 'region' : null,
  );

  protected readonly safeHtml = computed<SafeHtml | string>(() => {
    const html = this.normalized().html;
    if (typeof document === 'undefined') return '';
    // SECURITY_EXCEPTION: committed editor HTML is allowlist-sanitized
    // (tags, attributes, URL schemes) inside an inert template before
    // bypassing Angular sanitization, which would otherwise strip the
    // data-* attributes the content shell relies on (align, colors,
    // figures, task lists). Never bypass unsanitized consumer HTML.
    return this.sanitizer.bypassSecurityTrustHtml(this.sanitizeViewHtml(html));
  });

  private sanitizeViewHtml(html: string): string {
    const template = document.createElement('template');
    // SECURITY_EXCEPTION: <template> content is inert — no scripts run
    // and no resources load while the markup below is allowlisted.
    template.innerHTML = html;
    this.cleanViewNodes(template.content);
    const host = document.createElement('div');
    host.append(template.content);
    // SECURITY_EXCEPTION: serializing the allowlisted fragment above; read-only, no consumer HTML reaches the DOM unsanitized.
    return host.innerHTML;
  }

  private cleanViewNodes(root: ParentNode): void {
    for (const child of Array.from(root.childNodes)) {
      if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
        continue;
      }
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (!(child instanceof Element)) {
        child.remove();
        continue;
      }
      const tag = child.tagName.toLowerCase();
      if (VIEW_DENY_TAGS.has(tag)) {
        child.remove();
        continue;
      }
      if (
        !VIEW_ALLOWED_TAGS.has(tag) ||
        (tag === 'div' && !this.hasCodeLineClass(child))
      ) {
        this.cleanViewNodes(child);
        child.replaceWith(...Array.from(child.childNodes));
        continue;
      }
      if (tag === 'input' && !this.isTaskCheckbox(child)) {
        child.remove();
        continue;
      }
      this.cleanViewAttributes(child);
      this.cleanViewNodes(child);
      if (tag === 'blockquote' && child instanceof HTMLElement) {
        // Static views never run the editor sync: hide a lonely opening
        // mark and place the closing mark after the last content line.
        child.toggleAttribute(
          'data-hide-open',
          isQuoteEdgeLineEmpty(child, true),
        );
        this.placeQuoteCloseMark(child);
      }
    }
  }

  private hasCodeLineClass(el: Element): boolean {
    return el.classList.contains('solaris-rich-text-code-line');
  }

  private placeQuoteCloseMark(quote: HTMLElement): void {
    for (const child of Array.from(quote.childNodes)) {
      if (
        child instanceof Element &&
        child.classList.contains(SOLARIS_RICH_TEXT_QUOTE_CLOSE_MARK_CLASS)
      ) {
        child.remove();
      }
    }
    const { insert, before } = quoteCloseMarkReference(quote);
    if (!insert || typeof document === 'undefined') return;
    const mark = document.createElement('span');
    mark.className = SOLARIS_RICH_TEXT_QUOTE_CLOSE_MARK_CLASS;
    mark.setAttribute('contenteditable', 'false');
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '”';
    quote.insertBefore(mark, before);
  }

  private isTaskCheckbox(el: Element): boolean {
    return (
      el.getAttribute('type')?.trim().toLowerCase() === 'checkbox' &&
      el.hasAttribute('data-task-checkbox')
    );
  }

  private cleanViewAttributes(el: Element): void {
    const tag = el.tagName.toLowerCase();
    for (const attr of Array.from(el.attributes)) {
      if (
        !this.isAllowedViewAttribute(tag, attr.name.toLowerCase(), attr.value)
      ) {
        el.removeAttribute(attr.name);
      }
    }
  }

  private isAllowedViewAttribute(
    tag: string,
    name: string,
    value: string,
  ): boolean {
    if (name === 'class') {
      return value
        .trim()
        .split(/\s+/)
        .every(
          (token) => token === '' || token === 'solaris-rich-text-code-line',
        );
    }
    if (name === 'style') {
      return /^(width|max-width)\s*:\s*\d+(\.\d+)?px;?$/.test(value.trim());
    }
    if (name.startsWith('data-')) return true;
    if (!VIEW_ALLOWED_ATTRIBUTES.has(name)) return false;
    const trimmed = value.trim();
    switch (name) {
      case 'href':
        return this.isSafeLink(trimmed);
      case 'src':
        return this.isSafeSource(trimmed);
      case 'target':
        return (
          trimmed === '_blank' ||
          trimmed === '_self' ||
          trimmed === '_parent' ||
          trimmed === '_top'
        );
      case 'scope':
        return /^(col|row|colgroup|rowgroup|auto)$/.test(trimmed);
      case 'colspan':
      case 'rowspan':
        return /^\d{1,3}$/.test(trimmed);
      case 'type':
        return tag === 'input' && trimmed.toLowerCase() === 'checkbox';
      default:
        return true;
    }
  }

  private isSafeLink(value: string): boolean {
    if (value === '') return false;
    if (value.startsWith('#')) return true;
    if (/^(https?:|mailto:|tel:)/i.test(value)) return true;
    return !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value);
  }

  private isSafeSource(value: string): boolean {
    if (value === '') return false;
    if (/^(https?:|blob:)/i.test(value)) return true;
    if (/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(value)) return true;
    return !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value);
  }
}
