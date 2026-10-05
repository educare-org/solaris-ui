import { test, expect } from '@playwright/test';

test.describe('Avatar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/avatar');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('renders inside the shell with a working aside', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Avatar', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('solaris-avatar').first()).toBeVisible();
    const aside = page.getByRole('navigation', { name: 'On this page' });
    await expect(aside).toBeVisible();
    const statusLink = aside.getByRole('link', { name: 'Status' });
    await statusLink.click();
    await expect(statusLink).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('#status h2')).toBeInViewport();
  });

  test('switches status through tabs', async ({ page }) => {
    const statusSection = page.locator('#status');
    await statusSection.getByRole('tab', { name: 'Busy' }).click();
    await expect(
      statusSection.locator('solaris-avatar[data-status="busy"]'),
    ).toBeVisible();
  });

  test('truncates the group with a focusable overflow pill', async ({
    page,
  }) => {
    const groupSection = page.locator('#group');
    await groupSection.getByRole('tab', { name: '2', exact: true }).click();
    const overflow = groupSection.getByRole('button', { name: /more people/ });
    await expect(overflow).toBeVisible();
    await expect(overflow).toContainText('+3');
    await overflow.focus();
    await expect(overflow).toBeFocused();
  });

  test('collapses the profile in compact mode', async ({ page }) => {
    const profileSection = page.locator('#profile');
    await expect(
      profileSection.locator('solaris-avatar-profile'),
    ).toBeVisible();
    await profileSection
      .getByRole('tab', { name: 'Compact', exact: true })
      .click();
    await expect(
      profileSection.locator('solaris-avatar-profile[data-compact="true"]'),
    ).toBeVisible();
  });
});
