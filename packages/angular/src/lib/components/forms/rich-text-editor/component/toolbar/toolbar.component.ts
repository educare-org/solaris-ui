import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  booleanAttribute,
  inject,
  input,
  isDevMode,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

import { SolarisIconComponent } from '../../../../icon';
import { SolarisTooltipDirective } from '../../../../interaction/tooltip';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../../interaction/popover';
import { SolarisFormFieldComponent } from '../../../../forms/form-field';
import { SolarisInputDirective } from '../../../../forms/input';
import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisButtonGroupComponent } from '../../../../actions/button-group';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import {
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuTriggerDirective,
} from '../../../../interaction/dropdown-menu';
import { SolarisDividerComponent } from '../../../../data-display/divider';
import { SolarisSelectComponent } from '../../../../forms/select';
import { SolarisOptionComponent } from '../../../../forms/option';
import {
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '../../../../../services/translation';

import type {
  SolarisRichTextActiveMark,
  SolarisRichTextContentFormat,
  SolarisRichTextInlineTag,
  SolarisRichTextToolbarContrast,
  SolarisRichTextLinkDraft,
} from '../../model/rich-text-editor.types';
import type {
  SolarisRichTextBlockTag,
  SolarisRichTextAlign,
  SolarisRichTextColor,
  SolarisRichTextHighlight,
} from '../../functions/rich-text-editor.utils';

@Component({
  selector: 'solaris-rich-text-toolbar',
  standalone: true,
  imports: [
    SolarisIconComponent,
    SolarisTooltipDirective,
    SolarisPopoverTriggerDirective,
    SolarisPopoverDirective,
    SolarisFormFieldComponent,
    SolarisInputDirective,
    SolarisButtonDirective,
    SolarisButtonGroupComponent,
    SolarisIconButtonDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuItemComponent,
    SolarisDividerComponent,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisRichTextToolbarComponent {
  private readonly translateService = inject(SolarisTranslateService);

  private readonly toolbarTooltips = viewChildren(SolarisTooltipDirective);
  private readonly menuTriggers = viewChildren(
    SolarisDropdownMenuTriggerDirective,
  );
  private readonly linkPopoverTrigger = viewChild('linkTrigger', {
    read: SolarisPopoverTriggerDirective,
  });

  readonly show = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  readonly floating = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly top = input<number | null>(null);
  readonly left = input<number | null>(null);
  readonly floatingActive = input<boolean>(false);
  readonly label = input<string>('Rich text editor');
  readonly blockTag = input<SolarisRichTextBlockTag>('p');
  readonly marks = input<Record<SolarisRichTextActiveMark, boolean>>({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    link: false,
    bulletList: false,
    orderedList: false,
  });
  readonly align = input<SolarisRichTextAlign>('left');
  readonly color = input<SolarisRichTextColor>('default');
  readonly highlight = input<SolarisRichTextHighlight>('default');
  readonly contentFormat = input<SolarisRichTextContentFormat>('rich');
  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly readOnly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly canUndo = input<boolean>(false);
  readonly canRedo = input<boolean>(false);
  readonly paletteColors: readonly SolarisRichTextColor[] = [
    'default',
    'primaryLight',
    'successLight',
    'warningLight',
    'dangerLight',
    'infoLight',
    'accentLight',
    'cyanLight',
    'pinkLight',
    'violetLight',
    'muted',
    'primary',
    'success',
    'warning',
    'danger',
    'info',
    'accent',
    'cyan',
    'pink',
    'violet',
    'neutralDark',
    'primaryDark',
    'successDark',
    'warningDark',
    'dangerDark',
    'infoDark',
    'accentDark',
    'cyanDark',
    'pinkDark',
    'violetDark',
  ];
  readonly highlightColors: readonly SolarisRichTextHighlight[] = [
    'primary',
    'success',
    'warning',
    'danger',
    'info',
    'accent',
    'violet',
    'neutral',
  ];
  readonly contrast = input<SolarisRichTextToolbarContrast | null>(null);
  readonly imageAccept = input<string>('image/*');

  readonly blockSelect = output<string>();
  readonly inline = output<SolarisRichTextInlineTag>();
  readonly inlineCode = output<void>();
  readonly subscript = output<void>();
  readonly superscript = output<void>();
  readonly clearFormat = output<void>();
  readonly colorPick = output<SolarisRichTextColor>();
  readonly highlightPick = output<SolarisRichTextHighlight>();
  readonly highlightClear = output<void>();
  readonly alignChange = output<SolarisRichTextAlign>();
  readonly listInsert = output<'ul' | 'ol'>();
  readonly taskList = output<void>();
  readonly undo = output<void>();
  readonly redo = output<void>();
  readonly linkPrepare = output<void>();
  readonly linkApply = output<SolarisRichTextLinkDraft>();
  readonly formatToggle = output<void>();
  readonly imageFile = output<Event>();
  readonly tableInsert = output<void>();

  readonly linkUrl = input<string>('');
  readonly linkUrlChange = output<string>();
  readonly linkText = input<string>('');
  readonly linkTextChange = output<string>();

  protected readonly colorPanelOpen = signal(false);

  @HostListener('click')
  protected dismissTooltips(): void {
    for (const tooltip of this.toolbarTooltips()) tooltip.close();
  }

  protected closeMenus(): void {
    for (const trigger of this.menuTriggers()) {
      try {
        trigger.close();
      } catch {
        if (isDevMode()) console.warn('[SolarisRichText] Menu close failed.');
      }
    }
  }

  openLinkPanel(): void {
    try {
      this.linkPopoverTrigger()?.open();
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Link popover open failed.');
    }
  }

  closeLinkPanel(): void {
    try {
      this.linkPopoverTrigger()?.close();
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Link popover close failed.');
    }
  }

  protected applyLinkFromPanel(): void {
    this.linkApply.emit({ url: this.linkUrl(), text: this.linkText() });
  }

  protected colorSwatchLabel(color: string): string {
    const capitalized = color.charAt(0).toUpperCase() + color.slice(1);
    const key = `solaris.rich-text.color${capitalized}`;
    const translated = this.translateService.translate(key);
    return translated !== key ? translated : color;
  }
}
