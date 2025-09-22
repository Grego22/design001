import React, { useState } from 'react';
import { Download, Settings, FileText, Package } from 'lucide-react';

const SystemConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('downloads');

  const downloads = [
    {
      id: 'blast-sdk',
      name: 'BLAST SDK',
      description: 'Software Development Kit for BLAST integration',
      version: 'v0.11.23',
      size: '45.2 MB',
      type: 'SDK',
      downloadUrl: '#' // This would be the actual download URL
    }
  ];

  const handleDownload = (item: typeof downloads[0]) => {
    // In a real application, this would trigger the actual download
    console.log(`Downloading ${item.name}...`);
    // You could implement actual download logic here
  };

  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-slate-600 rounded-2xl shadow-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">System Configuration</h1>
              <p className="text-slate-600">Manage system settings and downloads</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('downloads')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'downloads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Download className="w-4 h-4 inline mr-2" />
                Downloads
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                General
              </button>
            </nav>
          </div>
        </div>

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Available Downloads
              </h3>
              
              <div className="space-y-4">
                {downloads.map((item) => (
                  <div key={item.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-800">{item.name}</h4>
                            <p className="text-sm text-slate-600">{item.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                          <div className="flex items-center">
                            <span className="font-medium">Version:</span>
                            <span className="ml-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                              {item.version}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Size:</span>
                            <span className="ml-1">{item.size}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Type:</span>
                            <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <button
                          onClick={() => handleDownload(item)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Download Instructions</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Ensure you have appropriate permissions to download SDK files</li>
                    <li>• The BLAST SDK includes documentation, examples, and integration guides</li>
                    <li>• For technical support, contact your system administrator</li>
                    <li>• Check system requirements before installation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              General Settings
            </h3>
            <p className="text-slate-600">General system configuration options will be available here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemConfig;