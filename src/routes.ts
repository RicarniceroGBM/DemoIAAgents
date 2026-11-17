import { isClientId, isScreen } from './data/demo.ts';
import type { ClientId, Screen } from './types.ts';

export type DetailSection = 'evento' | 'analisis' | 'hallazgos' | 'sintesis';
export interface Route {
  screen: Screen;
  section?: DetailSection;
  clientId?: ClientId;
  warning: string;
}

export const isCaseScreen = (screen: Screen) => ['detalle', 'simulador', 'aprobacion'].includes(screen);
const isSection = (value: string): value is DetailSection =>
  ['evento', 'analisis', 'hallazgos', 'sintesis'].includes(value);

export function routeTo(screen: Screen, clientId?: ClientId, section?: DetailSection) {
  return `#/${screen}${section ? `/${section}` : ''}${clientId ? `?cliente=${clientId}` : ''}`;
}

export function readRoute(hash: string, fallback: Screen): Route {
  const [path, query = '', ...extra] = hash.replace(/^#\/?/, '').split('?');
  const [screen, section, ...parts] = path.split('/');
  const target = !hash || hash === '#' ? fallback : screen;
  if (!isScreen(target) || parts.length || extra.length || (section && (target !== 'detalle' || !isSection(section)))) {
    return { screen: 'eventos', warning: 'La ruta no existe en esta demo. Se muestra el Centro de eventos.' };
  }
  const params = new URLSearchParams(query);
  const ids = params.getAll('cliente');
  const clientId = ids.length === 1 && isClientId(ids[0]) ? ids[0] : undefined;
  if ((ids.length > 0 && !clientId) || (isCaseScreen(target) && !clientId)) {
    return { screen: 'bandeja', warning: 'Selecciona un cliente válido en la bandeja para consultar el análisis, la simulación y la trazabilidad.' };
  }
  return { screen: target, section: section && isSection(section) ? section : undefined, clientId, warning: '' };
}
