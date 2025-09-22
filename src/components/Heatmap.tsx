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

// Approximate coordinates for US cities (latitude, longitude)
const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'New York': { lat: 40.7128, lng: -74.0060 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'Chicago': { lat: 41.8781, lng: -87.6298 },
  'Miami': { lat: 25.7617, lng: -80.1918 },
  'Seattle': { lat: 47.6062, lng: -122.3321 },
  'Dallas': { lat: 32.7767, lng: -96.7970 },
  'Denver': { lat: 39.7392, lng: -104.9903 },
  'Atlanta': { lat: 33.7490, lng: -84.3880 },
  'Phoenix': { lat: 33.4484, lng: -112.0740 },
  'Boston': { lat: 42.3601, lng: -71.0589 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'Washington': { lat: 38.9072, lng: -77.0369 },
  'Philadelphia': { lat: 39.9526, lng: -75.1652 },
  'Houston': { lat: 29.7604, lng: -95.3698 },
  'Detroit': { lat: 42.3314, lng: -83.0458 },
  'Minneapolis': { lat: 44.9778, lng: -93.2650 },
  'Portland': { lat: 45.5152, lng: -122.6784 },
  'Las Vegas': { lat: 36.1699, lng: -115.1398 },
  'Nashville': { lat: 36.1627, lng: -86.7816 },
  'New City': { lat: 39.8283, lng: -98.5795 } // Default center of US
};

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
        return `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`;
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
        return `rgba(245, 158, 11, ${0.3 + intensity * 0.7})`;
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
        return `rgba(16, 185, 129, ${0.3 + intensity * 0.7})`;
      },
      unit: 'activity'
    }
  ];

  const currentMetric = metrics.find(m => m.id === selectedMetric) || metrics[0];
  const metricValues = endpoints.map(ep => currentMetric.getValue(ep));
  const maxValue = Math.max(...metricValues, 1);

  // Convert lat/lng to SVG coordinates
  const mapWidth = 1000;
  const mapHeight = 600;
  const latRange = { min: 24.5, max: 49.4 }; // More precise US latitude range
  const lngRange = { min: -125, max: -66.9 }; // More precise US longitude range

  const getCoordinates = (endpoint: Endpoint) => {
    const coords = cityCoordinates[endpoint.geoLocation.city] || cityCoordinates['New City'];
    const x = ((coords.lng - lngRange.min) / (lngRange.max - lngRange.min)) * mapWidth;
    const y = mapHeight - ((coords.lat - latRange.min) / (latRange.max - latRange.min)) * mapHeight;
    return { x, y };
  };

  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl">
              <Thermometer className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Network Heatmap</h1>
              <p className="text-slate-600">Geographical visualization of gateway performance metrics</p>
            </div>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Select Metric</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Geographic Heatmap */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <currentMetric.icon className={`w-6 h-6 mr-3 ${currentMetric.color}`} />
              {currentMetric.name} Geographic Distribution
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Low</span>
              <div className="w-32 h-4 bg-gradient-to-r from-slate-200 to-blue-600 rounded-full"></div>
              <span className="text-sm text-slate-600">High</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <svg
              width={mapWidth}
              height={mapHeight}
              className="w-full h-auto border border-slate-200 rounded-lg"
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              style={{ backgroundColor: '#f8fafc' }}
            >
              {/* US Map Outline */}
              <defs>
                <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3"/>
                </pattern>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
              
              {/* Connection lines */}
              {endpoints.map(endpoint => 
                endpoint.connections.map((conn, connIndex) => {
                  const sourceCoords = getCoordinates(endpoint);
                  const targetEndpoint = endpoints.find(ep => ep.name === conn.target);
                  if (!targetEndpoint) return null;
                  const targetCoords = getCoordinates(targetEndpoint);
                  
                  return (
                    <line
                      key={`${endpoint.id}-${connIndex}`}
                      x1={sourceCoords.x}
                      y1={sourceCoords.y}
                      x2={targetCoords.x}
                      y2={targetCoords.y}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                      opacity="0.4"
                    />
                  );
                })
              )}

              {/* Gateway markers */}
              {endpoints.map((endpoint, index) => {
                const coords = getCoordinates(endpoint);
                const value = currentMetric.getValue(endpoint);
                const fillColor = currentMetric.getColor(value, maxValue);
                const radius = 15 + (value / maxValue) * 15; // Size based on metric value
                
                return (
                  <g key={endpoint.id}>
                    {/* Gateway circle with heatmap color */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={radius}
                      fill={fillColor}
                      stroke={endpoint.status === 'active' ? '#10b981' : '#ef4444'}
                      strokeWidth="3"
                      className="hover:stroke-blue-500 transition-colors duration-200"
                    />
                    
                    {/* Gateway name */}
                    <text
                      x={coords.x}
                      y={coords.y - radius - 8}
                      textAnchor="middle"
                      fill="#1e293b"
                      fontSize="12"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {endpoint.name}
                    </text>
                    
                    {/* Metric value */}
                    <text
                      x={coords.x}
                      y={coords.y}
                      textAnchor="middle"
                      fill="#1e293b"
                      fontSize="10"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {value.toFixed(1)}
                    </text>
                    
                    {/* Location info */}
                    <text
                      x={coords.x}
                      y={coords.y + radius + 15}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="10"
                      className="pointer-events-none"
                    >
                      {endpoint.geoLocation.city}, {endpoint.geoLocation.state}
                    </text>
                    
                    {/* IP Address */}
                    <text
                      x={coords.x}
                      y={coords.y + radius + 28}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      className="pointer-events-none"
                    >
                      {endpoint.ipAddress}
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
            Geographic Heatmap Legend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">Circle Size & Color</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-slate-200 rounded-full mr-3"></div>
                  <span className="text-slate-600">Low metric value</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full mr-3" style={{ backgroundColor: currentMetric.getColor(maxValue * 0.5, maxValue) }}></div>
                  <span className="text-slate-600">Medium metric value</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full mr-3" style={{ backgroundColor: currentMetric.getColor(maxValue, maxValue) }}></div>
                  <span className="text-slate-600">High metric value</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">Status Indicators</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-emerald-500 rounded-full mr-3"></div>
                  <span className="text-slate-600">Gateway Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-red-500 rounded-full mr-3"></div>
                  <span className="text-slate-600">Gateway Inactive</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-1 bg-blue-600 mr-3 opacity-40" style={{clipPath: 'polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)'}}></div>
                  <span className="text-slate-600">IPSec Connection</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">Map Features</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div>• Simplified US continental outline</div>
                <div>• State boundary grid lines</div>
                <div>• Gateways positioned by city coordinates</div>
                <div>• Connection lines show IPSec tunnels</div>
                <div>• Circle size indicates metric intensity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;