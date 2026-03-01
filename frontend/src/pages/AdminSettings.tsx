import React, { useState } from "react";
import { ChevronLeft, Shield, User, Bell, Monitor, Globe, Save, AlertCircle, Check, Server, Database, HardDrive, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"account" | "preferences" | "notifications" | "system">("account");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // UI-only for now
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admindashboard")}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">
              <span className="text-white">VRMTS</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <div className="hidden sm:flex items-center gap-2 text-emerald-400 text-xs font-medium">
                <Check className="w-4 h-4" />
                Settings saved
              </div>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Settings</h2>
          <p className="text-slate-400 text-sm">
            Manage your admin profile and core system preferences. This screen is UI‑only; backend connections can be added later.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activeTab === "account"
                  ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 text-cyan-300"
                  : "hover:bg-white/5 text-slate-300"
              }`}
            >
              <User className="w-4 h-4" />
              Admin profile
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activeTab === "preferences"
                  ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 text-cyan-300"
                  : "hover:bg-white/5 text-slate-300"
              }`}
            >
              <Monitor className="w-4 h-4" />
              Appearance & locale
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activeTab === "notifications"
                  ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 text-cyan-300"
                  : "hover:bg-white/5 text-slate-300"
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("system")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activeTab === "system"
                  ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 text-cyan-300"
                  : "hover:bg-white/5 text-slate-300"
              }`}
            >
              <Server className="w-4 h-4" />
              System controls
            </button>
          </aside>

          {/* Main content */}
          <section className="lg:col-span-3 space-y-8">
            {activeTab === "account" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  Admin profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-200">Full name</label>
                    <input
                      type="text"
                      placeholder="System Administrator"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-200">Email</label>
                    <input
                      type="email"
                      placeholder="admin@university.edu"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-200">Institution</label>
                    <input
                      type="text"
                      placeholder="Medical University"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-200">Role</label>
                    <input
                      type="text"
                      value="Platform Administrator"
                      readOnly
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/40 border border-white/10 text-sm text-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-cyan-400" />
                  Appearance & locale
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 rounded-xl border border-white/10 bg-slate-900/60 hover:border-cyan-400/60 transition-all">
                    <span className="block text-xs text-slate-400 mb-1">Theme</span>
                    <span className="font-medium">Dark (default)</span>
                  </button>
                  <button className="p-4 rounded-xl border border-white/10 bg-slate-900/60 hover:border-cyan-400/60 transition-all">
                    <span className="block text-xs text-slate-400 mb-1">Language</span>
                    <span className="font-medium">English (US)</span>
                  </button>
                  <button className="p-4 rounded-xl border border-white/10 bg-slate-900/60 hover:border-cyan-400/60 transition-all">
                    <span className="block text-xs text-slate-400 mb-1">Time zone</span>
                    <span className="font-medium">UTC+05:00</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  Admin notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start justify-between p-4 rounded-xl bg-slate-900/50 border border-white/10">
                    <div>
                      <p className="font-medium text-sm">Critical system alerts</p>
                      <p className="text-xs text-slate-400">
                        Email and in‑app alerts for downtime, database errors and security events.
                      </p>
                    </div>
                    <div className="w-11 h-6 rounded-full bg-slate-700 border border-white/10 relative">
                      {/* purely visual toggle */}
                      <div className="w-5 h-5 rounded-full bg-cyan-400 absolute top-0.5 left-0.5" />
                    </div>
                  </div>
                  <div className="flex items-start justify-between p-4 rounded-xl bg-slate-900/40 border border-white/5">
                    <div>
                      <p className="font-medium text-sm">Usage & analytics digests</p>
                      <p className="text-xs text-slate-400">
                        Periodic summary of activity, active users and storage usage.
                      </p>
                    </div>
                    <div className="w-11 h-6 rounded-full bg-slate-700 border border-white/10 relative">
                      <div className="w-5 h-5 rounded-full bg-slate-400 absolute top-0.5 right-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  System controls (UI only)
                </h3>
                <p className="text-xs text-slate-400">
                  These switches are visual only at the moment. Hook them up to your backend when you are ready to control
                  maintenance mode, backups and other operations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        Maintenance mode
                      </p>
                      <p className="text-xs text-slate-400">
                        Temporarily prevent new logins while keeping current sessions alive.
                      </p>
                    </div>
                    <div className="w-11 h-6 rounded-full bg-slate-700 border border-white/10 relative">
                      <div className="w-5 h-5 rounded-full bg-slate-400 absolute top-0.5 right-0.5" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Database className="w-4 h-4 text-cyan-400" />
                        Automatic backups
                      </p>
                      <p className="text-xs text-slate-400">
                        Configure when VRMTS should take full system snapshots.
                      </p>
                    </div>
                    <div className="w-11 h-6 rounded-full bg-slate-700 border border-white/10 relative">
                      <div className="w-5 h-5 rounded-full bg-cyan-400 absolute top-0.5 left-0.5" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-purple-400" />
                        Storage alerts
                      </p>
                      <p className="text-xs text-slate-400">
                        Visual threshold only — wire up to backend monitoring when ready.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[11px] border border-purple-500/40">
                      80% threshold
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Save bar */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <AlertCircle className="w-4 h-4 text-slate-500" />
                Changes here are only stored in the UI for now; connect to your API later.
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-sm font-semibold hover:from-cyan-400 hover:to-teal-400 transition-all"
              >
                <Save className="w-4 h-4" />
                Save changes
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;


