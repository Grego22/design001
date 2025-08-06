import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import { mockEndpoints } from './data/mockData';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<string>('ipsec-gateway');
  const [endpoints, setEndpoints] = useState(mockEndpoints);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        selectedProduct={selectedProduct}
        onProductSelect={setSelectedProduct}
      />
      <main className="flex-1 overflow-hidden">
        {selectedProduct === 'ipsec-gateway' && (
          <Dashboard endpoints={endpoints} onEndpointsChange={setEndpoints} />
        )}
        {selectedProduct === 'reports' && (
          <Reports endpoints={endpoints} />
        )}
      </main>
    </div>
  );
}

export default App;