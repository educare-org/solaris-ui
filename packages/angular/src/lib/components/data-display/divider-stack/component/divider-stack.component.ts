import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import type {
  SolarisDividerStackSpacing,
  SolarisDividerStackInset,
} from '../model/divider-stack.types';

@Component({
  selector: 'solaris-divider-stack',
  standalone: true,
  templateUrl: './divider-stack.component.html',
  styleUrls: ['./divider-stack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-divider-stack',
    '[attr.data-spacing]': 'spacing()',
    '[attr.data-inset]': 'inset()',
  },
})
export class SolarisDividerStackComponent {
  readonly spacing = input<SolarisDividerStackSpacing>('md');
  readonly inset = input<SolarisDividerStackInset>('none');
}
