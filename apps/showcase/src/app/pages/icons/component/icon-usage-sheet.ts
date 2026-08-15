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
} from '@solaris-ui/angular';

export interface IconUsageSheetData {
  name: string;
  width: Signal<number>;
  color: Signal<string | null>;
}

@Component({
  standalone: true,
  imports: [SolarisIconComponent, SolarisTranslatePipe, SolarisButtonDirective],
  templateUrl: './icon-usage-sheet.html',
  styleUrls: ['./icon-usage-sheet.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconUsageSheetComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly data = inject<IconUsageSheetData>(SOLARIS_DIALOG_DATA);

  protected readonly copied = signal(false);

  protected readonly widthCss = computed(() => `${this.data.width()}px`);
  protected readonly color = computed(() => this.data.color());
  protected readonly snippet = computed(
    () => `<solaris-icon name="${this.data.name}" />`,
  );

  copy(): void {
    void navigator.clipboard.writeText(this.snippet()).then(() => {
      this.copied.set(true);
      const timer = setTimeout(() => this.copied.set(false), 2000);
      this.destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }
}
