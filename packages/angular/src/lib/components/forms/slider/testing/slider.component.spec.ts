import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SolarisSliderComponent } from '../component/slider.component';
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

function thumbOf(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector('[role="slider"]') as HTMLElement;
}

function trackOf(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector(
    '.solaris-slider__track',
  ) as HTMLElement;
}

function sliderOf(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector('solaris-slider') as HTMLElement;
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
  selector: 'solaris-slider-test-1',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="Volume" />`,
})
class DefaultHost {}

@Component({
  selector: 'solaris-slider-test-2',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider label="Volume" />`,
})
class LabelledHost {}

@Component({
  selector: 'solaris-slider-test-3',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider name="volume" [value]="30" />`,
})
class NamedHost {}

@Component({
  selector: 'solaris-slider-test-4',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    ariaLabel="V"
    [min]="10"
    [max]="20"
    [step]="5"
    [value]="13"
  />`,
})
class ClampedHost {}

@Component({
  selector: 'solaris-slider-test-5',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    ariaLabel="V"
    size="lg"
    color="success"
    orientation="vertical"
    [disabled]="true"
  />`,
})
class VariantsHost {}

@Component({
  selector: 'solaris-slider-test-6',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" valueDisplay="tooltip" />`,
})
class TooltipHost {}

@Component({
  selector: 'solaris-slider-test-7',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" valueDisplay="thumb" />`,
})
class ThumbValueHost {}

@Component({
  selector: 'solaris-slider-test-8',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" valueDisplay="none" />`,
})
class NoValueHost {}

@Component({
  selector: 'solaris-slider-test-9',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    ariaLabel="V"
    [value]="25"
    [formatValue]="format"
    [valueText]="text"
  />`,
})
class FormatterHost {
  readonly format = (v: number): string => `${v} units`;
  readonly text = (v: number): string => `${v} units selected`;
}

@Component({
  selector: 'solaris-slider-test-10',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" [value]="40" unit="db" />`,
})
class UnitHost {}

@Component({
  selector: 'solaris-slider-test-11',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    ariaLabel="V"
    [showTicks]="true"
    [tickStep]="25"
  />`,
})
class TicksHost {}

@Component({
  selector: 'solaris-slider-test-12',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    label="V"
    description="Adjust it."
    startIcon="minus"
    endIcon="plus"
    thumbIcon="grip-vertical"
  />`,
})
class IconsHost {}

@Component({
  selector: 'solaris-slider-test-13',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    ariaLabel="V"
    [readonly]="true"
    [invalid]="true"
    [required]="true"
    label="V"
  />`,
})
class StatesHost {}

@Component({
  selector: 'solaris-slider-test-14',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" [value]="50" />`,
})
class KeyHost {}

@Component({
  selector: 'solaris-slider-test-15',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" [value]="50" [pageStep]="25" />`,
})
class PageStepHost {}

@Component({
  selector: 'solaris-slider-test-16',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" [value]="50" [disabled]="true" />`,
})
class DisabledKeyHost {}

@Component({
  selector: 'solaris-slider-test-17',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" [value]="50" [readonly]="true" />`,
})
class ReadonlyKeyHost {}

@Component({
  selector: 'solaris-slider-test-18',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" [value]="20" />`,
})
class PointerHost {}

@Component({
  selector: 'solaris-slider-test-19',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    ariaLabel="V"
    orientation="vertical"
    [value]="0"
  />`,
})
class VerticalPointerHost {}

@Component({
  selector: 'solaris-slider-test-20',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider label="Volume" description="Adjust it." />`,
})
class AriaLinkHost {}

@Component({
  selector: 'solaris-slider-test-21',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="Master volume" />`,
})
class AriaFallbackHost {}

@Component({
  selector: 'solaris-slider-test-22',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" [value]="20" />`,
})
class SyncHost {}

@Component({
  selector: 'solaris-slider-test-23',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    labelKey="demo.sliderLabel"
    descriptionKey="demo.sliderHint"
    ariaLabelKey="demo.sliderName"
    unitKey="demo.unit"
    [value]="10"
  />`,
})
class I18nHost {}

@Component({
  selector: 'solaris-slider-test-24',
  standalone: true,
  imports: [SolarisSliderComponent, ReactiveFormsModule],
  template: `<solaris-slider ariaLabel="V" [formControl]="control" />`,
})
class ReactiveHost {
  readonly control = new FormControl<number>(25);
}

@Component({
  selector: 'solaris-slider-test-25',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" [showMinMax]="true" />`,
})
class MinMaxHost {}

@Component({
  selector: 'solaris-slider-test-26',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
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
  selector: 'solaris-slider-test-27',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider ariaLabel="V" [showMinMax]="true" unit="kb" />`,
})
class MinMaxUnitHost {}

@Component({
  selector: 'solaris-slider-test-28',
  standalone: true,
  imports: [SolarisSliderComponent],
  template: `<solaris-slider
    ariaLabel="V"
    orientation="vertical"
    [showMinMax]="true"
  />`,
})
class MinMaxVerticalHost {}

describe('SolarisSliderComponent rendering', () => {
  it('creates the slider role with default value', () => {
    configure();
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const thumb = thumbOf(fixture);
    expect(thumb).toBeTruthy();
    expect(thumb.getAttribute('aria-valuenow')).toBe('50');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('renders inline label and value header by default', () => {
    configure();
    const fixture = TestBed.createComponent(LabelledHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.solaris-slider__label')?.textContent).toContain(
      'Volume',
    );
    expect(el.querySelector('.solaris-slider__value')?.textContent).toContain(
      '50%',
    );
  });

  it('renders the hidden form input with the bound name', () => {
    configure();
    const fixture = TestBed.createComponent(NamedHost);
    fixture.detectChanges();
    const hidden = fixture.nativeElement.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement;
    expect(hidden.getAttribute('name')).toBe('volume');
    expect(hidden.value).toBe('30');
  });
});

describe('SolarisSliderComponent inputs', () => {
  it('clamps and snaps the rendered value to min/max/step', () => {
    configure();
    const fixture = TestBed.createComponent(ClampedHost);
    fixture.detectChanges();
    expect(thumbOf(fixture).getAttribute('aria-valuenow')).toBe('15');
  });

  it('reflects size, color, orientation and disabled data attributes', () => {
    configure();
    const fixture = TestBed.createComponent(VariantsHost);
    fixture.detectChanges();
    const el = sliderOf(fixture);
    expect(el.getAttribute('data-size')).toBe('lg');
    expect(el.getAttribute('data-color')).toBe('success');
    expect(el.getAttribute('data-orientation')).toBe('vertical');
    expect(el.hasAttribute('data-disabled')).toBe(true);
    expect(thumbOf(fixture).getAttribute('tabindex')).toBe('-1');
  });

  it('renders tooltip, thumb and none value displays', () => {
    configure();
    const tooltip = TestBed.createComponent(TooltipHost);
    tooltip.detectChanges();
    expect(
      tooltip.nativeElement.querySelector('.solaris-slider__tooltip')
        ?.textContent,
    ).toContain('50%');
    expect(
      tooltip.nativeElement.querySelector('.solaris-slider__value'),
    ).toBeNull();

    const thumbMode = TestBed.createComponent(ThumbValueHost);
    thumbMode.detectChanges();
    expect(
      thumbMode.nativeElement.querySelector('.solaris-slider__thumb-value')
        ?.textContent,
    ).toContain('50%');

    const none = TestBed.createComponent(NoValueHost);
    none.detectChanges();
    expect(
      none.nativeElement.querySelector('.solaris-slider__value'),
    ).toBeNull();
    expect(
      none.nativeElement.querySelector('.solaris-slider__tooltip'),
    ).toBeNull();
    expect(
      none.nativeElement.querySelector('.solaris-slider__thumb-value'),
    ).toBeNull();
  });

  it('uses custom formatValue and valueText builders', () => {
    configure();
    const fixture = TestBed.createComponent(FormatterHost);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.solaris-slider__value')
        ?.textContent,
    ).toContain('25 units');
    expect(thumbOf(fixture).getAttribute('aria-valuetext')).toBe(
      '25 units selected',
    );
  });

  it('appends a custom unit suffix by default', () => {
    configure();
    const fixture = TestBed.createComponent(UnitHost);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.solaris-slider__value')
        ?.textContent,
    ).toContain('40db');
  });

  it('renders tick marks from showTicks and tickStep', () => {
    configure();
    const fixture = TestBed.createComponent(TicksHost);
    fixture.detectChanges();
    const ticks = fixture.nativeElement.querySelectorAll(
      '.solaris-slider__tick',
    );
    expect(ticks.length).toBe(5);
    expect(
      fixture.nativeElement
        .querySelector('.solaris-slider__ticks')
        ?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('renders description and icons', () => {
    configure();
    const fixture = TestBed.createComponent(IconsHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(
      el.querySelector('.solaris-slider__description')?.textContent,
    ).toContain('Adjust it.');
    expect(el.querySelectorAll('.solaris-slider__edge-icon').length).toBe(2);
    expect(thumbOf(fixture).querySelector('solaris-icon')).toBeTruthy();
  });

  it('marks readonly, invalid and required states', () => {
    configure();
    const fixture = TestBed.createComponent(StatesHost);
    fixture.detectChanges();
    const el = sliderOf(fixture);
    expect(el.hasAttribute('data-readonly')).toBe(true);
    expect(el.hasAttribute('data-invalid')).toBe(true);
    const thumb = thumbOf(fixture);
    expect(thumb.getAttribute('aria-readonly')).toBe('true');
    expect(thumb.getAttribute('aria-invalid')).toBe('true');
    expect(thumb.getAttribute('tabindex')).toBe('0');
  });
});

describe('SolarisSliderComponent keyboard (APG)', () => {
  it('steps with arrows and clamps at the bounds', () => {
    configure();
    const fixture = TestBed.createComponent(KeyHost);
    fixture.detectChanges();
    const thumb = thumbOf(fixture);
    pressKey(thumb, 'ArrowRight');
    fixture.detectChanges();
    expect(thumb.getAttribute('aria-valuenow')).toBe('51');
    pressKey(thumb, 'ArrowLeft');
    pressKey(thumb, 'ArrowLeft');
    fixture.detectChanges();
    expect(thumb.getAttribute('aria-valuenow')).toBe('49');

    pressKey(thumb, 'ArrowUp');
    fixture.detectChanges();
    expect(thumb.getAttribute('aria-valuenow')).toBe('50');
    pressKey(thumb, 'ArrowDown');
    fixture.detectChanges();
    expect(thumb.getAttribute('aria-valuenow')).toBe('49');
  });

  it('jumps with Home, End and default pageStep', () => {
    configure();
    const fixture = TestBed.createComponent(KeyHost);
    fixture.detectChanges();
    const thumb = thumbOf(fixture);
    pressKey(thumb, 'End');
    fixture.detectChanges();
    expect(thumb.getAttribute('aria-valuenow')).toBe('100');
    pressKey(thumb, 'Home');
    fixture.detectChanges();
    expect(thumb.getAttribute('aria-valuenow')).toBe('0');
    pressKey(thumb, 'PageUp');
    fixture.detectChanges();
    expect(thumb.getAttribute('aria-valuenow')).toBe('10');
    pressKey(thumb, 'PageDown');
    fixture.detectChanges();
    expect(thumb.getAttribute('aria-valuenow')).toBe('0');
  });

  it('honours a custom pageStep', () => {
    configure();
    const fixture = TestBed.createComponent(PageStepHost);
    fixture.detectChanges();
    const thumb = thumbOf(fixture);
    pressKey(thumb, 'PageUp');
    fixture.detectChanges();
    expect(thumb.getAttribute('aria-valuenow')).toBe('75');
  });

  it('ignores keys when disabled or readonly', () => {
    configure();
    const disabled = TestBed.createComponent(DisabledKeyHost);
    disabled.detectChanges();
    pressKey(thumbOf(disabled), 'ArrowRight');
    disabled.detectChanges();
    expect(thumbOf(disabled).getAttribute('aria-valuenow')).toBe('50');

    const readonly = TestBed.createComponent(ReadonlyKeyHost);
    readonly.detectChanges();
    pressKey(thumbOf(readonly), 'ArrowRight');
    readonly.detectChanges();
    expect(thumbOf(readonly).getAttribute('aria-valuenow')).toBe('50');
  });

  it('ignores unhandled keys', () => {
    configure();
    const fixture = TestBed.createComponent(KeyHost);
    fixture.detectChanges();
    pressKey(thumbOf(fixture), 'Enter');
    fixture.detectChanges();
    expect(thumbOf(fixture).getAttribute('aria-valuenow')).toBe('50');
  });
});

describe('SolarisSliderComponent valueCommit', () => {
  it('commits on blur after keyboard changes only', () => {
    configure();
    const commits: number[] = [];
    const fixture = TestBed.createComponent(KeyHost);
    fixture.detectChanges();
    const component = fixture.debugElement.children[0]
      .componentInstance as SolarisSliderComponent;
    component.valueCommit.subscribe((v: number) => commits.push(v));

    const thumb = thumbOf(fixture);
    thumb.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(commits).toEqual([]);

    pressKey(thumb, 'ArrowRight');
    fixture.detectChanges();
    thumb.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(commits).toEqual([51]);
  });

  it('commits on pointer up after track interaction', () => {
    configure();
    const fixture = TestBed.createComponent(PointerHost);
    fixture.detectChanges();
    const component = fixture.debugElement.children[0]
      .componentInstance as SolarisSliderComponent;
    const commits: number[] = [];
    component.valueCommit.subscribe((v: number) => commits.push(v));

    const track = trackOf(fixture);
    mockTrackRect(track, { width: 200, left: 0, right: 200 });
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientX: 100,
        button: 0,
        bubbles: true,
      }),
    );
    fixture.detectChanges();
    expect(sliderOf(fixture).hasAttribute('data-dragging')).toBe(true);
    expect(thumbOf(fixture).getAttribute('aria-valuenow')).toBe('50');

    track.dispatchEvent(
      new MouseEvent('pointerup', { clientX: 100, bubbles: true }),
    );
    fixture.detectChanges();
    expect(commits).toEqual([50]);
    expect(sliderOf(fixture).hasAttribute('data-dragging')).toBe(false);
  });

  it('pops the thumb on pointer release and clears on animation end', () => {
    configure();
    const fixture = TestBed.createComponent(PointerHost);
    fixture.detectChanges();

    const track = trackOf(fixture);
    mockTrackRect(track, { width: 200, left: 0, right: 200 });
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientX: 100,
        button: 0,
        bubbles: true,
      }),
    );
    fixture.detectChanges();
    expect(thumbOf(fixture).hasAttribute('data-released')).toBe(false);

    track.dispatchEvent(
      new MouseEvent('pointerup', { clientX: 100, bubbles: true }),
    );
    fixture.detectChanges();
    expect(thumbOf(fixture).hasAttribute('data-released')).toBe(true);

    thumbOf(fixture).dispatchEvent(new Event('animationend'));
    fixture.detectChanges();
    expect(thumbOf(fixture).hasAttribute('data-released')).toBe(false);
  });

  it('maps vertical pointer position from the bottom edge', () => {
    configure();
    const fixture = TestBed.createComponent(VerticalPointerHost);
    fixture.detectChanges();
    const track = trackOf(fixture);
    mockTrackRect(track, { height: 200, top: 0, bottom: 200 });
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientY: 50,
        button: 0,
        bubbles: true,
      }),
    );
    fixture.detectChanges();
    expect(thumbOf(fixture).getAttribute('aria-valuenow')).toBe('75');
  });
});

describe('SolarisSliderComponent accessibility', () => {
  it('links label and description via aria', () => {
    configure();
    const fixture = TestBed.createComponent(AriaLinkHost);
    fixture.detectChanges();
    const thumb = thumbOf(fixture);
    const labelledBy = thumb.getAttribute('aria-labelledby');
    const describedBy = thumb.getAttribute('aria-describedby');
    expect(labelledBy).toBeTruthy();
    expect(fixture.nativeElement.querySelector(`#${labelledBy}`)).toBeTruthy();
    expect(describedBy).toContain('-description');
    expect(
      fixture.nativeElement.querySelector(
        `#${describedBy?.split(' ').find((id) => id.endsWith('-description'))}`,
      )?.textContent,
    ).toContain('Adjust it.');
    expect(thumb.getAttribute('aria-disabled')).toBeNull();
  });

  it('falls back to ariaLabel when no visible label exists', () => {
    configure();
    const fixture = TestBed.createComponent(AriaFallbackHost);
    fixture.detectChanges();
    const thumb = thumbOf(fixture);
    expect(thumb.getAttribute('aria-label')).toBe('Master volume');
    expect(thumb.getAttribute('aria-labelledby')).toBeNull();
  });

  it('keeps aria-valuetext in sync with the value', () => {
    configure();
    const fixture = TestBed.createComponent(SyncHost);
    fixture.detectChanges();
    expect(thumbOf(fixture).getAttribute('aria-valuetext')).toContain('20');
    pressKey(thumbOf(fixture), 'ArrowRight');
    fixture.detectChanges();
    expect(thumbOf(fixture).getAttribute('aria-valuetext')).toContain('21');
  });
});

describe('SolarisSliderComponent i18n', () => {
  const localeTranslations = (locale: string) => ({
    locale,
    translations: {
      'en-US': {
        'demo.sliderLabel': 'Volume',
        'demo.sliderHint': 'Adjust it.',
        'demo.sliderName': 'Master volume',
        'demo.unit': 'pct',
      },
      'pt-BR': {
        'demo.sliderLabel': 'Volume',
        'demo.sliderHint': 'Ajuste.',
        'demo.sliderName': 'Volume principal',
        'demo.unit': 'pct',
      },
      'es-419': {
        'demo.sliderLabel': 'Volumen',
        'demo.sliderHint': 'Ajústalo.',
        'demo.sliderName': 'Volumen principal',
        'demo.unit': 'pct',
      },
    },
  });

  const expectedLabel: Record<string, string> = {
    'en-US': 'Volume',
    'pt-BR': 'Volume',
    'es-419': 'Volumen',
  };
  const expectedName: Record<string, string> = {
    'en-US': 'Master volume',
    'pt-BR': 'Volume principal',
    'es-419': 'Volumen principal',
  };

  for (const locale of ['en-US', 'pt-BR', 'es-419'] as const) {
    it(`resolves label, description, aria and unit keys in ${locale}`, () => {
      configure({ translate: localeTranslations(locale) });
      const fixture = TestBed.createComponent(I18nHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.solaris-slider__label')
          ?.textContent,
      ).toContain(expectedLabel[locale]);
      expect(thumbOf(fixture).getAttribute('aria-label')).toBe(
        expectedName[locale],
      );
      expect(
        fixture.nativeElement.querySelector('.solaris-slider__value')
          ?.textContent,
      ).toContain('10pct');
    });
  }
});

describe('SolarisSliderComponent ControlValueAccessor', () => {
  it('writeValue clamps and snaps into range', () => {
    configure();
    const fixture = TestBed.createComponent(SolarisSliderComponent);
    fixture.detectChanges();
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 20);
    fixture.componentRef.setInput('step', 5);
    fixture.componentRef.instance.writeValue(13);
    fixture.detectChanges();
    expect(thumbOf(fixture).getAttribute('aria-valuenow')).toBe('15');
  });

  it('notifies onChange on keyboard and onTouched on blur', () => {
    configure();
    const fixture = TestBed.createComponent(SolarisSliderComponent);
    fixture.detectChanges();
    const instance = fixture.componentRef.instance;
    let changed: number | null = null;
    let touched = false;
    instance.registerOnChange((v: number) => (changed = v));
    instance.registerOnTouched(() => (touched = true));
    pressKey(thumbOf(fixture), 'ArrowRight');
    fixture.detectChanges();
    expect(changed).toBe(51);
    thumbOf(fixture).dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(touched).toBe(true);
  });

  it('setDisabledState toggles the disabled attribute', () => {
    configure();
    const fixture = TestBed.createComponent(SolarisSliderComponent);
    fixture.detectChanges();
    fixture.componentRef.instance.setDisabledState(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-disabled')).toBe(true);
    fixture.componentRef.instance.setDisabledState(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-disabled')).toBe(false);
  });

  it('works with Reactive Forms in both directions', () => {
    configure();
    const fixture = TestBed.createComponent(ReactiveHost);
    fixture.detectChanges();
    expect(thumbOf(fixture).getAttribute('aria-valuenow')).toBe('25');
    pressKey(thumbOf(fixture), 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe(26);
    fixture.componentInstance.control.setValue(40);
    fixture.detectChanges();
    expect(thumbOf(fixture).getAttribute('aria-valuenow')).toBe('40');
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(sliderOf(fixture).hasAttribute('data-disabled')).toBe(true);
  });
});

describe('SolarisSliderComponent showMinMax', () => {
  it('hides the scale bounds by default', () => {
    configure();
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.solaris-slider__min'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.solaris-slider__max'),
    ).toBeNull();
  });

  it('renders the static min/max bounds as aria-hidden decoration', () => {
    configure();
    const fixture = TestBed.createComponent(MinMaxHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const min = el.querySelector('.solaris-slider__min') as HTMLElement;
    const max = el.querySelector('.solaris-slider__max') as HTMLElement;
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
      fixture.nativeElement.querySelector('.solaris-slider__min')?.textContent,
    ).toContain('10 units');
    expect(
      fixture.nativeElement.querySelector('.solaris-slider__max')?.textContent,
    ).toContain('20 units');
  });

  it('appends the unit suffix to the bounds by default', () => {
    configure();
    const fixture = TestBed.createComponent(MinMaxUnitHost);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.solaris-slider__min')?.textContent,
    ).toContain('0kb');
    expect(
      fixture.nativeElement.querySelector('.solaris-slider__max')?.textContent,
    ).toContain('100kb');
  });

  it('places the bounds above and below the track when vertical', () => {
    configure();
    const fixture = TestBed.createComponent(MinMaxVerticalHost);
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector(
      '.solaris-slider__body',
    ) as HTMLElement;
    const order = Array.from(body.children).map(
      (child) => (child as HTMLElement).className,
    );
    const minIndex = order.findIndex((name) =>
      name.includes('solaris-slider__min'),
    );
    const trackIndex = order.findIndex((name) =>
      name.includes('solaris-slider__track'),
    );
    const maxIndex = order.findIndex((name) =>
      name.includes('solaris-slider__max'),
    );
    expect(minIndex).toBeGreaterThanOrEqual(0);
    expect(trackIndex).toBeGreaterThanOrEqual(0);
    expect(maxIndex).toBeGreaterThanOrEqual(0);
    expect(minIndex).toBeLessThan(trackIndex);
    expect(trackIndex).toBeLessThan(maxIndex);
  });
});
