import {
  Component,
  input,
  output,
  computed,
  ElementRef,
  inject,
  HostListener,
} from '@angular/core';

import { SolarisIconComponent } from '../../../icon';

import type {
  SolarisDropdownMenuItemColor,
  SolarisDropdownMenuItemType,
} from '../model/dropdown-menu.types';

@Component({
  selector: 'solaris-dropdown-menu-item',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss'],
  host: {
    '[attr.data-type]': 'type()',
    '[attr.data-color]': 'color()',
    '[attr.role]': 'computedRole()',
    class: 'solaris-dropdown-menu-item',
    '[attr.tabindex]': 'tabIndexValue()',
    '[attr.aria-checked]': 'computedAriaChecked()',
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-has-leading]': 'hasLeadingContent() ? "" : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
  },
})
export class SolarisDropdownMenuItemComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly color = input<SolarisDropdownMenuItemColor>('neutral');
  readonly type = input<SolarisDropdownMenuItemType>('item');
  readonly closeOnSelect = input<boolean | undefined>(undefined);
  readonly descriptionKey = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly checked = input<boolean | undefined>(undefined);
  readonly labelKey = input<string | undefined>(undefined);
  readonly shortcut = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly iconDecorative = input<boolean>(false);
  readonly value = input<unknown>(undefined);
  readonly disabled = input<boolean>(false);

  readonly itemSelected = output<void>();

  protected readonly computedRole = computed<string>(() => {
    const t = this.type();
    if (t === 'checkbox') return 'menuitemcheckbox';
    if (t === 'radio') return 'menuitemradio';
    return 'menuitem';
  });

  protected readonly computedAriaChecked = computed<string | null>(() => {
    const t = this.type();
    if (t === 'checkbox' || t === 'radio') {
      return this.checked() ? 'true' : 'false';
    }
    return null;
  });

  protected readonly tabIndexValue = computed<string>(() => {
    return this.disabled() ? '-1' : '0';
  });

  protected readonly hasLeadingContent = computed(() => {
    return !!(
      this.icon() ||
      this.type() === 'checkbox' ||
      this.type() === 'radio'
    );
  });

  @HostListener('click')
  handleClick(): void {
    if (this.disabled()) return;
    this.itemSelected.emit();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.handleClick();
    }
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
