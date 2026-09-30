import type { StoryObj } from '@storybook/angular';
import type { SolarisToastEntry } from '../model/toast.types';

function makeEntry(patch: Partial<SolarisToastEntry> = {}): SolarisToastEntry {
  return {
    id: 'story-toast',
    options: {},
    createdAt: Date.now(),
    resolvedVariant: 'neutral',
    resolvedAppearance: 'outline',
    resolvedPosition: 'bottom-center',
    resolvedSize: 'md',
    resolvedDensity: 'normal',
    resolvedDuration: 5000,
    resolvedPersistent: true,
    resolvedCloseable: true,
    resolvedAriaLive: 'polite',
    resolvedRole: 'status',
    resolvedIcon: 'info',
    resolvedTitle: 'Toast',
    resolvedDescription: 'A message.',
    resolvedCloseLabel: undefined,
    resolvedCloseLabelKey: undefined,
    resolvedProgress: undefined,
    resolvedActions: undefined,
    resolvedExpandable: false,
    resolvedDefaultExpanded: false,
    resolvedMaxCollapsedLines: 2,
    resolvedExpandLabel: undefined,
    resolvedExpandLabelKey: undefined,
    resolvedCollapseLabel: undefined,
    resolvedCollapseLabelKey: undefined,
    resolvedCountdown: false,
    resolvedActionsAlign: 'end',
    resolvedIconSize: 'md',
    resolvedMediaShape: 'circle',
    ...patch,
  };
}

type Story = StoryObj<{ entry: SolarisToastEntry }>;

export const Neutral: Story = {
  args: { entry: makeEntry() },
};
export const Success: Story = {
  args: {
    entry: makeEntry({
      resolvedVariant: 'success',
      resolvedIcon: 'success',
      resolvedTitle: 'Saved!',
      resolvedDescription: 'Changes saved.',
    }),
  },
};
export const Danger: Story = {
  args: {
    entry: makeEntry({
      resolvedVariant: 'danger',
      resolvedIcon: 'danger',
      resolvedAriaLive: 'assertive',
      resolvedRole: 'alert',
      resolvedTitle: 'Error',
      resolvedDescription: 'Failed.',
    }),
  },
};
makeEntry({
  resolvedVariant: 'info',
  resolvedCountdown: 'text',
  resolvedDuration: 6000,
  resolvedPersistent: false,
});
makeEntry({ resolvedSize: 'lg', resolvedDensity: 'comfortable' });
