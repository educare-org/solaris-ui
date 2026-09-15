import {
  Component,
  input,
  output,
  inject,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SolarisButtonDirective } from '../../../../../actions/button';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import { SolarisTranslateService } from '../../../../../../services/translation';
import type {
  SolarisDialogAction,
  SolarisDialogActionsAlign,
  SolarisDialogActionsStack,
  SolarisDialogDensity,
} from '../../root/model/dialog.types';

@Component({
  selector: 'solaris-dialog-actions',
  standalone: true,
  imports: [SolarisButtonDirective],
  templateUrl: './dialog-actions.component.html',
  styleUrls: ['./dialog-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-align]': 'align()',
    '[attr.data-stack]': 'stack()',
    '[attr.data-separator]': "separator() ? '' : null",
    '[attr.data-density]': 'density()',
    class: 'solaris-dialog-actions',
  },
})
export class SolarisDialogActionsComponent<TResult = unknown> {
  private readonly dialogRef = inject(
    SOLARIS_DIALOG_REF,
  ) as SolarisDialogRef<TResult>;
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  readonly actions = input<SolarisDialogAction<TResult>[]>([]);
  readonly align = input<SolarisDialogActionsAlign>('end');
  readonly stack = input<SolarisDialogActionsStack>('auto');
  readonly separator = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly density = input<SolarisDialogDensity>();

  readonly actionExecuted = output<SolarisDialogAction<TResult>>();

  protected resolvedLabel(action: SolarisDialogAction<TResult>): string {
    if (action.labelKey) {
      return this.translateService?.translate(action.labelKey) ?? action.label;
    }
    return action.label;
  }

  protected handleAction(action: SolarisDialogAction<TResult>): void {
    const executeAction = (): void => {
      if (action.action) {
        const result = action.action(this.dialogRef);
        if (result instanceof Promise) {
          void result.catch(() => undefined);
        }
      }

      if (action.close) {
        this.dialogRef.close(action.result);
      }
    };

    executeAction();
    this.actionExecuted.emit(action);
  }
}
