import React from 'react';
import { Activity, Shield, Lock, Zap, Globe, Network } from 'lucide-react';
import EndpointCard from './EndpointCard';
import MeshNetwork from './MeshNetwork';
import { Endpoint, NetworkBlastParams } from '../types/endpoint';

interface DashboardProps {
  endpoints: Endpoint[];
  onEndpointsChange: (endpoints: Endpoint[]) => void;
  blastParams: NetworkBlastParams;
  onBlastParamsChange: (params: NetworkBlastParams) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  endpoints, 
  onEndpointsChange, 
  blastParams, 
  onBlastParamsChange 
}) => {
  const activeEndpoints = endpoints.filter(ep => ep.status === 'active').length;
  const totalConnections = endpoints.reduce((acc, ep) => acc + ep.connections.length, 0);

  return (
    <div className="h-full overflow-auto bg-slate-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Qrypt Quantum Secure Networking
              </h1>
              <p className="text-slate-600">Advanced cryptographic endpoint management with BLAST integration</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-slate-600 rounded-xl shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Endpoints</p>
                  <p className="text-3xl font-bold text-slate-800">{activeEndpoints}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-slate-600 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Endpoints</p>
                  <p className="text-3xl font-bold text-slate-800">{endpoints.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-slate-600 rounded-xl shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Connections</p>
                  <p className="text-3xl font-bold text-slate-800">{totalConnections}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-slate-600 rounded-xl shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">BLAST Servers</p>
                  <p className="text-3xl font-bold text-slate-800">{blastParams.activeServers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mesh Network Visualization */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            BLAST IPSec Tunnels
          </h2>
          <MeshNetwork 
            endpoints={endpoints} 
            onEndpointsChange={onEndpointsChange}
            blastParams={blastParams}
            onBlastParamsChange={onBlastParamsChange}
          />
        </div>

        {/* Endpoint Cards */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Lock className="w-6 h-6 mr-3 text-blue-600" />
            Cryptographic Endpoint Details
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {endpoints.map((endpoint) => (
            <EndpointCard 
              key={endpoint.id} 
              endpoint={endpoint} 
              onEndpointChange={(updatedEndpoint) => {
                const updatedEndpoints = endpoints.map(ep => 
                  ep.id === updatedEndpoint.id ? updatedEndpoint : ep
                );
                onEndpointsChange(updatedEndpoints);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;