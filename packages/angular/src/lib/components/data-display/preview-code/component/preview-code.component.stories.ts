import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisPreviewCodeComponent } from './preview-code.component';

const meta: Meta<SolarisPreviewCodeComponent> = {
  component: SolarisPreviewCodeComponent,
  title: 'Data Display/Preview Code',
  render: (args) => ({
    props: args,
    template: `<solaris-preview-code [code]="code" [language]="language" [defaultTab]="defaultTab" [previewAlign]="previewAlign" [previewMinHeight]="previewMinHeight" [previewPadding]="previewPadding"><button solaris-button>Save</button></solaris-preview-code>`,
  }),
};
export default meta;

type Story = StoryObj<SolarisPreviewCodeComponent>;

export const Basic: Story = {
  args: {
    code: '<button solaris-button>Save</button>',
    language: 'html',
  },
};

export const CodeTab: Story = {
  args: {
    code: '<button solaris-button>Save</button>',
    language: 'html',
    defaultTab: 'code',
  },
};

export const MultipleFiles: Story = {
  args: {
    codeFiles: [
      {
        id: 'html',
        label: 'HTML',
        language: 'html',
        code: '<button solaris-button>Save</button>',
      },
      {
        id: 'ts',
        label: 'TypeScript',
        language: 'typescript',
        code: "import { SolarisButtonDirective } from '@solaris-ui/angular';",
      },
    ],
    defaultCodeFile: 'ts',
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
    codeExpandable: true,
    codeCollapsedLines: 4,
  },
};
