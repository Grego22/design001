export interface BlastParams {
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
  rekeying?: string;
}

export interface Endpoint {
  id: string;
  name: string;
  ipAddress: string;
  status: 'active' | 'inactive';
  ipsecImplementation: string;
  rekeying: string;
  phase1Algorithm: string;
  phase2Algorithm: string;
  authType: 'PSK' | 'Certificate';
  blast: BlastParams;
  connections: Connection[];
}