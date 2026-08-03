import {
  Component,
  input,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';

import { SolarisDialogContentComponent } from '../../content/component/dialog-content.component';
import { SolarisDialogActionsComponent } from '../../actions/component/dialog-actions.component';
import { SolarisDialogHeaderComponent } from '../../header/component/dialog-header.component';
import type {
  SolarisDialogOptions,
  SolarisDialogButtonColor,
} from '../model/dialog.types';

@Component({
  selector: 'solaris-dialog',
  standalone: true,
  imports: [
    SolarisDialogHeaderComponent,
    SolarisDialogContentComponent,
    SolarisDialogActionsComponent,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog',
    '[attr.role]': 'null',
  },
})
export class SolarisDialogComponent<TResult = unknown> {
  readonly options = input.required<SolarisDialogOptions<TResult>>();

  protected readonly hasActions = computed(() => {
    const actions = this.options().actions;
    return actions && actions.length > 0;
  });
  protected readonly actionsAlign = computed(
    () => this.options().actionsAlign ?? 'end',
  );
  protected readonly actionsStack = computed(
    () => this.options().actionsStack ?? 'auto',
  );
  protected readonly iconDecorative = computed(
    () => this.options().iconDecorative ?? false,
  );
  protected readonly closeable = computed(
    () => this.options().closeable ?? true,
  );
  protected readonly closeLabel = computed(
    () => this.options().closeLabel ?? 'Close',
  );
  protected readonly size = computed(() => this.options().size ?? 'md');
  protected readonly variant = computed(
    () => this.options().variant ?? 'neutral',
  );
  protected readonly description = computed(() => this.options().description);
  protected readonly title = computed(() => this.options().title);
  protected readonly icon = computed(() => this.options().icon);

  protected readonly actions = computed(() => {
    const variant = this.variant();
    return (this.options().actions ?? []).map((action) => {
      const appearance = action.appearance ?? 'solid';
      const hasExplicitColor = action.color !== undefined;
      const color = hasExplicitColor
        ? action.color
        : appearance === 'solid'
          ? variant
          : undefined;
      return { ...action, color };
    });
  });
}
