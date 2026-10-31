import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SolarisFormFieldComponent,
  SolarisInputDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

import { ShowcaseThemeToggle } from '../../components/theme-toggle/component/theme-toggle';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    SolarisTranslatePipe,
    SolarisFormFieldComponent,
    SolarisInputDirective,
    ShowcaseThemeToggle,
  ],
  selector: 'app-shell-header',
  templateUrl: './shell-header.html',
  styleUrls: ['./shell-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseShellHeader {
  readonly searchQuery = model<string>('');
  readonly isMobile = input<boolean>(false);

  protected clearSearch(): void {
    this.searchQuery.set('');
  }
}
