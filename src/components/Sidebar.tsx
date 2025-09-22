import React from 'react';
import { Shield, Server, Network, Settings, Lock, BarChart3 } from 'lucide-react';
import qryptLogo from '../assets/Qrypt logo black on light 1200 630.png';

interface SidebarProps {
  selectedProduct: string;
  onProductSelect: (product: string) => void;
}

const products = [
  { id: 'ipsec-gateway', name: 'Quantum Secure Networking', icon: Shield, color: 'text-slate-600' },
  { id: 'heatmap', name: 'Network Heatmap', icon: Network, color: 'text-slate-600' },
  { id: 'reports', name: 'Reports', icon: BarChart3, color: 'text-slate-600' },
  { id: 'system-config', name: 'System Config', icon: Settings, color: 'text-slate-600' },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedProduct, onProductSelect }) => {
  return (
    <div className="w-64 text-white flex flex-col min-h-screen shadow-2xl" style={{ backgroundColor: '#1E1E35' }}>
      <div className="p-6 border-b border-gray-800">
        <div className="mb-2">
          <img 
            src={qryptLogo}
            alt="Qrypt Logo" 
            className="w-full h-24 object-contain"
            onError={(e) => {
              console.error('Logo failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
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
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-300 hover:bg-gray-800 hover:shadow-lg group ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                    isSelected ? 'text-white' : `text-gray-400 group-hover:text-gray-300`
                  }`} />
                  <span className="font-medium text-sm">{product.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-800">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">SA</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">Admin</p>
            <p className="text-xs text-gray-400">admin@qrypt.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;