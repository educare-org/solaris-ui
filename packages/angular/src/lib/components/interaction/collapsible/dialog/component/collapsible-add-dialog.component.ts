import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  SolarisDialogHeaderComponent,
  SolarisDialogContentComponent,
  SolarisDialogFooterComponent,
  SolarisDialogCloseDirective,
  SOLARIS_DIALOG_DATA,
  SOLARIS_DIALOG_REF,
  SolarisDialogRef,
} from '../../../../overlay/dialog';
import {
  SolarisFormFieldComponent,
  SolarisFormErrorComponent,
} from '../../../../forms/form-field';
import { SolarisInputDirective } from '../../../../forms/input';
import { SolarisTextareaDirective } from '../../../../forms/textarea';
import { SolarisSelectComponent } from '../../../../forms/select';
import {
  SolarisOptionComponent,
  SolarisOptionLeadingDirective,
} from '../../../../forms/option';
import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisIconComponent } from '../../../../icon';
import { SolarisTranslateService } from '../../../../../services/translation';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../services/icon';

import type {
  SolarisCollapsibleAddDialogData,
  SolarisCollapsibleAddResult,
} from '../../model/collapsible.types';

@Component({
  selector: 'solaris-collapsible-add-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisDialogHeaderComponent,
    SolarisDialogContentComponent,
    SolarisDialogFooterComponent,
    SolarisDialogCloseDirective,
    SolarisFormFieldComponent,
    SolarisFormErrorComponent,
    SolarisInputDirective,
    SolarisTextareaDirective,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisOptionLeadingDirective,
    SolarisButtonDirective,
    SolarisIconComponent,
  ],
  templateUrl: './collapsible-add-dialog.component.html',
  styleUrls: ['./collapsible-add-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisCollapsibleAddDialogComponent {
  private readonly dialogRef =
    inject<SolarisDialogRef<SolarisCollapsibleAddResult | undefined>>(
      SOLARIS_DIALOG_REF,
    );
  private readonly data =
    inject<SolarisCollapsibleAddDialogData>(SOLARIS_DIALOG_DATA);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly form = new FormGroup({
    label: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    leadingIcon: new FormControl<string | null>(null),
  });

  protected readonly iconOptions = computed(() => {
    const provided = this.data.iconOptions ?? [];
    if (provided.length > 0) {
      return provided;
    }
    return SOLARIS_BUILT_IN_ICONS.map((icon) => ({
      value: icon.name,
      label: humanizeIconName(icon.name),
    })).sort((a, b) => a.label.localeCompare(b.label));
  });

  protected readonly iconSearchable = computed(
    () => this.iconOptions().length > 8,
  );

  protected readonly dialogTitle = computed(
    () =>
      this.resolveText(
        this.data.title,
        this.data.titleKey,
        'solaris.collapsible.add.title',
      ) ?? '',
  );
  protected readonly titleLabel = computed(
    () =>
      this.resolveText(
        this.data.titleLabel,
        this.data.titleLabelKey,
        'solaris.collapsible.add.titleLabel',
      ) ?? '',
  );
  protected readonly descriptionLabel = computed(
    () =>
      this.resolveText(
        this.data.descriptionLabel,
        this.data.descriptionLabelKey,
        'solaris.collapsible.add.descriptionLabel',
      ) ?? '',
  );
  protected readonly iconLabel = computed(
    () =>
      this.resolveText(
        this.data.iconLabel,
        this.data.iconLabelKey,
        'solaris.collapsible.add.iconLabel',
      ) ?? '',
  );
  protected readonly noIconLabel = computed(
    () =>
      this.resolveText(
        this.data.noIconLabel,
        this.data.noIconLabelKey,
        'solaris.collapsible.add.noIcon',
      ) ?? 'None',
  );
  protected readonly cancelLabel = computed(
    () =>
      this.resolveText(
        this.data.cancelLabel,
        this.data.cancelLabelKey,
        'solaris.collapsible.add.cancel',
      ) ?? 'Cancel',
  );
  protected readonly confirmLabel = computed(
    () =>
      this.resolveText(
        this.data.confirmLabel,
        this.data.confirmLabelKey,
        'solaris.collapsible.add.confirm',
      ) ?? 'Add',
  );
  protected readonly requiredLabel = computed(
    () =>
      this.resolveText(undefined, 'solaris.collapsible.add.required') ??
      'Required',
  );

  protected optionLabel(option: {
    label?: string;
    labelKey?: string;
    value: string;
  }): string {
    return this.resolveText(option.label, option.labelKey) ?? option.value;
  }

  protected confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({
      label: value.label.trim(),
      description: value.description.trim(),
      leadingIcon: value.leadingIcon,
    });
  }

  private resolveText(
    value?: string,
    key?: string,
    fallbackKey?: string,
  ): string | undefined {
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    if (value) {
      return value;
    }
    if (fallbackKey && this.translateService) {
      const translated = this.translateService.translate(fallbackKey);
      if (translated !== fallbackKey) {
        return translated;
      }
    }
    return value;
  }
}

function humanizeIconName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
