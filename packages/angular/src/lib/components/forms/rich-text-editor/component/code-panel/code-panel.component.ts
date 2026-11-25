import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';

import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import { SolarisIconComponent } from '../../../../icon';
import { SolarisTooltipDirective } from '../../../../interaction/tooltip';
import { SolarisDividerComponent } from '../../../../data-display/divider';
import { SolarisSelectComponent } from '../../../select';
import { SolarisOptionComponent } from '../../../option';
import { SolarisOptionGroupComponent } from '../../../option-group';
import {
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '../../../../../services/translation';
import { SOLARIS_RICH_TEXT_CODE_LANGUAGES } from '../../model/rich-text-editor.defaults';

import type {
  SolarisRichTextCodeLanguage,
  SolarisRichTextCodeLanguageOption,
} from '../../model/rich-text-editor.types';

@Component({
  selector: 'solaris-rich-text-code-panel',
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisTooltipDirective,
    SolarisDividerComponent,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisOptionGroupComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './code-panel.component.html',
  styleUrls: ['./code-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisRichTextCodePanelComponent {
  private readonly translateService = inject(SolarisTranslateService);

  readonly top = input.required<number>();
  readonly left = input.required<number>();
  readonly language = input.required<SolarisRichTextCodeLanguage>();
  readonly lineNumbers = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly readOnly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  readonly languageChange = output<string>();
  readonly lineNumbersToggle = output<void>();
  readonly format = output<void>();
  readonly copied = output<void>();
  readonly remove = output<void>();
  protected readonly priorityLanguages: readonly SolarisRichTextCodeLanguageOption[] =
    SOLARIS_RICH_TEXT_CODE_LANGUAGES.slice(0, 2);
  protected readonly otherLanguages: readonly SolarisRichTextCodeLanguageOption[] =
    SOLARIS_RICH_TEXT_CODE_LANGUAGES.slice(2);

  protected codeLanguageLabel(id: string, fallback: string): string {
    let key: string | null = null;
    if (id === 'auto') {
      key = 'solaris.rich-text.codeDetectLanguage';
    } else if (id === 'text') {
      key = 'solaris.rich-text.codePlainText';
    }
    if (!key) return fallback;
    const translated = this.translateService.translate(key);
    return translated !== key ? translated : fallback;
  }
}
