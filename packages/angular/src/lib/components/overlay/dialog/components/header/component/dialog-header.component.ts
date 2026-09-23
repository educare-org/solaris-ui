// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement is the standard Angular API to read the host element for scroll-parent lookup (parentElement traversal) and passive scroll listener for scrolled state. SSR-safe via isPlatformBrowser guard with DestroyRef cleanup. No alternative exists.
import {
  Component,
  input,
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
import { isPlatformBrowser } from '@angular/common';

import type { SolarisDialogVariant } from '../../root/model/dialog.types';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import type { SolarisDialogRef } from '../../../service/dialog-ref';
import { SolarisIconComponent } from '../../../../../icon';

let nextDialogHeaderId = 0;

@Component({
  selector: 'solaris-dialog-header',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog-header',
    '[attr.data-variant]': 'variant()',
    '[attr.data-separator]': "separator() ? '' : null",
    '[attr.data-scrolled]': "effectiveScrolled() ? '' : null",
  },
})
export class SolarisDialogHeaderComponent implements AfterViewInit {
  private readonly dialogRef = inject(SOLARIS_DIALOG_REF, {
    optional: true,
  }) as SolarisDialogRef | null;
  private readonly hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly icon = input<string>();
  readonly title = input<string>();
  readonly description = input<string>();
  readonly iconDecorative = input<boolean>(false);
  readonly variant = input<SolarisDialogVariant>('neutral');
  readonly separator = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly closeable = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly closeLabel = input<string>('Close');
  readonly scrolled = input<boolean>();

  protected readonly internalScrolled = signal(false);
  protected readonly effectiveScrolled = computed(
    () => this.scrolled() ?? this.internalScrolled(),
  );

  private readonly idPrefix =
    this.dialogRef?.id ?? `solaris-dialog-${++nextDialogHeaderId}`;

  protected readonly titleId = `${this.idPrefix}-title`;
  protected readonly descriptionId = `${this.idPrefix}-description`;

  protected readonly hasTitle = () => !!this.title();
  protected readonly hasDescription = () => !!this.description();
  protected readonly hasIcon = () => !!this.icon();
  protected readonly showClose = () => this.closeable();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.observeScrollParent();
  }

  protected closeDialog(): void {
    this.dialogRef?.close();
  }

  private observeScrollParent(): void {
    const scrollParent = findScrollParent(this.hostElement);
    if (!scrollParent) {
      return;
    }
    const update = (): void => {
      this.internalScrolled.set(scrollParent.scrollTop > 0);
    };
    update();
    scrollParent.addEventListener('scroll', update, { passive: true });
    this.destroyRef.onDestroy(() => {
      scrollParent.removeEventListener('scroll', update);
    });
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
