import type { SchematicContext } from '@angular-devkit/schematics';

function prefix(message: string, symbol: string): string {
  return `${symbol} ${message}`;
}

export function logInfo(context: SchematicContext, message: string): void {
  context.logger.info(prefix(message, 'ℹ'));
}

export function logChange(context: SchematicContext, message: string): void {
  context.logger.info(prefix(message, '✏️'));
}

export function logSuccess(context: SchematicContext, message: string): void {
  context.logger.info(prefix(message, '✅'));
}

export function logSkip(context: SchematicContext, message: string): void {
  context.logger.info(prefix(message, '⏭️'));
}

export function logError(context: SchematicContext, message: string): void {
  context.logger.error(prefix(message, '❌'));
}
