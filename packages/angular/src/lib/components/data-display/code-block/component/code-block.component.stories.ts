import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisCodeBlockComponent } from './code-block.component';

const meta: Meta<SolarisCodeBlockComponent> = {
  component: SolarisCodeBlockComponent,
  title: 'Data Display/Code Block',
  render: (args) => ({
    props: args,
    template: `<solaris-code-block [code]="code" [language]="language" [editable]="editable" [expandable]="expandable" [collapsedLines]="collapsedLines" />`,
  }),
};
export default meta;

type Story = StoryObj<SolarisCodeBlockComponent>;

export const Basic: Story = {
  args: {
    code: 'const answer = 42;',
    language: 'typescript',
  },
};

export const Command: Story = {
  args: {
    variant: 'command',
    commands: [
      {
        id: 'pnpm',
        label: 'pnpm',
        code: 'pnpm add @educarehq/solaris-ui',
        language: 'shell',
      },
      {
        id: 'npm',
        label: 'npm',
        code: 'npm install @educarehq/solaris-ui',
        language: 'shell',
      },
    ],
  },
};

export const Inline: Story = {
  args: {
    layout: 'inline',
    code: 'pnpm nx build angular',
    language: 'shell',
  },
};

export const Expandable: Story = {
  args: {
    code: [
      'const answer = 42;',
      'function greet(name: string) {',
      '  return `Hello ${name}`;',
      '}',
      "console.log(greet('Solaris'));",
      "console.log(greet('Educare'));",
      "console.log(greet('Docs'));",
      "console.log(greet('Tokens'));",
      "console.log(greet('Signals'));",
      "console.log(greet('Standalone'));",
    ].join('\n'),
    language: 'typescript',
    expandable: true,
    collapsedLines: 4,
  },
};

export const Editable: Story = {
  args: {
    code: 'const answer = 42;',
    language: 'typescript',
    editable: true,
  },
};
