import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin';

export default function AdminAnnouncements() {
  const [announcement, setAnnouncement] = useState({ title: '', message: '', type: 'info' });
  const [busy, setBusy] = useState(false);

  const handleSend = async () => {
    setBusy(true);
    try {
      await axios.post(`${API_BASE_URL}/announce`, announcement, { withCredentials: true });
      alert('Broadcast dispatched successfully');
      setAnnouncement({ title: '', message: '', type: 'info' });
    } catch (err) {
      alert('Failed to send announcement');
    } finally {
      setBusy(false);
    }
  };

  const navItems = [
    { key: 'dashboard' as const, label: 'Overview', path: '/admindashboard' },
    { key: 'students' as const, label: 'Students', path: '/admin/students' },
    { key: 'faculty' as const, label: 'Faculty', path: '/admin/faculty' },
    { key: 'announcements' as const, label: 'Announcements', path: '/admin/announcements' },
    { key: 'audit' as const, label: 'Audit Logs', path: '/admin/audit' },
  ];

  return (
    <PageLayout
      title="Global Broadcast Controller"
      subtitle="Strategic communication and directive deployment"
      breadcrumbLabel="Announcements"
      userType="admin"
      navItems={navItems}
      activeNav="announcements"
      isWide={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 space-y-6 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4">
            <Bell className="w-12 h-12 text-amber-500/10" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-500" />
            Directive Composition
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Subject Handle</label>
              <input 
                type="text" 
                placeholder="Operational Alert..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-sm text-neutral-200 outline-none focus:border-emerald-500/50"
                value={announcement.title}
                onChange={e => setAnnouncement({...announcement, title: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Directive Intelligence</label>
              <textarea 
                rows={6}
                placeholder="Transmission details..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-sm text-neutral-200 outline-none focus:border-emerald-500/50 resize-none font-mono"
                value={announcement.message}
                onChange={e => setAnnouncement({...announcement, message: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Priority Classification</label>
              <select 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-200 outline-none focus:border-emerald-500/50"
                value={announcement.type}
                onChange={e => setAnnouncement({...announcement, type: e.target.value})}
              >
                <option value="info">General Info (Standard)</option>
                <option value="warning">System Warning (Critical)</option>
                <option value="success">Protocol Update (Optimal)</option>
                <option value="reminder">Scheduled Task (White)</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleSend}
            disabled={!announcement.title || !announcement.message || busy}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 rounded text-neutral-950 font-bold uppercase text-[10px] tracking-widest transition-all shadow-[0_4px_15px_rgba(245,158,11,0.2)] disabled:opacity-50"
          >
            {busy ? 'Transmitting Data...' : 'Dispatch Global Broadcast'}
          </button>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em]">Signal Preview</h3>
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 relative overflow-hidden group shadow-inner">
            <div className={`absolute top-0 left-0 w-1 h-full ${
              announcement.type === 'info' ? 'bg-blue-500' :
              announcement.type === 'warning' ? 'bg-amber-500' :
              announcement.type === 'success' ? 'bg-emerald-500' :
              'bg-neutral-400'
            }`} />
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-base font-bold text-white tracking-tight">{announcement.title || 'Signal Identifier'}</h4>
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Active Sink</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed min-h-[120px] font-mono whitespace-pre-wrap">
              {announcement.message || 'Transmission content will be simulated here. All authorized sessions will receive this payload via encrypted websocket immediately upon dispatch.'}
            </p>
            <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span className="text-neutral-600">Sink: Global Node List</span>
              <span className="text-emerald-500 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Signal Secure</span>
            </div>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-5 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest leading-relaxed">
              Caution: Dispatched directives are pervasive and immutable. Ensure payload integrity before authorizing transmission.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
