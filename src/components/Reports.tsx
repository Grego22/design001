import React from 'react';
import { BarChart3, TrendingUp, Shield, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';
import { Endpoint, NetworkBlastParams } from '../types/endpoint';

interface ReportsProps {
  endpoints: Endpoint[];
  blastParams: NetworkBlastParams;
}

const Reports: React.FC<ReportsProps> = ({ endpoints, blastParams }) => {
  const activeEndpoints = endpoints.filter(ep => ep.status === 'active').length;
  const totalConnections = endpoints.reduce((acc, ep) => acc + ep.connections.length, 0);
  const avgLatency = endpoints
    .flatMap(ep => ep.connections)
    .reduce((acc, conn, _, arr) => acc + parseFloat(conn.latency) / arr.length, 0);

  const securityMetrics = {
    certificateAuth: endpoints.filter(ep => ep.authType === 'Certificate').length,
    pskAuth: endpoints.filter(ep => ep.authType === 'PSK').length,
  };

  return (
    <div className="h-full overflow-auto bg-slate-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-slate-600 rounded-2xl shadow-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">System Health</p>
                <p className="text-3xl font-bold text-emerald-600">98.7%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Avg Latency</p>
                <p className="text-3xl font-bold text-blue-600">{avgLatency.toFixed(1)}ms</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Connections</p>
                <p className="text-3xl font-bold text-amber-600">{totalConnections}</p>
              </div>
              <Activity className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Alerts</p>
                <p className="text-3xl font-bold text-red-600">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Security Analysis - removed BLAST Parameters from here */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Authentication Methods
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">Certificate-based</span>
                <div className="flex items-center">
                  <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(securityMetrics.certificateAuth / endpoints.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{securityMetrics.certificateAuth}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">Pre-shared Key</span>
                <div className="flex items-center">
                  <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-amber-600 h-2 rounded-full" 
                      style={{ width: `${(securityMetrics.pskAuth / endpoints.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{securityMetrics.pskAuth}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Empty space where BLAST Parameters used to be */}
          <div></div>
        </div>

        {/* Available Reports */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Available Reports
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="font-medium text-slate-700">Network Performance Analysis</span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">PDF</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                <span className="font-medium text-slate-700">Security Compliance Report</span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">PDF</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                <span className="font-medium text-slate-700">Re-keying Activity Summary</span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">CSV</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                <span className="font-medium text-slate-700">BLAST Parameter Optimization</span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">JSON</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                <span className="font-medium text-slate-700">Threat Detection & Anomalies</span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">PDF</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                <span className="font-medium text-slate-700">Geographic Distribution Analysis</span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">PDF</span>
            </div>
                <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
                <span className="font-medium text-slate-700">Quantum Cryptography Status</span>
              <span className="font-medium text-slate-700">Current Active Connections</span>
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">PDF</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
              <span className="font-medium text-slate-700">Endpoints with ML-KEM</span>
            </div>
          </div>
        </div>

        {/* Endpoint Status Table */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Endpoint Status Overview
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Endpoint</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Implementation</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Auth Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Connections</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">BLAST Version</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Location</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((endpoint) => (
                  <tr key={endpoint.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-slate-800">{endpoint.name}</div>
                        <div className="text-sm text-slate-500 font-mono">{endpoint.ipAddress}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        endpoint.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {endpoint.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{endpoint.ipsecImplementation}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.authType === 'Certificate' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {endpoint.authType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{endpoint.connections.length}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.blastVersion === 'v0.11.23' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {endpoint.blastVersion || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {endpoint.geoLocation.city}, {endpoint.geoLocation.state}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BLAST Parameters - moved to bottom */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            BLAST Parameters
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-slate-700">Network Beta</span>
                <span className="text-2xl font-bold text-blue-600">{blastParams.beta}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(blastParams.beta / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-slate-700">Network Delta</span>
                <span className="text-2xl font-bold text-emerald-600">{blastParams.delta}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full" 
                  style={{ width: `${(blastParams.delta / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700">Active/Queried Servers</span>
                <span className="text-lg font-bold text-amber-600">
                <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                <span className="font-medium text-slate-700">Connection Latency Trends</span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">CSV</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;