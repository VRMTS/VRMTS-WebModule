import React, { useState } from 'react';
import { Shield, Users, BookOpen, Settings, Database, Upload, Download, UserPlus, FileText, Activity, TrendingUp, Server, HardDrive, Cpu, AlertTriangle, CheckCircle, Clock, BarChart3, Trash2, Edit, Eye, RefreshCw, Bell, Mail, Lock, X } from 'lucide-react';

export default function VRMTSAdminDashboard() {
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const systemStats = [
    { label: 'Total Users', value: '342', change: '+24', icon: Users, color: 'from-cyan-500 to-teal-500' },
    { label: 'Active Instructors', value: '48', change: '+3', icon: UserPlus, color: 'from-purple-500 to-indigo-500' },
    { label: 'Total Modules', value: '12', change: '+2', icon: BookOpen, color: 'from-emerald-500 to-green-500' },
    { label: 'System Uptime', value: '99.8%', change: '+0.2%', icon: Server, color: 'from-blue-500 to-cyan-500' }
  ];

  const systemHealth = [
    { service: 'API Server', status: 'operational', uptime: '99.9%', latency: '45ms', color: 'emerald' },
    { service: 'Database', status: 'operational', uptime: '99.8%', latency: '12ms', color: 'emerald' },
    { service: 'VR Server', status: 'operational', uptime: '99.7%', latency: '78ms', color: 'emerald' },
    { service: 'Storage', status: 'warning', uptime: '99.5%', latency: '234ms', color: 'yellow' },
    { service: 'WebGL Engine', status: 'operational', uptime: '99.9%', latency: '34ms', color: 'emerald' }
  ];

  const recentActivity = [
    { action: 'New instructor registered', user: 'Dr. Smith', time: '5 minutes ago', type: 'user' },
    { action: 'Bulk upload completed', user: 'Admin', time: '15 minutes ago', type: 'data' },
    { action: 'Module updated', user: 'Dr. Rahman', time: '1 hour ago', type: 'content' },
    { action: 'System backup completed', user: 'System', time: '2 hours ago', type: 'system' },
    { action: 'New class created', user: 'Dr. Chen', time: '3 hours ago', type: 'class' }
  ];

  const userStats = {
    totalStudents: 286,
    totalInstructors: 48,
    totalAdmins: 8,
    activeUsers: 267,
    pendingApprovals: 12
  };

  const storageStats = {
    total: 500,
    used: 347,
    available: 153,
    models: 145,
    userdata: 102,
    backups: 100
  };

  const classes = [
    { id: 1, name: 'Medical Batch 2024', students: 156, instructor: 'Dr. Rahman', created: '2024-08-01', status: 'active' },
    { id: 2, name: 'Medical Batch 2023', students: 142, instructor: 'Dr. Smith', created: '2023-08-01', status: 'active' },
    { id: 3, name: 'Nursing Program A', students: 89, instructor: 'Dr. Chen', created: '2024-09-01', status: 'active' },
    { id: 4, name: 'Medical Batch 2022', students: 130, instructor: 'Dr. Johnson', created: '2022-08-01', status: 'archived' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadFile(file);

      // Simulate CSV parsing
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const text = e.target.result as string;
          const rows = text.split('\n').slice(0, 6); // Preview first 5 rows + header
          const preview = rows.map(row => row.split(','));
          setPreviewData(preview);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleBulkUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setShowBulkUpload(false);
            setUploadFile(null);
            setPreviewData([]);
            setUploadProgress(0);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <header className="border-b border-neutral-900 bg-neutral-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-base font-bold text-white tracking-tight">VRMTS</h1>
            <nav className="hidden md:flex gap-6 text-sm">
              <button className="text-emerald-500 font-medium">Dashboard</button>
              <button className="text-neutral-500 hover:text-neutral-300 transition-colors">Users</button>
              <button className="text-neutral-500 hover:text-neutral-300 transition-colors">Content</button>
              <button className="text-neutral-500 hover:text-neutral-300 transition-colors">System</button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-neutral-400 border border-neutral-700">
              <Shield className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1 flex items-center gap-3">
              Admin Dashboard
            </h2>
            <p className="text-neutral-500 text-sm">System overview and management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBulkUpload(true)}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-sm font-bold text-white transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Users', value: '342', change: '+24', icon: Users, color: 'text-neutral-400' },
            { label: 'Active Instructors', value: '48', change: '+3', icon: UserPlus, color: 'text-emerald-500' },
            { label: 'Total Modules', value: '12', change: '+2', icon: BookOpen, color: 'text-emerald-400' },
            { label: 'System Uptime', value: '99.8%', change: '+0.2%', icon: Server, color: 'text-neutral-500' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-500">
                  <stat.icon className="w-5 h-5 shadow-sm" />
                </div>
                <span className="text-emerald-500 text-[10px] font-bold tracking-tight bg-emerald-500/10 px-2 py-0.5 rounded">
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-neutral-500 text-sm font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* System Health */}
          <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                System Health
              </h3>
              <button className="text-neutral-500 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {systemHealth.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 group hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${service.color === 'emerald' ? 'bg-emerald-500' :
                          service.color === 'yellow' ? 'bg-amber-500' : 'bg-rose-500'
                        } shadow-[0_0_8px_rgba(16,185,129,0.3)]`}></div>
                      <h4 className="font-bold text-neutral-200 tracking-tight">{service.service}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight ${service.status === 'operational' ? 'bg-emerald-500/10 text-emerald-500' :
                          service.status === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-rose-500/10 text-rose-500'
                        }`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs font-medium text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Uptime: {service.uptime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Latency: {service.latency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Overview */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-8">
              Storage
            </h3>

            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold text-neutral-500 mb-3 uppercase tracking-tight">
                <span>Disk Usage</span>
                <span className="text-neutral-200">{storageStats.used} GB / {storageStats.total} GB</span>
              </div>
              <div className="h-1 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/30">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${(storageStats.used / storageStats.total) * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest mt-3">{storageStats.available} GB available</div>
            </div>

            <div className="space-y-3">
              {[
                { label: '3D Models', value: storageStats.models },
                { label: 'User Data', value: storageStats.userdata },
                { label: 'Backups', value: storageStats.backups }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-lg group hover:border-neutral-700 transition-colors">
                  <span className="text-xs font-bold text-neutral-500 group-hover:text-neutral-400 transition-colors">{item.label}</span>
                  <span className="text-xs font-bold text-neutral-200 tracking-tight">{item.value} GB</span>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs font-bold text-neutral-200 transition-all uppercase tracking-widest">
              Manage Storage
            </button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            User Statistics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">{userStats.totalStudents}</div>
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Students</div>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">{userStats.totalInstructors}</div>
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Instructors</div>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">{userStats.totalAdmins}</div>
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Admins</div>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{userStats.activeUsers}</div>
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Active Today</div>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">{userStats.pendingApprovals}</div>
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Pending</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Classes Management */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                Classes
              </h3>
              <button className="text-neutral-500 hover:text-white text-xs font-bold transition-colors">View All</button>
            </div>

            <div className="space-y-4">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 group hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-neutral-200 tracking-tight">{cls.name}</h4>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1.5">Instructor: {cls.instructor}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-tight border ${cls.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        'bg-neutral-500/10 text-neutral-500 border-neutral-800'
                      }`}>
                      {cls.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">{cls.students} students</span>
                    <div className="flex gap-2">
                      {[Eye, Edit, Trash2].map((Icon, i) => (
                        <button key={i} className="p-2 hover:bg-neutral-800 rounded transition-colors text-neutral-500 hover:text-white">
                          <Icon className={`w-3.5 h-3.5 ${Icon === Trash2 ? 'hover:text-rose-500' : 'hover:text-emerald-500'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-8">
              Recent Activity
            </h3>

            <div className="space-y-6">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className={`w-8 h-8 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-700 transition-colors ${activity.type === 'user' ? 'text-emerald-500' :
                      activity.type === 'data' ? 'text-amber-500' :
                        activity.type === 'content' ? 'text-emerald-400' :
                          'text-neutral-500'
                    }`}>
                    {activity.type === 'user' && <Users className="w-4 h-4" />}
                    {activity.type === 'data' && <Database className="w-4 h-4" />}
                    {activity.type === 'content' && <BookOpen className="w-4 h-4" />}
                    {activity.type === 'system' && <Server className="w-4 h-4" />}
                    {activity.type === 'class' && <UserPlus className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-200 leading-snug tracking-tight uppercase">{activity.action}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 mt-1 uppercase tracking-wider">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          {[
            { label: 'Add User', desc: 'New account', icon: UserPlus, color: 'text-emerald-500' },
            { label: 'Add Module', desc: 'New content', icon: BookOpen, color: 'text-amber-500' },
            { label: 'Backup', desc: 'System save', icon: Download, color: 'text-emerald-400' },
            { label: 'Reports', desc: 'Analytics', icon: BarChart3, color: 'text-neutral-400' }
          ].map((action, i) => (
            <button key={i} className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg p-6 text-left transition-all group">
              <action.icon className={`w-5 h-5 ${action.color} mb-3 group-hover:scale-110 transition-transform`} />
              <h4 className="font-bold text-neutral-200 text-sm tracking-tight">{action.label}</h4>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-1">{action.desc}</p>
            </button>
          ))}
        </div>

        {/* Bulk Upload Modal */}
        {showBulkUpload && (
          <div className="fixed inset-0 bg-neutral-950/80 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Bulk Upload Students</h3>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1">Upload a CSV file to add multiple students at once</p>
                </div>
                <button
                  onClick={() => {
                    setShowBulkUpload(false);
                    setUploadFile(null);
                    setPreviewData([]);
                    setUploadProgress(0);
                  }}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

                <div className="p-8 space-y-8">
                {/* Instructions */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
                  <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4 flex items-center gap-3">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    CSV Format Requirements
                  </h4>
                  <div className="space-y-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    <p>• First row must contain headers</p>
                    <p>• Required columns: <code className="px-2 py-0.5 bg-neutral-900 rounded text-emerald-500">name</code>, <code className="px-2 py-0.5 bg-neutral-900 rounded text-emerald-500">email</code>, <code className="px-2 py-0.5 bg-neutral-900 rounded text-emerald-500">class</code></p>
                    <p>• Optional columns: student_id, phone, enrollment_date</p>
                    <p>• Maximum 500 rows per upload</p>
                  </div>
                  <button className="mt-4 text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Sample CSV Template
                  </button>
                </div>

                {/* File Upload Area */}
                {!uploadFile ? (
                  <div className="border border-dashed border-neutral-800 rounded-lg p-12 text-center hover:border-emerald-500/50 transition-all cursor-pointer bg-neutral-950/50">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Click to upload or drag and drop</h4>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">CSV files only (max 10MB)</p>
                    </label>
                  </div>
                ) : (
                  <>
                    {/* File Info */}
                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded bg-emerald-500/10">
                          <FileText className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">{uploadFile.name}</h4>
                          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button
                          onClick={() => {
                            setUploadFile(null);
                            setPreviewData([]);
                          }}
                          className="p-2 hover:bg-neutral-800 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    </div>

                    {/* Data Preview */}
                    {previewData.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Data Preview (First 5 rows)</h4>
                        <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-[10px] font-bold uppercase tracking-widest">
                              <thead className="bg-neutral-900">
                                <tr>
                                  {previewData[0]?.map((header, idx) => (
                                    <th key={idx} className="p-4 text-left font-bold text-emerald-500 border-b border-neutral-800">
                                      {header.trim()}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {previewData.slice(1).map((row, idx) => (
                                  <tr key={idx} className="border-t border-neutral-800/50">
                                    {row.map((cell, cellIdx) => (
                                      <td key={cellIdx} className="p-4 text-neutral-400">
                                        {cell.trim()}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-2">
                          Total rows detected: {previewData.length - 1} students
                        </p>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {isUploading && (
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
                          <span>Processing Upload...</span>
                          <span className="font-bold text-emerald-500">{uploadProgress}%</span>
                        </div>
                        <div className="h-1 bg-neutral-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload Actions */}
                    {!isUploading && uploadFile && (
                      <div className="flex gap-4">
                        <button
                          onClick={handleBulkUpload}
                          className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Process Data
                        </button>
                        <button
                          onClick={() => {
                            setUploadFile(null);
                            setPreviewData([]);
                          }}
                          className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-500 hover:text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
