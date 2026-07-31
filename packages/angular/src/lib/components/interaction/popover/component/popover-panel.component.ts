import {
  Component,
  inject,
  AfterViewInit,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import {
  SOLARIS_POPOVER_PANEL_DATA,
  type SolarisPopoverPanelData,
} from '../token/popover.tokens';

@Component({
  selector: 'solaris-popover-panel',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './popover-panel.component.html',
  styleUrls: ['./popover-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-popover-panel',
    '[attr.tabindex]': 'data.autoFocus === "panel" ? "-1" : null',
  },
})
export class SolarisPopoverPanelComponent implements AfterViewInit {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly data: SolarisPopoverPanelData = inject(SOLARIS_POPOVER_PANEL_DATA);

  ngAfterViewInit(): void {
    if (this.data.autoFocus === 'panel') {
      // SECURITY_EXCEPTION: nativeElement.focus() required for autoFocus='panel'. SSR-safe via ElementRef.
      (this.elementRef as ElementRef<HTMLElement>).nativeElement.focus();
    } else if (this.data.autoFocus === 'first-tabbable') {
      const firstTabbable = (
        this.elementRef as ElementRef<HTMLElement>
      ).nativeElement // SECURITY_EXCEPTION: nativeElement.querySelector needed for autoFocus='first-tabbable'. Standard query only.
        .querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
      firstTabbable?.focus();
    }
  }
}
