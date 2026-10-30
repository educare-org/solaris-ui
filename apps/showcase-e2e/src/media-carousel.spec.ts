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

  test('resumes after mouse focus leaves the carousel', async ({ page }) => {
    const autoplay = page.locator('#autoplay');
    await autoplay.scrollIntoViewIfNeeded();
    const region = autoplay.getByRole('region', { name: 'Featured stories' });
    await region.getByRole('button', { name: 'Next slide' }).click();
    await page.mouse.move(4, 4);
    await expect(region.getByRole('button', { name: 'Pause' })).toHaveAttribute(
      'aria-pressed',
      'true',
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

  test('renders the preview strip with three named thumbs', async ({
    page,
  }) => {
    const preview = page.locator('#preview');
    const region = preview.getByRole('region', { name: 'Featured stories' });
    const thumbs = region.getByRole('button', { name: /slide \d of 3/ });
    await expect(thumbs).toHaveCount(3);
    await expect(
      region.getByRole('button', { name: 'Go to slide 1 of 3' }),
    ).toHaveAttribute('aria-current', 'true');
    await expect(
      region.getByRole('button', { name: 'Go to slide 2 of 3' }),
    ).not.toHaveAttribute('aria-current', 'true');
  });

  test('navigates through preview thumbs with wrap', async ({ page }) => {
    const preview = page.locator('#preview');
    const region = preview.getByRole('region', { name: 'Featured stories' });
    await region.getByRole('button', { name: 'Go to slide 3 of 3' }).click();
    await expect(
      region.getByRole('group', { name: '3 of 3' }),
    ).not.toHaveAttribute('aria-hidden', 'true');
    await expect(
      region.getByRole('button', { name: 'Go to slide 3 of 3' }),
    ).toHaveAttribute('aria-current', 'true');
  });

  test('shows the video Play badge on video thumbs', async ({ page }) => {
    const preview = page.locator('#preview');
    const region = preview.getByRole('region', { name: 'Featured stories' });
    const thumb = region.getByRole('button', {
      name: 'Go to slide 2 of 3',
    });
    await expect(
      thumb.locator('.solaris-media-carousel__preview-badge'),
    ).toHaveText('Play');
  });

  test('keeps the Play badge inside the video thumb', async ({ page }) => {
    const preview = page.locator('#preview');
    const region = preview.getByRole('region', { name: 'Featured stories' });
    const thumb = region.getByRole('button', {
      name: 'Go to slide 2 of 3',
    });
    const boxes = await thumb.evaluate((el) => {
      const host = el.getBoundingClientRect().toJSON();
      const badge = el
        .querySelector('.solaris-media-carousel__preview-badge')
        ?.getBoundingClientRect()
        .toJSON();
      return { host, badge };
    });
    expect(boxes.badge).toBeDefined();
    expect(boxes.badge.x).toBeGreaterThanOrEqual(boxes.host.x - 1);
    expect(boxes.badge.x + boxes.badge.width).toBeLessThanOrEqual(
      boxes.host.x + boxes.host.width + 1,
    );
  });

  test('renders video thumbs wider than image thumbs', async ({ page }) => {
    const preview = page.locator('#preview');
    const region = preview.getByRole('region', { name: 'Featured stories' });
    const imageThumb = region.getByRole('button', {
      name: 'Go to slide 1 of 3',
    });
    const videoThumb = region.getByRole('button', {
      name: 'Go to slide 2 of 3',
    });
    const imageBox = await imageThumb.evaluate((el) =>
      el.getBoundingClientRect().toJSON(),
    );
    const videoBox = await videoThumb.evaluate((el) =>
      el.getBoundingClientRect().toJSON(),
    );
    expect(videoBox.width).toBeGreaterThan(imageBox.width);
  });

  test('harmonizes the preview frame radius with the thumbs', async ({
    page,
  }) => {
    const preview = page.locator('#preview');
    const region = preview.getByRole('region', { name: 'Featured stories' });
    const radii = await region.evaluate((host) => {
      const frame = host.querySelector('.solaris-media-carousel__preview');
      const thumb = host.querySelector(
        '.solaris-media-carousel__preview-thumb',
      );
      const parse = (value: string | undefined): number =>
        Number.parseFloat(value ?? '0');
      return {
        frame: parse(
          frame ? getComputedStyle(frame).borderTopLeftRadius : undefined,
        ),
        thumb: parse(
          thumb ? getComputedStyle(thumb).borderTopLeftRadius : undefined,
        ),
      };
    });
    expect(radii.thumb).toBeGreaterThan(0);
    expect(radii.frame - radii.thumb).toBeCloseTo(3, 0);
  });

  test('switches chrome between minimal, arrows and dots', async ({ page }) => {
    const carousels = page.locator('#chrome solaris-media-carousel');
    await expect(carousels).toHaveCount(3);
    await expect(
      carousels.nth(0).locator('.solaris-media-carousel__arrow'),
    ).toHaveCount(0);
    await expect(
      carousels.nth(0).locator('.solaris-media-carousel__dot'),
    ).toHaveCount(0);
    await expect(
      carousels.nth(1).locator('.solaris-media-carousel__arrow'),
    ).toHaveCount(2);
    await expect(
      carousels.nth(1).locator('.solaris-media-carousel__dot'),
    ).toHaveCount(0);
    await expect(
      carousels.nth(2).locator('.solaris-media-carousel__arrow'),
    ).toHaveCount(0);
    await expect(
      carousels.nth(2).locator('.solaris-media-carousel__dot'),
    ).toHaveCount(3);
  });

  test('fills the active dot over the duration with progress', async ({
    page,
  }) => {
    const region = page
      .locator('#progress')
      .getByRole('region', { name: 'Featured stories' });
    await expect(region).toHaveAttribute('data-navigation', 'progress');
    await expect(
      region.locator('.solaris-media-carousel__dot-fill'),
    ).toHaveCount(1);
    const colors = await region.evaluate((host) => {
      const track = host.querySelector(
        '.solaris-media-carousel__dot[data-active] .solaris-media-carousel__dot-track',
      );
      const fill = host.querySelector('.solaris-media-carousel__dot-fill');
      return {
        track: track ? getComputedStyle(track).backgroundColor : null,
        fill: fill ? getComputedStyle(fill).backgroundColor : null,
      };
    });
    expect(colors.fill).not.toBe(colors.track);
  });

  test('moves slides with a horizontal drag', async ({ page }) => {
    const region = page
      .locator('#examples')
      .getByRole('region', { name: 'Featured stories' });
    const viewport = region.locator('.solaris-media-carousel__viewport');
    const box = await viewport.boundingBox();
    expect(box).not.toBeNull();
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width - 40, y);
    await page.mouse.down();
    await page.mouse.move(box.x + 40, y, { steps: 5 });
    await page.mouse.up();
    await expect(
      region.locator('.solaris-media-carousel__slide[data-active]'),
    ).toHaveAttribute('aria-label', '2 of 3');
    await expect(region.locator('.solaris-media-carousel__track')).toHaveCSS(
      'cursor',
      'grab',
    );
  });

  test('renders one viewport per aspect ratio', async ({ page }) => {
    const ratios = page.locator('#ratios');
    const viewports = ratios.locator('.solaris-media-carousel__viewport');
    await expect(viewports).toHaveCount(5);
    await expect(viewports.nth(0)).toHaveAttribute(
      'style',
      /aspect-ratio: 16 \/ 9/,
    );
    await expect(viewports.nth(1)).toHaveAttribute(
      'style',
      /aspect-ratio: 4 \/ 3/,
    );
    await expect(viewports.nth(2)).toHaveAttribute(
      'style',
      /aspect-ratio: 1 \/ 1/,
    );
    await expect(viewports.nth(3)).toHaveAttribute(
      'style',
      /aspect-ratio: 3 \/ 4/,
    );
    await expect(viewports.nth(4)).toHaveAttribute(
      'style',
      /aspect-ratio: 9 \/ 16/,
    );
  });

  test('highlights the active thumb with a lighter border', async ({
    page,
  }) => {
    const preview = page.locator('#preview');
    const region = preview.getByRole('region', { name: 'Featured stories' });
    const colors = await region.evaluate((host) => {
      const active = host.querySelector(
        '.solaris-media-carousel__preview-thumb[data-active]',
      );
      const inactive = host.querySelector(
        '.solaris-media-carousel__preview-thumb:not([data-active])',
      );
      return {
        active: active ? getComputedStyle(active).borderTopColor : null,
        inactive: inactive ? getComputedStyle(inactive).borderTopColor : null,
      };
    });
    expect(colors.active).toBe('rgb(242, 245, 251)');
    expect(colors.inactive).not.toBe(colors.active);
  });
});
