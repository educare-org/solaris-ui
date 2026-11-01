import { Component, input, signal } from '@angular/core';

import { SolarisRangeSliderComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-currency-range-slider-example',
  imports: [SolarisRangeSliderComponent],
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyRangeSliderExample {
  readonly label = input('Budget');
  readonly budget = signal([500, 2000]);

  protected formatBRL(value: number): string {
    // Why: the locale is pinned (not the visitor's) so SSR and the client
    // render byte-identical strings and hydration never mismatches.
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  }
}
