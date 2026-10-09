import React, { useState } from 'react';
import { MessageSquare, Play, AlertCircle, RefreshCw, Trash2, ArrowRight } from 'lucide-react';

function MessagingWorkflow() {
  const [events, setEvents] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addEvent = (name, status, service, details) => {
    const newEvent = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      name,
      status,
      service,
      details
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const simulateSuccessWorkflow = () => {
    setIsProcessing(true);
    setEvents([]);
    
    addEvent('BookingCreated', 'processing', 'Booking Service', 'User initiated a booking.');
    
    setTimeout(() => {
      addEvent('RoomReserved', 'success', 'Inventory Service', 'Room 201 temporarily reserved.');
      
      setTimeout(() => {
        addEvent('PaymentSuccessful', 'success', 'Payment Service', 'Amount $500 charged to card.');
        
        setTimeout(() => {
          addEvent('BookingConfirmed', 'success', 'Booking Service', 'Booking state updated to Confirmed.');
          
          setTimeout(() => {
            addEvent('NotificationRequested', 'success', 'Notification Service', 'Email sent to user@example.com.');
            setIsProcessing(false);
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const simulateFailureWorkflow = () => {
    setIsProcessing(true);
    setEvents([]);
    
    addEvent('BookingCreated', 'processing', 'Booking Service', 'User initiated a booking.');
    
    setTimeout(() => {
      addEvent('RoomReserved', 'success', 'Inventory Service', 'Room 201 temporarily reserved.');
      
      setTimeout(() => {
        addEvent('PaymentFailed', 'error', 'Payment Service', 'Card declined. Insufficient funds.');
        
        setTimeout(() => {
          addEvent('BookingCancelled', 'error', 'Booking Service', 'Booking cancelled. Inventory released.');
          setIsProcessing(false);
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-main" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Asynchronous Messaging Workflow</h2>
          <p className="text-muted text-sm">Event-driven communication using Kafka / RabbitMQ</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => setEvents([])} disabled={isProcessing}>
            <Trash2 size={16} /> Clear Log
          </button>
          <button className="btn btn-outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={simulateFailureWorkflow} disabled={isProcessing}>
            <AlertCircle size={16} /> Simulate Payment Failure
          </button>
          <button className="btn btn-primary" onClick={simulateSuccessWorkflow} disabled={isProcessing}>
            <Play size={16} /> Start Booking Workflow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card flex flex-col justify-center items-center py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="badge badge-info flex items-center gap-1">
              <MessageSquare size={14} /> Message Broker
            </span>
          </div>

          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <div className="w-full p-4 border-2 border-blue-200 rounded-lg bg-white shadow-sm flex justify-between items-center relative z-10">
              <span className="font-semibold text-slate-700">Booking Service</span>
              <ArrowRight className="text-blue-500" />
            </div>

            <div className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-lg text-center font-bold text-red-700 shadow-sm relative z-10" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)' }}>
              KAFKA / RABBITMQ
            </div>

            <div className="w-full flex gap-4 relative z-10">
              <div className="flex-1 p-3 border-2 border-green-200 rounded-lg bg-white shadow-sm text-center text-sm font-semibold text-slate-700">
                Inventory
              </div>
              <div className="flex-1 p-3 border-2 border-purple-200 rounded-lg bg-white shadow-sm text-center text-sm font-semibold text-slate-700">
                Payment
              </div>
              <div className="flex-1 p-3 border-2 border-amber-200 rounded-lg bg-white shadow-sm text-center text-sm font-semibold text-slate-700">
                Notification
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-full bg-slate-100 z-0"></div>
          </div>
          
          <div className="mt-8 text-sm text-slate-500 text-center px-8">
            Asynchronous messaging helps services communicate without requiring every operation to finish within the original HTTP request. This improves responsiveness and fault tolerance.
          </div>
        </div>

        <div className="card flex flex-col h-full">
          <h3 className="card-title">Event Log</h3>
          <div className="flex-1 bg-slate-900 rounded-lg p-4 overflow-y-auto" style={{ backgroundColor: '#1e293b', minHeight: '300px' }}>
            {events.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                <MessageSquare size={32} opacity={0.5} />
                <p>Waiting for events...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {events.map(evt => (
                  <div key={evt.id} className="border border-slate-700 bg-slate-800 rounded p-3 text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-semibold ${evt.status === 'success' ? 'text-green-400' : evt.status === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
                        {evt.name}
                      </span>
                      <span className="text-slate-500 text-xs">{evt.timestamp}</span>
                    </div>
                    <div className="text-slate-300 text-xs mb-1">Service: <span className="text-slate-400">{evt.service}</span></div>
                    <div className="text-slate-400 text-xs">{evt.details}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card bg-slate-50 border-slate-200">
        <h4 className="font-semibold mb-3">Enterprise Messaging Patterns Implemented:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="block text-slate-700">Idempotent Event Processing</strong>
            <span className="text-slate-500">Consumers maintain a record of processed message IDs to prevent duplicate actions if a message is delivered twice.</span>
          </div>
          <div>
            <strong className="block text-slate-700">Dead-Letter Queues (DLQ)</strong>
            <span className="text-slate-500">Messages that repeatedly fail processing (e.g. malformed payload) are routed to a DLQ for manual inspection.</span>
          </div>
          <div>
            <strong className="block text-slate-700">Retry Handling</strong>
            <span className="text-slate-500">Transient failures (e.g. database timeout) trigger automatic retries with exponential backoff before failing permanently.</span>
          </div>
          <div>
            <strong className="block text-slate-700">Saga Pattern (Choreography)</strong>
            <span className="text-slate-500">Distributed transactions are managed via a sequence of local transactions and compensating events (e.g. releasing inventory if payment fails).</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagingWorkflow;
