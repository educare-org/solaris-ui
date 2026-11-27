import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  output,
} from '@angular/core';

import { SolarisButtonGroupComponent } from '../../../../actions/button-group';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import { SolarisIconComponent } from '../../../../icon';
import { SolarisTooltipDirective } from '../../../../interaction/tooltip';
import { SolarisDividerComponent } from '../../../../data-display/divider';
import {
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuTriggerDirective,
} from '../../../../interaction/dropdown-menu';
import { SolarisTranslatePipe } from '../../../../../services/translation';

import type { SolarisRichTextImagePreset } from '../../model/rich-text-editor.types';
import type { SolarisRichTextAlign } from '../../functions/rich-text-editor.utils';

@Component({
  selector: 'solaris-rich-text-image-panel',
  standalone: true,
  imports: [
    SolarisButtonGroupComponent,
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisTooltipDirective,
    SolarisDividerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuItemComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisRichTextImagePanelComponent {
  readonly top = input.required<number>();
  readonly left = input.required<number>();
  readonly align = input.required<SolarisRichTextAlign | 'mixed'>();
  readonly bordered = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly width = input<number>(0);
  readonly height = input<number>(0);
  readonly resizing = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly readOnly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  readonly alignChange = output<SolarisRichTextAlign>();
  readonly presetChange = output<SolarisRichTextImagePreset>();
  readonly borderToggle = output<void>();
  readonly remove = output<void>();
  readonly focusHandle = output<void>();
  readonly copied = output<void>();
  readonly linkRequest = output<void>();
  readonly altRequest = output<void>();
  readonly jumpBelow = output<void>();
}
