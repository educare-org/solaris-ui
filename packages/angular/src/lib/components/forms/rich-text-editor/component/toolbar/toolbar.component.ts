import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  booleanAttribute,
  computed,
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
import { SolarisTabsComponent } from '../../../../navigation/tabs/components/root/component/tabs.component';
import { SolarisTabComponent } from '../../../../navigation/tabs/components/tab/component/tab.component';
import { SolarisTabPanelComponent } from '../../../../navigation/tabs/components/tab-panel/component/tab-panel.component';
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
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
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
  private readonly imagePopoverTrigger = viewChild('imageTrigger', {
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
  readonly align = input<SolarisRichTextAlign | 'mixed'>('left');
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
    'blueLight',
    'petrolLight',
    'greenLight',
    'limeLight',
    'yellowLight',
    'orangeLight',
    'redLight',
    'magentaLight',
    'purpleLight',
    'muted',
    'blue',
    'petrol',
    'green',
    'lime',
    'yellow',
    'orange',
    'red',
    'magenta',
    'purple',
    'neutralDark',
    'blueDark',
    'petrolDark',
    'greenDark',
    'limeDark',
    'yellowDark',
    'orangeDark',
    'redDark',
    'magentaDark',
    'purpleDark',
  ];
  readonly highlightColors: readonly SolarisRichTextHighlight[] = [
    'neutral',
    'blue',
    'petrol',
    'green',
    'lime',
    'yellow',
    'orange',
    'red',
    'magenta',
    'purple',
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
  readonly imageLinkApply = output<string>();
  readonly imagePrepare = output<void>();
  readonly tableInsert = output<void>();

  readonly linkUrl = input<string>('');
  readonly linkUrlChange = output<string>();
  readonly linkText = input<string>('');
  readonly linkTextChange = output<string>();

  readonly imageLinkUrl = input<string>('');
  readonly imageLinkUrlChange = output<string>();

  protected readonly colorPanelOpen = signal(false);
  protected readonly imageTab = signal<'file' | 'link'>('file');
  protected readonly imagePreviewUrl = signal<string>('');
  protected readonly imagePreviewError = signal(false);

  protected readonly alignIcon = computed(() => {
    switch (this.align()) {
      case 'center':
        return 'text-align-center';
      case 'right':
        return 'text-align-end';
      case 'justify':
        return 'text-align-justify';
      default:
        return 'text-align-start';
    }
  });

  protected readonly alignLabelKey = computed(() => {
    switch (this.align()) {
      case 'center':
        return 'solaris.rich-text.alignCenter';
      case 'right':
        return 'solaris.rich-text.alignRight';
      case 'justify':
        return 'solaris.rich-text.alignJustify';
      case 'mixed':
        return 'solaris.rich-text.alignLabel';
      default:
        return 'solaris.rich-text.alignLeft';
    }
  });

  protected readonly alignValue = computed<SolarisRichTextAlign>(() => {
    const current = this.align();
    if (current === 'mixed') return 'left';
    return current;
  });

  protected readonly isWrapAlign = computed(() => {
    const current = this.align();
    return current === 'start-wrap' || current === 'end-wrap';
  });

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

  openImagePanel(): void {
    try {
      this.imagePopoverTrigger()?.open();
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Image popover open failed.');
    }
  }

  closeImagePanel(): void {
    try {
      this.imagePopoverTrigger()?.close();
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Image popover close failed.');
    }
  }

  protected prepareImagePanel(): void {
    this.imageTab.set('file');
    this.imagePreviewUrl.set('');
    this.imagePreviewError.set(false);
    this.imagePrepare.emit();
  }

  protected setImageTab(tab: string | number | undefined): void {
    if (tab !== 'file' && tab !== 'link') return;
    this.imageTab.set(tab);
    this.imagePreviewError.set(false);
  }

  protected loadImagePreview(): void {
    const url = this.imageLinkUrl().trim();
    if (url.length === 0) return;
    this.imagePreviewError.set(false);
    this.imagePreviewUrl.set(url);
  }

  protected onImagePreviewError(): void {
    this.imagePreviewError.set(true);
  }

  protected applyImageLinkFromPanel(): void {
    const url = this.imageLinkUrl().trim();
    if (url.length === 0) return;
    this.imageLinkApply.emit(url);
    this.closeImagePanel();
  }

  protected clearImagePanel(): void {
    this.imageLinkUrlChange.emit('');
    this.imagePreviewUrl.set('');
    this.imagePreviewError.set(false);
    this.imageTab.set('file');
  }

  protected colorSwatchLabel(color: string): string {
    const capitalized = color.charAt(0).toUpperCase() + color.slice(1);
    const key = `solaris.rich-text.color${capitalized}`;
    const translated = this.translateService.translate(key);
    return translated !== key ? translated : color;
  }
}
