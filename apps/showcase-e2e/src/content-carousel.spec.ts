import { test, expect } from '@playwright/test';

test.use({ locale: 'en-US' });

test.describe('Content carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interaction/content-carousel');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('renders inside the shell with carousel semantics', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Content carousel', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    const region = page
      .locator('#examples')
      .getByRole('region', { name: 'Login highlights' });
    await expect(region).toBeVisible();
    await expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    await expect(region.getByRole('group', { name: '1 of 2' })).toBeVisible();
  });

  test('projects slides in DOM order', async ({ page }) => {
    const region = page
      .locator('#examples')
      .getByRole('region', { name: 'Login highlights' });
    const slides = region.locator('.solaris-content-carousel__slide');
    await expect(slides).toHaveCount(2);
    await expect(slides.first()).toContainText('Scan to continue');
    await expect(slides.last()).toContainText('Early access');
  });

  test('navigates slides with arrows and dots', async ({ page }) => {
    const examples = page.locator('#examples');
    const region = examples.getByRole('region', {
      name: 'Login highlights',
    });
    const active = region.locator(
      '.solaris-content-carousel__slide[data-active]',
    );
    await region.getByRole('button', { name: 'Next slide' }).click();
    await expect(active).toHaveAttribute('aria-label', '2 of 2');
    await region.getByRole('button', { name: 'Go to slide 1 of 2' }).click();
    await expect(active).toHaveAttribute('aria-label', '1 of 2');
    await region.getByRole('button', { name: 'Previous slide' }).click();
    await expect(active).toHaveAttribute('aria-label', '2 of 2');
  });

  test('moves with keyboard arrows and Home/End', async ({ page }) => {
    const examples = page.locator('#examples');
    const region = examples.getByRole('region', {
      name: 'Login highlights',
    });
    await region.getByRole('button', { name: 'Next slide' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(
      region.getByRole('group', { name: '2 of 2' }),
    ).not.toHaveAttribute('aria-hidden', 'true');
    await page.keyboard.press('Home');
    await expect(
      region.getByRole('group', { name: '1 of 2' }),
    ).not.toHaveAttribute('aria-hidden', 'true');
    await page.keyboard.press('End');
    await expect(
      region.getByRole('group', { name: '2 of 2' }),
    ).not.toHaveAttribute('aria-hidden', 'true');
  });

  test('renders the login-split divider on the left', async ({ page }) => {
    const region = page
      .locator('#examples')
      .getByRole('region', { name: 'Login highlights' });
    await expect(region).toHaveAttribute('data-divider', 'left');
    const divider = region.locator('.solaris-content-carousel__divider--left');
    await expect(divider).toBeVisible();
    await expect(divider).toHaveAttribute('aria-hidden', 'true');
  });

  test('renders the promo divider on the left', async ({ page }) => {
    const region = page
      .locator('#promo')
      .getByRole('region', { name: 'Promotions' });
    await expect(region).toHaveAttribute('data-divider', 'left');
    await expect(
      region.locator('.solaris-content-carousel__divider--left'),
    ).toBeVisible();
  });

  test('renders the mega panel without a divider', async ({ page }) => {
    const region = page
      .locator('#mega-panel')
      .getByRole('region', { name: 'Featured content' });
    await expect(region).toHaveAttribute('data-divider', 'none');
    await expect(
      region.locator('.solaris-content-carousel__divider'),
    ).toHaveCount(0);
  });

  test('keeps inactive slides out of the tab order', async ({ page }) => {
    const region = page
      .locator('#examples')
      .getByRole('region', { name: 'Login highlights' });
    const inactive = region.locator(
      '.solaris-content-carousel__slide:not([data-active])',
    );
    await expect(inactive).toHaveCount(1);
    await expect(inactive).toHaveAttribute('aria-hidden', 'true');
    await expect(inactive).toHaveAttribute('inert', '');
  });

  test('flips the vertical divider to the bottom at 360px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const region = page
      .locator('#examples')
      .getByRole('region', { name: 'Login highlights' });
    await expect(region).toBeVisible();
    const box = await region
      .locator('.solaris-content-carousel__divider--left')
      .evaluate((el) => el.getBoundingClientRect().toJSON());
    expect(box.height).toBeLessThanOrEqual(2);
    expect(box.width).toBeGreaterThan(100);
  });

  test('frames centered content with dividers on both sides', async ({
    page,
  }) => {
    const region = page
      .locator('#dividers')
      .getByRole('region', { name: 'Centered highlights' });
    await expect(region).toHaveAttribute('data-divider', 'both');
    await expect(
      region.locator('.solaris-content-carousel__divider--left'),
    ).toBeVisible();
    await expect(
      region.locator('.solaris-content-carousel__divider--right'),
    ).toBeVisible();
  });

  test('fills the active dot over the duration with progress', async ({
    page,
  }) => {
    const region = page
      .locator('#progress')
      .getByRole('region', { name: 'Rotating announcements' });
    await expect(region).toHaveAttribute('data-navigation', 'progress');
    await expect(
      region.locator('.solaris-content-carousel__dot-fill'),
    ).toHaveCount(1);
    const colors = await region.evaluate((host) => {
      const track = host.querySelector(
        '.solaris-content-carousel__dot[data-active] .solaris-content-carousel__dot-track',
      );
      const fill = host.querySelector('.solaris-content-carousel__dot-fill');
      return {
        track: track ? getComputedStyle(track).backgroundColor : null,
        fill: fill ? getComputedStyle(fill).backgroundColor : null,
      };
    });
    expect(colors.fill).not.toBe(colors.track);
  });

  test('switches chrome between minimal, arrows and dots', async ({ page }) => {
    const carousels = page.locator('#chrome solaris-content-carousel');
    await expect(carousels).toHaveCount(3);
    await expect(
      carousels.nth(0).locator('.solaris-content-carousel__arrow'),
    ).toHaveCount(0);
    await expect(
      carousels.nth(0).locator('.solaris-content-carousel__dot'),
    ).toHaveCount(0);
    await expect(
      carousels.nth(1).locator('.solaris-content-carousel__arrow'),
    ).toHaveCount(2);
    await expect(
      carousels.nth(1).locator('.solaris-content-carousel__dot'),
    ).toHaveCount(0);
    await expect(
      carousels.nth(2).locator('.solaris-content-carousel__arrow'),
    ).toHaveCount(0);
    await expect(
      carousels.nth(2).locator('.solaris-content-carousel__dot'),
    ).toHaveCount(2);
  });

  test('resumes after mouse focus leaves the carousel', async ({ page }) => {
    const progress = page.locator('#progress');
    await progress.scrollIntoViewIfNeeded();
    const region = progress.getByRole('region', {
      name: 'Rotating announcements',
    });
    await region.getByRole('button', { name: 'Next slide' }).click();
    await page.mouse.move(4, 4);
    await expect(region.getByRole('button', { name: 'Pause' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('moves slides with a horizontal drag', async ({ page }) => {
    const region = page
      .locator('#examples')
      .getByRole('region', { name: 'Login highlights' });
    const viewport = region.locator('.solaris-content-carousel__viewport');
    const box = await viewport.boundingBox();
    expect(box).not.toBeNull();
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width - 40, y);
    await page.mouse.down();
    await page.mouse.move(box.x + 40, y, { steps: 5 });
    await page.mouse.up();
    await expect(
      region.locator('.solaris-content-carousel__slide[data-active]'),
    ).toHaveAttribute('aria-label', '2 of 2');
    await expect(region.locator('.solaris-content-carousel__track')).toHaveCSS(
      'cursor',
      'grab',
    );
  });

  test('keeps the divider legible in dark and high-contrast themes', async ({
    page,
  }) => {
    const region = page
      .locator('#examples')
      .getByRole('region', { name: 'Login highlights' });
    for (const theme of ['dark', 'high-contrast']) {
      await page.evaluate((value) => {
        document.documentElement.dataset['theme'] = value;
      }, theme);
      await expect(region).toBeVisible();
      const color = await region
        .locator('.solaris-content-carousel__divider--left')
        .evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
});
