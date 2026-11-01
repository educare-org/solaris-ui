import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SolarisRangeSliderComponent } from '../component/range-slider.component';
import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

function configure(
  options?: Parameters<typeof provideSolarisTesting>[0],
): void {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      ...provideSolarisTesting(options),
    ],
  });
}

function thumbsOf(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('[role="slider"]'),
  ) as HTMLElement[];
}

function sliderOf(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector(
    'solaris-range-slider',
  ) as HTMLElement;
}

function trackOf(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector(
    '.solaris-range-slider__track',
  ) as HTMLElement;
}

function pressKey(thumb: HTMLElement, key: string): void {
  thumb.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

function mockTrackRect(track: HTMLElement, rect: Partial<DOMRect>): void {
  vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
    width: 200,
    height: 20,
    top: 0,
    left: 0,
    right: 200,
    bottom: 20,
    x: 0,
    y: 0,
    ...rect,
  } as DOMRect);
}

@Component({
  selector: 'solaris-range-test-default',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider label="Price" />`,
})
class DefaultHost {}

@Component({
  selector: 'solaris-range-test-unordered',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider ariaLabel="Price" [values]="[80, 20]" />`,
})
class UnorderedHost {}

@Component({
  selector: 'solaris-range-test-five',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    ariaLabel="Stops"
    [values]="[90, 10, 50, 30, 70, 60, 40]"
  />`,
})
class CappedHost {}

@Component({
  selector: 'solaris-range-test-three',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    ariaLabel="Segments"
    [values]="[10, 50, 90]"
  />`,
})
class ThreeHost {}

@Component({
  selector: 'solaris-range-test-gap',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    ariaLabel="Gap"
    [values]="[28, 25]"
    [minStepsBetweenThumbs]="10"
  />`,
})
class GapHost {}

@Component({
  selector: 'solaris-range-test-keys',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider ariaLabel="Keys" [values]="[20, 80]" />`,
})
class KeyHost {}

@Component({
  selector: 'solaris-range-test-vertical',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    ariaLabel="V"
    orientation="vertical"
    [values]="[20, 80]"
  />`,
})
class VerticalHost {}

@Component({
  selector: 'solaris-range-test-display',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    ariaLabel="V"
    valueDisplay="tooltip"
    [values]="[20, 80]"
  />`,
})
class TooltipHost {}

@Component({
  selector: 'solaris-range-test-inline',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    ariaLabel="V"
    valueDisplay="inline"
    [values]="[20, 80]"
  />`,
})
class InlineHost {}

@Component({
  selector: 'solaris-range-test-ticks',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    ariaLabel="V"
    [showTicks]="true"
    [tickStep]="25"
  />`,
})
class TicksHost {}

@Component({
  selector: 'solaris-range-test-states',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider ariaLabel="V" [disabled]="true" />`,
})
class DisabledHost {}

@Component({
  selector: 'solaris-range-test-icons',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    label="V"
    description="Adjust it."
    startIcon="minus"
    endIcon="plus"
    thumbIcon="grip-vertical"
  />`,
})
class IconsHost {}

@Component({
  selector: 'solaris-range-test-i18n',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    labelKey="demo.rangeLabel"
    descriptionKey="demo.rangeHint"
    ariaLabelKey="demo.rangeName"
    unitKey="demo.unit"
    valueDisplay="thumb"
    [values]="[10, 90]"
  />`,
})
class I18nHost {}

@Component({
  selector: 'solaris-range-test-reactive',
  standalone: true,
  imports: [SolarisRangeSliderComponent, ReactiveFormsModule],
  template: `<solaris-range-slider ariaLabel="V" [formControl]="control" />`,
})
class ReactiveHost {
  readonly control = new FormControl<number[]>([30, 70]);
}

@Component({
  selector: 'solaris-range-test-min-max',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider ariaLabel="V" [showMinMax]="true" />`,
})
class MinMaxHost {}

@Component({
  selector: 'solaris-range-test-min-max-format',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    ariaLabel="V"
    [min]="10"
    [max]="20"
    [showMinMax]="true"
    [formatValue]="format"
  />`,
})
class MinMaxFormatHost {
  readonly format = (v: number): string => `${v} units`;
}

@Component({
  selector: 'solaris-range-test-min-max-unit',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    ariaLabel="V"
    [showMinMax]="true"
    unit="kb"
  />`,
})
class MinMaxUnitHost {}

@Component({
  selector: 'solaris-range-test-min-max-vertical',
  standalone: true,
  imports: [SolarisRangeSliderComponent],
  template: `<solaris-range-slider
    ariaLabel="V"
    orientation="vertical"
    [values]="[20, 80]"
    [showMinMax]="true"
  />`,
})
class MinMaxVerticalHost {}

describe('SolarisRangeSliderComponent rendering', () => {
  it('renders two ordered thumbs with the fill between them', () => {
    configure();
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const thumbs = thumbsOf(fixture);
    expect(thumbs.length).toBe(2);
    expect(thumbs[0].getAttribute('aria-valuenow')).toBe('25');
    expect(thumbs[1].getAttribute('aria-valuenow')).toBe('75');
    const fill = fixture.nativeElement.querySelector(
      '.solaris-range-slider__fill',
    ) as HTMLElement;
    expect(fill.style.transform).toContain('translateX(25%)');
    expect(fill.style.transform).toContain('scaleX(0.5)');
  });

  it('orders crossing input values without mutating them', () => {
    configure();
    const fixture = TestBed.createComponent(UnorderedHost);
    fixture.detectChanges();
    const thumbs = thumbsOf(fixture);
    expect(thumbs[0].getAttribute('aria-valuenow')).toBe('20');
    expect(thumbs[1].getAttribute('aria-valuenow')).toBe('80');
  });

  it('caps thumbs at five by default', () => {
    configure();
    const fixture = TestBed.createComponent(CappedHost);
    fixture.detectChanges();
    expect(thumbsOf(fixture).length).toBe(5);
  });

  it('names two thumbs min/max and three thumbs by position', () => {
    configure();
    const two = TestBed.createComponent(KeyHost);
    two.detectChanges();
    const pair = thumbsOf(two);
    expect(pair[0].getAttribute('aria-label')).toContain('Minimum value');
    expect(pair[1].getAttribute('aria-label')).toContain('Maximum value');

    const three = TestBed.createComponent(ThreeHost);
    three.detectChanges();
    expect(thumbsOf(three)[1].getAttribute('aria-label')).toContain(
      'Value 2 of 3',
    );
  });

  it('renders inline joined values, tooltips and ticks', () => {
    configure();
    const inline = TestBed.createComponent(InlineHost);
    inline.detectChanges();
    expect(
      inline.nativeElement.querySelector('.solaris-range-slider__value')
        ?.textContent,
    ).toContain('20%');

    const tooltip = TestBed.createComponent(TooltipHost);
    tooltip.detectChanges();
    expect(
      tooltip.nativeElement.querySelectorAll('.solaris-range-slider__tooltip')
        .length,
    ).toBe(2);

    const ticks = TestBed.createComponent(TicksHost);
    ticks.detectChanges();
    expect(
      ticks.nativeElement.querySelectorAll('.solaris-range-slider__tick')
        .length,
    ).toBe(5);
  });

  it('renders description, icons and disabled state', () => {
    configure();
    const icons = TestBed.createComponent(IconsHost);
    icons.detectChanges();
    const el: HTMLElement = icons.nativeElement;
    expect(
      el.querySelector('.solaris-range-slider__description')?.textContent,
    ).toContain('Adjust it.');
    expect(el.querySelectorAll('.solaris-range-slider__edge-icon').length).toBe(
      2,
    );

    const disabled = TestBed.createComponent(DisabledHost);
    disabled.detectChanges();
    expect(sliderOf(disabled).hasAttribute('data-disabled')).toBe(true);
    for (const thumb of thumbsOf(disabled)) {
      expect(thumb.getAttribute('tabindex')).toBe('-1');
    }
  });
});

describe('SolarisRangeSliderComponent interaction', () => {
  it('moves each thumb independently with arrows and clamps at neighbors', () => {
    configure();
    const fixture = TestBed.createComponent(KeyHost);
    fixture.detectChanges();
    const thumbs = thumbsOf(fixture);
    pressKey(thumbs[1], 'ArrowLeft');
    fixture.detectChanges();
    expect(thumbsOf(fixture)[1].getAttribute('aria-valuenow')).toBe('79');
    expect(thumbsOf(fixture)[0].getAttribute('aria-valuenow')).toBe('20');

    pressKey(thumbsOf(fixture)[0], 'End');
    fixture.detectChanges();
    expect(thumbsOf(fixture)[0].getAttribute('aria-valuenow')).toBe('79');
  });

  it('never lets thumbs cross under a minimum gap', () => {
    configure();
    const fixture = TestBed.createComponent(GapHost);
    fixture.detectChanges();
    const thumbs = thumbsOf(fixture);
    expect(thumbs[0].getAttribute('aria-valuenow')).toBe('25');
    expect(thumbs[1].getAttribute('aria-valuenow')).toBe('35');
    pressKey(thumbsOf(fixture)[1], 'ArrowLeft');
    fixture.detectChanges();
    expect(thumbsOf(fixture)[1].getAttribute('aria-valuenow')).toBe('35');
  });

  it('emits thumbFocus with the focused index', () => {
    configure();
    const fixture = TestBed.createComponent(KeyHost);
    fixture.detectChanges();
    const component = fixture.debugElement.children[0]
      .componentInstance as SolarisRangeSliderComponent;
    const focused: number[] = [];
    component.thumbFocus.subscribe((index: number) => focused.push(index));
    thumbsOf(fixture)[1].dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(focused).toEqual([1]);
  });

  it('commits the array on blur after keyboard changes', () => {
    configure();
    const fixture = TestBed.createComponent(KeyHost);
    fixture.detectChanges();
    const component = fixture.debugElement.children[0]
      .componentInstance as SolarisRangeSliderComponent;
    const commits: number[][] = [];
    component.valueCommit.subscribe((values: number[]) => commits.push(values));
    const thumbs = thumbsOf(fixture);
    pressKey(thumbs[0], 'ArrowRight');
    fixture.detectChanges();
    thumbsOf(fixture)[0].dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(commits).toEqual([[21, 80]]);
  });

  it('drags the nearest thumb and commits on pointer up', () => {
    configure();
    const fixture = TestBed.createComponent(KeyHost);
    fixture.detectChanges();
    const component = fixture.debugElement.children[0]
      .componentInstance as SolarisRangeSliderComponent;
    const commits: number[][] = [];
    component.valueCommit.subscribe((values: number[]) => commits.push(values));
    const track = trackOf(fixture);
    mockTrackRect(track, { width: 200, left: 0, right: 200 });
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientX: 190,
        button: 0,
        bubbles: true,
      }),
    );
    fixture.detectChanges();
    expect(sliderOf(fixture).hasAttribute('data-dragging')).toBe(true);
    const thumbs = thumbsOf(fixture);
    expect(thumbs[1].getAttribute('aria-valuenow')).toBe('95');
    expect(thumbs[0].getAttribute('aria-valuenow')).toBe('20');
    track.dispatchEvent(
      new MouseEvent('pointerup', { clientX: 190, bubbles: true }),
    );
    fixture.detectChanges();
    expect(commits).toEqual([[20, 95]]);
    expect(sliderOf(fixture).hasAttribute('data-dragging')).toBe(false);
  });

  it('pops the released thumb on pointer up and clears on animation end', () => {
    configure();
    const fixture = TestBed.createComponent(KeyHost);
    fixture.detectChanges();
    const track = trackOf(fixture);
    mockTrackRect(track, { width: 200, left: 0, right: 200 });
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientX: 190,
        button: 0,
        bubbles: true,
      }),
    );
    fixture.detectChanges();
    const thumbs = thumbsOf(fixture);
    expect(thumbs[1].hasAttribute('data-released')).toBe(false);

    track.dispatchEvent(
      new MouseEvent('pointerup', { clientX: 190, bubbles: true }),
    );
    fixture.detectChanges();
    const released = thumbsOf(fixture);
    expect(released[1].hasAttribute('data-released')).toBe(true);
    expect(released[0].hasAttribute('data-released')).toBe(false);

    released[1].dispatchEvent(new Event('animationend'));
    fixture.detectChanges();
    expect(thumbsOf(fixture)[1].hasAttribute('data-released')).toBe(false);

    released[0].dispatchEvent(new Event('animationend'));
    fixture.detectChanges();
    expect(thumbsOf(fixture)[0].hasAttribute('data-released')).toBe(false);
  });

  it('maps vertical pointer position from the bottom edge', () => {
    configure();
    const fixture = TestBed.createComponent(VerticalHost);
    fixture.detectChanges();
    const track = trackOf(fixture);
    mockTrackRect(track, { height: 200, top: 0, bottom: 200 });
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientY: 40,
        button: 0,
        bubbles: true,
      }),
    );
    fixture.detectChanges();
    expect(thumbsOf(fixture)[1].getAttribute('aria-valuenow')).toBe('80');
  });
});

describe('SolarisRangeSliderComponent i18n', () => {
  const localeTranslations = (locale: string) => ({
    locale,
    translations: {
      'en-US': {
        'demo.rangeLabel': 'Price',
        'demo.rangeHint': 'Adjust it.',
        'demo.rangeName': 'Price range',
        'demo.unit': 'pct',
      },
      'pt-BR': {
        'demo.rangeLabel': 'Preço',
        'demo.rangeHint': 'Ajuste.',
        'demo.rangeName': 'Faixa de preço',
        'demo.unit': 'pct',
      },
      'es-419': {
        'demo.rangeLabel': 'Precio',
        'demo.rangeHint': 'Ajústalo.',
        'demo.rangeName': 'Rango de precios',
        'demo.unit': 'pct',
      },
    },
  });

  const expectedLabel: Record<string, string> = {
    'en-US': 'Price',
    'pt-BR': 'Preço',
    'es-419': 'Precio',
  };
  const expectedName: Record<string, string> = {
    'en-US': 'Price range Minimum value',
    'pt-BR': 'Faixa de preço Valor mínimo',
    'es-419': 'Rango de precios Valor mínimo',
  };

  for (const locale of ['en-US', 'pt-BR', 'es-419'] as const) {
    it(`resolves label, description, aria and unit keys in ${locale}`, () => {
      configure({ translate: localeTranslations(locale) });
      const fixture = TestBed.createComponent(I18nHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.solaris-range-slider__label')
          ?.textContent,
      ).toContain(expectedLabel[locale]);
      expect(thumbsOf(fixture)[0].getAttribute('aria-label')).toBe(
        expectedName[locale],
      );
      expect(
        fixture.nativeElement.querySelector(
          '.solaris-range-slider__thumb-value',
        )?.textContent,
      ).toContain('10pct');
    });
  }

  it('translates positional thumb names with index params', () => {
    configure({
      translate: {
        locale: 'pt-BR',
        translations: {
          'pt-BR': {
            'solaris.slider.thumbN': 'Valor {{index}} de {{total}}',
          },
        },
      },
    });
    const fixture = TestBed.createComponent(ThreeHost);
    fixture.detectChanges();
    expect(thumbsOf(fixture)[0].getAttribute('aria-label')).toBe(
      'Segments Valor 1 de 3',
    );
  });
});

describe('SolarisRangeSliderComponent ControlValueAccessor', () => {
  it('writeValue orders, clamps and caps into range', () => {
    configure();
    const fixture = TestBed.createComponent(SolarisRangeSliderComponent);
    fixture.detectChanges();
    fixture.componentRef.instance.writeValue([150, -20, 50]);
    fixture.detectChanges();
    const thumbs = thumbsOf(fixture);
    expect(thumbs.length).toBe(3);
    expect(thumbs[0].getAttribute('aria-valuenow')).toBe('0');
    expect(thumbs[2].getAttribute('aria-valuenow')).toBe('100');
  });

  it('notifies onChange with a new array on keyboard and onTouched on blur', () => {
    configure();
    const fixture = TestBed.createComponent(SolarisRangeSliderComponent);
    fixture.detectChanges();
    const instance = fixture.componentRef.instance;
    const before = instance.values();
    let changed: number[] | null = null;
    let touched = false;
    instance.registerOnChange((values: number[]) => (changed = values));
    instance.registerOnTouched(() => (touched = true));
    pressKey(thumbsOf(fixture)[0], 'ArrowRight');
    fixture.detectChanges();
    expect(changed).toEqual([26, 75]);
    expect(changed).not.toBe(before);
    thumbsOf(fixture)[0].dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(touched).toBe(true);
  });

  it('setDisabledState toggles the disabled attribute', () => {
    configure();
    const fixture = TestBed.createComponent(SolarisRangeSliderComponent);
    fixture.detectChanges();
    fixture.componentRef.instance.setDisabledState(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-disabled')).toBe(true);
  });

  it('works with Reactive Forms arrays in both directions', () => {
    configure();
    const fixture = TestBed.createComponent(ReactiveHost);
    fixture.detectChanges();
    expect(thumbsOf(fixture)[0].getAttribute('aria-valuenow')).toBe('30');
    pressKey(thumbsOf(fixture)[1], 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toEqual([30, 71]);
    fixture.componentInstance.control.setValue([10, 90]);
    fixture.detectChanges();
    expect(thumbsOf(fixture)[1].getAttribute('aria-valuenow')).toBe('90');
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(sliderOf(fixture).hasAttribute('data-disabled')).toBe(true);
  });
});

describe('SolarisRangeSliderComponent showMinMax', () => {
  it('hides the scale bounds by default', () => {
    configure();
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.solaris-range-slider__min'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.solaris-range-slider__max'),
    ).toBeNull();
  });

  it('renders the static min/max bounds as aria-hidden decoration', () => {
    configure();
    const fixture = TestBed.createComponent(MinMaxHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const min = el.querySelector('.solaris-range-slider__min') as HTMLElement;
    const max = el.querySelector('.solaris-range-slider__max') as HTMLElement;
    expect(min?.textContent).toContain('0%');
    expect(max?.textContent).toContain('100%');
    expect(min?.getAttribute('aria-hidden')).toBe('true');
    expect(max?.getAttribute('aria-hidden')).toBe('true');
  });

  it('formats the bounds with formatValue', () => {
    configure();
    const fixture = TestBed.createComponent(MinMaxFormatHost);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.solaris-range-slider__min')
        ?.textContent,
    ).toContain('10 units');
    expect(
      fixture.nativeElement.querySelector('.solaris-range-slider__max')
        ?.textContent,
    ).toContain('20 units');
  });

  it('appends the unit suffix to the bounds by default', () => {
    configure();
    const fixture = TestBed.createComponent(MinMaxUnitHost);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.solaris-range-slider__min')
        ?.textContent,
    ).toContain('0kb');
    expect(
      fixture.nativeElement.querySelector('.solaris-range-slider__max')
        ?.textContent,
    ).toContain('100kb');
  });

  it('places the bounds above and below the track when vertical', () => {
    configure();
    const fixture = TestBed.createComponent(MinMaxVerticalHost);
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector(
      '.solaris-range-slider__body',
    ) as HTMLElement;
    const order = Array.from(body.children).map(
      (child) => (child as HTMLElement).className,
    );
    const minIndex = order.findIndex((name) =>
      name.includes('solaris-range-slider__min'),
    );
    const trackIndex = order.findIndex((name) =>
      name.includes('solaris-range-slider__track'),
    );
    const maxIndex = order.findIndex((name) =>
      name.includes('solaris-range-slider__max'),
    );
    expect(minIndex).toBeGreaterThanOrEqual(0);
    expect(trackIndex).toBeGreaterThanOrEqual(0);
    expect(maxIndex).toBeGreaterThanOrEqual(0);
    expect(minIndex).toBeLessThan(trackIndex);
    expect(trackIndex).toBeLessThan(maxIndex);
  });
});
