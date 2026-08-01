import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/**/*.stories.ts',
          ],
          ignoredDependencies: [
            '@angular/common',
            '@angular/core',
            '@angular-devkit/schematics',
            '@storybook/angular',
            'storybook',
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'solaris',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['lib', 'solaris'],
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
  {
    files: [
      '**/forms/checkbox-group/component/checkbox-group.component.ts',
      '**/forms/radio-group/component/radio-group.component.ts',
      '**/forms/switch-group/component/switch-group.component.ts',
    ],
    rules: {
      '@angular-eslint/no-output-native': 'off',
    },
  },
];
