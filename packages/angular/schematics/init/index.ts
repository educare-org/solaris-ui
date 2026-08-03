import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { buildFontSizeComment } from './fonts';
import { logChange, logInfo, logSkip, logSuccess } from './messages';
import {
  getAppConfigPath,
  updateAppConfig,
  type SolarisProviderOptions,
} from './providers';
import {
  createSolarisStyleFile,
  getGlobalStylesPath,
  importSolarisStyleFromGlobal,
  type SolarisStyleOptions,
} from './styles';
import { getProject } from './workspace';

export interface InitOptions {
  project?: string;
  colorScheme?: 'light' | 'dark' | 'system';
  density?: 'comfortable' | 'compact';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  reducedMotion?: 'auto' | 'reduce' | 'no-preference';
  skipStyles?: boolean;
  skipProviders?: boolean;
}

function styleOptions(options: InitOptions): SolarisStyleOptions {
  return {
    colorScheme: options.colorScheme,
    density: options.density,
    radius: options.radius,
    motion: options.reducedMotion === 'reduce' ? 'reduce' : 'auto',
  };
}

function providerOptions(options: InitOptions): SolarisProviderOptions {
  return {
    colorScheme: options.colorScheme,
    density: options.density,
    reducedMotion: options.reducedMotion,
  };
}

export function init(options: InitOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    logInfo(context, 'Setting up Solaris UI...');
    const project = getProject(tree, options.project);
    const projectRoot = project.root;

    if (!options.skipStyles) {
      // 1. Create editable src/styles/solaris.scss
      const solarisStylePath = createSolarisStyleFile(
        tree,
        projectRoot,
        styleOptions(options),
      );
      logChange(context, `Created style setup file: ${solarisStylePath}`);

      // 2. Import it from the global styles entry
      const globalStylesPath = getGlobalStylesPath(tree, projectRoot);
      if (globalStylesPath) {
        const changed = importSolarisStyleFromGlobal(
          tree,
          globalStylesPath,
          solarisStylePath,
        );
        if (changed) {
          logChange(
            context,
            `Imported Solaris styles from ${globalStylesPath}`,
          );
        } else {
          logSkip(
            context,
            `Solaris styles already imported in ${globalStylesPath}`,
          );
        }
      } else {
        logInfo(
          context,
          'No global styles file found. Import solaris.scss from your global styles entry.',
        );
      }
    } else {
      logSkip(context, 'Skipping style setup (skipStyles).');
    }

    if (!options.skipProviders) {
      // 3. Add provideSolaris(...) to the application config
      const appConfigPath = getAppConfigPath(tree, projectRoot);
      if (appConfigPath) {
        const changed = updateAppConfig(
          tree,
          appConfigPath,
          providerOptions(options),
        );
        if (changed) {
          logChange(context, `Added provideSolaris(...) to ${appConfigPath}`);
        } else {
          logSkip(
            context,
            `provideSolaris already present in ${appConfigPath}`,
          );
        }
      } else {
        logInfo(
          context,
          'No app.config.ts found. Add provideSolaris(...) to your application providers.',
        );
      }
    } else {
      logSkip(context, 'Skipping provider setup (skipProviders).');
    }

    if (!options.skipStyles) {
      const comment = buildFontSizeComment({});
      logInfo(context, comment);
    }

    logSuccess(context, 'Solaris UI setup complete.');
    return tree;
  };
}
