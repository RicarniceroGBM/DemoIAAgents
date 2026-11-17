import test from 'node:test';
import assert from 'node:assert/strict';
import { amount, cases, casePerspective, cashHolding, clients, demoCase, holdings, isClientId, isPerspective, isScreen, marketEvents, perspectives, rebalance, rebalanceFor, screenList, timeline } from '../src/data/demo.ts';
import { readRoute, routeTo } from '../src/routes.ts';

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

test('three complete client cases and twenty meaningful perspective contexts exist', () => {
  assert.equal(clients.length, 3);
  assert.equal(clients.find((client) => client.id === 'MT-1042')?.value, demoCase.value);
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

for (const scenario of Object.values(cases)) {
  test(`${scenario.client}: complete fixtures, balanced portfolios and static outputs`, () => {
    const client = clients.find((entry) => entry.id === scenario.clientId)!;
    assert.equal(client.profile, scenario.profile);
    assert.equal(client.value, scenario.value);
    assert.equal(marketEvents.filter((event) => event.id === scenario.eventId).length, 1);
    assert.equal(new Set(scenario.holdings.map((h) => h.id)).size, scenario.holdings.length);
    for (const field of ['current', 'proposed'] as const) {
      assert.equal(scenario.holdings.reduce((sum, h) => sum + h[field], 0), 100);
      assert.equal(scenario.holdings.reduce((sum, h) => sum + amount(h[field], scenario.value), 0), scenario.value);
      assert.ok(scenario.holdings.every((h) => h[field] >= 0 && h[field] <= 100));
    }
    assert.equal(scenario.holdings.filter((h) => h.id === 'efectivo').length, 1);
    const movements = rebalanceFor(scenario);
    assert.equal(movements.buys, movements.sales + movements.cashUsed);
    assert.equal(scenario.agents.length, 4);
    assert.deepEqual(scenario.agents.map((agent) => agent.id), ['macro', 'instrumentos', 'riesgo', 'sintesis']);
    assert.ok(scenario.agents.every((agent) => agent.result && agent.tool.endsWith('.mock')));
    assert.equal(scenario.causalSteps.length, 4);
    assert.deepEqual(Object.keys(scenario.advisorScript), ['opening', 'event', 'impact', 'proposal', 'closing']);
    assert.match(scenario.advisorScript.opening, new RegExp(`Hola ${scenario.client.split(' ')[0]}`));
    assert.ok(Object.values(scenario.advisorScript).every((text) => text.length > 50));
    assert.match(scenario.advisorScript.closing, /no autoriza ninguna operación/);
    for (const other of Object.values(cases).filter((entry) => entry.clientId !== scenario.clientId)) {
      assert.ok(!JSON.stringify(scenario.advisorScript).includes(other.client.split(' ')[0]));
    }
    assert.ok(Object.keys(scenario.event.inputs).length > 0);
    assert.equal(scenario.timeline.length, 4);
    assert.ok(!scenario.timeline.some((entry) => /aprobada|rechazada|orden ejecutada|consentimiento recibido/i.test(entry.title)));
    for (const screen of screenList) {
      const titles = new Set<string>();
      for (const perspective of ['asesor', 'cliente', 'tecnica', 'control'] as const) {
        const copy = casePerspective(screen.id, perspective, scenario);
        assert.ok(copy.body && copy.title && copy.points.length === 3);
        titles.add(copy.title);
        if (scenario.clientId !== 'MT-1042') assert.doesNotMatch(JSON.stringify(copy), /Mariana|2\.5 millones|125,000|NX-2026-042/);
      }
      assert.equal(titles.size, 4);
    }
  });
}

test('Carlos takes more equity risk on an explicit margin assumption, not oil prices alone', () => {
  const scenario = cases['CL-2086'];
  const inputs = scenario.event.inputs;
  assert.equal(scenario.profile, 'Dinámico');
  assert.equal(scenario.riskLevel, 5);
  assert.equal(inputs.eps_actual_usd, 2.4);
  assert.equal(inputs.eps_consensus_usd, 2);
  assert.equal(inputs.report_date, '2026-10-20');
  assert.equal(inputs.conflict_news_date, '2026-10-21');
  assert.equal(inputs.scenario_date, '2026-10-22');
  assert.equal(inputs.margin_assumption_date, inputs.scenario_date);
  assert.equal(inputs.oil_previous_usd_per_barrel, 75);
  assert.equal(inputs.oil_scenario_usd_per_barrel, 90);
  assert.equal(inputs.refining_margin_before_usd_per_barrel, 18);
  assert.equal(inputs.refining_margin_assumed_after_usd_per_barrel, 19);
  assert.match(String(inputs.margin_basis), /No es un dato observado/);
  const refinery = scenario.holdings.find((h) => h.id === 'refinadora')!;
  assert.deepEqual([refinery.current, refinery.proposed], [15, 20]);
  assert.deepEqual(scenario.holdings.map((h) => [h.id, h.current, h.proposed]), [
    ['refinadora', 15, 20], ['global', 40, 45], ['local', 20, 15], ['deuda-global', 15, 10], ['efectivo', 10, 10],
  ]);
  assert.match(scenario.holdings.find((h) => h.id === 'global')!.instrument, /excluye/);
  for (const [field, expected] of [['current', 55], ['proposed', 65]] as const) {
    assert.equal(scenario.holdings.filter((h) => h.assetClass === 'equity').reduce((sum, h) => sum + h[field], 0), expected);
  }
  assert.deepEqual(rebalanceFor(scenario), { buys: 180_000, sales: 180_000, cashUsed: 0 });
  assert.equal(amount(cashHolding(scenario).proposed, scenario.value), 180_000);
  assert.ok(scenario.estimatedRisk.proposed > scenario.estimatedRisk.current);
  assert.match(scenario.riskNote, /pérdidas importantes/);
  assert.match(scenario.advisorScript.event, /ayer, 21 de octubre/);
  assert.match(scenario.advisorScript.impact, /no es un resultado observado/);
  assert.match(scenario.advisorScript.proposal, /55% a 65%/);
  assert.match(scenario.advisorScript.proposal, /pérdidas importantes/);
});

test('market events are global and contain no client identity or portfolio-specific recommendations', () => {
  assert.equal(new Set(marketEvents.map((event) => event.id)).size, marketEvents.length);
  for (const event of marketEvents) {
    assert.equal(Object.hasOwn(event, 'clientId'), false);
    assert.doesNotMatch(JSON.stringify(event), /Mariana|Carlos|Ana García|MT-1042|CL-2086|AG-3108|95%|su portafolio|su cartera/i);
  }
  for (const perspective of ['asesor', 'cliente', 'tecnica', 'control'] as const) {
    for (const scenario of Object.values(cases)) {
      assert.deepEqual(casePerspective('eventos', perspective, scenario), casePerspective('eventos', perspective));
    }
  }
});

test('Ana diversifies regions while retaining 95% high-quality short-duration debt', () => {
  const scenario = cases['AG-3108'];
  assert.equal(scenario.profile, 'Muy conservador');
  assert.equal(scenario.riskLevel, 1);
  for (const field of ['current', 'proposed'] as const) {
    assert.equal(scenario.holdings.filter((h) => h.assetClass === 'debt').reduce((sum, h) => sum + h[field], 0), 95);
    assert.equal(scenario.holdings.filter((h) => h.assetClass === 'equity').length, 0);
    assert.equal(cashHolding(scenario)[field], 5);
  }
  assert.deepEqual(scenario.holdings.filter((h) => h.assetClass === 'debt').map((h) => [h.region, h.current, h.proposed]), [
    ['EUA', 95, 60], ['México', 0, 20], ['Desarrollados excl. EUA', 0, 15],
  ]);
  assert.equal(amount(20, scenario.value), 840_000);
  assert.equal(amount(15, scenario.value), 630_000);
  assert.deepEqual(rebalanceFor(scenario), { buys: 1_470_000, sales: 1_470_000, cashUsed: 0 });
  assert.equal(amount(cashHolding(scenario).proposed, scenario.value), 210_000);
  assert.match(scenario.riskNote, /costos|contraparte/);
  assert.match(scenario.holdings.find((h) => h.id === 'eua')!.currency!, /USD/);
  assert.equal(scenario.holdings.find((h) => h.id === 'eua')!.region, 'EUA');
  assert.match(scenario.advisorScript.proposal, /sin añadir acciones/);
  assert.match(scenario.advisorScript.proposal, /costos no incluidos y riesgos residuales/);
});

test('case routes require a valid explicit client, including restored screens', () => {
  for (const screen of ['detalle', 'simulador', 'aprobacion'] as const) {
    for (const suffix of ['', '?cliente=constructor', '?cliente=CL-2086&cliente=AG-3108', '?cliente=']) {
      const route = readRoute(`#/${screen}${suffix}`, 'eventos');
      assert.equal(route.screen, 'bandeja');
      assert.ok(route.warning);
      assert.equal(route.clientId, undefined);
    }
    assert.equal(readRoute('', screen).screen, 'bandeja');
    for (const client of clients) {
      const route = readRoute(routeTo(screen, client.id), 'eventos');
      assert.equal(route.screen, screen);
      assert.equal(route.clientId, client.id);
      assert.equal(route.warning, '');
    }
  }
  assert.deepEqual(readRoute('#/detalle/hallazgos?cliente=CL-2086', 'eventos'), { screen: 'detalle', section: 'hallazgos', clientId: 'CL-2086', warning: '' });
  assert.equal(readRoute('#/detalle/no-existe?cliente=CL-2086', 'eventos').screen, 'eventos');
  assert.equal(readRoute('#/simulador/analisis?cliente=CL-2086', 'eventos').screen, 'eventos');
  assert.equal(isClientId('__proto__'), false);
  assert.equal(isClientId('CL-2086'), true);
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
