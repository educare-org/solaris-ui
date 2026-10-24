import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  DestroyRef,
  type Signal,
} from '@angular/core';

import {
  SolarisIconComponent,
  SolarisTranslatePipe,
  SOLARIS_DIALOG_DATA,
  SolarisButtonDirective,
  SolarisIconRegistryService,
  SOLARIS_ICONS_METADATA,
  iconElementsToInner,
  type SolarisIconVariant,
} from '@solaris-ui/angular';

import { ICON_CATEGORIES } from '../model/icons-category';

export interface IconUsageSheetData {
  name: string;
  variant: Signal<SolarisIconVariant>;
  width: Signal<number>;
  strokeWidth: Signal<number>;
  color: Signal<string | null>;
}

const MAX_VISIBLE_KEYWORDS = 5;

@Component({
  standalone: true,
  imports: [SolarisIconComponent, SolarisTranslatePipe, SolarisButtonDirective],
  templateUrl: './icon-usage-sheet.html',
  styleUrls: ['./icon-usage-sheet.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconUsageSheetComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly registry = inject(SolarisIconRegistryService);

  protected readonly data = inject<IconUsageSheetData>(SOLARIS_DIALOG_DATA);

  protected readonly copiedSvg = signal(false);
  protected readonly copiedAngular = signal(false);

  protected readonly widthCss = computed(() => `${this.data.width()}px`);
  protected readonly color = computed(() => this.data.color());
  protected readonly variant = computed(() => this.data.variant());
  protected readonly strokeWidth = computed(() => this.data.strokeWidth());

  protected readonly meta = computed(
    () => SOLARIS_ICONS_METADATA[this.data.name],
  );

  protected readonly categoryId = computed(() => {
    const name = this.data.name;
    return (
      ICON_CATEGORIES.find((category) => category.names.includes(name))?.id ??
      null
    );
  });

  protected readonly visibleKeywords = computed(() =>
    (this.meta()?.keywords ?? []).slice(0, MAX_VISIBLE_KEYWORDS),
  );

  protected readonly hiddenKeywordCount = computed(() =>
    Math.max(0, (this.meta()?.keywords ?? []).length - MAX_VISIBLE_KEYWORDS),
  );

  protected readonly angularSnippet = computed(() => {
    const attrs: string[] = [`name="${this.data.name}"`];
    if (this.variant() !== 'outline') attrs.push(`variant="${this.variant()}"`);
    if (this.data.width() !== 24) attrs.push(`[size]="${this.data.width()}"`);
    if (this.data.strokeWidth() !== 2)
      attrs.push(`[strokeWidth]="${this.data.strokeWidth()}"`);
    return `<solaris-icon ${attrs.join(' ')} />`;
  });

  protected readonly svgSnippet = computed(() => {
    const icon = this.registry.getIcon(this.data.name);
    if (!icon) return '';
    const inner = iconElementsToInner(icon.elements);
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="${this.data.width()}" height="${this.data.width()}" ` +
      `viewBox="${icon.viewBox}" fill="${icon.fill ?? 'none'}" stroke="currentColor" ` +
      `stroke-width="${this.data.strokeWidth()}" stroke-linecap="${icon.strokeLinecap ?? 'round'}" ` +
      `stroke-linejoin="${icon.strokeLinejoin ?? 'round'}">${inner}</svg>`
    );
  });

  copySvg(): void {
    this.copy(this.svgSnippet(), this.copiedSvg);
  }

  copyAngular(): void {
    this.copy(this.angularSnippet(), this.copiedAngular);
  }

  private copy(text: string, flag: ReturnType<typeof signal<boolean>>): void {
    void navigator.clipboard.writeText(text).then(() => {
      flag.set(true);
      const timer = setTimeout(() => flag.set(false), 2000);
      this.destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }
}
