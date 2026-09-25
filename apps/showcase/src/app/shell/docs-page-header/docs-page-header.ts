import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisButtonGroupComponent,
  SolarisButtonIconDirective,
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuTriggerDirective,
  SolarisIconButtonDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

export interface ShowcaseDocsBreadcrumb {
  readonly labelKey?: string;
  readonly label?: string;
  readonly route?: string;
}

export interface ShowcaseDocsPageNav {
  readonly labelKey?: string;
  readonly label?: string;
  readonly route: string;
}

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisButtonGroupComponent,
    SolarisButtonIconDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
    SolarisDropdownMenuTriggerDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
    SolarisIconButtonDirective,
  ],
  selector: 'app-docs-page-header',
  templateUrl: './docs-page-header.html',
  styleUrls: ['./docs-page-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseDocsPageHeader {
  readonly eyebrowKey = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly titleKey = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly descriptionKey = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly breadcrumbs = input<readonly ShowcaseDocsBreadcrumb[]>([]);

  readonly prev = input<ShowcaseDocsPageNav | undefined>(undefined);
  readonly next = input<ShowcaseDocsPageNav | undefined>(undefined);
  readonly copyable = input<boolean>(false);

  readonly copyPage = output<void>();
  readonly viewMarkdown = output<void>();
  readonly openChatGpt = output<void>();
  readonly openClaude = output<void>();
}
