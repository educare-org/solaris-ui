import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisAnimatedIconComponent,
  SolarisDialogRef,
  SolarisDialogService,
  SolarisFormFieldComponent,
  SolarisIconComponent,
  SolarisIconButtonDirective,
  SolarisInputDirective,
  SolarisMenuToggleDirective,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SOLARIS_BUILT_IN_ICONS,
  SOLARIS_ICONS_METADATA,
  SolarisFormPrefixDirective,
  type SolarisIconVariant,
} from '@solaris-ui/angular';

import { ICON_CATEGORIES } from '../model/icons-category';
import { matchesIconQuery } from '../model/icon-search';
import {
  IconUsageSheetComponent,
  type IconUsageSheetData,
} from './icon-usage-sheet';

interface IconColorSwatch {
  label: string;
  value: string;
}

export interface ShowcaseIconEntry {
  name: string;
  keywords: string[];
  isFallback: boolean;
}

const ICON_VARIANTS: SolarisIconVariant[] = ['outline', 'solid', 'duotone'];

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisAnimatedIconComponent,
    SolarisFormFieldComponent,
    SolarisIconComponent,
    SolarisIconButtonDirective,
    SolarisInputDirective,
    SolarisMenuToggleDirective,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    SolarisFormPrefixDirective,
  ],
  templateUrl: './icons-showcase.html',
  styleUrls: ['./icons-showcase.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconsShowcasePage {
  private readonly dialogService = inject(SolarisDialogService);
  private usageDialogRef: SolarisDialogRef | null = null;

  protected readonly allCategory = 'all';
  protected readonly animatedCategory = 'animated';
  protected readonly categories = ICON_CATEGORIES;
  protected readonly iconVariants = ICON_VARIANTS;

  protected readonly query = signal('');
  protected selectedCategory = signal<string | number>(this.allCategory);
  protected readonly selectedVariant = signal<SolarisIconVariant>('outline');
  protected readonly selectedIcon = signal<string | null>(null);
  protected readonly menuToggleOpen = signal(false);

  protected readonly iconWidth = signal(24);
  protected readonly iconStrokeWidth = signal(2);
  protected readonly iconColor = signal<string | null>(null);

  protected readonly colorSwatches: IconColorSwatch[] = [
    { label: 'primary', value: 'var(--solaris-primary-solid)' },
    { label: 'success', value: 'var(--solaris-success-solid)' },
    { label: 'warning', value: 'var(--solaris-warning-solid)' },
    { label: 'danger', value: 'var(--solaris-danger-solid)' },
    { label: 'info', value: 'var(--solaris-info-solid)' },
    { label: 'accent', value: 'var(--solaris-accent-solid)' },
    { label: 'violet', value: 'var(--solaris-violet-solid)' },
  ];

  protected readonly iconWidthCss = computed(() => `${this.iconWidth()}px`);
  protected readonly isAnimatedCategory = computed(
    () => this.selectedCategory() === this.animatedCategory,
  );

  protected readonly colorHex = computed(() => {
    const color = this.iconColor();
    if (!color) {
      return this.resolveTokenHex('--solaris-neutral-text-heading');
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

  protected readonly icons = computed<ShowcaseIconEntry[]>(() => {
    const query = this.query();
    const category = this.selectedCategory();
    const variant = this.selectedVariant();

    return SOLARIS_BUILT_IN_ICONS.filter((icon) => {
      const matchesCategory =
        category === this.allCategory ||
        this.categories
          .find((item) => item.id === category)
          ?.names.includes(icon.name);
      if (!matchesCategory) return false;
      const meta = SOLARIS_ICONS_METADATA[icon.name];
      return matchesIconQuery(
        {
          name: icon.name,
          keywords: meta?.keywords ?? [],
          aliases: meta?.aliases ?? [],
        },
        query,
      );
    }).map((icon) => {
      const meta = SOLARIS_ICONS_METADATA[icon.name];
      return {
        name: icon.name,
        keywords: meta?.keywords ?? [],
        isFallback:
          variant !== 'outline' &&
          !(meta?.availableVariants.includes(variant) ?? false),
      };
    });
  });

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  selectIcon(name: string): void {
    this.selectedIcon.set(name);

    this.usageDialogRef?.close();

    const data: IconUsageSheetData = {
      name,
      variant: this.selectedVariant,
      width: this.iconWidth,
      strokeWidth: this.iconStrokeWidth,
      color: this.iconColor,
    };

    this.usageDialogRef = this.dialogService.openComponent(
      IconUsageSheetComponent,
      {
        placement: 'center',
        width: 'min(720px, calc(100vw - 32px))',
        backdrop: true,
        closeable: true,
        closeOnBackdropClick: true,
        closeOnEscape: true,
        restoreFocus: true,
        data,
      },
    );
  }

  onWidthChange(event: Event): void {
    this.iconWidth.set(Number((event.target as HTMLInputElement).value));
  }

  onStrokeChange(event: Event): void {
    this.iconStrokeWidth.set(Number((event.target as HTMLInputElement).value));
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
}
