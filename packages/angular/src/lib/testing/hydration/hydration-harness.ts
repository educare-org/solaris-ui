import '@angular/compiler';
import type { ApplicationRef, Type } from '@angular/core';
import {
  bootstrapApplication,
  provideClientHydration,
  withEventReplay,
  type BootstrapContext,
} from '@angular/platform-browser';
import {
  provideServerRendering,
  renderApplication,
} from '@angular/platform-server';
import { provideSolarisTesting } from '../provide-solaris-testing';

export interface HydrationReplayInput {
  selector: string;
  value: string;
}

export interface HydrationScenarioOptions {
  replayInput?: HydrationReplayInput;
}

export interface HydrationScenarioResult {
  ssrHtml: string;
  logs: string[];
  threw: string | null;
  appRef: ApplicationRef | null;
}

const HYDRATION_FAILURE_PATTERN =
  /NG0500|NG0501|NG0502|NG0503|NG0504|NG0505|hydrat/i;

function extractBody(html: string): string {
  return html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
}

export async function renderServerHtml(
  host: Type<unknown>,
  tag: string,
): Promise<string> {
  const html = await renderApplication(
    (context: BootstrapContext) =>
      bootstrapApplication(
        host,
        {
          providers: [
            provideClientHydration(),
            provideServerRendering(),
            provideSolarisTesting(),
          ],
        },
        context,
      ),
    {
      document: `<html><head></head><body><${tag}></${tag}></body></html>`,
      url: '/',
    },
  );
  return extractBody(html);
}

export async function hydrateFromHtml(
  host: Type<unknown>,
  ssrHtml: string,
  options: HydrationScenarioOptions = {},
): Promise<HydrationScenarioResult> {
  // SECURITY_EXCEPTION: installing server-rendered HTML into the jsdom
  // document is the harness's explicit purpose; content comes from
  // renderApplication of the component under test, never user input.
  document.body.innerHTML = ssrHtml;

  const replay = options.replayInput;
  const logs: string[] = [];
  const originalError = console.error;
  const originalWarn = console.warn;
  console.error = (...args: unknown[]) => {
    logs.push(`ERROR: ${args.map(String).join(' ').slice(0, 500)}`);
  };
  console.warn = (...args: unknown[]) => {
    logs.push(`WARN: ${args.map(String).join(' ').slice(0, 500)}`);
  };

  let appRef: ApplicationRef | null = null;
  let threw: string | null = null;
  try {
    appRef = await bootstrapApplication(host, {
      providers: [
        provideClientHydration(withEventReplay()),
        provideSolarisTesting(),
      ],
    });
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (replay) {
      const live = document.querySelector<HTMLInputElement>(replay.selector);
      if (!live) {
        throw new Error(
          `[hydration-harness] replay target not found: ${replay.selector}`,
        );
      }
      live.value = replay.value;
      const replayEvent = document.createEvent('Event');
      replayEvent.initEvent('input', true, true);
      live.dispatchEvent(replayEvent);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  } catch (error) {
    threw = String((error as Error)?.message ?? error).slice(0, 500);
  } finally {
    console.error = originalError;
    console.warn = originalWarn;
  }

  return { ssrHtml, logs, threw, appRef };
}

export async function ssrAndHydrate(
  host: Type<unknown>,
  tag: string,
  options: HydrationScenarioOptions = {},
): Promise<HydrationScenarioResult> {
  const ssrHtml = await renderServerHtml(host, tag);
  return hydrateFromHtml(host, ssrHtml, options);
}

export function cleanupHydrationScenario(
  result: HydrationScenarioResult,
): void {
  result.appRef?.destroy();
  result.appRef = null;
  // SECURITY_EXCEPTION: clearing the jsdom document between scenarios; see above.
  document.body.innerHTML = '';
}

export function hydrationFailures(result: HydrationScenarioResult): string[] {
  const failures = result.logs.filter((line) =>
    HYDRATION_FAILURE_PATTERN.test(line),
  );
  if (result.threw) {
    failures.push(`THROW: ${result.threw}`);
  }
  return failures;
}

export function assertHydrationClean(
  result: HydrationScenarioResult,
  scenario: string,
): void {
  const failures = hydrationFailures(result);
  if (failures.length > 0) {
    throw new Error(
      `hydration failures in scenario "${scenario}":\n- ${failures.join('\n- ')}`,
    );
  }
}

export function queryAffix(variant: 'prefix' | 'suffix'): Element | null {
  return document.querySelector(`.solaris-form-field__affix--${variant}`);
}
