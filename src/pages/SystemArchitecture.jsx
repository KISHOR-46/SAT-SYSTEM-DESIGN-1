import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Info, Play, AlertTriangle } from 'lucide-react';

const initialNodes = [
  { id: 'client', position: { x: 400, y: 50 }, data: { label: 'Web / Mobile Client' }, type: 'input', className: 'flow-node node-client' },
  { id: 'lb', position: { x: 400, y: 150 }, data: { label: 'Load Balancer' }, className: 'flow-node node-gateway' },
  { id: 'gateway', position: { x: 400, y: 250 }, data: { label: 'API Gateway' }, className: 'flow-node node-gateway' },
  
  { id: 'user-svc', position: { x: 50, y: 380 }, data: { label: 'User Service' }, className: 'flow-node node-service' },
  { id: 'hotel-svc', position: { x: 250, y: 380 }, data: { label: 'Hotel Search Service' }, className: 'flow-node node-service' },
  { id: 'inv-svc', position: { x: 450, y: 380 }, data: { label: 'Inventory Service' }, className: 'flow-node node-service' },
  { id: 'booking-svc', position: { x: 650, y: 380 }, data: { label: 'Booking Service' }, className: 'flow-node node-service' },
  { id: 'payment-svc', position: { x: 850, y: 380 }, data: { label: 'Payment Service' }, className: 'flow-node node-service' },
  
  { id: 'redis', position: { x: 250, y: 500 }, data: { label: 'Redis Cache' }, className: 'flow-node node-db' },
  { id: 'db', position: { x: 550, y: 500 }, data: { label: 'PostgreSQL DB' }, className: 'flow-node node-db' },
  { id: 'broker', position: { x: 750, y: 500 }, data: { label: 'Kafka / RabbitMQ' }, className: 'flow-node node-broker' },
  
  { id: 'notif-svc', position: { x: 750, y: 600 }, data: { label: 'Notification Service' }, className: 'flow-node node-service' },
  { id: 'ext-payment', position: { x: 850, y: 250 }, data: { label: 'Payment Gateway (Stripe)' }, type: 'output', className: 'flow-node node-client' },
  { id: 'ext-email', position: { x: 750, y: 700 }, data: { label: 'Email/SMS Provider' }, type: 'output', className: 'flow-node node-client' },
];

const createEdge = (source, target, label = '', animated = false, color = '#94a3b8') => ({
  id: `e-${source}-${target}`,
  source,
  target,
  label,
  animated,
  style: { stroke: color, strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color },
});

const initialEdges = [
  createEdge('client', 'lb'),
  createEdge('lb', 'gateway'),
  createEdge('gateway', 'user-svc'),
  createEdge('gateway', 'hotel-svc'),
  createEdge('gateway', 'inv-svc'),
  createEdge('gateway', 'booking-svc'),
  createEdge('gateway', 'payment-svc'),
  
  createEdge('hotel-svc', 'redis', 'Read Cache'),
  createEdge('hotel-svc', 'db', 'Read'),
  createEdge('inv-svc', 'db', 'Lock/Update'),
  createEdge('booking-svc', 'db', 'Write'),
  createEdge('user-svc', 'db', 'Read/Write'),
  createEdge('payment-svc', 'db', 'Update Status'),
  
  createEdge('booking-svc', 'broker', 'BookingCreated'),
  createEdge('payment-svc', 'ext-payment', 'Charge API'),
  createEdge('payment-svc', 'broker', 'PaymentStatus'),
  createEdge('broker', 'notif-svc', 'Consume'),
  createEdge('notif-svc', 'ext-email', 'Send'),
];

function SystemArchitecture() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  const highlightFlow = (flowType) => {
    let highlightedEdges = [];
    if (flowType === 'success') {
      highlightedEdges = [
        'e-client-lb', 'e-lb-gateway', 'e-gateway-booking-svc',
        'e-booking-svc-db', 'e-booking-svc-broker', 'e-gateway-payment-svc',
        'e-payment-svc-ext-payment', 'e-payment-svc-db', 'e-broker-notif-svc',
        'e-notif-svc-ext-email'
      ];
    } else if (flowType === 'failure') {
      highlightedEdges = [
        'e-client-lb', 'e-lb-gateway', 'e-gateway-payment-svc',
        'e-payment-svc-ext-payment', 'e-payment-svc-db', 'e-payment-svc-broker'
      ];
    }

    setEdges((eds) =>
      eds.map((edge) => {
        if (highlightedEdges.includes(edge.id)) {
          return { ...edge, animated: true, style: { ...edge.style, stroke: flowType === 'success' ? '#10b981' : '#ef4444' } };
        }
        return { ...edge, animated: false, style: { ...edge.style, stroke: '#e2e8f0' } };
      })
    );
  };

  const resetFlow = () => {
    setEdges(initialEdges);
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-main" style={{ fontSize: '1.25rem', fontWeight: 600 }}>System Architecture Diagram</h2>
          <p className="text-muted text-sm">Interactive microservices flow</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => highlightFlow('success')}>
            <Play size={16} /> Show Request Flow
          </button>
          <button className="btn btn-outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => highlightFlow('failure')}>
            <AlertTriangle size={16} /> Show Failure Flow
          </button>
          <button className="btn btn-outline" onClick={resetFlow}>Reset</button>
        </div>
      </div>

      <div className="flex gap-4" style={{ flex: 1 }}>
        <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap />
            <Background color="#cbd5e1" gap={16} />
          </ReactFlow>
        </div>

        <div className="card" style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="card-title"><Info size={20} /> Component Details</h3>
          {selectedNode ? (
            <div>
              <div className="mb-4">
                <span className="text-muted text-sm block">Name</span>
                <span className="font-semibold">{selectedNode.data.label}</span>
              </div>
              <div className="mb-4">
                <span className="text-muted text-sm block">Type</span>
                <span className="badge badge-info mt-1">{selectedNode.className.split(' ')[1].replace('node-', '').toUpperCase()}</span>
              </div>
              <p className="text-sm text-muted">
                Select other components to view their respective details, inputs, outputs, and dependencies within the StayEase system.
              </p>
            </div>
          ) : (
            <div className="text-center text-muted mt-8">
              <p>Click on any component in the diagram to view its details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SystemArchitecture;
