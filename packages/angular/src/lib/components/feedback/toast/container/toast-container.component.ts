import {
  Component,
  inject,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisToastComponent } from '../component/toast.component';
import type { SolarisToastPosition } from '../model/toast.types';
import { SolarisToastService } from '../service/toast.service';

@Component({
  selector: 'solaris-toast-container',
  standalone: true,
  imports: [SolarisToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-toast-container',
    '[attr.data-position]': 'position()',
  },
})
export class SolarisToastContainerComponent {
  private readonly toastService = inject(SolarisToastService);

  readonly position = input<SolarisToastPosition>('bottom-center');

  readonly entries = computed(() =>
    this.toastService
      .entries()
      .filter((e) => e.resolvedPosition === this.position()),
  );

  protected dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
