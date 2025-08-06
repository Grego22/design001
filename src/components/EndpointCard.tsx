import React, { useState } from 'react';
import { Shield, Activity, Key, RefreshCw, Server, Zap, Lock, Cpu, Edit2, Save, X, MapPin } from 'lucide-react';
import { Endpoint, Connection } from '../types/endpoint';

interface EndpointCardProps {
  endpoint: Endpoint;
  onEndpointChange: (endpoint: Endpoint) => void;
}

const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint, onEndpointChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingConnection, setEditingConnection] = useState<number | null>(null);
  const [editedEndpoint, setEditedEndpoint] = useState<Endpoint>(endpoint);

  const statusColor = endpoint.status === 'active' ? 'text-emerald-400' : 'text-red-400';
  const statusBg = endpoint.status === 'active' ? 'bg-emerald-50' : 'bg-red-50';
  const statusBorder = endpoint.status === 'active' ? 'border-emerald-200' : 'border-red-200';

  const handleSave = () => {
    onEndpointChange(editedEndpoint);
    setIsEditing(false);
    setEditingConnection(null);
  };

  const handleCancel = () => {
    setEditedEndpoint(endpoint);
    setIsEditing(false);
    setEditingConnection(null);
  };

  const updateConnection = (index: number, field: keyof Connection, value: string) => {
    const updatedConnections = [...editedEndpoint.connections];
    if (field === 'timeToNextRekeying') {
      updatedConnections[index] = { ...updatedConnections[index], [field]: parseInt(value) || 0 };
    } else {
      updatedConnections[index] = { ...updatedConnections[index], [field]: value };
    }
    setEditedEndpoint({ ...editedEndpoint, connections: updatedConnections });
  };

  const updateEndpoint = (field: keyof Endpoint, value: any) => {
    setEditedEndpoint({
      ...editedEndpoint,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      {/* Status Bar */}
      <div className={`h-1 ${endpoint.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${statusBg} ${statusBorder} border`}>
              <Shield className={`w-6 h-6 ${statusColor}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{endpoint.name}</h3>
              <p className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded-md inline-block">
                {endpoint.ipAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg ${
              endpoint.status === 'active' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {endpoint.status}
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Basic Details */}
        <div className="space-y-4 mb-6 bg-slate-50 rounded-xl p-4">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center mb-3">
            <Server className="w-4 h-4 mr-2" />
            Gateway Details
          </h4>
          
          {/* IP Address */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center font-medium">
              <Server className="w-4 h-4 mr-2" />
              IP Address
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editedEndpoint.ipAddress}
                onChange={(e) => updateEndpoint('ipAddress', e.target.value)}
                className="font-mono text-slate-800 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <span className="font-mono text-slate-800 bg-white px-2 py-1 rounded-lg shadow-sm">
                {endpoint.ipAddress}
              </span>
            )}
          </div>
          
          {/* Geo Location */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center font-medium">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </span>
            {isEditing ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="City"
                  value={editedEndpoint.geoLocation.city}
                  onChange={(e) => updateEndpoint('geoLocation', { ...editedEndpoint.geoLocation, city: e.target.value })}
                  className="text-slate-800 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-300 focus:outline-none focus:border-blue-500 w-20"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={editedEndpoint.geoLocation.state}
                  onChange={(e) => updateEndpoint('geoLocation', { ...editedEndpoint.geoLocation, state: e.target.value })}
                  className="text-slate-800 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-300 focus:outline-none focus:border-blue-500 w-16"
                />
              </div>
            ) : (
              <span className="font-medium text-slate-800 bg-white px-2 py-1 rounded-lg shadow-sm">
                {endpoint.geoLocation.city}, {endpoint.geoLocation.state}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center font-medium">
              <Server className="w-4 h-4 mr-2" />
              Implementation
            </span>
            <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded-lg shadow-sm">
              {endpoint.ipsecImplementation}
            </span>
          </div>
        </div>

        {/* Save/Cancel buttons for main endpoint editing */}
        {isEditing && (
          <div className="flex justify-end space-x-2 mb-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Active Connections */}
        <div>
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center mb-3">
            <Activity className="w-4 h-4 mr-2" />
            Active Connections
          </h4>
          <div className="space-y-3">
            {endpoint.connections.map((conn, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-700 font-medium">→ {conn.target}</span>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                      {conn.latency}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingConnection(editingConnection === index ? null : index)}
                    className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
                
                {editingConnection === index && (
                  <div className="space-y-3 border-t border-slate-200 pt-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-600 font-medium block mb-1">Re-keying Interval:</label>
                        <input
                          type="text"
                          value={editedEndpoint.connections[index]?.rekeyingInterval || ''}
                          onChange={(e) => updateConnection(index, 'rekeyingInterval', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 font-medium block mb-1">Next Re-key (sec):</label>
                        <input
                          type="number"
                          value={editedEndpoint.connections[index]?.timeToNextRekeying || 0}
                          onChange={(e) => updateConnection(index, 'timeToNextRekeying', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-600 font-medium block mb-1">Auth Type:</label>
                        <select
                          value={editedEndpoint.connections[index]?.authType || ''}
                          onChange={(e) => updateConnection(index, 'authType', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                        >
                          <option value="Certificate">Certificate</option>
                          <option value="PSK">PSK</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-600 font-medium block mb-1">Phase 1 Algorithm:</label>
                      <input
                        type="text"
                        value={editedEndpoint.connections[index]?.phase1Algorithm || ''}
                        onChange={(e) => updateConnection(index, 'phase1Algorithm', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 font-medium block mb-1">Phase 2 Algorithm:</label>
                      <input
                        type="text"
                        value={editedEndpoint.connections[index]?.phase2Algorithm || ''}
                        onChange={(e) => updateConnection(index, 'phase2Algorithm', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-mono text-xs"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setEditingConnection(null)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded text-xs transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors duration-200"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
                
                {editingConnection !== index && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Re-keying Interval:</span>
                      <span className="font-medium text-slate-800">{conn.rekeyingInterval || endpoint.rekeyingInterval}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Next Re-key:</span>
                      <span className="font-medium text-emerald-600">{conn.timeToNextRekeying || 0}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Auth:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        (conn.authType || endpoint.authType) === 'Certificate' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {conn.authType || endpoint.authType}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="text-slate-600 mb-1">Phase 1:</div>
                      <div className="font-mono text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        {conn.phase1Algorithm || endpoint.phase1Algorithm}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-slate-600 mb-1">Phase 2:</div>
                      <div className="font-mono text-xs bg-slate-600 text-white px-2 py-1 rounded">
                        {conn.phase2Algorithm || endpoint.phase2Algorithm}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {endpoint.connections.length === 0 && (
              <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 rounded-lg">
                No active connections
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndpointCard;