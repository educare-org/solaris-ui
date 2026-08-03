import {
  Component,
  input,
  effect,
  viewChild,
  ViewContainerRef,
  inject,
  HostListener,
  ChangeDetectionStrategy,
  type Type,
  type ComponentRef,
  Injector,
  type Provider,
} from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';

import {
  SOLARIS_DIALOG_REF,
  SOLARIS_DIALOG_DATA,
} from '../../../token/dialog-data.token';
import type {
  SolarisDialogOptions,
  SolarisDialogComponentConfig,
} from '../../root/model/dialog.types';
import { SolarisDialogComponent } from '../../root/component/dialog.component';
import { SolarisDialogRef } from '../../../service/dialog-ref';

@Component({
  selector: 'solaris-dialog-container',
  standalone: true,
  imports: [CdkTrapFocus, SolarisDialogComponent],
  templateUrl: './dialog-container.component.html',
  styleUrls: ['./dialog-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'hostSize',
    class: 'solaris-dialog-container',
    '[attr.data-variant]': 'hostVariant',
    '[attr.data-appearance]': 'hostAppearance',
  },
})
export class SolarisDialogContainerComponent {
  private readonly dialogRef = inject(SOLARIS_DIALOG_REF) as SolarisDialogRef;
  private readonly injector = inject(Injector);

  readonly externalComponent = input<Type<unknown> | null>(null);
  readonly simpleOptions = input<SolarisDialogOptions | null>(null);
  readonly externalComponentConfig = input<SolarisDialogComponentConfig | null>(
    null,
  );

  private readonly _componentHost = viewChild('componentHost', {
    read: ViewContainerRef,
  });

  private componentRef: ComponentRef<unknown> | null = null;

  protected get hostAppearance(): string {
    if (this.simpleOptions())
      return this.simpleOptions()?.appearance ?? 'surface';
    return this.externalComponentConfig()?.appearance ?? 'surface';
  }

  protected get hostSize(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.size ?? 'md';
    return this.externalComponentConfig()?.size ?? 'md';
  }

  protected get hostVariant(): string | undefined | null {
    if (this.simpleOptions()) return this.simpleOptions()?.variant ?? 'neutral';
    return null;
  }

  protected get panelWidth(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.width ?? '';
    return this.externalComponentConfig()?.width ?? '';
  }

  protected get panelHeight(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.height ?? '';
    return this.externalComponentConfig()?.height ?? '';
  }

  protected get panelMinWidth(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.minWidth ?? '';
    return this.externalComponentConfig()?.minWidth ?? '';
  }

  protected get panelMaxWidth(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.maxWidth ?? '';
    return this.externalComponentConfig()?.maxWidth ?? '';
  }

  protected get panelMinHeight(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.minHeight ?? '';
    return this.externalComponentConfig()?.minHeight ?? '';
  }

  protected get panelMaxHeight(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.maxHeight ?? '';
    return this.externalComponentConfig()?.maxHeight ?? '';
  }

  protected get isSimpleMode(): boolean {
    return this.simpleOptions() !== null;
  }

  protected get closeOnBackdrop(): boolean {
    if (this.simpleOptions()) {
      return this.simpleOptions()?.closeOnBackdropClick ?? true;
    }
    return this.externalComponentConfig()?.closeOnBackdropClick ?? true;
  }

  protected get closeOnEscapeEnabled(): boolean {
    if (this.simpleOptions()) {
      return this.simpleOptions()?.closeOnEscape ?? true;
    }
    return this.externalComponentConfig()?.closeOnEscape ?? true;
  }

  protected get dialogRole(): string {
    if (this.simpleOptions()) return this.simpleOptions()?.role ?? 'dialog';
    return this.externalComponentConfig()?.role ?? 'dialog';
  }

  constructor() {
    effect(() => {
      const comp = this.externalComponent();
      const host = this._componentHost();
      if (comp && host) {
        this.createComponentInHost(comp);
      }
    });
  }

  private createComponentInHost(compType: Type<unknown>): void {
    const host = this._componentHost();
    if (!host) return;
    host.clear();

    const providers: Provider[] = [
      { provide: SOLARIS_DIALOG_REF, useValue: this.dialogRef },
    ];
    const data = this.externalComponentConfig()?.data;
    if (data !== undefined) {
      providers.push({ provide: SOLARIS_DIALOG_DATA, useValue: data });
    }

    const injector = Injector.create({
      providers,
      parent: this.injector,
    });

    this.componentRef = host.createComponent(compType, {
      injector,
    });

    this.dialogRef.componentInstance = this.componentRef.instance;
  }

  @HostListener('document:keydown.escape')
  protected onEscapePress(): void {
    if (this.closeOnEscapeEnabled) {
      this.dialogRef.close();
    }
  }

  protected onBackdropClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (
      this.closeOnBackdrop &&
      target.classList.contains('solaris-dialog-backdrop')
    ) {
      this.dialogRef.close();
    }
  }
}
