import React, { useState } from 'react';
import { Users, BookOpen, TrendingUp, AlertCircle, Clock, Target, Award, MessageSquare, Settings, Bell, Search, ChevronRight, Plus, Download, Send, BarChart3, Activity, CheckCircle, AlertTriangle, Calendar, Eye } from 'lucide-react';

export default function InstructorDashboard() {
  const [selectedClass, setSelectedClass] = useState('Medical Batch 2024');

  const classStats = [
    { label: 'Total Students', value: '156', icon: Users, color: 'from-cyan-500 to-teal-500', change: '+12' },
    { label: 'Average Performance', value: '78%', icon: Target, color: 'from-purple-500 to-indigo-500', change: '+5%' },
    { label: 'Modules Assigned', value: '8/12', icon: BookOpen, color: 'from-emerald-500 to-green-500', change: '+2' },
    { label: 'At-Risk Students', value: '12', icon: AlertCircle, color: 'from-red-500 to-orange-500', change: '-3' }
  ];

  const modulePerformance = [
    { module: 'Cardiovascular System', completed: 142, avgScore: 85, timeSpent: '4.2h', status: 'excellent' },
    { module: 'Nervous System', completed: 138, avgScore: 82, timeSpent: '5.1h', status: 'good' },
    { module: 'Skeletal System', completed: 125, avgScore: 76, timeSpent: '3.8h', status: 'average' },
    { module: 'Muscular System', completed: 98, avgScore: 71, timeSpent: '3.2h', status: 'needs-attention' },
    { module: 'Respiratory System', completed: 87, avgScore: 79, timeSpent: '2.9h', status: 'good' }
  ];

  const recentSubmissions = [
    { student: 'Sarah Johnson', module: 'Cardiovascular System', score: 94, time: '2 mins ago', status: 'excellent' },
    { student: 'Michael Chen', module: 'Nervous System', score: 67, time: '15 mins ago', status: 'needs-review' },
    { student: 'Emma Davis', module: 'Skeletal System', score: 88, time: '1 hour ago', status: 'good' },
    { student: 'James Wilson', module: 'Cardiovascular System', score: 45, time: '2 hours ago', status: 'poor' },
    { student: 'Olivia Brown', module: 'Respiratory System', score: 91, time: '3 hours ago', status: 'excellent' }
  ];

  const atRiskStudents = [
    { name: 'Michael Chen', avatar: 'MC', avgScore: 62, missedDeadlines: 3, lastActive: '2 days ago', risk: 'high' },
    { name: 'James Wilson', avatar: 'JW', avgScore: 58, missedDeadlines: 4, lastActive: '5 days ago', risk: 'high' },
    { name: 'Lisa Anderson', avatar: 'LA', avgScore: 68, missedDeadlines: 2, lastActive: '1 day ago', risk: 'medium' },
    { name: 'David Martinez', avatar: 'DM', avgScore: 65, missedDeadlines: 2, lastActive: '3 days ago', risk: 'medium' }
  ];

  const upcomingDeadlines = [
    { assignment: 'Cardiovascular Quiz', dueDate: 'Dec 15', studentsCompleted: 89, totalStudents: 156 },
    { assignment: 'Nervous System Module', dueDate: 'Dec 18', studentsCompleted: 134, totalStudents: 156 },
    { assignment: 'Respiratory Quiz', dueDate: 'Dec 22', studentsCompleted: 45, totalStudents: 156 }
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', avatar: 'SJ', avgScore: 94, modules: 8, badge: '🏆' },
    { name: 'Emily White', avatar: 'EW', avgScore: 92, modules: 8, badge: '🥇' },
    { name: 'Olivia Brown', avatar: 'OB', avgScore: 91, modules: 7, badge: '🥈' },
    { name: 'Sophia Lee', avatar: 'SL', avgScore: 89, modules: 8, badge: '🥉' }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'excellent': 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      'good': 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
      'average': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      'needs-attention': 'text-orange-400 bg-orange-500/20 border-orange-500/30',
      'poor': 'text-red-400 bg-red-500/20 border-red-500/30',
      'needs-review': 'text-orange-400 bg-orange-500/20 border-orange-500/30'
    };
    return colors[status] || colors['average'];
  };

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      'high': 'border-red-500/30 bg-red-500/10',
      'medium': 'border-orange-500/30 bg-orange-500/10',
      'low': 'border-yellow-500/30 bg-yellow-500/10'
    };
    return colors[risk] || colors['medium'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">
              <span className="text-white">VR</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">MTS</span>
            </h1>
            <nav className="hidden md:flex gap-6">
              <button className="text-slate-400 hover:text-white transition-colors">Dashboard</button>
              <button className="text-cyan-400 font-medium" onClick={() => window.location.href = '/instructor/students'}>Students</button>
              <button className="text-slate-400 hover:text-white transition-colors">Modules</button>
              <button className="text-slate-400 hover:text-white transition-colors">Analytics</button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cyan-400/50"
            >
              <option>Medical Batch 2024</option>
              <option>Medical Batch 2023</option>
              <option>Nursing Program A</option>
            </select>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center font-bold">
              DR
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Good afternoon, Dr. Rahman 👋</h2>
            <p className="text-slate-400">Here's what's happening with your classes today</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg hover:border-cyan-400/50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Assign Module
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {classStats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.change && (
                  <span className={`text-sm font-medium flex items-center gap-1 ${
                    stat.change.startsWith('+') && !stat.label.includes('At-Risk') ? 'text-emerald-400' : 
                    stat.change.startsWith('-') && stat.label.includes('At-Risk') ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Module Performance */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                  Module Performance Overview
                </h3>
                <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300 flex items-center gap-1">
                  View Detailed Analytics <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {modulePerformance.map((module, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-800/50 border border-white/10 rounded-xl p-4 hover:border-cyan-400/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{module.module}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {module.completed}/156 completed
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Avg: {module.timeSpent}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold mb-1">{module.avgScore}%</div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(module.status)}`}>
                          {module.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                        style={{ width: `${(module.completed / 156) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-6 h-6 text-cyan-400" />
                  Recent Quiz Submissions
                </h3>
                <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {recentSubmissions.map((submission, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-slate-800/30 border border-white/5 rounded-lg hover:border-cyan-400/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center font-bold text-sm">
                      {submission.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{submission.student}</h4>
                      <p className="text-xs text-slate-400">{submission.module}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        submission.score >= 80 ? 'text-emerald-400' :
                        submission.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {submission.score}%
                      </div>
                      <p className="text-xs text-slate-500">{submission.time}</p>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 rounded-xl p-6 text-left hover:scale-105 transition-all hover:border-cyan-400">
                <Plus className="w-8 h-8 text-cyan-400 mb-3" />
                <h4 className="font-semibold mb-1">Create Quiz</h4>
                <p className="text-sm text-slate-400">New assessment</p>
              </button>

              <button className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-6 text-left hover:scale-105 transition-all hover:border-emerald-400">
                <Send className="w-8 h-8 text-emerald-400 mb-3" />
                <h4 className="font-semibold mb-1">Send Message</h4>
                <p className="text-sm text-slate-400">Contact students</p>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* At-Risk Students */}
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                At-Risk Students
              </h4>
              <div className="space-y-3">
                {atRiskStudents.map((student, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg border ${getRiskColor(student.risk)}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold">
                        {student.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{student.name}</p>
                        <p className="text-xs text-slate-400">Avg: {student.avgScore}%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{student.missedDeadlines} missed deadlines</span>
                      <span>{student.lastActive}</span>
                    </div>
                    <button className="mt-2 w-full py-1.5 px-3 bg-white/5 hover:bg-white/10 rounded text-xs font-medium transition-colors">
                      Send Reminder
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm font-medium transition-all">
                View All At-Risk
              </button>
            </div>

            {/* Top Performers */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Top Performers
              </h4>
              <div className="space-y-3">
                {topPerformers.map((student, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-2xl">{student.badge}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-xs font-bold">
                      {student.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.modules} modules</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">{student.avgScore}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                Upcoming Deadlines
              </h4>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{deadline.assignment}</p>
                        <p className="text-xs text-slate-400">Due: {deadline.dueDate}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Completion</span>
                        <span>{deadline.studentsCompleted}/{deadline.totalStudents}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                          style={{ width: `${(deadline.studentsCompleted / deadline.totalStudents) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-2xl p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                AI Insights
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                  <p className="text-slate-300">
                    <span className="text-cyan-400 font-medium">12 students</span> are struggling with the Muscular System module
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2"></div>
                  <p className="text-slate-300">
                    Class engagement has increased <span className="text-emerald-400 font-medium">15%</span> this week
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2"></div>
                  <p className="text-slate-300">
                    Consider reviewing cardiovascular quiz difficulty
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full py-2 px-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-sm font-medium transition-all">
                View All Insights
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}