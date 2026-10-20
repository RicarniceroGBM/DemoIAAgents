export type Screen = 'eventos' | 'bandeja' | 'detalle' | 'simulador' | 'aprobacion';
export type Perspective = 'asesor' | 'cliente' | 'tecnica' | 'control';
export type Tone = 'green' | 'amber' | 'blue' | 'neutral';
export type Decision = 'aprobar' | 'modificar' | 'rechazar' | 'revision';

export interface MarketEvent {
  id: string;
  category: 'Política monetaria' | 'Inflación' | 'Divisas';
  institution: string;
  title: string;
  description: string;
  time: string;
  impact: string;
  tone: Tone;
  featured: boolean;
  tags: string[];
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  profile: string;
  value: number;
  event: string;
  status: string;
  main: boolean;
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
}

export interface PerspectiveCopy {
  label: string;
  role: string;
  description: string;
  screens: Record<Screen, { title: string; body: string; points: string[] }>;
}
