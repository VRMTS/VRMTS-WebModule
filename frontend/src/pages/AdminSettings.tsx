import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Shield, Bell, Globe, Monitor, Sun, Moon, Eye, Lock, Key, Smartphone, Clock, Save, Camera, AlertCircle, Check, BookOpen, Users, Award, Activity, Server, Database, HardDrive, ChevronLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useTheme } from '@/hooks/useTheme';

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"account" | "preferences" | "notifications" | "system">("account");
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // UI-only for now
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-400 font-sans selection:bg-emerald-500/30 selection:text-emerald-500">
      <header className="border-b border-neutral-900 bg-neutral-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/admindashboard")}
              className="p-2 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded transition-all group"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-600 group-hover:text-emerald-500" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-white uppercase tracking-tighter">
              VRMTS ADMIN
              </h1>
              <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">System Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {saved && (
              <div className="hidden sm:flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                <Check className="w-3 h-3" />
                Settings saved
              </div>
            )}
            <div className="w-10 h-10 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              <Shield className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="space-y-1">
            {[
              { id: "account", label: "Admin Profile", icon: User },
              { id: "preferences", label: "Interface Settings", icon: Monitor },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "system", label: "System Settings", icon: Server }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded text-left transition-all group ${
                  activeTab === tab.id
                    ? "bg-neutral-900 border border-neutral-800 text-emerald-500"
                    : "text-neutral-500 hover:text-neutral-300 border border-transparent hover:border-neutral-900"
                }`}
              >
                <tab.icon className={`w-4 h-4 flex-shrink-0 ${activeTab === tab.id ? "text-emerald-500" : "text-neutral-600 group-hover:text-neutral-400"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </aside>

          {/* Main content */}
          <section className="lg:col-span-3 space-y-12">
            {activeTab === "account" && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 space-y-10">
                <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-3 mb-8">
                  <User className="w-4 h-4 text-emerald-500" />
                  Admin Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      placeholder="System Administrator"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-neutral-800"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      placeholder="admin@university.edu"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded text-white text-xs font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-neutral-800"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Institution</label>
                    <input
                      type="text"
                      placeholder="Medical University"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-neutral-800"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Role</label>
                    <input
                      type="text"
                      value="Platform Administrator"
                      readOnly
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded text-neutral-600 text-[10px] font-bold uppercase tracking-widest cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 space-y-10">
                <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-emerald-500" />
                  Interface & Locale
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button 
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="p-6 rounded border border-neutral-800 bg-neutral-950/20 hover:border-neutral-700 hover:bg-neutral-950/40 transition-all text-left group"
                  >
                    <span className="block text-[10px] font-bold text-neutral-600 mb-2 uppercase tracking-widest group-hover:text-neutral-500">Theme</span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{theme === "light" ? "Light" : "Dark (Default)"}</span>
                  </button>
                  {[
                    { label: "Language", value: "English (US)" },
                    { label: "Time Zone", value: "UTC+05:00" }
                  ].map((pref, idx) => (
                    <button key={idx} className="p-6 rounded border border-neutral-800 bg-neutral-950/20 hover:border-neutral-700 hover:bg-neutral-950/40 transition-all text-left group">
                      <span className="block text-[10px] font-bold text-neutral-600 mb-2 uppercase tracking-widest group-hover:text-neutral-500">{pref.label}</span>
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">{pref.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 space-y-12">
                <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-3">
                  <Bell className="w-4 h-4 text-emerald-500" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Critical system alerts", desc: "Downtime, database errors, and security events" },
                    { label: "Usage analytics", desc: "Summary of platform activity and storage metrics" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-neutral-950 border border-neutral-800 rounded group hover:border-neutral-700 transition-all">
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">{item.label}</h4>
                        <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-tight">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={idx === 0} />
                        <div className="w-9 h-5 bg-neutral-800 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 space-y-12">
                <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-3">
                  <Server className="w-4 h-4 text-emerald-500" />
                  System Controls
                </h3>
                <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                  Manage platform-wide settings and maintenance
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Maintenance mode", icon: Activity, desc: "Prevent new logins while keeping current sessions active", color: "text-emerald-500" },
                    { label: "System backups", icon: Database, desc: "Configure automatic system snapshots and storage", color: "text-emerald-500" }
                  ].map((control, idx) => (
                    <div key={idx} className="p-6 bg-neutral-950 border border-neutral-800 rounded flex flex-col justify-between group hover:border-neutral-700 transition-all">
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                          <control.icon className={`w-4 h-4 ${control.color}`} />
                          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">{control.label}</h4>
                        </div>
                        <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-tight leading-relaxed">{control.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-auto">
                        <input type="checkbox" className="sr-only peer" defaultChecked={idx === 1} />
                        <div className="w-9 h-5 bg-neutral-800 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                      </label>
                    </div>
                  ))}
                  
                  <div className="p-6 bg-neutral-950 border border-neutral-800 rounded flex flex-col justify-between group hover:border-neutral-700 transition-all md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <HardDrive className="w-4 h-4 text-emerald-500" />
                          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Storage Alerts</h4>
                        </div>
                        <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-tight">Alert triggers for storage capacity limits</p>
                      </div>
                      <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                        80% Capacity
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 border-t border-neutral-800">
              <div className="flex items-center gap-3 text-neutral-600">
                <AlertCircle className="w-3 h-3 text-emerald-500/50" />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Settings are stored locally in the UI for demonstration</p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-500 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center gap-3"
                >
                  <Save className="w-3 h-3" />
                  Save changes
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;


