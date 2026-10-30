import nx from '@nx/eslint-plugin';
import angular from 'angular-eslint';
import solaris from './tools/eslint-plugin-solaris/index.mjs';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/storybook-static',
      '.nx',
      'tools/generators/**/files/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    plugins: {
      '@angular-eslint': angular.tsPlugin,
    },
    // Override or add rules here
    rules: {
      '@angular-eslint/no-input-rename': 'off',
    },
  },
  {
    files: ['packages/angular/src/lib/**/*.ts'],
    ignores: [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.stories.ts',
      '**/testing/**',
      '**/solaris-translate-defaults.ts',
      '**/services/translation/model/i18n/**',
    ],
    plugins: {
      solaris,
    },
    rules: {
      'solaris/no-hardcoded-i18n-text': 'error',
      'solaris/no-dangerous-security-patterns': 'error',
    },
  },
  {
    files: [
      'packages/angular/src/lib/**/*.ts',
      'apps/showcase/src/app/**/*.ts',
    ],
    ignores: [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.stories.ts',
      '**/testing/**',
    ],
    plugins: {
      solaris,
    },
    rules: {
      'solaris/no-forbidden-lib-imports': 'error',
    },
  },
];
