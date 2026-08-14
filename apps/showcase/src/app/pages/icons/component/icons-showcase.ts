import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import {
  SolarisIconComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SOLARIS_BUILT_IN_ICONS,
} from '@solaris-ui/angular';

import { ICON_CATEGORIES } from '../model/icons-category';

interface IconColorSwatch {
  label: string;
  value: string;
}

@Component({
  standalone: true,
  imports: [
    SolarisIconComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './icons-showcase.html',
  styleUrls: ['./icons-showcase.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconsShowcasePage {
  protected readonly allCategory = 'all';
  protected readonly categories = ICON_CATEGORIES;

  protected readonly query = signal('');
  protected readonly selectedCategory = signal<string>(this.allCategory);
  protected readonly selectedIcon = signal<string | null>(null);
  protected readonly copied = signal(false);

  protected readonly iconWidth = signal(1.5);
  protected readonly iconColor = signal<string | null>(null);

  protected readonly colorSwatches: IconColorSwatch[] = [
    { label: 'primary', value: 'var(--solaris-primary-base)' },
    { label: 'success', value: 'var(--solaris-success-base)' },
    { label: 'warning', value: 'var(--solaris-warning-base)' },
    { label: 'danger', value: 'var(--solaris-danger-base)' },
    { label: 'info', value: 'var(--solaris-info-base)' },
    { label: 'orange', value: 'var(--solaris-orange-base)' },
  ];

  protected readonly iconWidthCss = computed(() => `${this.iconWidth()}rem`);

  protected readonly activeSwatch = computed(() => {
    const color = this.iconColor();
    if (!color) {
      return null;
    }
    return this.colorSwatches.find((swatch) => swatch.value === color) ?? null;
  });

  protected readonly colorHex = computed(() => {
    const color = this.iconColor();
    if (!color) {
      return this.resolveTokenHex('--solaris-text-strong');
    }
    if (color.startsWith('var(')) {
      return this.resolveTokenHex(color.slice(4, -1));
    }
    return color;
  });

  private resolveTokenHex(token: string): string {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(token)
        .trim() || '#000000'
    );
  }

  protected readonly icons = computed(() => {
    const query = this.query().toLowerCase().trim();
    const category = this.selectedCategory();

    return SOLARIS_BUILT_IN_ICONS.filter((icon) => {
      const matchesCategory =
        category === this.allCategory ||
        this.categories
          .find((item) => item.id === category)
          ?.names.includes(icon.name);
      const matchesQuery = !query || icon.name.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  });

  protected readonly usageSnippet = computed(() => {
    const name = this.selectedIcon();
    if (!name) {
      return '';
    }
    return `<solaris-icon name="${name}" />`;
  });

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  selectIcon(name: string): void {
    this.selectedIcon.set(name);
    this.copied.set(false);
  }

  closeUsage(): void {
    this.selectedIcon.set(null);
    this.copied.set(false);
  }

  onWidthChange(event: Event): void {
    this.iconWidth.set(Number((event.target as HTMLInputElement).value));
  }

  selectColor(color: string | null): void {
    this.iconColor.set(color);
  }

  onColorPicker(event: Event): void {
    this.iconColor.set((event.target as HTMLInputElement).value);
  }

  onHexChange(event: Event): void {
    const hex = (event.target as HTMLInputElement).value.trim();
    if (/^#[0-9a-f]{6}$/i.test(hex)) {
      this.iconColor.set(hex);
    }
  }

  async copySnippet(): Promise<void> {
    const snippet = this.usageSnippet();
    if (!snippet) {
      return;
    }
    await navigator.clipboard.writeText(snippet);
    this.copied.set(true);
  }
}
