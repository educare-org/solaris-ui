import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import {
  SolarisAnimatedIconComponent,
  SolarisIconButtonDirective,
  SolarisMenuToggleDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

import { ShowcaseThemeToggle } from '../../components/theme-toggle/component/theme-toggle';
import { ShowcaseShellHeader } from '../shell-header/shell-header';
import { ShowcaseShellSidebar } from '../shell-sidebar/shell-sidebar';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    SolarisTranslatePipe,
    SolarisIconButtonDirective,
    SolarisMenuToggleDirective,
    SolarisAnimatedIconComponent,
    ShowcaseThemeToggle,
    ShowcaseShellHeader,
    ShowcaseShellSidebar,
  ],
  selector: 'app-shell',
  templateUrl: './shell.html',
  styleUrls: ['./shell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseShell {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly searchQuery = signal<string>('');
  protected readonly sidebarOpen = signal<boolean>(false);
  protected readonly isMobile = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (!this.isBrowser) {
        return;
      }
      this.document.body.style.overflow = this.sidebarOpen() ? 'hidden' : '';
    });
    if (this.isBrowser) {
      const media =
        this.document.defaultView?.matchMedia?.('(max-width: 768px)');
      if (media) {
        this.isMobile.set(media.matches);
        const onChange = (event: MediaQueryListEvent): void => {
          this.isMobile.set(event.matches);
        };
        media.addEventListener('change', onChange);
        this.destroyRef.onDestroy(() =>
          media.removeEventListener('change', onChange),
        );
      }
    }
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
