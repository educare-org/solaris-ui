import type {
  SolarisCodeBlockCommand,
  SolarisTranslateService,
} from '@solaris-ui/angular';

/**
 * Utilitários compartilhados das páginas showcase.
 *
 * Centraliza tudo que se repetia (literalmente) nas 7 páginas migradas
 * para o padrão de apresentação (button, segmented-control, tabs,
 * tooltip, popover, preview-code, code-block):
 * - `SHOWCASE_INSTALL_COMMANDS` (pnpm/npm, pacote único)
 * - serialização da página como Markdown (Copy Page / View as Markdown)
 * - abertura do prompt nos assistentes de IA (ChatGPT / Claude)
 * - copy/download via `DOCUMENT`
 *
 * Dados específicos de cada página (breadcrumbs, prev/next, tocItems,
 * importCode e snippets estáticos) continuam em
 * `pages/<categoria>/<nome>/model/<nome>-showcase.data.ts`.
 * O componente mantém apenas signals, computed dinâmicos e as
 * delegações finas para estas factories.
 */

export const SHOWCASE_INSTALL_PACKAGE = '@educarehq/solaris-ui';

export const SHOWCASE_INSTALL_COMMANDS: readonly SolarisCodeBlockCommand[] = [
  {
    id: 'pnpm',
    label: 'pnpm',
    code: `pnpm add ${SHOWCASE_INSTALL_PACKAGE}`,
    language: 'shell',
  },
  {
    id: 'npm',
    label: 'npm',
    code: `npm install ${SHOWCASE_INSTALL_PACKAGE}`,
    language: 'shell',
  },
];

export interface ShowcasePageMarkdownOptions {
  /** Prefixo das chaves i18n, ex: `button`, `tabs`, `code-block`. */
  readonly translationPrefix: string;
  /** Snippet de import exibido na seção de instalação. */
  readonly importCode: string;
  /** Snippet do exemplo básico (seção examples). Omitido quando a página não tem um único basic. */
  readonly basicCode?: string;
  /** Linguagem do bloco do exemplo básico. Padrão: `html`. */
  readonly basicLanguage?: string;
}

export function buildShowcasePageMarkdown(
  translate: (key: string) => string,
  options: ShowcasePageMarkdownOptions,
): string {
  const { translationPrefix, importCode, basicCode, basicLanguage } = options;
  const lines = [
    `# ${translate(`${translationPrefix}.title`)}`,
    '',
    translate(`${translationPrefix}.description`),
    '',
    `## ${translate(`${translationPrefix}.section.examples`)}`,
    '',
    translate(`${translationPrefix}.examples.note`),
    '',
  ];

  if (basicCode) {
    lines.push('```' + (basicLanguage ?? 'html'), basicCode, '```', '');
  }

  lines.push(
    `## ${translate(`${translationPrefix}.section.installation`)}`,
    '',
    translate(`${translationPrefix}.installation.note`),
    '',
    '```sh',
    `pnpm add ${SHOWCASE_INSTALL_PACKAGE}`,
    '```',
    '',
    '```ts',
    importCode,
    '```',
    '',
    `## ${translate(`${translationPrefix}.section.props`)}`,
    '',
    translate(`${translationPrefix}.props.note`),
    '',
  );

  return lines.join('\n');
}

export async function copyShowcaseText(
  document: Document,
  value: string,
): Promise<void> {
  const view = document.defaultView;

  if (!view?.navigator.clipboard) {
    throw new Error('Clipboard API is not available.');
  }

  await view.navigator.clipboard.writeText(value);
}

export function downloadShowcaseMarkdown(
  document: Document,
  slug: string,
  markdown: string,
): void {
  const view = document.defaultView;
  if (!view) {
    return;
  }
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = view.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${slug}.md`;
  anchor.click();
  view.URL.revokeObjectURL(url);
}

export function openShowcaseAiAssistant(
  document: Document,
  translateService: SolarisTranslateService,
  translationPrefix: string,
  baseUrl: string,
): void {
  const view = document.defaultView;
  if (!view) {
    return;
  }
  const prompt = translateService.translate(`${translationPrefix}.ai.prompt`, {
    component: translateService.translate(`${translationPrefix}.title`),
    url: view.location.href,
  });
  view.open(`${baseUrl}${encodeURIComponent(prompt)}`, '_blank', 'noopener');
}

export interface ShowcasePageActionsOptions
  extends ShowcasePageMarkdownOptions {
  /** Slug usado no nome do arquivo `.md` (ex: `segmented-control`). */
  readonly slug: string;
}

export interface ShowcasePageActions {
  copyPageAsMarkdown(): void;
  downloadPageAsMarkdown(): void;
  openInChatGpt(): void;
  openInClaude(): void;
}

/**
 * Factory das page actions. O componente injeta `SolarisTranslateService`
 * + `DOCUMENT` e delega os handlers do header/footer para o objeto retornado,
 * mantendo no componente apenas wrappers finos (exigidos pelo template).
 */
export function createShowcasePageActions(
  translateService: SolarisTranslateService,
  document: Document,
  options: ShowcasePageActionsOptions,
): ShowcasePageActions {
  const translate = (key: string): string => translateService.translate(key);
  const build = (): string => buildShowcasePageMarkdown(translate, options);

  return {
    copyPageAsMarkdown(): void {
      void copyShowcaseText(document, build());
    },
    downloadPageAsMarkdown(): void {
      downloadShowcaseMarkdown(document, options.slug, build());
    },
    openInChatGpt(): void {
      openShowcaseAiAssistant(
        document,
        translateService,
        options.translationPrefix,
        'https://chatgpt.com/?q=',
      );
    },
    openInClaude(): void {
      openShowcaseAiAssistant(
        document,
        translateService,
        options.translationPrefix,
        'https://claude.ai/new?q=',
      );
    },
  };
}
