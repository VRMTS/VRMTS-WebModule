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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">VRMTS</span>
            </h1>
            <nav className="hidden md:flex gap-6">
              <button className="text-cyan-400 font-medium">Dashboard</button>
              <button className="text-slate-400 hover:text-white transition-colors">Users</button>
              <button className="text-slate-400 hover:text-white transition-colors">Content</button>
              <button className="text-slate-400 hover:text-white transition-colors">System</button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              Admin Dashboard
            </h2>
            <p className="text-slate-400">System overview and management</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowBulkUpload(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <Upload className="w-5 h-5" />
              Bulk Upload Students
            </button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {systemStats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* System Health */}
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6 text-cyan-400" />
                System Health
              </h3>
              <button className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            <div className="space-y-3">
              {systemHealth.map((service, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-800/30 border border-white/10 rounded-xl p-4 hover:border-cyan-400/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.color === 'emerald' ? 'bg-emerald-500' :
                        service.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                      } shadow-lg`}></div>
                      <h4 className="font-semibold">{service.service}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${
                        service.status === 'operational' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        service.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Uptime: {service.uptime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Latency: {service.latency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Overview */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HardDrive className="w-6 h-6 text-cyan-400" />
              Storage
            </h3>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Used</span>
                <span className="font-semibold">{storageStats.used} GB / {storageStats.total} GB</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                  style={{ width: `${(storageStats.used / storageStats.total) * 100}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">{storageStats.available} GB available</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-sm text-slate-400">3D Models</span>
                <span className="font-semibold">{storageStats.models} GB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-sm text-slate-400">User Data</span>
                <span className="font-semibold">{storageStats.userdata} GB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-sm text-slate-400">Backups</span>
                <span className="font-semibold">{storageStats.backups} GB</span>
              </div>
            </div>

            <button className="mt-4 w-full py-2 px-4 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-lg text-sm font-medium transition-all">
              Manage Storage
            </button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            User Statistics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-800/30 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">{userStats.totalStudents}</div>
              <div className="text-sm text-slate-400">Students</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">{userStats.totalInstructors}</div>
              <div className="text-sm text-slate-400">Instructors</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">{userStats.totalAdmins}</div>
              <div className="text-sm text-slate-400">Admins</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{userStats.activeUsers}</div>
              <div className="text-sm text-slate-400">Active Today</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">{userStats.pendingApprovals}</div>
              <div className="text-sm text-slate-400">Pending</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Classes Management */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                Classes
              </h3>
              <button className="text-cyan-400 text-sm hover:text-cyan-300">View All</button>
            </div>

            <div className="space-y-3">
              {classes.map((cls) => (
                <div 
                  key={cls.id}
                  className="bg-slate-800/30 border border-white/10 rounded-xl p-4 hover:border-cyan-400/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{cls.name}</h4>
                      <p className="text-xs text-slate-400">Instructor: {cls.instructor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      cls.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}>
                      {cls.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{cls.students} students</span>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-white/5 rounded transition-colors">
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button className="p-1 hover:bg-white/5 rounded transition-colors">
                        <Edit className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1 hover:bg-white/5 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              Recent Activity
            </h3>

            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-3 pb-3 border-b border-white/5 last:border-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-cyan-500/20' :
                    activity.type === 'data' ? 'bg-purple-500/20' :
                    activity.type === 'content' ? 'bg-emerald-500/20' :
                    activity.type === 'system' ? 'bg-blue-500/20' :
                    'bg-orange-500/20'
                  }`}>
                    {activity.type === 'user' && <Users className="w-4 h-4 text-cyan-400" />}
                    {activity.type === 'data' && <Database className="w-4 h-4 text-purple-400" />}
                    {activity.type === 'content' && <BookOpen className="w-4 h-4 text-emerald-400" />}
                    {activity.type === 'system' && <Server className="w-4 h-4 text-blue-400" />}
                    {activity.type === 'class' && <UserPlus className="w-4 h-4 text-orange-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-slate-900/50 border border-white/10 hover:border-cyan-400/50 rounded-xl p-6 text-left transition-all group">
            <UserPlus className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold mb-1">Add User</h4>
            <p className="text-xs text-slate-400">Create new account</p>
          </button>

          <button className="bg-slate-900/50 border border-white/10 hover:border-purple-400/50 rounded-xl p-6 text-left transition-all group">
            <BookOpen className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold mb-1">Add Module</h4>
            <p className="text-xs text-slate-400">Upload new content</p>
          </button>

          <button className="bg-slate-900/50 border border-white/10 hover:border-emerald-400/50 rounded-xl p-6 text-left transition-all group">
            <Download className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold mb-1">Backup</h4>
            <p className="text-xs text-slate-400">Create system backup</p>
          </button>

          <button className="bg-slate-900/50 border border-white/10 hover:border-orange-400/50 rounded-xl p-6 text-left transition-all group">
            <BarChart3 className="w-8 h-8 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold mb-1">Reports</h4>
            <p className="text-xs text-slate-400">Generate analytics</p>
          </button>
        </div>

        {/* Bulk Upload Modal */}
        {showBulkUpload && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-2xl font-bold">Bulk Upload Students</h3>
                  <p className="text-slate-400 text-sm mt-1">Upload a CSV file to add multiple students at once</p>
                </div>
                <button 
                  onClick={() => {
                    setShowBulkUpload(false);
                    setUploadFile(null);
                    setPreviewData([]);
                    setUploadProgress(0);
                  }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Instructions */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    CSV Format Requirements
                  </h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>• First row must contain headers</p>
                    <p>• Required columns: <code className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400">name</code>, <code className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400">email</code>, <code className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400">class</code></p>
                    <p>• Optional columns: student_id, phone, enrollment_date</p>
                    <p>• Maximum 500 rows per upload</p>
                  </div>
                  <button className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Sample CSV Template
                  </button>
                </div>

                {/* File Upload Area */}
                {!uploadFile ? (
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-cyan-400/50 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">Click to upload or drag and drop</h4>
                      <p className="text-sm text-slate-400">CSV files only (max 10MB)</p>
                    </label>
                  </div>
                ) : (
                  <>
                    {/* File Info */}
                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-emerald-500/20">
                          <FileText className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{uploadFile.name}</h4>
                          <p className="text-sm text-slate-400">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button 
                          onClick={() => {
                            setUploadFile(null);
                            setPreviewData([]);
                          }}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Data Preview */}
                    {previewData.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Data Preview (First 5 rows)</h4>
                        <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-800/50">
                                <tr>
                                  {previewData[0]?.map((header, idx) => (
                                    <th key={idx} className="p-3 text-left font-semibold text-cyan-400">
                                      {header.trim()}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {previewData.slice(1).map((row, idx) => (
                                  <tr key={idx} className="border-t border-white/5">
                                    {row.map((cell, cellIdx) => (
                                      <td key={cellIdx} className="p-3 text-slate-300">
                                        {cell.trim()}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">
                          Total rows detected: {previewData.length - 1} students
                        </p>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {isUploading && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Uploading...</span>
                          <span className="font-bold text-cyan-400">{uploadProgress}%</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload Actions */}
                    {!isUploading && uploadFile && (
                      <div className="flex gap-3">
                        <button
                          onClick={handleBulkUpload}
                          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
                        >
                          <Upload className="w-5 h-5" />
                          Upload Students
                        </button>
                        <button
                          onClick={() => {
                            setUploadFile(null);
                            setPreviewData([]);
                          }}
                          className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-lg font-medium transition-all"
                        >
                          Clear File
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
