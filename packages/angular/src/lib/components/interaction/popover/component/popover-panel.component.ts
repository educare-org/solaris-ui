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

// SECURITY_EXCEPTION_FILE: nativeElement.focus() and querySelector are required for autoFocus behavior. Standard DOM API, read-only and SSR-safe via ElementRef.

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
    '[attr.data-appearance]': 'data.appearance',
    '[attr.data-padding]': 'data.padding',
    '[attr.data-radius]': 'data.radius',
    '[attr.data-scrollable]': 'data.maxHeight ? "" : null',
    '[style.max-height]': 'data.maxHeight ?? null',
  },
})
export class SolarisPopoverPanelComponent implements AfterViewInit {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly data: SolarisPopoverPanelData = inject(SOLARIS_POPOVER_PANEL_DATA);

  ngAfterViewInit(): void {
    if (this.data.autoFocus === 'panel') {
      (this.elementRef as ElementRef<HTMLElement>).nativeElement.focus();
    } else if (this.data.autoFocus === 'first-tabbable') {
      const firstTabbable = (
        this.elementRef as ElementRef<HTMLElement>
      ).nativeElement.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstTabbable?.focus();
    }
  }
}
