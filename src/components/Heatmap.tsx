import React, { useState } from 'react';
import { Activity, Shield, Thermometer, MapPin, Zap, TrendingUp } from 'lucide-react';
import { Endpoint, NetworkBlastParams } from '../types/endpoint';

interface HeatmapProps {
  endpoints: Endpoint[];
  blastParams: NetworkBlastParams;
}

interface HeatmapMetric {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  getValue: (endpoint: Endpoint) => number;
  getColor: (value: number, max: number) => string;
  unit: string;
}

const Heatmap: React.FC<HeatmapProps> = ({ endpoints, blastParams }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('connections');

  const metrics: HeatmapMetric[] = [
    {
      id: 'connections',
      name: 'Active Connections',
      icon: Activity,
      color: 'text-blue-600',
      getValue: (endpoint) => endpoint.connections.length,
      getColor: (value, max) => {
        const intensity = max > 0 ? value / max : 0;
        return `rgba(59, 130, 246, ${0.2 + intensity * 0.8})`;
      },
      unit: 'connections'
    },
    {
      id: 'latency',
      name: 'Average Latency',
      icon: Zap,
      color: 'text-amber-600',
      getValue: (endpoint) => {
        if (endpoint.connections.length === 0) return 0;
        const avgLatency = endpoint.connections.reduce((acc, conn) => 
          acc + parseFloat(conn.latency), 0) / endpoint.connections.length;
        return avgLatency;
      },
      getColor: (value, max) => {
        const intensity = max > 0 ? value / max : 0;
        return `rgba(245, 158, 11, ${0.2 + intensity * 0.8})`;
      },
      unit: 'ms'
    },
    {
      id: 'rekeying',
      name: 'Re-keying Activity',
      icon: Shield,
      color: 'text-emerald-600',
      getValue: (endpoint) => {
        if (endpoint.connections.length === 0) return 0;
        const avgTimeToRekey = endpoint.connections.reduce((acc, conn) => 
          acc + (conn.timeToNextRekeying || 0), 0) / endpoint.connections.length;
        return 3600 - avgTimeToRekey; // Higher value = more recent re-keying
      },
      getColor: (value, max) => {
        const intensity = max > 0 ? value / max : 0;
        return `rgba(16, 185, 129, ${0.2 + intensity * 0.8})`;
      },
      unit: 'activity'
    },
    {
      id: 'security',
      name: 'Security Score',
      icon: Shield,
      color: 'text-purple-600',
      getValue: (endpoint) => {
        let score = 0;
        if (endpoint.authType === 'Certificate') score += 50;
        if (endpoint.phase1Algorithm.includes('AES256')) score += 30;
        if (endpoint.phase2Algorithm.includes('AES256')) score += 20;
        return score;
      },
      getColor: (value, max) => {
        const intensity = max > 0 ? value / max : 0;
        return `rgba(147, 51, 234, ${0.2 + intensity * 0.8})`;
      },
      unit: 'score'
    }
  ];

  const currentMetric = metrics.find(m => m.id === selectedMetric) || metrics[0];
  const metricValues = endpoints.map(ep => currentMetric.getValue(ep));
  const maxValue = Math.max(...metricValues, 1);

  // Create a grid layout for the heatmap
  const gridSize = Math.ceil(Math.sqrt(endpoints.length));
  const cellSize = 120;
  const padding = 20;

  return (
    <div className="h-full overflow-auto bg-slate-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl">
              <Thermometer className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Network Heatmap</h1>
              <p className="text-slate-600">Visual analysis of gateway performance and security metrics</p>
            </div>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Select Metric</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const isSelected = selectedMetric === metric.id;
              
              return (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : metric.color}`} />
                    <div className="text-left">
                      <div className={`font-semibold ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>
                        {metric.name}
                      </div>
                      <div className="text-sm text-slate-600">{metric.unit}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <currentMetric.icon className={`w-6 h-6 mr-3 ${currentMetric.color}`} />
              {currentMetric.name} Heatmap
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Low</span>
              <div className="w-32 h-4 bg-gradient-to-r from-slate-200 to-blue-600 rounded-full"></div>
              <span className="text-sm text-slate-600">High</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <svg
              width={gridSize * (cellSize + padding)}
              height={gridSize * (cellSize + padding)}
              className="w-full h-auto"
              viewBox={`0 0 ${gridSize * (cellSize + padding)} ${gridSize * (cellSize + padding)}`}
            >
              {endpoints.map((endpoint, index) => {
                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                const x = col * (cellSize + padding) + padding;
                const y = row * (cellSize + padding) + padding;
                const value = currentMetric.getValue(endpoint);
                const fillColor = currentMetric.getColor(value, maxValue);
                
                return (
                  <g key={endpoint.id}>
                    {/* Cell background */}
                    <rect
                      x={x}
                      y={y}
                      width={cellSize}
                      height={cellSize}
                      fill={fillColor}
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      rx="12"
                      className="hover:stroke-blue-500 transition-colors duration-200"
                    />
                    
                    {/* Status indicator */}
                    <circle
                      cx={x + cellSize - 15}
                      cy={y + 15}
                      r="6"
                      fill={endpoint.status === 'active' ? '#10b981' : '#ef4444'}
                      stroke="white"
                      strokeWidth="2"
                    />
                    
                    {/* Gateway name */}
                    <text
                      x={x + cellSize / 2}
                      y={y + 25}
                      textAnchor="middle"
                      fill="#1e293b"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      {endpoint.name}
                    </text>
                    
                    {/* IP Address */}
                    <text
                      x={x + cellSize / 2}
                      y={y + 45}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {endpoint.ipAddress}
                    </text>
                    
                    {/* Location */}
                    <text
                      x={x + cellSize / 2}
                      y={y + 60}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="10"
                    >
                      {endpoint.geoLocation.city}, {endpoint.geoLocation.state}
                    </text>
                    
                    {/* Metric value */}
                    <text
                      x={x + cellSize / 2}
                      y={y + 85}
                      textAnchor="middle"
                      fill="#1e293b"
                      fontSize="18"
                      fontWeight="bold"
                    >
                      {value.toFixed(1)}
                    </text>
                    
                    {/* Metric unit */}
                    <text
                      x={x + cellSize / 2}
                      y={y + 100}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="10"
                    >
                      {currentMetric.unit}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Average {currentMetric.name}</p>
                <p className="text-3xl font-bold text-blue-600">
                  {(metricValues.reduce((a, b) => a + b, 0) / metricValues.length).toFixed(1)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Maximum Value</p>
                <p className="text-3xl font-bold text-emerald-600">{maxValue.toFixed(1)}</p>
              </div>
              <Activity className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Gateways</p>
                <p className="text-3xl font-bold text-amber-600">
                  {endpoints.filter(ep => ep.status === 'active').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">BLAST Beta</p>
                <p className="text-3xl font-bold text-purple-600">{blastParams.beta}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Heatmap Legend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">Color Intensity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-slate-200 rounded mr-3"></div>
                  <span className="text-slate-600">Low activity/value</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-3" style={{ backgroundColor: currentMetric.getColor(maxValue * 0.5, maxValue) }}></div>
                  <span className="text-slate-600">Medium activity/value</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-3" style={{ backgroundColor: currentMetric.getColor(maxValue, maxValue) }}></div>
                  <span className="text-slate-600">High activity/value</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">Status Indicators</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                  <span className="text-slate-600">Gateway Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-slate-600">Gateway Inactive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;