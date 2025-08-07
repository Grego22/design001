import { Endpoint, NetworkBlastParams } from '../types/endpoint';

export const networkBlastParams: NetworkBlastParams = {
  beta: 3,
  delta: 2,
  activeServers: 45,
  queriedServers: 32
};

export const mockEndpoints: Endpoint[] = [
  {
    id: 'ep-001',
    name: 'gateway-001',
    ipAddress: '192.168.1.10',
    geoLocation: {
      city: 'New York',
      state: 'NY'
    },
    status: 'active',
    ipsecImplementation: 'StrongSwan 5.9.8',
    rekeyingInterval: '3600s',
    phase1Algorithm: 'AES256-SHA256-MODP2048',
    phase2Algorithm: 'AES256-SHA256-PFS',
    authType: 'Certificate',
    blastVersion: 'v0.11.23',
    connections: [
      { 
        target: 'gateway-002', 
        latency: '2.3ms',
        phase1Algorithm: 'AES256-SHA256-MODP2048',
        phase2Algorithm: 'AES256-SHA256-PFS',
        authType: 'Certificate',
        rekeyingInterval: '3600s',
        timeToNextRekeying: 2847
      },
      { 
        target: 'gateway-003', 
        latency: '1.8ms',
        phase1Algorithm: 'AES128-SHA256-MODP1024',
        phase2Algorithm: 'AES128-SHA256-PFS',
        authType: 'PSK',
        rekeyingInterval: '1800s',
        timeToNextRekeying: 1234
      }
    ]
  },
  {
    id: 'ep-002',
    name: 'gateway-002',
    ipAddress: '192.168.1.11',
    geoLocation: {
      city: 'Los Angeles',
      state: 'CA'
    },
    status: 'active',
    ipsecImplementation: 'StrongSwan 5.9.8',
    rekeyingInterval: '1800s',
    phase1Algorithm: 'AES128-SHA256-MODP1024',
    phase2Algorithm: 'AES128-SHA256-PFS',
    authType: 'PSK',
    blastVersion: 'v0.11.22',
    connections: [
      { 
        target: 'gateway-001', 
        latency: '2.1ms',
        phase1Algorithm: 'AES128-SHA256-MODP1024',
        phase2Algorithm: 'AES128-SHA256-PFS',
        authType: 'PSK',
        rekeyingInterval: '1800s',
        timeToNextRekeying: 892
      },
      { 
        target: 'gateway-004', 
        latency: '3.2ms',
        phase1Algorithm: 'AES256-SHA384-MODP3072',
        phase2Algorithm: 'AES256-SHA384-PFS',
        authType: 'Certificate',
        rekeyingInterval: '7200s',
        timeToNextRekeying: 5643
      }
    ]
  },
  {
    id: 'ep-003',
    name: 'gateway-003',
    ipAddress: '192.168.1.12',
    geoLocation: {
      city: 'Chicago',
      state: 'IL'
    },
    status: 'active',
    ipsecImplementation: 'StrongSwan 5.9.7',
    rekeyingInterval: '7200s',
    phase1Algorithm: 'AES256-SHA512-MODP4096',
    phase2Algorithm: 'AES256-SHA512-PFS',
    authType: 'Certificate',
    blastVersion: 'v0.11.23',
    connections: [
      { 
        target: 'gateway-001', 
        latency: '1.9ms',
        phase1Algorithm: 'AES256-SHA512-MODP4096',
        phase2Algorithm: 'AES256-SHA512-PFS',
        authType: 'Certificate',
        rekeyingInterval: '7200s',
        timeToNextRekeying: 4521
      }
    ]
  },
  {
    id: 'ep-004',
    name: 'gateway-004',
    ipAddress: '192.168.1.13',
    geoLocation: {
      city: 'Miami',
      state: 'FL'
    },
    status: 'inactive',
    ipsecImplementation: 'StrongSwan 5.9.8',
    rekeyingInterval: '3600s',
    phase1Algorithm: 'AES256-SHA256-MODP2048',
    phase2Algorithm: 'AES256-SHA256-PFS',
    authType: 'PSK',
    blastVersion: 'v0.11.22',
    connections: []
  },
  {
    id: 'ep-005',
    name: 'gateway-005',
    ipAddress: '192.168.1.14',
    geoLocation: {
      city: 'Seattle',
      state: 'WA'
    },
    status: 'active',
    ipsecImplementation: 'StrongSwan 5.9.9',
    rekeyingInterval: '1800s',
    phase1Algorithm: 'AES128-SHA256-MODP1024',
    phase2Algorithm: 'AES128-SHA256-PFS',
    authType: 'Certificate',
    blastVersion: 'v0.11.23',
    connections: [
      { 
        target: 'gateway-002', 
        latency: '2.7ms',
        phase1Algorithm: 'AES128-SHA256-MODP1024',
        phase2Algorithm: 'AES128-SHA256-PFS',
        authType: 'Certificate',
        rekeyingInterval: '1800s',
        timeToNextRekeying: 1567
      },
      { 
        target: 'gateway-006', 
        latency: '4.1ms',
        phase1Algorithm: 'AES256-SHA384-MODP3072',
        phase2Algorithm: 'AES256-SHA384-PFS',
        authType: 'PSK',
        rekeyingInterval: '3600s',
        timeToNextRekeying: 2890
      }
    ]
  },
  {
    id: 'ep-006',
    name: 'gateway-006',
    ipAddress: '192.168.1.15',
    geoLocation: {
      city: 'Dallas',
      state: 'TX'
    },
    status: 'active',
    ipsecImplementation: 'StrongSwan 5.9.8',
    rekeyingInterval: '3600s',
    phase1Algorithm: 'AES256-SHA384-MODP3072',
    phase2Algorithm: 'AES256-SHA384-PFS',
    authType: 'PSK',
    blastVersion: 'v0.11.23',
    connections: [
      { 
        target: 'gateway-005', 
        latency: '3.8ms',
        phase1Algorithm: 'AES256-SHA384-MODP3072',
        phase2Algorithm: 'AES256-SHA384-PFS',
        authType: 'PSK',
        rekeyingInterval: '3600s',
        timeToNextRekeying: 3421
      }
    ]
  }
];