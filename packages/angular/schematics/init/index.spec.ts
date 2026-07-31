import { HostTree, type Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const COLLECTION_PATH = path.join(
  process.cwd(),
  'dist',
  'packages',
  'angular',
  'schematics',
  'collection.json',
);

const WORKSPACE = {
  version: 1,
  newProjectRoot: 'projects',
  defaultProject: 'app',
  projects: {
    app: {
      root: '',
      projectType: 'application',
    },
    lib: {
      root: 'projects/lib',
      projectType: 'library',
    },
  },
};

function createWorkspaceTree(): Tree {
  const tree = new HostTree();
  tree.create('angular.json', JSON.stringify(WORKSPACE, null, 2));
  tree.create('src/styles.scss', `body {\n  margin: 0;\n}\n`);
  tree.create(
    'src/app/app.config.ts',
    `import { ApplicationConfig } from '@angular/core';\n\n` +
      `export const appConfig: ApplicationConfig = {\n` +
      `  providers: [],\n` +
      `};\n`,
  );
  return tree;
}

async function runInit(
  options: Record<string, unknown>,
  tree: Tree = createWorkspaceTree(),
): Promise<UnitTestTree> {
  const runner = new SchematicTestRunner('solaris-ui', COLLECTION_PATH);
  return runner.runSchematic('init', options, tree);
}

describe('init schematic', () => {
  it('creates src/styles/solaris.scss', async () => {
    const tree = await runInit({});

    expect(tree.exists('src/styles/solaris.scss')).toBe(true);
    const content = tree.readContent('src/styles/solaris.scss');
    expect(content).toContain(
      "@use '@educarehq/solaris-ui/styles' as solaris;",
    );
    expect(content).toContain('@include solaris.core();');
    expect(content).toContain('@include solaris.theme(');
  });

  it('applies theme options to solaris.scss', async () => {
    const tree = await runInit({
      colorScheme: 'dark',
      density: 'compact',
      radius: 'lg',
    });

    const content = tree.readContent('src/styles/solaris.scss');
    expect(content).toContain('color-scheme: dark,');
    expect(content).toContain('density: compact,');
    expect(content).toContain('radius: lg,');
  });

  it('maps reducedMotion reduce to motion reduce', async () => {
    const tree = await runInit({ reducedMotion: 'reduce' });

    const content = tree.readContent('src/styles/solaris.scss');
    expect(content).toContain('motion: reduce,');
  });

  it('imports solaris styles from the global stylesheet', async () => {
    const tree = await runInit({});

    const content = tree.readContent('src/styles.scss');
    expect(content).toContain("@use './styles/solaris';");
  });

  it('does not import twice when already present', async () => {
    const tree = createWorkspaceTree();
    tree.overwrite(
      'src/styles.scss',
      `@use './styles/solaris';\n\nbody {\n  margin: 0;\n}\n`,
    );

    const result = await runInit({}, tree);
    const content = result.readContent('src/styles.scss');
    expect(content.match(/@use '\.\/styles\/solaris';/g)).toHaveLength(1);
  });

  it('adds provideSolaris() to app.config.ts', async () => {
    const tree = await runInit({});

    const content = tree.readContent('src/app/app.config.ts');
    expect(content).toContain(
      "import { provideSolaris } from '@educarehq/solaris-ui';",
    );
    expect(content).toMatch(/provideSolaris\(\),/);
  });

  it('adds theme config to provideSolaris when options provided', async () => {
    const tree = await runInit({
      colorScheme: 'dark',
      density: 'compact',
    });

    const content = tree.readContent('src/app/app.config.ts');
    expect(content).toContain('provideSolaris({');
    expect(content).toContain("colorScheme: 'dark'");
    expect(content).toContain("density: 'compact'");
  });

  it('does not add provideSolaris twice', async () => {
    const tree = createWorkspaceTree();
    tree.overwrite(
      'src/app/app.config.ts',
      `import { ApplicationConfig } from '@angular/core';\n` +
        `import { provideSolaris } from '@educarehq/solaris-ui';\n\n` +
        `export const appConfig: ApplicationConfig = {\n` +
        `  providers: [provideSolaris()],\n` +
        `};\n`,
    );

    const result = await runInit({}, tree);
    const content = result.readContent('src/app/app.config.ts');
    expect(content.match(/provideSolaris/g)).toHaveLength(2);
  });

  it('respects skipStyles', async () => {
    const tree = await runInit({ skipStyles: true });

    expect(tree.exists('src/styles/solaris.scss')).toBe(false);
  });

  it('respects skipProviders', async () => {
    const tree = await runInit({ skipProviders: true });

    const content = tree.readContent('src/app/app.config.ts');
    expect(content).not.toContain('provideSolaris');
  });

  it('resolves the project from angular.json', async () => {
    const tree = await runInit({}, createWorkspaceTree());

    const content = tree.readContent('src/app/app.config.ts');
    expect(content).toContain('provideSolaris');
  });

  it('throws when no workspace file exists', async () => {
    const runner = new SchematicTestRunner('solaris-ui', COLLECTION_PATH);
    await expect(
      runner.runSchematic('init', {}, new HostTree()),
    ).rejects.toThrow(/No angular\.json or workspace\.json/);
  });
});

describe('ng-add schematic', () => {
  it('delegates to init', async () => {
    const tree = createWorkspaceTree();
    const runner = new SchematicTestRunner('solaris-ui', COLLECTION_PATH);
    const result = await runner.runSchematic('ng-add', {}, tree);

    expect(result.exists('src/styles/solaris.scss')).toBe(true);
    expect(result.readContent('src/app/app.config.ts')).toContain(
      'provideSolaris',
    );
  });

  it('removes legacy component style imports', async () => {
    const tree = createWorkspaceTree();
    tree.overwrite(
      'src/styles.scss',
      `@use '@educarehq/solaris-ui/styles/button';\n` +
        `@use '@educarehq/solaris-ui/styles/toast';\n\n` +
        `body {\n  margin: 0;\n}\n`,
    );

    const runner = new SchematicTestRunner('solaris-ui', COLLECTION_PATH);
    const result = await runner.runSchematic('ng-add', {}, tree);

    const content = result.readContent('src/styles.scss');
    expect(content).not.toContain('styles/button');
    expect(content).not.toContain('styles/toast');
  });
});
