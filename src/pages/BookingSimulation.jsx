import React, { useState, useEffect } from 'react';
import { mockHotels } from '../data/mockHotels';
import { CreditCard, Calendar, Users, Hotel, CheckCircle, XCircle, Clock, Trash2, ArrowRight } from 'lucide-react';

function BookingSimulation() {
  const [hotels, setHotels] = useState(mockHotels);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({ checkIn: '', checkOut: '', guests: 1 });
  
  const [bookings, setBookings] = useState([]);
  const [currentBookingStep, setCurrentBookingStep] = useState(0);
  const [bookingStatus, setBookingStatus] = useState(null); // 'Pending', 'Room Reserved', 'Payment Processing', 'Confirmed', 'Payment Failed', 'Cancelled'

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('stayease_mock_bookings');
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  }, []);

  // Save to local storage whenever bookings change
  useEffect(() => {
    localStorage.setItem('stayease_mock_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleBookingSubmit = (simulatePaymentFailure = false) => {
    if (!selectedRoom || !bookingForm.checkIn || !bookingForm.checkOut) return;

    // Concurrency check simulation
    // Find the current availability of the room across all confirmed/reserved bookings
    const activeBookingsForRoom = bookings.filter(b => b.roomId === selectedRoom.room_id && (b.status === 'Confirmed' || b.status === 'Room Reserved'));
    
    // Simplistic inventory check for demo
    if (selectedRoom.availability - activeBookingsForRoom.length <= 0) {
      alert("Concurrency Error: This room is no longer available. Another user just booked the last remaining inventory.");
      return;
    }

    // Start Workflow
    setCurrentBookingStep(1);
    setBookingStatus('Pending');
    
    const newBooking = {
      id: `bk_${Date.now()}`,
      hotelName: selectedHotel.name,
      roomType: selectedRoom.room_type,
      roomId: selectedRoom.room_id,
      checkIn: bookingForm.checkIn,
      checkOut: bookingForm.checkOut,
      status: 'Pending',
      amount: selectedRoom.price_per_night * 2 // simplify duration to 2 nights for demo
    };

    setBookings([newBooking, ...bookings]);

    // Simulate Workflow Steps
    setTimeout(() => {
      setCurrentBookingStep(2);
      updateBookingStatus(newBooking.id, 'Room Reserved');
      
      setTimeout(() => {
        setCurrentBookingStep(3);
        updateBookingStatus(newBooking.id, 'Payment Processing');
        
        setTimeout(() => {
          if (simulatePaymentFailure) {
            setCurrentBookingStep(4);
            updateBookingStatus(newBooking.id, 'Payment Failed');
            
            // Auto cancel after failure to release inventory
            setTimeout(() => {
              updateBookingStatus(newBooking.id, 'Cancelled');
              resetSelection();
            }, 2000);
            
          } else {
            setCurrentBookingStep(4);
            updateBookingStatus(newBooking.id, 'Confirmed');
            setTimeout(() => {
              resetSelection();
            }, 2000);
          }
        }, 1500);
      }, 1000);
    }, 1000);
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookingStatus(newStatus);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const resetSelection = () => {
    setSelectedHotel(null);
    setSelectedRoom(null);
    setBookingForm({ checkIn: '', checkOut: '', guests: 1 });
    setCurrentBookingStep(0);
    setBookingStatus(null);
  };

  const cancelBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
  };

  const resetAllDemo = () => {
    localStorage.removeItem('stayease_mock_bookings');
    setBookings([]);
    resetSelection();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'var(--success)';
      case 'Cancelled': return 'var(--text-muted)';
      case 'Payment Failed': return 'var(--error)';
      case 'Room Reserved': return 'var(--info)';
      default: return 'var(--warning)';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-main" style={{ fontSize: '1.25rem', fontWeight: 600 }}>End-to-End Booking Simulation</h2>
          <p className="text-muted text-sm">Interactive mock workflow demonstrating the microservices orchestration</p>
        </div>
        <button className="btn btn-outline" onClick={resetAllDemo}>
          <Trash2 size={16} /> Reset Demo Data
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column: Flow */}
        <div className="flex flex-col gap-6">
          
          {/* Step 1 & 2: Selection */}
          <div className="card">
            <h3 className="card-title">1. Search & Selection</h3>
            
            {!selectedHotel ? (
              <div className="flex flex-col gap-3 mt-4">
                {hotels.map(h => (
                  <div key={h.hotel_id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-center hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedHotel(h)}>
                    <div>
                      <div className="font-semibold">{h.name}</div>
                      <div className="text-sm text-slate-500">{h.location} • {h.rating}⭐</div>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Select</button>
                  </div>
                ))}
              </div>
            ) : !selectedRoom ? (
              <div>
                <div className="mb-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{selectedHotel.name}</span>
                    <span className="text-sm text-slate-500 block">Select a Room</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:underline" onClick={() => setSelectedHotel(null)}>Back to Hotels</button>
                </div>
                <div className="flex flex-col gap-3">
                  {selectedHotel.rooms.map(r => {
                    const activeForRoom = bookings.filter(b => b.roomId === r.room_id && (b.status === 'Confirmed' || b.status === 'Room Reserved')).length;
                    const availableNow = r.availability - activeForRoom;
                    
                    return (
                      <div key={r.room_id} className={`p-4 border rounded-lg flex justify-between items-center ${availableNow > 0 ? 'border-slate-200 hover:bg-slate-50 cursor-pointer' : 'border-red-100 bg-red-50 opacity-70'}`} onClick={() => availableNow > 0 && setSelectedRoom(r)}>
                        <div>
                          <div className="font-semibold">{r.room_type} Room</div>
                          <div className="text-sm text-slate-500">₹{r.price_per_night}/night • Up to {r.capacity} guests</div>
                          <div className={`text-xs mt-1 font-medium ${availableNow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {availableNow > 0 ? `${availableNow} left in inventory` : 'Sold Out'}
                          </div>
                        </div>
                        <button className="btn btn-outline" disabled={availableNow <= 0} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                          {availableNow > 0 ? 'Select' : 'Unavailable'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : currentBookingStep === 0 ? (
              <div>
                <div className="mb-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{selectedHotel.name} - {selectedRoom.room_type} Room</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:underline" onClick={() => setSelectedRoom(null)}>Change Room</button>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Check-in</label>
                      <input type="date" className="w-full p-2 border border-slate-300 rounded text-sm" value={bookingForm.checkIn} onChange={e => setBookingForm({...bookingForm, checkIn: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Check-out</label>
                      <input type="date" className="w-full p-2 border border-slate-300 rounded text-sm" value={bookingForm.checkOut} onChange={e => setBookingForm({...bookingForm, checkOut: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="btn btn-primary flex-1 py-3" onClick={() => handleBookingSubmit(false)} disabled={!bookingForm.checkIn || !bookingForm.checkOut}>
                      Book & Pay Success
                    </button>
                    <button className="btn btn-outline flex-1 py-3" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => handleBookingSubmit(true)} disabled={!bookingForm.checkIn || !bookingForm.checkOut}>
                      Simulate Payment Failure
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-pulse flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                  <p className="text-slate-600 font-medium">Processing your request...</p>
                </div>
              </div>
            )}
          </div>

          {/* Workflow Timeline */}
          {currentBookingStep > 0 && (
            <div className="card border-blue-200 shadow-md">
              <h3 className="card-title mb-6">Orchestration Timeline</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className={`timeline-dot ${currentBookingStep >= 1 ? 'bg-blue-500 border-blue-500' : ''}`}></div>
                  <div className={`timeline-content ${currentBookingStep >= 1 ? 'border-blue-200' : 'opacity-50'}`}>
                    <div className="font-semibold text-sm">Booking Request Created</div>
                    <div className="text-xs text-slate-500">API Gateway → Booking Service</div>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className={`timeline-dot ${currentBookingStep >= 2 ? 'bg-amber-500 border-amber-500' : ''}`}></div>
                  <div className={`timeline-content ${currentBookingStep >= 2 ? 'border-amber-200' : 'opacity-50'}`}>
                    <div className="font-semibold text-sm flex items-center gap-2">Inventory Check & Hold <Lock size={12} /></div>
                    <div className="text-xs text-slate-500">Booking Service → Message Broker → Inventory Service</div>
                    <div className="text-xs text-amber-600 mt-1">Room temporarily locked to prevent double-booking.</div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className={`timeline-dot ${currentBookingStep >= 3 ? (bookingStatus === 'Payment Failed' ? 'bg-red-500 border-red-500' : 'bg-purple-500 border-purple-500') : ''}`}></div>
                  <div className={`timeline-content ${currentBookingStep >= 3 ? (bookingStatus === 'Payment Failed' ? 'border-red-200 bg-red-50' : 'border-purple-200') : 'opacity-50'}`}>
                    <div className="font-semibold text-sm">Payment Processing</div>
                    <div className="text-xs text-slate-500">Payment Service → External Gateway</div>
                    {bookingStatus === 'Payment Failed' && <div className="text-xs text-red-600 mt-1 font-medium">Card Declined. Emitting failure event.</div>}
                  </div>
                </div>

                <div className="timeline-item mb-0">
                  <div className={`timeline-dot ${currentBookingStep >= 4 ? (bookingStatus === 'Confirmed' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500') : ''}`}></div>
                  <div className={`timeline-content ${currentBookingStep >= 4 ? (bookingStatus === 'Confirmed' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'opacity-50'}`}>
                    <div className="font-semibold text-sm">Finalization</div>
                    {bookingStatus === 'Confirmed' ? (
                      <>
                        <div className="text-xs text-green-700 mt-1 font-medium flex items-center gap-1"><CheckCircle size={14}/> Booking Confirmed & Inventory Deducted.</div>
                      </>
                    ) : bookingStatus === 'Payment Failed' || bookingStatus === 'Cancelled' ? (
                      <>
                        <div className="text-xs text-red-700 mt-1 font-medium flex items-center gap-1"><XCircle size={14}/> Booking Cancelled & Inventory Hold Released.</div>
                      </>
                    ) : (
                      <div className="text-xs text-slate-500">Waiting for payment outcome...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Active Bookings */}
        <div className="card h-full">
          <h3 className="card-title">My Bookings</h3>
          <p className="text-sm text-slate-500 mb-4">View and manage simulated reservations. (Stored in LocalStorage)</p>
          
          <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                <Calendar size={32} className="mb-2 opacity-50" />
                <p>No bookings yet.</p>
              </div>
            ) : (
              bookings.map(b => (
                <div key={b.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-slate-800">{b.hotelName}</div>
                    <span className="badge" style={{ backgroundColor: `${getStatusColor(b.status)}20`, color: getStatusColor(b.status) }}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 flex items-center gap-2 mb-1">
                    <Hotel size={14} /> {b.roomType} Room
                  </div>
                  <div className="text-sm text-slate-600 flex items-center gap-2 mb-3">
                    <Calendar size={14} /> {b.checkIn} to {b.checkOut}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="font-semibold">₹{b.amount}</div>
                    {b.status === 'Confirmed' && (
                      <button className="text-xs text-red-600 hover:underline" onClick={() => cancelBooking(b.id)}>
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingSimulation;
