import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Settings, Copy, CheckCircle, RotateCcw } from 'lucide-react';
import { Endpoint, Connection, NetworkBlastParams } from '../types/endpoint';

interface MeshNetworkProps {
  endpoints: Endpoint[];
  onEndpointsChange: (endpoints: Endpoint[]) => void;
  blastParams: NetworkBlastParams;
  onBlastParamsChange: (params: NetworkBlastParams) => void;
}

interface Position {
  x: number;
  y: number;
}

interface HoverInfo {
  visible: boolean;
  x: number;
  y: number;
  source: string;
  target: string;
  latency: string;
  phase1: string;
  phase2: string;
  authType: string;
  rekeyingInterval: string;
  timeToNextRekeying: number;
}

interface DragState {
  isDragging: boolean;
  sourceNode: string | null;
  currentPos: Position | null;
}

interface ConnectionFeedback {
  visible: boolean;
  source: string;
  target: string;
  x: number;
  y: number;
}
const MeshNetwork: React.FC<MeshNetworkProps> = ({ 
  endpoints, 
  onEndpointsChange, 
  blastParams, 
  onBlastParamsChange 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [showBlastConfig, setShowBlastConfig] = useState(false);
  const [editedBlastParams, setEditedBlastParams] = useState<NetworkBlastParams>(blastParams);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>({
    visible: false,
    x: 0,
    y: 0,
    source: '',
    target: '',
    latency: '',
    phase1: '',
    phase2: '',
    authType: '',
    rekeyingInterval: '',
    timeToNextRekeying: 0
  });
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    sourceNode: null,
    currentPos: null
  });

  const [connectionFeedback, setConnectionFeedback] = useState<ConnectionFeedback>({
    visible: false,
    source: '',
    target: '',
    x: 0,
    y: 0
  });
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [newGatewayToken, setNewGatewayToken] = useState<{
    gatewayName: string;
    token: string;
    expiry: number;
  } | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showForceRekeyModal, setShowForceRekeyModal] = useState(false);

  // Update current time every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update re-keying timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedEndpoints = endpoints.map(endpoint => ({
        ...endpoint,
        connections: endpoint.connections.map(conn => ({
          ...conn,
          timeToNextRekeying: Math.max(0, (conn.timeToNextRekeying || 0) - 1)
        }))
      }));
      
      // Only update if there are actual changes to prevent unnecessary re-renders
      const hasChanges = endpoints.some(endpoint => 
        endpoint.connections.some(conn => (conn.timeToNextRekeying || 0) > 0)
      );
      
      if (hasChanges) {
        onEndpointsChange(updatedEndpoints);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endpoints, onEndpointsChange]);
  // Calculate positions for endpoints in a circular layout
  const getEndpointPositions = (): { [key: string]: Position } => {
    const positions: { [key: string]: Position } = {};
    const centerX = 400;
    const centerY = 300;
    const radius = 200;
    
    endpoints.forEach((endpoint, index) => {
      const angle = (index * 2 * Math.PI) / endpoints.length;
      positions[endpoint.name] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    
    return positions;
  };

  const positions = getEndpointPositions();

  // Auto-activate gateways after 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedEndpoints = endpoints.map(endpoint => {
        if (endpoint.status === 'inactive' && 
            endpoint.createdAt && 
            endpoint.tokenExpiry &&
            now > endpoint.createdAt + 60000) { // 1 minute after creation
          return {
            ...endpoint,
            status: 'active' as const,
            registrationToken: undefined,
            tokenExpiry: undefined
          };
        }
        return endpoint;
      });
      
      if (JSON.stringify(updatedEndpoints) !== JSON.stringify(endpoints)) {
        onEndpointsChange(updatedEndpoints);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endpoints, onEndpointsChange]);

  // Generate a random token
  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  const handleConnectionHover = (
    event: React.MouseEvent,
    source: Endpoint,
    connection: Connection
  ) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setHoverInfo({
        visible: true,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        source: source.name,
        target: connection.target,
        latency: connection.latency,
        phase1: connection.phase1Algorithm || source.phase1Algorithm,
        phase2: connection.phase2Algorithm || source.phase2Algorithm,
        authType: connection.authType || source.authType,
        rekeyingInterval: connection.rekeyingInterval || source.rekeyingInterval,
        timeToNextRekeying: connection.timeToNextRekeying || 0
      });
    }
  };

  const handleConnectionLeave = () => {
    setHoverInfo(prev => ({ ...prev, visible: false }));
  };

  const handleNodeMouseDown = (nodeName: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragState({
      isDragging: true,
      sourceNode: nodeName,
      currentPos: null
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (dragState.isDragging && dragState.sourceNode) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        setDragState(prev => ({
          ...prev,
          currentPos: {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          }
        }));
      }
    }
  };

  const handleNodeMouseUp = (targetNode: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (dragState.isDragging && dragState.sourceNode && targetNode && targetNode !== dragState.sourceNode) {
      // Check if connection already exists
      const sourceEndpoint = endpoints.find(ep => ep.name === dragState.sourceNode);
      const existingConnection = sourceEndpoint?.connections.find(conn => conn.target === targetNode);
      
      if (!existingConnection) {
        // Create new connection
        const updatedEndpoints = endpoints.map(ep => {
          if (ep.name === dragState.sourceNode) {
            return {
              ...ep,
              connections: [...ep.connections, {
                target: targetNode,
                latency: '2.5ms',
                phase1Algorithm: 'AES256-SHA256-MODP2048',
                phase2Algorithm: 'AES256-SHA256-PFS',
                authType: 'Certificate' as const,
                rekeyingInterval: '3600s',
                timeToNextRekeying: 3600
              }]
            };
          }
          return ep;
        });
        onEndpointsChange(updatedEndpoints);
        
        // Show connection success feedback
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setConnectionFeedback({
            visible: true,
            source: dragState.sourceNode,
            target: targetNode,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          });
          
          // Hide feedback after 3 seconds
          setTimeout(() => {
            setConnectionFeedback(prev => ({ ...prev, visible: false }));
          }, 3000);
        }
      }
    }
    
    setDragState({
      isDragging: false,
      sourceNode: null,
      currentPos: null
    });
  };

  const handleSvgMouseUp = (event: React.MouseEvent) => {
    if (dragState.isDragging) {
      setDragState({
        isDragging: false,
        sourceNode: null,
        currentPos: null
      });
    }
  };
  const handleAddNode = (event: React.MouseEvent) => {
    if (!isAddingNode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const newNodeNumber = endpoints.length + 1;
      const token = generateToken();
      const now = Date.now();
      const gatewayName = `gateway-${String(newNodeNumber).padStart(3, '0')}`;
      
      const newEndpoint: Endpoint = {
        id: `ep-${String(newNodeNumber).padStart(3, '0')}`,
        name: gatewayName,
        ipAddress: `192.168.1.${20 + newNodeNumber}`,
        geoLocation: {
          city: 'New City',
          state: 'XX'
        },
        status: 'inactive',
        ipsecImplementation: 'StrongSwan 5.9.8',
        rekeyingInterval: '3600s',
        phase1Algorithm: 'AES256-SHA256-MODP2048',
        phase2Algorithm: 'AES256-SHA256-PFS',
        authType: 'Certificate',
        blastVersion: 'v0.11.23',
        connections: [],
        registrationToken: token,
        tokenExpiry: now + 300000, // 5 minutes
        createdAt: now
      };
      
      onEndpointsChange([...endpoints, newEndpoint]);
      setNewGatewayToken({
        gatewayName,
        token,
        expiry: now + 300000
      });
      setShowTokenModal(true);
      setIsAddingNode(false);
    }
  };

  const handleDeleteConnection = (sourceNode: string, targetNode: string) => {
    const updatedEndpoints = endpoints.map(ep => {
      if (ep.name === sourceNode) {
        return {
          ...ep,
          connections: ep.connections.filter(conn => conn.target !== targetNode)
        };
      }
      return ep;
    });
    onEndpointsChange(updatedEndpoints);
  };

  const handleForceRekey = () => {
    // Here you would implement the actual re-keying logic
    // For now, we'll just close the modal
    setShowForceRekeyModal(false);
    // You could add logic here to trigger re-keying on all active connections
  };

  const handleBlastParamsSave = () => {
    onBlastParamsChange(editedBlastParams);
    setShowBlastConfig(false);
  };

  const handleBlastParamsCancel = () => {
    setEditedBlastParams(blastParams);
    setShowBlastConfig(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setShowForceRekeyModal(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4 inline mr-2" />
          Force Rekey
        </button>
        <button
          onClick={() => setShowBlastConfig(!showBlastConfig)}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-600 transition-all duration-200"
        >
          <Settings className="w-4 h-4 inline mr-2" />
          BLAST Config
        </button>
        <button
          onClick={() => setIsAddingNode(!isAddingNode)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            isAddingNode 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isAddingNode ? (
            <>
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 inline mr-2" />
              Add Gateway
            </>
          )}
        </button>
      </div>

      {/* BLAST Configuration Panel */}
      {showBlastConfig && (
        <div className="absolute top-16 right-4 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-20 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Network BLAST Parameters</h3>
            <button
              onClick={handleBlastParamsCancel}
              className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-slate-600 font-medium block mb-2">Beta Parameter:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={editedBlastParams.beta}
                onChange={(e) => setEditedBlastParams({ ...editedBlastParams, beta: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-2">Delta Parameter:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={editedBlastParams.delta}
                onChange={(e) => setEditedBlastParams({ ...editedBlastParams, delta: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-2">Active Servers:</label>
              <input
                type="number"
                min="1"
                value={editedBlastParams.activeServers}
                onChange={(e) => setEditedBlastParams({ ...editedBlastParams, activeServers: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-2">Queried Servers:</label>
              <input
                type="number"
                min="1"
                value={editedBlastParams.queriedServers}
                onChange={(e) => setEditedBlastParams({ ...editedBlastParams, queriedServers: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
              <button
                onClick={handleBlastParamsCancel}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBlastParamsSave}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Force Rekey Modal */}
      {showForceRekeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Force Re-key Confirmation</h3>
              <button
                onClick={() => setShowForceRekeyModal(false)}
                className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-700 text-center">
                Are you sure you want to rekey all active connections?
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowForceRekeyModal(false)}
                className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors duration-200"
              >
                No
              </button>
              <button
                onClick={handleForceRekey}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Token Modal */}
      {showTokenModal && newGatewayToken && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Gateway Registration Token</h3>
              <button
                onClick={() => {
                  setShowTokenModal(false);
                  setNewGatewayToken(null);
                  setCopiedToken(false);
                }}
                className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-slate-600 font-medium block mb-2">Gateway Name:</label>
                <div className="bg-slate-100 px-3 py-2 rounded-lg font-mono text-slate-800">
                  {newGatewayToken.gatewayName}
                </div>
              </div>
              
              <div>
                <label className="text-slate-600 font-medium block mb-2">Registration Token:</label>
                <div className="bg-slate-100 px-3 py-2 rounded-lg font-mono text-slate-800 break-all text-sm">
                  {newGatewayToken.token}
                </div>
                <button
                  onClick={() => copyToClipboard(newGatewayToken.token)}
                  className="mt-2 flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                >
                  {copiedToken ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Token
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-amber-800 font-medium text-sm mb-1">Important:</p>
                    <ul className="text-amber-700 text-sm space-y-1">
                      <li>• Token expires in 5 minutes</li>
                      <li>• Gateway will appear as inactive (red dot)</li>
                      <li>• Use this token to register your client</li>
                      <li>• Gateway will auto-activate in 1 minute after registration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowTokenModal(false);
                  setNewGatewayToken(null);
                  setCopiedToken(false);
                }}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <svg
        ref={svgRef}
        width="800"
        height="600"
        className={`w-full h-auto ${isAddingNode ? 'cursor-crosshair' : dragState.isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
        viewBox="0 0 800 600"
        onMouseMove={handleMouseMove}
        onMouseUp={handleSvgMouseUp}
        onClick={isAddingNode ? handleAddNode : undefined}
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Drag line */}
        {dragState.isDragging && dragState.sourceNode && dragState.currentPos && (
          <line
            x1={positions[dragState.sourceNode]?.x || 0}
            y1={positions[dragState.sourceNode]?.y || 0}
            x2={dragState.currentPos.x}
            y2={dragState.currentPos.y}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.7"
          />
        )}

        {/* Connection lines */}
        {endpoints.filter(ep => ep.status === 'active').map(endpoint => 
          endpoint.connections.map((conn, connIndex) => {
            const sourcePos = positions[endpoint.name];
            const targetPos = positions[conn.target];
            
            if (!sourcePos || !targetPos) return null;

            return (
              <g key={`${endpoint.id}-${connIndex}`}>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className="animate-pulse cursor-pointer hover:stroke-blue-700 transition-colors duration-200"
                  onMouseEnter={(e) => handleConnectionHover(e, endpoint, conn)}
                  onMouseLeave={handleConnectionLeave}
                  filter="url(#glow)"
                />
                {/* Connection direction arrow */}
                <polygon
                  points={`${targetPos.x - 8},${targetPos.y - 4} ${targetPos.x - 8},${targetPos.y + 4} ${targetPos.x - 2},${targetPos.y}`}
                  fill="#3b82f6"
                  className="cursor-pointer"
                  onMouseEnter={(e) => handleConnectionHover(e, endpoint, conn)}
                  onMouseLeave={handleConnectionLeave}
                />
                {/* Delete connection button */}
                <circle
                  cx={(sourcePos.x + targetPos.x) / 2}
                  cy={(sourcePos.y + targetPos.y) / 2}
                  r="8"
                  fill="#ef4444"
                  className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleDeleteConnection(endpoint.name, conn.target)}
                />
                <text
                  x={(sourcePos.x + targetPos.x) / 2}
                  y={(sourcePos.y + targetPos.y) / 2}
                  textAnchor="middle"
                  dy="0.35em"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  className="cursor-pointer pointer-events-none"
                >
                  ×
                </text>
              </g>
            );
          })
        )}

        {/* Endpoint nodes */}
        {endpoints.map((endpoint) => {
          const pos = positions[endpoint.name];
          if (!pos) return null;

          return (
            <g key={endpoint.id}>
              {/* Node shadow */}
              <circle
                cx={pos.x + 2}
                cy={pos.y + 2}
                r="35"
                fill="rgba(0,0,0,0.1)"
              />
              {/* Main node */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="35"
                fill={endpoint.status === 'active' ? '#3b82f6' : '#64748b'}
                stroke="white"
                strokeWidth="4"
                className={`transition-colors duration-200 ${
                  dragState.isDragging ? 'cursor-crosshair' : 'cursor-grab'
                }`}
                filter="url(#glow)"
                onMouseDown={(e) => handleNodeMouseDown(endpoint.name, e)}
                onMouseUp={(e) => handleNodeMouseUp(endpoint.name, e)}
              />
              {/* Registration token indicator for new inactive gateways */}
              {endpoint.status === 'inactive' && endpoint.registrationToken && (
                <circle
                  cx={pos.x + 30}
                  cy={pos.y - 30}
                  r="8"
                  fill="#f59e0b"
                  stroke="white"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              )}
              {endpoint.status === 'inactive' && endpoint.registrationToken && (
                <text
                  x={pos.x + 30}
                  y={pos.y - 30}
                  textAnchor="middle"
                  dy="0.35em"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  T
                </text>
              )}
              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dy="0.35em"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {endpoint.name.split('-')[1]?.toUpperCase() || 'EP'}
              </text>
              {/* IP Address label */}
              <text
                x={pos.x}
                y={pos.y + 55}
                textAnchor="middle"
                fill="#475569"
                fontSize="11"
                fontWeight="500"
                className="pointer-events-none"
              >
                {endpoint.name}
              </text>
              <text
                x={pos.x}
                y={pos.y + 70}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
                className="pointer-events-none"
              >
                {endpoint.ipAddress}
              </text>
              <text
                x={pos.x}
                y={pos.y + 85}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
                className="pointer-events-none"
              >
                {endpoint.geoLocation.city}, {endpoint.geoLocation.state}
              </text>
              {/* Status indicator */}
              <circle
                cx={pos.x + 25}
                cy={pos.y - 25}
                r="6"
                fill={endpoint.status === 'active' ? '#10b981' : '#ef4444'}
                stroke="white"
                strokeWidth="2"
                className={endpoint.status === 'active' ? 'animate-pulse' : ''}
              />
            </g>
          );
        })}
      </svg>

      {/* Connection Success Feedback */}
      {connectionFeedback.visible && (
        <div
          className="absolute bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-2xl border border-emerald-500 z-20 pointer-events-none animate-pulse"
          style={{
            left: connectionFeedback.x - 100,
            top: connectionFeedback.y - 40,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="text-sm font-bold">
              Connection Created: {connectionFeedback.source} → {connectionFeedback.target}
            </span>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {hoverInfo.visible && (
        <div
          className="absolute bg-slate-900 text-white p-4 rounded-lg shadow-2xl border border-slate-700 z-10 pointer-events-none"
          style={{
            left: hoverInfo.x + 10,
            top: hoverInfo.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="text-sm font-bold mb-2 text-blue-400">
            {hoverInfo.source} → {hoverInfo.target}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Latency:</span>
              <span className="text-emerald-400 font-mono">{hoverInfo.latency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Auth:</span>
              <span className="text-amber-400">{hoverInfo.authType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Re-keying:</span>
              <span className="text-slate-300">{hoverInfo.rekeyingInterval}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Next Re-key:</span>
              <span className="text-emerald-400">{hoverInfo.timeToNextRekeying}s</span>
            </div>
            <div className="border-t border-slate-700 pt-2 mt-2">
              <div className="text-slate-400 text-xs mb-1">Phase 1:</div>
              <div className="text-blue-300 font-mono text-xs">{hoverInfo.phase1}</div>
              <div className="text-slate-400 text-xs mt-1 mb-1">Phase 2:</div>
              <div className="text-violet-300 font-mono text-xs">{hoverInfo.phase2}</div>
            </div>
            <div className="border-t border-slate-700 pt-2 mt-2">
              <div className="text-slate-400 text-xs mb-1">Live Countdown:</div>
              <div className="text-emerald-400 font-mono text-sm font-bold">
                {(() => {
                  const totalSeconds = Math.max(0, hoverInfo.timeToNextRekeying);
                  const hours = Math.floor(totalSeconds / 3600);
                  const minutes = Math.floor((totalSeconds % 3600) / 60);
                  const seconds = totalSeconds % 60;
                  
                  if (hours > 0) {
                    return `${hours}h ${minutes}m ${seconds}s`;
                  } else {
                    return `${minutes}m ${seconds}s`;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="text-sm font-bold text-slate-800 mb-2">Legend</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-slate-600">Active Gateway</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-slate-600 rounded-full mr-2"></div>
            <span className="text-slate-600">Inactive Gateway</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-blue-600 mr-2" style={{clipPath: 'polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)'}}></div>
            <span className="text-slate-600">IPSec Tunnel</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-600 rounded-full mr-2 animate-pulse"></div>
            <span className="text-slate-600">Active Status</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-slate-600">Registration Token</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-red-500 mr-2"></div>
            <span className="text-slate-600">Drag from gateway to gateway to connect</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeshNetwork;