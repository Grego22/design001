import React from 'react';
import { Shield, Server, Network, Settings, Lock, BarChart3 } from 'lucide-react';

interface SidebarProps {
  selectedProduct: string;
  onProductSelect: (product: string) => void;
}

const products = [
  { id: 'ipsec-gateway', name: 'IPSec Gateway', icon: Shield, color: 'text-blue-400' },
  { id: 'reports', name: 'Security Reports', icon: BarChart3, color: 'text-slate-400' },
  { id: 'load-balancer', name: 'Load Balancer', icon: Server, color: 'text-slate-500' },
  { id: 'network-monitor', name: 'Network Monitor', icon: Network, color: 'text-slate-500' },
  { id: 'system-config', name: 'System Config', icon: Settings, color: 'text-slate-500' },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedProduct, onProductSelect }) => {
  return (
    <div className="w-72 bg-slate-900 shadow-2xl border-r border-slate-700/50 flex flex-col">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-400">
              CryptoShield
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">ENTERPRISE SECURITY</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
          Security Modules
        </h2>
        <ul className="space-y-2">
          {products.map((product) => {
            const Icon = product.icon;
            const isSelected = selectedProduct === product.id;
            
            return (
              <li key={product.id}>
                <button
                  onClick={() => onProductSelect(product.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-300 hover:bg-slate-800/50 hover:shadow-lg group ${
                    isSelected 
                      ? 'bg-blue-500/20 text-blue-300 border-r-2 border-blue-400 shadow-lg' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                    isSelected ? 'text-blue-400' : `${product.color} group-hover:text-white`
                  }`} />
                  <span className="font-medium text-sm">{product.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">SA</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">Security Admin</p>
            <p className="text-xs text-slate-400">admin@cryptoshield.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;