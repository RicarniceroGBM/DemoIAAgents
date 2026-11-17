export type Screen = 'eventos' | 'bandeja' | 'detalle' | 'simulador' | 'aprobacion';
export type Perspective = 'asesor' | 'cliente' | 'tecnica' | 'control';
export type Tone = 'green' | 'amber' | 'blue' | 'neutral';
export type Decision = 'aprobar' | 'modificar' | 'rechazar' | 'revision';

export interface MarketEvent {
  id: string;
  category: 'Política monetaria' | 'Inflación' | 'Divisas' | 'Energía y geopolítica' | 'Renta fija global';
  institution: string;
  title: string;
  description: string;
  time: string;
  impact: string;
  tone: Tone;
  featured: boolean;
  tags: string[];
}

export type ClientId = 'MT-1042' | 'CL-2086' | 'AG-3108';

export interface Client {
  id: ClientId;
  name: string;
  initials: string;
  profile: string;
  value: number;
  event: string;
  status: string;
}

export interface Agent {
  id: string;
  number: string;
  name: string;
  role: string;
  tool: string;
  result: string;
  duration: string;
}

export interface Holding {
  id: string;
  name: string;
  instrument: string;
  color: string;
  current: number;
  proposed: number;
  sensitivity: string;
  rationale: string;
  assetClass?: 'debt' | 'equity' | 'cash';
  region?: string;
  currency?: string;
}

export interface Scenario {
  id: string;
  eventId: string;
  clientId: ClientId;
  initials: string;
  date: string;
  client: string;
  value: number;
  profile: string;
  riskLevel: number;
  goal: string;
  horizon: string;
  estimatedRisk: { current: number; proposed: number };
  estimatedReturn: { current: number; proposed: number };
  event: { title: string; description: string; source: string; inputs: Record<string, string | number> };
  holdings: Holding[];
  agents: Agent[];
  causalSteps: { title: string; text: string }[];
  recommendation: string;
  riskNote: string;
  conversation: string;
  advisorScript: {
    opening: string;
    event: string;
    impact: string;
    proposal: string;
    closing: string;
  };
  auditSource: string;
  timeline: { time: string; title: string; body: string }[];
}

export interface PerspectiveCopy {
  label: string;
  role: string;
  description: string;
  screens: Record<Screen, { title: string; body: string; points: string[] }>;
}
