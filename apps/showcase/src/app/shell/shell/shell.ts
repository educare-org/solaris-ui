import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SolarisTranslatePipe } from '@solaris-ui/angular';

import { ShowcaseShellHeader } from '../shell-header/shell-header';
import { ShowcaseShellSidebar } from '../shell-sidebar/shell-sidebar';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    SolarisTranslatePipe,
    ShowcaseShellHeader,
    ShowcaseShellSidebar,
  ],
  selector: 'app-shell',
  templateUrl: './shell.html',
  styleUrls: ['./shell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseShell {
  protected readonly searchQuery = signal<string>('');
  protected readonly sidebarOpen = signal<boolean>(false);

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
