import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Heatmap from './components/Heatmap';
import { mockEndpoints, networkBlastParams } from './data/mockData';
import { NetworkBlastParams } from './types/endpoint';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<string>('ipsec-gateway');
  const [endpoints, setEndpoints] = useState(mockEndpoints);
  const [blastParams, setBlastParams] = useState<NetworkBlastParams>(networkBlastParams);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        selectedProduct={selectedProduct}
        onProductSelect={setSelectedProduct}
      />
      <main className="flex-1 overflow-hidden">
        {selectedProduct === 'ipsec-gateway' && (
          <Dashboard 
            endpoints={endpoints} 
            onEndpointsChange={setEndpoints}
            blastParams={blastParams}
            onBlastParamsChange={setBlastParams}
          />
        )}
        {selectedProduct === 'heatmap' && (
          <Heatmap endpoints={endpoints} blastParams={blastParams} />
        )}
        {selectedProduct === 'reports' && (
          <Reports endpoints={endpoints} blastParams={blastParams} />
        )}
      </main>
    </div>
  );
}

export default App;