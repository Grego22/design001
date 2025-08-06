export interface NetworkBlastParams {
  beta: number;
  delta: number;
  activeServers: number;
  queriedServers: number;
}

export interface Connection {
  target: string;
  latency: string;
  phase1Algorithm?: string;
  phase2Algorithm?: string;
  authType?: 'PSK' | 'Certificate';
  rekeyingInterval?: string;
  timeToNextRekeying?: number; // in seconds
}

export interface Endpoint {
  id: string;
  name: string;
  ipAddress: string;
  geoLocation: {
    city: string;
    state: string;
  };
  status: 'active' | 'inactive';
  ipsecImplementation: string;
  rekeyingInterval: string;
  phase1Algorithm: string;
  phase2Algorithm: string;
  authType: 'PSK' | 'Certificate';
  connections: Connection[];
}