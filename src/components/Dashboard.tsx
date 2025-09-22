import React, { useState } from 'react';
import { Shield, Activity, Network, Server, Plus, Settings, Eye, EyeOff } from 'lucide-react';
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
  const [showMeshNetwork, setShowMeshNetwork] = useState(false);

  const activeEndpoints = endpoints.filter(ep => ep.status === 'active').length;
  const totalConnections = endpoints.reduce((acc, ep) => acc + ep.connections.length, 0);

  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Quantum Secure Networking</h1>
                <p className="text-slate-600">IPSec Gateway Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setShowMeshNetwork(!showMeshNetwork)}
              className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
              {showMeshNetwork ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Network
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Network
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Endpoints</p>
                <p className="text-3xl font-bold text-emerald-600">{activeEndpoints}</p>
              </div>
              <Shield className="w-8 h-8" style={{ color: '#1E1E34' }} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Endpoints</p>
                <p className="text-3xl font-bold text-blue-600">{endpoints.length}</p>
              </div>
              <Server className="w-8 h-8" style={{ color: '#1E1E34' }} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Connections</p>
                <p className="text-3xl font-bold text-amber-600">{totalConnections}</p>
              </div>
              <Activity className="w-8 h-8" style={{ color: '#1E1E34' }} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">BLAST Servers</p>
                <p className="text-3xl font-bold text-purple-600">{blastParams.activeServers}</p>
              </div>
              <Network className="w-8 h-8" style={{ color: '#1E1E34' }} />
            </div>
          </div>
        </div>

        {/* Mesh Network Visualization */}
        {showMeshNetwork && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Network Topology</h2>
            <MeshNetwork 
              endpoints={endpoints} 
              onEndpointsChange={onEndpointsChange}
              blastParams={blastParams}
              onBlastParamsChange={onBlastParamsChange}
            />
          </div>
        )}

        {/* Endpoints Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Gateway Endpoints</h2>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
    </div>
  );
};

export default Dashboard;