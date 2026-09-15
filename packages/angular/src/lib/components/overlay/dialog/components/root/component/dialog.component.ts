import {
  Component,
  input,
  inject,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';

import { SolarisDialogContentComponent } from '../../content/component/dialog-content.component';
import { SolarisDialogActionsComponent } from '../../actions/component/dialog-actions.component';
import { SolarisDialogHeaderComponent } from '../../header/component/dialog-header.component';
import { SolarisTranslateService } from '../../../../../../services/translation';
import type { SolarisDialogOptions } from '../model/dialog.types';

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
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

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
  protected readonly variant = computed(
    () => this.options().variant ?? 'neutral',
  );
  protected readonly headerSeparator = computed(
    () => this.options().headerSeparator ?? true,
  );
  protected readonly footerSeparator = computed(
    () => this.options().footerSeparator ?? true,
  );
  protected readonly actionsShape = computed(() => this.options().actionsShape);
  protected readonly actionsDensity = computed(
    () => this.options().actionsDensity,
  );
  protected readonly actionsRadius = computed(
    () => this.options().actionsRadius,
  );
  protected readonly density = computed(() => this.options().density);
  protected readonly description = computed(() => this.options().description);
  protected readonly title = computed(() => this.options().title);
  protected readonly icon = computed(() => this.options().icon);
  protected readonly resolvedTitle = computed(() => {
    const titleKey = this.options().titleKey;
    if (titleKey) {
      return this.translateService?.translate(titleKey) ?? this.options().title;
    }
    return this.title();
  });
  protected readonly resolvedDescription = computed(() => {
    const descriptionKey = this.options().descriptionKey;
    if (descriptionKey) {
      return (
        this.translateService?.translate(descriptionKey) ??
        this.options().description
      );
    }
    return this.description();
  });

  protected readonly actions = computed(() => {
    const variant = this.variant();
    const shape = this.actionsShape();
    const density = this.actionsDensity();
    const radius = this.actionsRadius();
    return (this.options().actions ?? []).map((action) => {
      const appearance = action.appearance ?? 'solid';
      const hasExplicitColor = action.color !== undefined;
      const color = hasExplicitColor
        ? action.color
        : appearance === 'solid'
          ? variant
          : undefined;
      return {
        ...action,
        color,
        shape: action.shape ?? shape,
        density: action.density ?? density,
        radius: action.radius ?? radius,
      };
    });
  });
}
