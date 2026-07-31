import { SchematicsException, type Tree } from '@angular-devkit/schematics';

export interface WorkspaceProject {
  name: string;
  root: string;
  projectType?: string;
}

export interface Workspace {
  defaultProject?: string;
  projects: Record<string, { root: string; projectType?: string }>;
}

function stripJsonComments(content: string): string {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

export function getWorkspace(tree: Tree): Workspace | null {
  for (const file of ['angular.json', 'workspace.json']) {
    if (tree.exists(file)) {
      try {
        const parsed = JSON.parse(stripJsonComments(tree.readText(file)));
        if (parsed?.projects) {
          return parsed;
        }
      } catch {
        throw new SchematicsException(`Failed to parse ${file}`);
      }
    }
  }
  return null;
}

export function getProject(tree: Tree, projectName?: string): WorkspaceProject {
  const workspace = getWorkspace(tree);
  if (!workspace) {
    throw new SchematicsException(
      'No angular.json or workspace.json found. Run this schematic inside an Angular workspace.',
    );
  }

  const name = projectName ?? workspace.defaultProject;
  if (!name) {
    throw new SchematicsException(
      'No project name provided and no default project found in the workspace.',
    );
  }

  const project = workspace.projects[name];
  if (!project) {
    throw new SchematicsException(
      `Project "${name}" not found in the workspace.`,
    );
  }

  return { name, root: project.root ?? '', projectType: project.projectType };
}

export function getProjectTargetPath(tree: Tree, projectName?: string): string {
  return getProject(tree, projectName).root;
}
