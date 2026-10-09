import React, { useState } from 'react';
import { Database, Search, ShieldCheck } from 'lucide-react';

function DatabaseDesign() {
  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <h2 className="card-title">Relational Database Schema (PostgreSQL)</h2>
        <p className="text-muted text-sm mb-6">
          PostgreSQL is chosen for handling core business entities because of its strong ACID compliance, ensuring that 
          hotel room inventory is always consistent and double-bookings are prevented.
        </p>

        <div className="flex flex-wrap gap-8 justify-center">
          {/* Users Table */}
          <div className="card" style={{ width: '280px', margin: 0, padding: 0, overflow: 'hidden' }}>
            <div className="bg-slate-800 text-white p-3 font-semibold flex justify-between items-center" style={{ backgroundColor: '#1e293b' }}>
              Users
              <span className="text-xs opacity-70">users</span>
            </div>
            <div className="p-0">
              <table style={{ margin: 0 }}>
                <tbody>
                  <tr><td className="font-mono text-sm py-2">🔑 user_id (PK)</td></tr>
                  <tr><td className="font-mono text-sm py-2">name</td></tr>
                  <tr><td className="font-mono text-sm py-2">email</td></tr>
                  <tr><td className="font-mono text-sm py-2">password_hash</td></tr>
                  <tr><td className="font-mono text-sm py-2">created_at</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Hotels Table */}
          <div className="card" style={{ width: '280px', margin: 0, padding: 0, overflow: 'hidden' }}>
            <div className="bg-slate-800 text-white p-3 font-semibold flex justify-between items-center" style={{ backgroundColor: '#1e293b' }}>
              Hotels
              <span className="text-xs opacity-70">hotels</span>
            </div>
            <div className="p-0">
              <table style={{ margin: 0 }}>
                <tbody>
                  <tr><td className="font-mono text-sm py-2">🔑 hotel_id (PK)</td></tr>
                  <tr><td className="font-mono text-sm py-2">name</td></tr>
                  <tr><td className="font-mono text-sm py-2">location</td></tr>
                  <tr><td className="font-mono text-sm py-2">rating</td></tr>
                  <tr><td className="font-mono text-sm py-2">description</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Rooms Table */}
          <div className="card" style={{ width: '280px', margin: 0, padding: 0, overflow: 'hidden' }}>
            <div className="bg-slate-800 text-white p-3 font-semibold flex justify-between items-center" style={{ backgroundColor: '#1e293b' }}>
              Rooms
              <span className="text-xs opacity-70">rooms</span>
            </div>
            <div className="p-0">
              <table style={{ margin: 0 }}>
                <tbody>
                  <tr><td className="font-mono text-sm py-2">🔑 room_id (PK)</td></tr>
                  <tr><td className="font-mono text-sm py-2">🔗 hotel_id (FK)</td></tr>
                  <tr><td className="font-mono text-sm py-2">room_type</td></tr>
                  <tr><td className="font-mono text-sm py-2">price_per_night</td></tr>
                  <tr><td className="font-mono text-sm py-2">capacity</td></tr>
                  <tr><td className="font-mono text-sm py-2 font-semibold text-blue-600" style={{ color: 'var(--primary)' }}>availability</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="card" style={{ width: '280px', margin: 0, padding: 0, overflow: 'hidden' }}>
            <div className="bg-slate-800 text-white p-3 font-semibold flex justify-between items-center" style={{ backgroundColor: '#1e293b' }}>
              Bookings
              <span className="text-xs opacity-70">bookings</span>
            </div>
            <div className="p-0">
              <table style={{ margin: 0 }}>
                <tbody>
                  <tr><td className="font-mono text-sm py-2">🔑 booking_id (PK)</td></tr>
                  <tr><td className="font-mono text-sm py-2">🔗 user_id (FK)</td></tr>
                  <tr><td className="font-mono text-sm py-2">🔗 room_id (FK)</td></tr>
                  <tr><td className="font-mono text-sm py-2">check_in</td></tr>
                  <tr><td className="font-mono text-sm py-2">check_out</td></tr>
                  <tr><td className="font-mono text-sm py-2">booking_status</td></tr>
                  <tr><td className="font-mono text-sm py-2">total_amount</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments Table */}
          <div className="card" style={{ width: '280px', margin: 0, padding: 0, overflow: 'hidden' }}>
            <div className="bg-slate-800 text-white p-3 font-semibold flex justify-between items-center" style={{ backgroundColor: '#1e293b' }}>
              Payments
              <span className="text-xs opacity-70">payments</span>
            </div>
            <div className="p-0">
              <table style={{ margin: 0 }}>
                <tbody>
                  <tr><td className="font-mono text-sm py-2">🔑 payment_id (PK)</td></tr>
                  <tr><td className="font-mono text-sm py-2">🔗 booking_id (FK)</td></tr>
                  <tr><td className="font-mono text-sm py-2">amount</td></tr>
                  <tr><td className="font-mono text-sm py-2">payment_status</td></tr>
                  <tr><td className="font-mono text-sm py-2">transaction_ref</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-800" style={{ color: '#1e40af' }}>
            <ShieldCheck size={18} /> Relationships & Integrity
          </h4>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1" style={{ color: '#334155' }}>
            <li>One user can have multiple bookings (1:N).</li>
            <li>One hotel can have multiple rooms (1:N).</li>
            <li>One room can have multiple bookings over time (1:N).</li>
            <li>One booking can have associated payment records (1:1 or 1:N for retries).</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '8px' }}><Database size={24} /></div>
            <h3 className="font-semibold text-lg">PostgreSQL</h3>
          </div>
          <p className="text-sm text-muted">
            Serves as the ultimate source of truth. Used for bookings, payments, and user accounts where <strong>transactional guarantees (ACID)</strong> and referential integrity are strictly required.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px' }}><Database size={24} /></div>
            <h3 className="font-semibold text-lg">Redis</h3>
          </div>
          <p className="text-sm text-muted">
            Used as an in-memory data store for <strong>frequently accessed cached data</strong> like hotel details, reducing database read load. Also used for distributed locks during inventory reservation.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '8px' }}><Search size={24} /></div>
            <h3 className="font-semibold text-lg">Elasticsearch</h3>
          </div>
          <p className="text-sm text-muted">
            Optimized for complex text queries and geospatial searches. Used for the <strong>hotel search indexing</strong> (e.g., searching by location, amenities, rating).
          </p>
        </div>
      </div>
    </div>
  );
}

export default DatabaseDesign;
