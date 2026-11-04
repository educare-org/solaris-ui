import {
  Component,
  input,
  output,
  inject,
  booleanAttribute,
  ChangeDetectionStrategy,
  ElementRef,
  DestroyRef,
  signal,
  computed,
  AfterViewInit,
  PLATFORM_ID,
} from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { SolarisButtonDirective } from '../../../../../actions/button';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import { SolarisTranslateService } from '../../../../../../services/translation';
import { SolarisThemeService } from '../../../../../../services/theme';
import type {
  SolarisDialogAction,
  SolarisDialogActionsAlign,
  SolarisDialogActionsStack,
  SolarisDialogDensity,
} from '../../root/model/dialog.types';

@Component({
  selector: 'solaris-dialog-actions',
  standalone: true,
  imports: [NgTemplateOutlet, SolarisButtonDirective],
  templateUrl: './dialog-actions.component.html',
  styleUrls: ['./dialog-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-align]': 'align()',
    '[attr.data-stack]': 'stack()',
    '[attr.data-separator]': "separator() ? '' : null",
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-scrolled]': "effectiveScrolled() ? '' : null",
    '[attr.data-flat]': "flat() ? '' : null",
    '[attr.data-split]': "hasSplit() ? '' : null",
    class: 'solaris-dialog-actions',
  },
})
export class SolarisDialogActionsComponent<TResult = unknown>
  implements AfterViewInit
{
  private readonly dialogRef = inject(
    SOLARIS_DIALOG_REF,
  ) as SolarisDialogRef<TResult>;
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeService = inject(SolarisThemeService, {
    optional: true,
  });

  readonly actions = input<SolarisDialogAction<TResult>[]>([]);
  readonly align = input<SolarisDialogActionsAlign>('end');
  readonly stack = input<SolarisDialogActionsStack>('auto');
  readonly separator = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly density = input<SolarisDialogDensity>();
  readonly scrolled = input<boolean>();
  readonly flat = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  protected readonly effectiveDensity = computed(
    () => this.density() ?? this.themeService?.density ?? 'normal',
  );

  protected readonly startActions = computed(() =>
    this.actions().filter((action) => action.position === 'start'),
  );

  protected readonly endActions = computed(() =>
    this.actions().filter((action) => action.position !== 'start'),
  );

  protected readonly hasSplit = computed(
    () => this.startActions().length > 0 && this.endActions().length > 0,
  );

  protected readonly internalScrolled = signal(false);
  protected readonly effectiveScrolled = computed(
    () => this.scrolled() ?? this.internalScrolled(),
  );

  readonly actionExecuted = output<SolarisDialogAction<TResult>>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.collapseSeparatorWhenAdjacentToHeader();
    this.observeScrollParent();
  }

  private observeScrollParent(): void {
    const scrollParent = findScrollParent(this.hostElement);
    if (!scrollParent) {
      return;
    }
    const update = (): void => {
      this.internalScrolled.set(hasMoreBelow(scrollParent));
    };
    update();
    scrollParent.addEventListener('scroll', update, { passive: true });
    this.destroyRef.onDestroy(() => {
      scrollParent.removeEventListener('scroll', update);
    });
  }

  private collapseSeparatorWhenAdjacentToHeader(): void {
    if (this.separator() && followsHeaderSeparator(this.hostElement)) {
      this.hostElement.setAttribute('data-adjacent-header', '');
    }
  }

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

function findScrollParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;
  while (parent) {
    const overflowY = getComputedStyle(parent).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

function hasMoreBelow(element: HTMLElement): boolean {
  return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
}

function followsHeaderSeparator(element: HTMLElement): boolean {
  const previous = element.previousElementSibling as HTMLElement | null;
  return (
    previous?.tagName === 'SOLARIS-DIALOG-HEADER' &&
    previous.hasAttribute('data-separator')
  );
}
