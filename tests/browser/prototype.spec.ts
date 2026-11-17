import { expect, test } from '@playwright/test';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer, preview } from 'vite';
import { amount, cases, casePerspective, cashHolding, clients, decisionCopy, marketEvents, money, rebalanceFor, screenList } from '../../src/data/demo.ts';
import { routeTo } from '../../src/routes.ts';
import type { Screen } from '../../src/types.ts';

const marianaUrl = (screen: Screen) => `/${routeTo(screen, 'MT-1042')}`;

test('full walkthrough, four perspectives, history and reload', async ({ page }) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => { if (!request.url().startsWith('http://127.0.0.1:4173')) externalRequests.push(request.url()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Centro de eventos');
  await page.getByRole('link', { name: 'Ver impacto en carteras: Banxico recorta la tasa de referencia en 25 pb', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bandeja del asesor');
  await page.getByRole('link', { name: 'Ver caso de Mariana Torres' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Detalle multiagente');
  await page.getByRole('link', { name: 'Comparar portafolios' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Simulador de rebalanceo');
  await page.getByRole('link', { name: 'Revisar propuesta y trazabilidad' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aprobación y trazabilidad');

  for (const screen of screenList) {
    await page.goto(marianaUrl(screen.id));
    for (const id of ['asesor', 'cliente', 'tecnica', 'control'] as const) {
      await page.getByLabel('Seleccionar perspectiva').selectOption(id);
      await expect(page.getByTestId('perspective-note')).toContainText(casePerspective(screen.id, id, cases['MT-1042']).title);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen.label);
    }
  }
  await page.reload();
  await expect(page.getByLabel('Seleccionar perspectiva')).toHaveValue('control');
  await page.getByRole('link', { name: 'Volver a la comparación' }).click();
  await expect(page).toHaveURL(/#\/simulador\?cliente=MT-1042$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/aprobacion\?cliente=MT-1042$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aprobación y trazabilidad');
  await page.goForward();
  await expect(page).toHaveURL(/#\/simulador\?cliente=MT-1042$/);
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test('illustrative actions do not persist decisions and dialogs restore focus', async ({ page }) => {
  await page.goto(marianaUrl('aprobacion'));
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
  await expect(page).toHaveURL(/#\/simulador\?cliente=MT-1042$/);
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
  await expect(page.locator('.event-card')).toHaveCount(marketEvents.length);
  await page.getByRole('searchbox').fill('Banxico');
  await page.getByLabel('Seleccionar perspectiva').selectOption('tecnica');
  await page.getByRole('button', { name: 'Reiniciar demo' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('');
  await expect(page.locator('.event-card')).toHaveCount(marketEvents.length);
  await expect(page.getByLabel('Seleccionar perspectiva')).toHaveValue('asesor');
  await expect(page.getByRole('status')).toContainText('Demo reiniciada');
});

test('station links focus their sections and explicit routes override stored screens', async ({ page }) => {
  await page.goto(marianaUrl('detalle'));
  await page.getByRole('link', { name: '03 Hallazgos' }).click();
  await expect(page).toHaveURL(/#\/detalle\/hallazgos\?cliente=MT-1042$/);
  await expect(page.locator('#hallazgos')).toBeFocused();
  await page.getByRole('link', { name: '04 Síntesis' }).click();
  await expect(page.locator('#sintesis')).toBeFocused();
  await page.goto(marianaUrl('simulador'));
  await page.goto('/');
  await expect(page).toHaveURL(/#\/bandeja$/);
  await expect(page.getByRole('alert')).toContainText('Selecciona un cliente válido');
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
  await page.getByRole('link', { name: 'Ver impacto en carteras: Banxico recorta la tasa de referencia en 25 pb', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bandeja del asesor');
});

test('invalid saved preferences restore defaults with a visible warning', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nexo-demo-ui', '{"screen":"constructor","perspective":"admin"}'));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('preferencias guardadas no son válidas');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Centro de eventos');
  await expect(page.getByLabel('Seleccionar perspectiva')).toHaveValue('asesor');
});

test('case tabs are disabled until explicit selection and direct routes cannot bypass it', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('.main-nav');
  for (const label of ['Detalle multiagente', 'Simulador de rebalanceo', 'Aprobación y trazabilidad']) {
    await expect(nav.getByRole('button', { name: label, exact: true })).toBeDisabled();
    await expect(nav.getByRole('link', { name: label, exact: true })).toHaveCount(0);
  }
  await page.getByRole('link', { name: 'Seleccionar un cliente', exact: true }).click();
  await expect(page).toHaveURL('/#/bandeja');
  await expect(page.locator('.case-header')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /^Ver caso de / })).toHaveCount(3);
  for (const path of ['detalle', 'detalle/hallazgos', 'simulador', 'aprobacion', 'detalle?cliente=desconocido', 'simulador?cliente=CL-2086&cliente=AG-3108']) {
    await page.goto(`/#/${path}`);
    await expect(page).toHaveURL('/#/bandeja');
    await expect(page.getByRole('alert')).toContainText('Selecciona un cliente válido');
    await expect(page.locator('.case-header')).toHaveCount(0);
    await expect(nav.getByRole('button', { name: 'Detalle multiagente', exact: true })).toBeDisabled();
  }
});

test('market radar stays global regardless of selected client', async ({ page }) => {
  await page.goto('/#/eventos');
  const originalCards = await page.locator('.event-grid').innerText();
  for (const client of clients) {
    await page.goto(`/${routeTo('eventos', client.id)}`);
    await expect(page.locator('.event-grid')).toHaveText(originalCards, { useInnerText: true });
    for (const name of clients.map((entry) => entry.name)) {
      await expect(page.locator('.event-grid')).not.toContainText(name);
      await expect(page.getByTestId('perspective-note')).not.toContainText(name);
    }
    await page.getByRole('searchbox').fill(client.name);
    await expect(page.locator('.event-card')).toHaveCount(0);
    await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).click();
    await page.getByRole('link', { name: 'Ver impacto en carteras: El crudo se dispara ante el escalamiento del conflicto con Irán', exact: true }).click();
    await expect(page).toHaveURL(`/${routeTo('bandeja', client.id)}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bandeja del asesor');
  }
});

for (const scenario of Object.values(cases)) {
  test(`${scenario.client}: complete case, outputs, perspectives, reload, and illustrative decision`, async ({ page }) => {
    const errors: string[] = [];
    const externalRequests: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => { if (!request.url().startsWith('http://127.0.0.1:4173')) externalRequests.push(request.url()); });
    await page.goto('/#/bandeja');
    await page.getByRole('link', { name: `Ver caso de ${scenario.client}`, exact: true }).click();
    await expect(page).toHaveURL(`/${routeTo('detalle', scenario.clientId)}`);
    await expect(page.locator('.case-header')).toContainText(scenario.client);
    await expect(page.locator('.case-header')).toContainText(scenario.profile);
    await expect(page.locator('.agent-card')).toHaveCount(4);
    await expect(page.locator('#evento')).toContainText(scenario.event.description);
    const script = page.getByRole('region', { name: 'Guion para conversar con el cliente', exact: true });
    await expect(script).toBeVisible();
    await expect(script.getByRole('listitem')).toHaveCount(5);
    for (const text of Object.values(scenario.advisorScript)) await expect(script).toContainText(text);
    await expect(script).toContainText('no un mensaje enviado');
    await page.getByLabel('Seleccionar perspectiva').selectOption('tecnica');
    const output = JSON.parse(await page.locator('.json-output').innerText());
    expect(output.case_id).toBe(scenario.id);
    expect(output.client_id).toBe(scenario.clientId);
    expect(output.inputs).toEqual(scenario.event.inputs);
    expect(output.proposed_weights).toEqual(Object.fromEntries(scenario.holdings.map((h) => [h.id, h.proposed])));
    expect(output.rebalance).toEqual(rebalanceFor(scenario));
    expect(output.execution_enabled).toBe(false);
    await page.getByRole('link', { name: '03 Hallazgos' }).click();
    await expect(page.locator('#hallazgos')).toBeFocused();
    await page.getByRole('link', { name: 'Comparar portafolios' }).click();
    await expect(page).toHaveURL(`/${routeTo('simulador', scenario.clientId)}`);
    await expect(page.locator('.portfolio-value')).toHaveText([`${money(scenario.value)} MXN`, `${money(scenario.value)} MXN`]);
    const movements = rebalanceFor(scenario);
    await expect(page.locator('.balance-strip')).toContainText(money(movements.buys));
    await expect(page.locator('.balance-strip')).toContainText(money(movements.sales));
    await page.screenshot({ path: `test-results/case-${scenario.clientId}.png`, fullPage: true });
    for (const holding of scenario.holdings) {
      const row = page.getByRole('table', { name: /^Cambios de asignación/ }).getByRole('row').filter({ hasText: holding.instrument });
      await expect(row).toContainText(`${holding.current}%`);
      await expect(row).toContainText(`${holding.proposed}%`);
      await expect(row).toContainText(money(Math.abs(amount(holding.proposed - holding.current, scenario.value))));
      if (holding.id === 'efectivo' && movements.cashUsed === 0) await expect(row).toContainText('Mantener');
    }
    await page.getByRole('link', { name: 'Revisar propuesta y trazabilidad' }).click();
    await expect(page.locator('.ticket-total')).toContainText(money(amount(cashHolding(scenario).proposed, scenario.value)));
    await expect(page.locator('.trace-reference')).toContainText(scenario.auditSource);
    const originalTimeline = await page.locator('.timeline').allTextContents();
    for (const copy of Object.values(decisionCopy)) {
      await page.getByRole('button', { name: copy.label, exact: true }).click();
      await expect(page.getByRole('dialog')).toContainText('No se ha registrado ninguna decisión.');
      await page.keyboard.press('Escape');
      await expect(page.locator('.timeline')).toHaveText(originalTimeline);
    }
    for (const screen of screenList) {
      await page.goto(`/${routeTo(screen.id, scenario.clientId)}`);
      for (const perspective of ['asesor', 'cliente', 'tecnica', 'control'] as const) {
        await page.getByLabel('Seleccionar perspectiva').selectOption(perspective);
        await expect(page.getByTestId('perspective-note')).toContainText(casePerspective(screen.id, perspective, scenario).title);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen.label);
        if (screen.id === 'detalle') {
          await expect(page.getByRole('region', { name: 'Guion para conversar con el cliente', exact: true })).toContainText(scenario.advisorScript.opening);
        }
      }
    }
    await page.reload();
    await expect(page.locator('.case-header')).toContainText(scenario.client);
    await page.getByRole('button', { name: 'Modificar propuesta', exact: true }).click();
    await page.getByRole('link', { name: 'Ver comparación', exact: true }).click();
    await expect(page).toHaveURL(`/${routeTo('simulador', scenario.clientId)}`);
    await page.getByRole('link', { name: 'Volver a la síntesis' }).click();
    await expect(page.locator('#sintesis')).toBeFocused();
    await page.getByRole('link', { name: 'Volver a la bandeja' }).click();
    await expect(page.locator('.selected-client')).toContainText(scenario.client);
    await page.locator('.main-nav').getByRole('link', { name: /^Centro de eventos/ }).click();
    await expect(page).toHaveURL(`/${routeTo('eventos', scenario.clientId)}`);
    const storage = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
    expect(Object.keys(storage)).toEqual(['nexo-demo-ui']);
    expect(Object.keys(JSON.parse(storage['nexo-demo-ui'])).sort()).toEqual(['perspective', 'screen']);
    await page.getByRole('button', { name: 'Reiniciar demo' }).click();
    await expect(page).toHaveURL('/#/eventos');
    await expect(page.locator('.main-nav').getByRole('button', { name: 'Detalle multiagente', exact: true })).toBeDisabled();
    expect(errors).toEqual([]);
    expect(externalRequests).toEqual([]);
  });
}

test('switching clients and browser history never mixes case data', async ({ page }) => {
  await page.goto('/#/bandeja');
  for (const client of clients) {
    await page.getByRole('link', { name: `Ver caso de ${client.name}`, exact: true }).click();
    await expect(page.locator('.case-header')).toContainText(client.name);
    await expect(page.locator('.case-header')).toContainText(money(client.value));
    await page.getByRole('link', { name: 'Volver a la bandeja' }).click();
  }
  await page.goBack();
  await expect(page.locator('.case-header')).toContainText('Ana García');
  await page.goBack();
  await expect(page.locator('.selected-client')).toContainText('Carlos López');
  await page.goBack();
  await expect(page.locator('.case-header')).toContainText('Carlos López');
  await page.goForward();
  await expect(page.locator('.selected-client')).toContainText('Carlos López');
});

test('production build loads assets and hash routes under the GitHub Pages project path', async ({ page }) => {
  const server = await preview({
    configFile: 'vite.config.ts',
    base: '/DemoIAAgents/',
    logLevel: 'silent',
    preview: { host: '127.0.0.1', port: 0, strictPort: false },
  });
  try {
    const address = server.httpServer.address();
    if (!address || typeof address === 'string') throw new Error('Vite preview did not bind to a local TCP port.');
    const url = `http://127.0.0.1:${address.port}/DemoIAAgents/`;
    const errors: string[] = [];
    const failedRequests: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('requestfailed', (request) => failedRequests.push(request.url()));
    page.on('response', (response) => {
      if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
    });

    await page.goto(`${url}#/eventos`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Centro de eventos');
    await page.getByRole('link', { name: 'Ver impacto en carteras: Banxico recorta la tasa de referencia en 25 pb', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bandeja del asesor');
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bandeja del asesor');
    expect(errors).toEqual([]);
    expect(failedRequests).toEqual([]);

    const documentation = await page.request.get(`${url}doc/README.md`);
    expect(documentation.status()).toBe(404);
  } finally {
    await new Promise<void>((resolveClose, reject) => {
      server.httpServer.close((error) => error ? reject(error) : resolveClose());
    });
  }
});

test('private documentation is not served by the development server', async () => {
  const server = await createServer({
    configFile: 'vite.config.ts',
    logLevel: 'silent',
    server: { host: '127.0.0.1', port: 0, strictPort: false },
  });
  try {
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === 'string') throw new Error('Vite did not bind to a local TCP port.');
    for (const path of ['/doc', '/doc/README.md', '/%64oc/README.md', '/%64oc%2fREADME.md', '/%2564oc/README.md', '/DOC/README.md', '/%2e%2e/doc/README.md', '/@fs/C:/workspace/DemoIAAgents/doc/README.md']) {
      const response = await fetch(`http://127.0.0.1:${address.port}${path}`);
      expect(response.status, path).toBe(404);
      expect(response.headers.get('cache-control'), path).toBe('no-store');
    }
  } finally {
    await server.close();
  }
});

test('private documentation is not included or served by the production build', async ({ request }) => {
  await expect(access(resolve('dist/doc'))).rejects.toThrow();
  for (const path of ['/doc', '/doc/README.md', '/%64oc/README.md', '/%64oc%2fREADME.md', '/%2564oc/README.md', '/DOC/README.md', '/%2e%2e/doc/README.md']) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
  }
});

for (const width of [320, 390, 768, 1440]) {
  test(`responsive layout at ${width}px and keyboard navigation`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    if (width < 801) {
      await page.getByRole('button', { name: 'Abrir menú' }).click();
      await expect(page.locator('.main-nav').getByRole('button', { name: 'Detalle multiagente', exact: true })).toBeDisabled();
      await page.keyboard.press('Tab');
      await expect(page.locator('.main-nav').getByRole('button', { name: 'Detalle multiagente', exact: true })).not.toBeFocused();
      await page.keyboard.press('Escape');
    }
    for (const scenario of Object.values(cases)) {
      for (const screen of screenList) {
        await page.goto(`/${routeTo(screen.id, scenario.clientId)}`);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen.label);
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
        expect(layout.documentWidth, `${scenario.clientId}/${screen.id}: ${JSON.stringify(layout)}`).toBeLessThanOrEqual(layout.width);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.getByLabel('Seleccionar perspectiva')).toBeVisible();
      }
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
  for (const client of clients) {
    for (const screen of screenList) {
      await page.goto(`/${routeTo(screen.id, client.id)}`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(screen.label);
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
      expect.soft(failures, `${client.id}/${screen.id}`).toEqual([]);
    }
  }
});
