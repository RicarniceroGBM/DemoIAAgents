import test from 'node:test';
import assert from 'node:assert/strict';
import { amount, clients, demoCase, holdings, isPerspective, isScreen, perspectives, rebalance, screenList, timeline } from '../src/data/demo.ts';

test('both portfolios allocate exactly 100% and preserve the same value', () => {
  for (const field of ['current', 'proposed'] as const) {
    assert.equal(holdings.reduce((total, h) => total + h[field], 0), 100);
    assert.equal(holdings.reduce((total, h) => total + amount(h[field]), 0), demoCase.value);
    assert.ok(holdings.every((h) => h[field] >= 0 && h[field] <= 100));
  }
});

test('buys are funded by sales and available cash while preserving the reserve', () => {
  const assets = holdings.filter((h) => h.id !== 'efectivo');
  const buys = assets.reduce((total, h) => total + Math.max(0, amount(h.proposed - h.current)), 0);
  const sales = assets.reduce((total, h) => total + Math.max(0, amount(h.current - h.proposed)), 0);
  const cash = holdings.find((h) => h.id === 'efectivo')!;
  assert.equal(buys, 375_000);
  assert.equal(sales, 250_000);
  assert.equal(amount(cash.current), demoCase.available);
  assert.equal(amount(cash.proposed), demoCase.minimumCash);
  assert.equal(buys, sales + amount(cash.current - cash.proposed));
  assert.deepEqual(rebalance, { buys, sales, cashUsed: amount(cash.current - cash.proposed) });
  assert.equal(holdings.reduce((total, h) => total + amount(h.proposed - h.current), 0), 0);
});

test('the rate change is exactly 25 basis points', () => {
  assert.equal(Math.round((demoCase.currentRate - demoCase.proposedRate) * 100), demoCase.cutBasisPoints);
});

test('one complete client case and twenty meaningful perspective contexts exist', () => {
  assert.equal(clients.filter((client) => client.main).length, 1);
  assert.equal(clients.find((client) => client.main)?.value, demoCase.value);
  assert.equal(screenList.length, 5);
  assert.equal(Object.keys(perspectives).length, 4);
  for (const screen of screenList) {
    const titles = new Set<string>();
    for (const perspective of Object.values(perspectives)) {
      const copy = perspective.screens[screen.id];
      assert.ok(copy.title && copy.body && copy.points.length === 3);
      titles.add(copy.title);
    }
    assert.equal(titles.size, 4, `Distinct content for ${screen.id}`);
  }
});

test('guards reject invalid navigation and inherited object properties', () => {
  assert.ok(isScreen('detalle'));
  assert.ok(isPerspective('tecnica'));
  for (const value of ['constructor', '__proto__', 'admin', null, {}, 1]) {
    assert.equal(isScreen(value), false);
    assert.equal(isPerspective(value), false);
  }
});

test('the static audit contains no consent or executed decision', () => {
  assert.equal(timeline.length, 4);
  assert.equal(timeline.some((entry) => /aprobada|rechazada|orden ejecutada|consentimiento recibido/i.test(entry.title)), false);
});
