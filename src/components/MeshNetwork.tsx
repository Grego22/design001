import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Endpoint, Connection } from '../types/endpoint';

interface MeshNetworkProps {
  endpoints: Endpoint[];
  onEndpointsChange: (endpoints: Endpoint[]) => void;
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
  rekeying: string;
}

interface DragState {
  isDragging: boolean;
  sourceNode: string | null;
  currentPos: Position | null;
}

const MeshNetwork: React.FC<MeshNetworkProps> = ({ endpoints, onEndpointsChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
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
    rekeying: ''
  });
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    sourceNode: null,
    currentPos: null
  });

  const [isAddingNode, setIsAddingNode] = useState(false);

  const activeEndpoints = endpoints.filter(ep => ep.status === 'active');
  
  // Calculate positions for endpoints in a circular layout
  const getEndpointPositions = (): { [key: string]: Position } => {
    const positions: { [key: string]: Position } = {};
    const centerX = 400;
    const centerY = 300;
    const radius = 200;
    
    activeEndpoints.forEach((endpoint, index) => {
      const angle = (index * 2 * Math.PI) / activeEndpoints.length;
      positions[endpoint.name] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    
    return positions;
  };

  const positions = getEndpointPositions();

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
        rekeying: connection.rekeying || source.rekeying
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
      // Create new connection
      const updatedEndpoints = endpoints.map(ep => {
        if (ep.name === dragState.sourceNode) {
          const existingConnection = ep.connections.find(conn => conn.target === targetNode);
          if (!existingConnection) {
            return {
              ...ep,
              connections: [...ep.connections, {
                target: targetNode,
                latency: '2.5ms',
                phase1Algorithm: 'AES256-SHA256-MODP2048',
                phase2Algorithm: 'AES256-SHA256-PFS',
                authType: 'Certificate' as const,
                rekeying: '3600s'
              }]
            };
          }
        }
        return ep;
      });
      onEndpointsChange(updatedEndpoints);
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
      const newEndpoint: Endpoint = {
        id: `ep-${String(newNodeNumber).padStart(3, '0')}`,
        name: `gateway-${String(newNodeNumber).padStart(3, '0')}`,
        ipAddress: `192.168.1.${20 + newNodeNumber}`,
        status: 'active',
        ipsecImplementation: 'StrongSwan 5.9.8',
        rekeying: '3600s',
        phase1Algorithm: 'AES256-SHA256-MODP2048',
        phase2Algorithm: 'AES256-SHA256-PFS',
        authType: 'Certificate',
        blast: {
          beta: 3,
          delta: 1.8,
          activeServers: 10,
          queriedServers: 8
        },
        connections: []
      };
      
      onEndpointsChange([...endpoints, newEndpoint]);
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

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
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
        {activeEndpoints.map(endpoint => 
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
        {activeEndpoints.map((endpoint) => {
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
                className={`hover:scale-110 transition-transform duration-200 ${
                  dragState.isDragging ? 'cursor-crosshair' : 'cursor-grab'
                }`}
                filter="url(#glow)"
                onMouseDown={(e) => handleNodeMouseDown(endpoint.name, e)}
                onMouseUp={(e) => handleNodeMouseUp(endpoint.name, e)}
              />
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
              <span className="text-slate-300">{hoverInfo.rekeying}</span>
            </div>
            <div className="border-t border-slate-700 pt-2 mt-2">
              <div className="text-slate-400 text-xs mb-1">Phase 1:</div>
              <div className="text-blue-300 font-mono text-xs">{hoverInfo.phase1}</div>
              <div className="text-slate-400 text-xs mt-1 mb-1">Phase 2:</div>
              <div className="text-violet-300 font-mono text-xs">{hoverInfo.phase2}</div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="text-sm font-bold text-slate-800 mb-2">Instructions</div>
        <div className="space-y-1 text-xs text-slate-600">
          <div>• Click "Add Gateway" then click on canvas to place</div>
          <div>• Drag from one node to another to create connection</div>
          <div>• Hover over connections to see tunnel details</div>
          <div>• Click × on connection midpoint to delete</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="text-sm font-bold text-slate-800 mb-2">Legend</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-slate-600">Active Gateway</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-blue-600 mr-2" style={{clipPath: 'polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)'}}></div>
            <span className="text-slate-600">IPSec Tunnel</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-600 rounded-full mr-2 animate-pulse"></div>
            <span className="text-slate-600">Active Status</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeshNetwork;