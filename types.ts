
export enum CloudType {
  CUMULUS = 'Cumulus',
  STRATUS = 'Stratus',
  CIRRUS = 'Cirrus',
  NIMBUS = 'Nimbus-Heavy',
  ALTOCUMULUS = 'Altocumulus-v2'
}

export interface CloudInstance {
  id: string;
  name: string;
  type: CloudType;
  lat: number;
  lng: number;
  humidity: number;
  windSpeed: number;
  area: number;
  status: 'Active' | 'Evaporating' | 'Liquidated' | 'Pending';
  rentedAt: Date;
  expiresAt: Date;
  ownerId: string;
  creditsPerHour: number;
}

export interface EvaporationLog {
  id: string;
  cloudName: string;
  evaporatedAt: Date;
  volumeRecovered: number;
  creditsRefunded: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  credits: number;
  plan: 'Free-Tier' | 'Cloud-Pro' | 'Enterprise-Mist';
  token?: string;
}

export interface SystemHealth {
  service: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  latency: number;
}
