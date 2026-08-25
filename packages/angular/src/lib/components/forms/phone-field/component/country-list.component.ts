import {
  Component,
  computed,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisIconComponent } from '../../../icon';
import { SolarisSafeHtmlPipe } from './solaris-safe-html.pipe';
import { nextIdFor } from '../../../../core';

import type {
  SolarisCountry,
  SolarisCountryCode,
} from '../model/country.types';

@Component({
  selector: 'solaris-phone-country-list',
  standalone: true,
  imports: [SolarisIconComponent, SolarisSafeHtmlPipe],
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisPhoneCountryListComponent {
  readonly countries = input<SolarisCountry[]>([]);
  readonly selectedCode = input<SolarisCountryCode | undefined>();
  readonly searchable = input<boolean>(true);
  readonly searchPlaceholder = input<string>('');
  readonly noResultsText = input<string>('');
  readonly emptyText = input<string>('');
  readonly maxHeight = input<string | number | undefined>();

  readonly countrySelected = output<SolarisCountry>();
  readonly closeRequest = output<void>();

  protected readonly listId = nextIdFor('solaris-phone-country-list');
  protected readonly searchQuery = signal('');
  protected readonly activeIndex = signal(-1);

  protected readonly filtered = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.countries();
    if (!query) {
      return list;
    }
    return list.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.callingCode.includes(query),
    );
  });

  protected readonly showEmpty = computed(() => {
    return this.countries().length === 0;
  });

  protected readonly showNoResults = computed(() => {
    return this.countries().length > 0 && this.filtered().length === 0;
  });

  protected readonly activeDescendantId = computed(() => {
    const index = this.activeIndex();
    if (index < 0 || index >= this.filtered().length) {
      return null;
    }
    return this.optionId(index);
  });

  protected optionId(index: number): string {
    return `${this.listId}-option-${index}`;
  }

  protected onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.activeIndex.set(-1);
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActive(-1);
        break;
      case 'Enter':
        event.preventDefault();
        this.selectActive();
        break;
      case 'Escape':
        event.preventDefault();
        if (this.searchQuery()) {
          this.searchQuery.set('');
          this.activeIndex.set(-1);
        } else {
          this.closeRequest.emit();
        }
        break;
      case 'Tab':
        this.closeRequest.emit();
        break;
    }
  }

  protected onListClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const optionEl = target.closest('.solaris-phone-country-list__option');
    if (!optionEl) {
      return;
    }
    const current = event.currentTarget as HTMLElement;
    const index = Array.from(current.children).indexOf(optionEl);
    const list = this.filtered();
    if (index >= 0 && index < list.length) {
      this.countrySelected.emit(list[index]);
    }
  }

  protected onListKeydown(event: KeyboardEvent): void {
    const list = this.filtered();
    if (list.length === 0) {
      return;
    }

    let index = this.activeIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        index = index >= list.length - 1 ? 0 : index + 1;
        break;
      case 'ArrowUp':
        event.preventDefault();
        index = index <= 0 ? list.length - 1 : index - 1;
        break;
      case 'Home':
        event.preventDefault();
        index = 0;
        break;
      case 'End':
        event.preventDefault();
        index = list.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (index >= 0 && index < list.length) {
          this.countrySelected.emit(list[index]);
        }
        return;
      case 'Escape':
        event.preventDefault();
        this.closeRequest.emit();
        return;
      case 'Tab':
        this.closeRequest.emit();
        return;
      default:
        return;
    }

    this.activeIndex.set(index);
  }

  private moveActive(direction: 1 | -1): void {
    const list = this.filtered();
    if (list.length === 0) {
      return;
    }
    let index = this.activeIndex();
    index =
      index < 0
        ? direction === 1
          ? 0
          : list.length - 1
        : (index + direction + list.length) % list.length;
    this.activeIndex.set(index);
  }

  private selectActive(): void {
    const list = this.filtered();
    const index = this.activeIndex();
    if (index >= 0 && index < list.length) {
      this.countrySelected.emit(list[index]);
    }
  }
}
