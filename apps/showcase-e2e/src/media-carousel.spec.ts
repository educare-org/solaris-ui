import { test, expect } from '@playwright/test';

test.use({ locale: 'en-US' });

test.describe('Media carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interaction/media-carousel');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('renders inside the shell with carousel semantics', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Media carousel', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    const region = page
      .locator('#examples')
      .getByRole('region', { name: 'Featured stories' });
    await expect(region).toBeVisible();
    await expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    await expect(region.getByRole('group', { name: '1 of 3' })).toBeVisible();
  });

  test('navigates slides with arrows and dots', async ({ page }) => {
    const basicSection = page.locator('#examples');
    const region = basicSection.getByRole('region', {
      name: 'Featured stories',
    });
    await region.getByRole('button', { name: 'Next slide' }).click();
    await expect(
      region.getByRole('group', { name: '2 of 3' }),
    ).not.toHaveAttribute('aria-hidden', 'true');
    await region.getByRole('button', { name: 'Go to slide 3 of 3' }).click();
    await expect(
      region.getByRole('group', { name: '3 of 3' }),
    ).not.toHaveAttribute('aria-hidden', 'true');
    await region.getByRole('button', { name: 'Previous slide' }).click();
    await expect(
      region.getByRole('group', { name: '2 of 3' }),
    ).not.toHaveAttribute('aria-hidden', 'true');
  });

  test('moves with keyboard arrows and Home/End', async ({ page }) => {
    const examples = page.locator('#examples');
    const region = examples.getByRole('region', {
      name: 'Featured stories',
    });
    await region.getByRole('button', { name: 'Next slide' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(
      region.getByRole('group', { name: '2 of 3' }),
    ).not.toHaveAttribute('aria-hidden', 'true');
    await page.keyboard.press('End');
    await expect(
      region.getByRole('group', { name: '3 of 3' }),
    ).not.toHaveAttribute('aria-hidden', 'true');
    await page.keyboard.press('Home');
    await expect(
      region.getByRole('group', { name: '1 of 3' }),
    ).not.toHaveAttribute('aria-hidden', 'true');
  });

  test('clamps with aria-disabled when loop is off', async ({ page }) => {
    const loop = page.locator('#loop');
    const region = loop.getByRole('region', { name: 'Featured stories' });
    await region.getByRole('button', { name: 'Next slide' }).click();
    await region.getByRole('button', { name: 'Next slide' }).click();
    await expect(
      region.getByRole('button', { name: 'Next slide' }),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  test('toggles autoplay with label swap', async ({ page }) => {
    const autoplay = page.locator('#autoplay');
    await autoplay.scrollIntoViewIfNeeded();
    const region = autoplay.getByRole('region', { name: 'Featured stories' });
    const toggle = region.getByRole('button', { name: 'Pause' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.click();
    await expect(region.getByRole('button', { name: 'Play' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('keeps the dots centered with the toggle visible', async ({ page }) => {
    const autoplay = page.locator('#autoplay');
    const region = autoplay.getByRole('region', { name: 'Featured stories' });
    const geometry = await region.evaluate((host) => {
      const dots = [
        ...host.querySelectorAll('.solaris-media-carousel__dot'),
      ].map((dot) => dot.getBoundingClientRect());
      const first = dots[0];
      const last = dots[dots.length - 1];
      return {
        hostCenter: host.getBoundingClientRect().x + host.offsetWidth / 2,
        dotsCenter: (first.x + last.right) / 2,
      };
    });
    expect(Math.abs(geometry.dotsCenter - geometry.hostCenter)).toBeLessThan(2);
  });
});
