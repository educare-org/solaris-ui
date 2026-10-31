import type { IntroductionShowcaseItem } from '../model/introduction-showcase.data';

export interface IntroductionShowcaseMarkdownSections {
  readonly principles: readonly IntroductionShowcaseItem[];
  readonly contracts: readonly IntroductionShowcaseItem[];
  readonly next: readonly { titleKey: string; descriptionKey: string }[];
}

export function buildIntroductionMarkdown(
  translate: (key: string) => string,
  sections: IntroductionShowcaseMarkdownSections,
): string {
  const lines = [
    `# ${translate('introduction.title')}`,
    '',
    translate('introduction.description'),
    '',
    `## ${translate('introduction.section.principles')}`,
    '',
    translate('introduction.principles.note'),
    '',
  ];

  for (const item of sections.principles) {
    lines.push(
      `### ${translate(item.titleKey)}`,
      '',
      translate(item.descriptionKey),
      '',
    );
  }

  lines.push(
    `## ${translate('introduction.section.contracts')}`,
    '',
    translate('introduction.contracts.note'),
    '',
  );

  for (const item of sections.contracts) {
    lines.push(
      `### ${translate(item.titleKey)}`,
      '',
      translate(item.descriptionKey),
      '',
    );
  }

  lines.push(
    `## ${translate('introduction.section.next')}`,
    '',
    translate('introduction.next.note'),
    '',
  );

  for (const item of sections.next) {
    lines.push(
      `### ${translate(item.titleKey)}`,
      '',
      translate(item.descriptionKey),
      '',
    );
  }

  return lines.join('\n');
}
