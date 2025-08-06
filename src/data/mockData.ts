import { Endpoint } from '../types/endpoint';

export const mockEndpoints: Endpoint[] = [
  {
    id: 'ep-001',
    name: 'gateway-001',
    ipAddress: '192.168.1.10',
    status: 'active',
    ipsecImplementation: 'StrongSwan 5.9.8',
    rekeying: '3600s',
    phase1Algorithm: 'AES256-SHA256-MODP2048',
    phase2Algorithm: 'AES256-SHA256-PFS',
    authType: 'Certificate',
    blast: {
      beta: 3,
      delta: 1.7,
      activeServers: 12,
      queriedServers: 8
    },
    connections: [
      { 
        target: 'gateway-002', 
        latency: '2.3ms',
        phase1Algorithm: 'AES256-SHA256-MODP2048',
        phase2Algorithm: 'AES256-SHA256-PFS',
        authType: 'Certificate',
        rekeying: '3600s'
      },
      { 
        target: 'gateway-003', 
        latency: '1.8ms',
        phase1Algorithm: 'AES128-SHA256-MODP1024',
        phase2Algorithm: 'AES128-SHA256-PFS',
        authType: 'PSK',
        rekeying: '1800s'
      }
    ]
  },
  {
    id: 'ep-002',
    name: 'gateway-002',
    ipAddress: '192.168.1.11',
    status: 'active',
    ipsecImplementation: 'StrongSwan 5.9.8',
    rekeying: '1800s',
    phase1Algorithm: 'AES128-SHA256-MODP1024',
    phase2Algorithm: 'AES128-SHA256-PFS',
    authType: 'PSK',
    blast: {
      beta: 4,
      delta: 2.1,
      activeServers: 15,
      queriedServers: 12
    },
    connections: [
      { 
        target: 'gateway-001', 
        latency: '2.1ms',
        phase1Algorithm: 'AES128-SHA256-MODP1024',
        phase2Algorithm: 'AES128-SHA256-PFS',
        authType: 'PSK',
        rekeying: '1800s'
      },
      { 
        target: 'gateway-004', 
        latency: '3.2ms',
        phase1Algorithm: 'AES256-SHA384-MODP3072',
        phase2Algorithm: 'AES256-SHA384-PFS',
        authType: 'Certificate',
        rekeying: '7200s'
      }
    ]
  },
  {
    id: 'ep-003',
    name: 'gateway-003',
    ipAddress: '192.168.1.12',
    status: 'active',
    ipsecImplementation: 'StrongSwan 5.9.7',
    rekeying: '7200s',
    phase1Algorithm: 'AES256-SHA512-MODP4096',
    phase2Algorithm: 'AES256-SHA512-PFS',
    authType: 'Certificate',
    blast: {
      beta: 2,
      delta: 1.4,
      activeServers: 8,
      queriedServers: 6
    },
    connections: [
      { 
        target: 'gateway-001', 
        latency: '1.9ms',
        phase1Algorithm: 'AES256-SHA512-MODP4096',
        phase2Algorithm: 'AES256-SHA512-PFS',
        authType: 'Certificate',
        rekeying: '7200s'
      }
    ]
  },
  {
    id: 'ep-004',
    name: 'gateway-004',
    ipAddress: '192.168.1.13',
    status: 'inactive',
    ipsecImplementation: 'StrongSwan 5.9.8',
    rekeying: '3600s',
    phase1Algorithm: 'AES256-SHA256-MODP2048',
    phase2Algorithm: 'AES256-SHA256-PFS',
    authType: 'PSK',
    blast: {
      beta: 5,
      delta: 2.8,
      activeServers: 0,
      queriedServers: 0
    },
    connections: []
  },
  {
    id: 'ep-005',
    name: 'gateway-005',
    ipAddress: '192.168.1.14',
    status: 'active',
    ipsecImplementation: 'StrongSwan 5.9.9',
    rekeying: '1800s',
    phase1Algorithm: 'AES128-SHA256-MODP1024',
    phase2Algorithm: 'AES128-SHA256-PFS',
    authType: 'Certificate',
    blast: {
      beta: 3,
      delta: 1.9,
      activeServers: 10,
      queriedServers: 7
    },
    connections: [
      { 
        target: 'gateway-002', 
        latency: '2.7ms',
        phase1Algorithm: 'AES128-SHA256-MODP1024',
        phase2Algorithm: 'AES128-SHA256-PFS',
        authType: 'Certificate',
        rekeying: '1800s'
      },
      { 
        target: 'gateway-006', 
        latency: '4.1ms',
        phase1Algorithm: 'AES256-SHA384-MODP3072',
        phase2Algorithm: 'AES256-SHA384-PFS',
        authType: 'PSK',
        rekeying: '3600s'
      }
    ]
  },
  {
    id: 'ep-006',
    name: 'gateway-006',
    ipAddress: '192.168.1.15',
    status: 'active',
    ipsecImplementation: 'StrongSwan 5.9.8',
    rekeying: '3600s',
    phase1Algorithm: 'AES256-SHA384-MODP3072',
    phase2Algorithm: 'AES256-SHA384-PFS',
    authType: 'PSK',
    blast: {
      beta: 4,
      delta: 2.3,
      activeServers: 14,
      queriedServers: 11
    },
    connections: [
      { 
        target: 'gateway-005', 
        latency: '3.8ms',
        phase1Algorithm: 'AES256-SHA384-MODP3072',
        phase2Algorithm: 'AES256-SHA384-PFS',
        authType: 'PSK',
        rekeying: '3600s'
      }
    ]
  }
];