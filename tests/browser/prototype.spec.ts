import { expect, test } from '@playwright/test';
import { decisionCopy, perspectives, screenList } from '../../src/data/demo.ts';

test('full walkthrough, four perspectives, history and reload', async ({ page }) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => { if (!request.url().startsWith('http://127.0.0.1:4173')) externalRequests.push(request.url()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Centro de eventos');
  await page.getByRole('link', { name: 'Ver caso asociado' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bandeja del asesor');
  await page.getByRole('link', { name: 'Ver caso de Mariana Torres' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Detalle multiagente');
  await page.getByRole('link', { name: 'Comparar portafolios' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Simulador de rebalanceo');
  await page.getByRole('link', { name: 'Revisar propuesta y trazabilidad' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aprobación y trazabilidad');

  for (const screen of screenList) {
    await page.goto(`/#/${screen.id}`);
    for (const [id, perspective] of Object.entries(perspectives)) {
      await page.getByLabel('Seleccionar perspectiva').selectOption(id);
      await expect(page.getByTestId('perspective-note')).toContainText(perspective.screens[screen.id].title);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen.label);
    }
  }
  await page.reload();
  await expect(page.getByLabel('Seleccionar perspectiva')).toHaveValue('control');
  await page.getByRole('link', { name: 'Volver a la comparación' }).click();
  await expect(page).toHaveURL(/#\/simulador$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/aprobacion$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aprobación y trazabilidad');
  await page.goForward();
  await expect(page).toHaveURL(/#\/simulador$/);
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test('illustrative actions do not persist decisions and dialogs restore focus', async ({ page }) => {
  await page.goto('/#/aprobacion');
  const originalTimeline = await page.locator('.timeline').allTextContents();
  for (const copy of Object.values(decisionCopy)) {
    const button = page.getByRole('button', { name: copy.label, exact: true });
    await button.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText(copy.title);
    await expect(page.getByRole('dialog')).toContainText('No se ha registrado ninguna decisión.');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(button).toBeFocused();
    await expect(page.locator('.timeline')).toHaveText(originalTimeline);
  }
  await page.getByRole('button', { name: 'Modificar propuesta', exact: true }).click();
  await page.getByRole('link', { name: 'Ver comparación' }).click();
  await expect(page).toHaveURL(/#\/simulador$/);
  const storage = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  expect(Object.keys(storage)).toEqual(['nexo-demo-ui']);
  expect(Object.keys(JSON.parse(storage['nexo-demo-ui'])).sort()).toEqual(['perspective', 'screen']);
});

test('filtering, empty state and reset restore the default experience', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Divisas', exact: true }).click();
  await expect(page.locator('.event-card')).toHaveCount(1);
  await page.getByRole('searchbox').fill('no-existe');
  await expect(page.getByRole('heading', { name: 'No hay eventos con esos filtros' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpiar filtros' }).click();
  await expect(page.locator('.event-card')).toHaveCount(4);
  await page.getByRole('searchbox').fill('Banxico');
  await page.getByLabel('Seleccionar perspectiva').selectOption('tecnica');
  await page.getByRole('button', { name: 'Reiniciar demo' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('');
  await expect(page.locator('.event-card')).toHaveCount(4);
  await expect(page.getByLabel('Seleccionar perspectiva')).toHaveValue('asesor');
  await expect(page.getByRole('status')).toContainText('Demo reiniciada');
});

test('station links focus their sections and explicit routes override stored screens', async ({ page }) => {
  await page.goto('/#/detalle');
  await page.getByRole('link', { name: '03 Hallazgos' }).click();
  await expect(page).toHaveURL(/#\/detalle\/hallazgos$/);
  await expect(page.locator('#hallazgos')).toBeFocused();
  await page.getByRole('link', { name: '04 Síntesis' }).click();
  await expect(page.locator('#sintesis')).toBeFocused();
  await page.goto('/#/simulador');
  await page.goto('/');
  await expect(page).toHaveURL(/#\/simulador$/);
  await page.goto('/#/bandeja');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bandeja del asesor');
  await page.goto('/#/ruta-invalida');
  await expect(page.getByRole('alert')).toContainText('La ruta no existe');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Centro de eventos');
});

test('unavailable or corrupt storage is surfaced instead of blocking navigation', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('almacenamiento');
  await page.getByRole('link', { name: 'Ver caso asociado' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bandeja del asesor');
});

test('invalid saved preferences restore defaults with a visible warning', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nexo-demo-ui', '{"screen":"constructor","perspective":"admin"}'));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('preferencias guardadas no son válidas');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Centro de eventos');
  await expect(page.getByLabel('Seleccionar perspectiva')).toHaveValue('asesor');
});

for (const width of [320, 390, 768, 1440]) {
  test(`responsive layout at ${width}px and keyboard navigation`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const screen of screenList) {
      await page.goto(`/#/${screen.id}`);
      const layout = await page.evaluate(() => ({
        width: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        overflowing: [...document.querySelectorAll<HTMLElement>('body *')]
          .filter((element) => {
            if (element.closest('.table-wrap, .sidebar')) return false;
            const box = element.getBoundingClientRect();
            return box.width > 0 && box.right > window.innerWidth;
          })
          .map((element) => `${element.tagName}.${element.className}`),
      }));
      expect(layout.documentWidth, `${screen.id}: ${JSON.stringify(layout)}`).toBeLessThanOrEqual(layout.width);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByLabel('Seleccionar perspectiva')).toBeVisible();
    }
    if (width < 801) {
      await page.getByRole('button', { name: 'Abrir menú' }).click();
      await expect(page.locator('.sidebar')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeFocused();
      await page.getByRole('button', { name: 'Abrir menú' }).click();
      await page.locator('.main-nav').getByRole('link', { name: 'Centro de eventos' }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Centro de eventos');
      await expect(page.locator('.sidebar')).toBeHidden();
    }
    await page.goto('/#/eventos');
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
  });
}

test('solid-background text has accessible contrast', async ({ page }) => {
  for (const screen of screenList) {
    await page.goto(`/#/${screen.id}`);
    const failures = await page.evaluate(() => {
      const rgb = (color: string) => (color.match(/[\d.]+/g) || []).map(Number);
      const luminance = (channels: number[]) => channels.slice(0, 3).map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
      const results: string[] = [];
      for (const element of document.querySelectorAll<HTMLElement>('body *')) {
        if (!element.getClientRects().length || element.closest('[aria-hidden="true"], .sr-only')) continue;
        if (![...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())) continue;
        const style = getComputedStyle(element);
        if (style.visibility !== 'visible') continue;
        let ancestor: HTMLElement | null = element;
        let background: number[] | null = null;
        while (ancestor) {
          const parentStyle = getComputedStyle(ancestor);
          if (parentStyle.backgroundImage !== 'none') break;
          const channels = rgb(parentStyle.backgroundColor);
          if (channels.length === 3 || channels[3] === 1) { background = channels; break; }
          ancestor = ancestor.parentElement;
        }
        if (!background) continue;
        const foreground = luminance(rgb(style.color));
        const backdrop = luminance(background);
        const contrast = (Math.max(foreground, backdrop) + 0.05) / (Math.min(foreground, backdrop) + 0.05);
        const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700);
        if (contrast < (large ? 3 : 4.5)) results.push(`${element.className || element.tagName}: ${contrast.toFixed(2)} ${element.textContent?.trim().slice(0, 45)}`);
      }
      return results;
    });
    expect.soft(failures, screen.id).toEqual([]);
  }
});
