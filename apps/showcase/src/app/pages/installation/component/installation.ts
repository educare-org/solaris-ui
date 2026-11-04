import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../shell/docs-section/docs-section';

import {
  copyShowcaseText,
  downloadShowcaseMarkdown,
  openShowcaseAiAssistant,
} from '../../shared/showcase-page-utils';
import {
  buildInstallationMarkdown,
  buildInstallationProvidersCode,
  type InstallationProvidersVariant,
} from '../functions/installation-showcase-snippets';
import {
  INSTALLATION_SHOWCASE_BREADCRUMBS,
  INSTALLATION_SHOWCASE_GLOBAL_STYLE_CODE,
  INSTALLATION_SHOWCASE_INSTALL_COMMANDS,
  INSTALLATION_SHOWCASE_NEXT,
  INSTALLATION_SHOWCASE_NX_COMMANDS,
  INSTALLATION_SHOWCASE_PREV,
  INSTALLATION_SHOWCASE_SCHEMATIC_COMMANDS,
  INSTALLATION_SHOWCASE_SLUG,
  INSTALLATION_SHOWCASE_STYLE_CODE,
  INSTALLATION_SHOWCASE_TOC_ITEMS,
  INSTALLATION_SHOWCASE_TRANSLATE_CODE,
  INSTALLATION_SHOWCASE_VERIFY_COMMANDS,
  INSTALLATION_TRANSLATION_PREFIX,
} from '../model/installation-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './installation.html',
  styleUrls: ['./installation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallationShowcasePage {
  private readonly document = inject(DOCUMENT);
  private readonly translateService = inject(SolarisTranslateService);

  protected readonly breadcrumbs = INSTALLATION_SHOWCASE_BREADCRUMBS;
  protected readonly prev = INSTALLATION_SHOWCASE_PREV;
  protected readonly next = INSTALLATION_SHOWCASE_NEXT;
  protected readonly tocItems = INSTALLATION_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = INSTALLATION_SHOWCASE_INSTALL_COMMANDS;
  protected readonly schematicCommands =
    INSTALLATION_SHOWCASE_SCHEMATIC_COMMANDS;
  protected readonly nxCommands = INSTALLATION_SHOWCASE_NX_COMMANDS;
  protected readonly verifyCommands = INSTALLATION_SHOWCASE_VERIFY_COMMANDS;

  protected readonly styleCode = INSTALLATION_SHOWCASE_STYLE_CODE;
  protected readonly globalStyleCode = INSTALLATION_SHOWCASE_GLOBAL_STYLE_CODE;
  protected readonly translateCode = INSTALLATION_SHOWCASE_TRANSLATE_CODE;

  protected readonly selectedProviders =
    signal<InstallationProvidersVariant>('basic');

  protected readonly providersCode = computed(() =>
    buildInstallationProvidersCode(this.selectedProviders()),
  );

  protected copyPageAsMarkdown(): void {
    void copyShowcaseText(this.document, this.buildMarkdown());
  }

  protected downloadPageAsMarkdown(): void {
    downloadShowcaseMarkdown(
      this.document,
      INSTALLATION_SHOWCASE_SLUG,
      this.buildMarkdown(),
    );
  }

  protected openInChatGpt(): void {
    openShowcaseAiAssistant(
      this.document,
      this.translateService,
      INSTALLATION_TRANSLATION_PREFIX,
      'https://chatgpt.com/?q=',
    );
  }

  protected openInClaude(): void {
    openShowcaseAiAssistant(
      this.document,
      this.translateService,
      INSTALLATION_TRANSLATION_PREFIX,
      'https://claude.ai/new?q=',
    );
  }

  private buildMarkdown(): string {
    const translate = (key: string): string =>
      this.translateService.translate(key);
    return buildInstallationMarkdown(translate, {
      schematicCode: this.schematicCommands[0].code,
      nxCode: this.nxCommands[0].code,
      styleCode: this.styleCode,
      globalStyleCode: this.globalStyleCode,
      basicProvidersCode: buildInstallationProvidersCode('basic'),
      themeProvidersCode: buildInstallationProvidersCode('theme'),
      translateProvidersCode: buildInstallationProvidersCode('translate'),
      translateCode: this.translateCode,
      verifyCode: this.verifyCommands[0].code,
    });
  }
}
