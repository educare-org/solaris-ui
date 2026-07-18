import { Component, input, computed } from '@angular/core';

import type {
  SolarisDividerOrientation,
  SolarisDividerAppearance,
  SolarisDividerSpacing,
  SolarisDividerInset,
  SolarisDividerLength,
} from '../model/divider.types';

@Component({
  selector: 'solaris-divider',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  host: {
    '[attr.data-inset]': 'inset()',
    '[attr.role]': 'computedRole()',
    '[attr.data-spacing]': 'spacing()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
    '[attr.aria-orientation]': 'computedAriaOrientation()',
    '[style.--solaris-divider-width]': 'computedWidth()',
    '[style.--solaris-divider-height]': 'computedHeight()',
  },
})
export class SolarisDividerComponent {
  readonly orientation = input<SolarisDividerOrientation>('horizontal');
  readonly appearance = input<SolarisDividerAppearance>('subtle');
  readonly spacing = input<SolarisDividerSpacing>('md');
  readonly inset = input<SolarisDividerInset>('none');
  readonly decorative = input<boolean>(true);
  readonly width = input<SolarisDividerLength>('');
  readonly height = input<SolarisDividerLength>('');

  protected readonly computedRole = computed<string | null>(() => {
    return this.decorative() ? null : 'separator';
  });

  protected readonly computedAriaOrientation = computed<string | null>(() => {
    if (this.decorative()) return null;
    if (this.orientation() === 'vertical') return 'vertical';
    return null;
  });

  protected readonly computedWidth = computed<string | null>(() => {
    const w = this.width();
    return w ? w : null;
  });

  protected readonly computedHeight = computed<string | null>(() => {
    const h = this.height();
    return h ? h : null;
  });
}
