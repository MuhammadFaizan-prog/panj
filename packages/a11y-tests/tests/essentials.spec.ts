import { expect, test } from '@playwright/test';

import { openSkin, SKINS, videoProp, wake } from './helpers';

for (const skin of SKINS) {
  test.describe(`${skin}: essential controls`, () => {
    test('all essential controls are present and visible', async ({ page }) => {
      const { container } = await openSkin(page, skin);
      await wake(page, skin);
      const bar = container.locator('.video-controls-content');
      await expect(bar.locator('media-play-button').last()).toBeVisible();
      await expect(container.locator('media-time-slider')).toBeVisible();
      await expect(container.locator('media-time').filter({ visible: true }).first()).toBeVisible();
      await expect(container.locator('media-mute-button')).toBeVisible();
      await expect(container.locator('media-fullscreen-button')).toBeVisible();
      await expect(container.locator('media-captions-button')).toBeVisible();
      await expect(container.locator('button[commandfor]')).toBeVisible(); // settings (speed)
    });

    test('play / pause by button and by keyboard (Space, K)', async ({ page }) => {
      const { container } = await openSkin(page, skin);
      await wake(page, skin);
      await container.locator('.video-controls-content media-play-button').last().click();
      await expect.poll(() => videoProp(page, 'paused')).toBe(false);
      await container.focus();
      await page.keyboard.press('k');
      await expect.poll(() => videoProp(page, 'paused')).toBe(true);
      await page.keyboard.press('Space');
      await expect.poll(() => videoProp(page, 'paused')).toBe(false);
    });

    test('seek and time display (arrows, Home/End, slider keys)', async ({ page }) => {
      const { container } = await openSkin(page, skin);
      await container.focus();
      await page.keyboard.press('End');
      await expect.poll(() => videoProp(page, 'currentTime')).toBeGreaterThan(20);
      await page.keyboard.press('Home');
      await expect.poll(() => videoProp(page, 'currentTime')).toBeLessThan(1);
      await page.keyboard.press('ArrowRight');
      await expect.poll(() => videoProp(page, 'currentTime')).toBeGreaterThan(1);
      // the time slider thumb itself is keyboard operable
      const thumb = container.locator('media-time-slider [role="slider"]');
      await thumb.focus();
      const before = await videoProp(page, 'currentTime');
      await page.keyboard.press('ArrowRight');
      await expect.poll(() => videoProp(page, 'currentTime')).toBeGreaterThan(before);
      await expect(container.locator('media-time[type="current"], media-time').filter({ visible: true }).first()).not.toHaveText(/^\s*$/);
    });

    test('mute and volume (M, arrows, button)', async ({ page }) => {
      const { container } = await openSkin(page, skin);
      await container.focus();
      await page.keyboard.press('m');
      await expect.poll(() => videoProp(page, 'muted')).toBe(true);
      await page.keyboard.press('m');
      await expect.poll(() => videoProp(page, 'muted')).toBe(false);
      await page.keyboard.press('ArrowDown');
      await expect.poll(() => videoProp(page, 'volume')).toBeLessThan(1);
      await wake(page, skin);
      await container.locator('media-mute-button').click();
      await expect.poll(() => videoProp(page, 'muted')).toBe(true);
    });

    test('fullscreen toggles (F, button)', async ({ page }) => {
      const { container } = await openSkin(page, skin);
      await container.focus();
      await page.keyboard.press('f');
      await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
      await page.keyboard.press('f');
      await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
      await wake(page, skin);
      await container.locator('media-fullscreen-button').click();
      await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
    });

    test('captions toggle (C, button)', async ({ page }) => {
      const { container } = await openSkin(page, skin);
      const mode = () => page.evaluate(() => (document.querySelector('video') as HTMLVideoElement).textTracks[0]?.mode);
      await container.focus();
      await page.keyboard.press('c');
      await expect.poll(mode).toBe('showing');
      await wake(page, skin);
      await container.locator('media-captions-button').click();
      await expect.poll(mode).not.toBe('showing');
    });

    test('speed menu: keyboard open, choose 1.5×, Esc closes and returns focus', async ({ page }) => {
      const { container } = await openSkin(page, skin);
      await wake(page, skin);
      const trigger = container.locator('button[commandfor]');
      await trigger.focus();
      await page.keyboard.press('Enter');
      const menu = container.locator('media-menu');
      await expect(menu).toHaveAttribute('data-open', /.*/);
      await menu.locator('media-menu-item[commandfor]', { hasText: 'Speed' }).click();
      await container.locator('media-menu-radio-item', { hasText: /1\.5/ }).first().click();
      await expect.poll(() => videoProp(page, 'playbackRate')).toBe(1.5);
      if ((await menu.getAttribute('data-open')) === null) {
        await trigger.focus();
        await page.keyboard.press('Enter');
        await expect(menu).toHaveAttribute('data-open', /.*/);
      }
      await page.keyboard.press('Escape');
      await expect(menu).not.toHaveAttribute('data-open', /.*/);
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => !!document.fullscreenElement)).toBe(false);
    });
  });
}

test.describe('ink-reed: ±15 s skip', () => {
  test('skip buttons step 15 seconds', async ({ page }, info) => {
    test.skip(info.project.name.startsWith('mobile'), 'centre skip buttons show on fine pointers only (Scaffold layout)');
    const { container } = await openSkin(page, 'ink-reed');
    await wake(page, 'ink-reed');
    const fwd = container.locator('media-seek-button[seconds="15"]');
    await expect(fwd).toHaveAttribute('aria-label', /15/);
    await expect(container.locator('media-seek-button[seconds="-15"]')).toHaveAttribute('aria-label', /15/);
    await fwd.click();
    await expect.poll(() => videoProp(page, 'currentTime')).toBeGreaterThanOrEqual(14.5);
  });
});
