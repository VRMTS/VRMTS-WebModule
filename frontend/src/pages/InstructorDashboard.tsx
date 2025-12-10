import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, BookOpen, TrendingUp, AlertCircle, Clock, Target, Award, MessageSquare, Settings, Bell, Search, ChevronRight, Plus, Download, Send, BarChart3, Activity, CheckCircle, AlertTriangle, Calendar, Eye, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

interface ClassStats {
  totalStudents: number;
  averagePerformance: number;
  modulesAssigned: number;
  totalModules: number;
  atRiskStudents: number;
}

interface ModulePerformance {
  module: string;
  completed: number;
  avgScore: number;
  timeSpent: string;
  status: string;
}

interface RecentSubmission {
  student: string;
  module: string;
  score: number;
  time: string;
  status: string;
}

interface AtRiskStudent {
  name: string;
  avatar: string;
  avgScore: number;
  missedDeadlines: number;
  lastActive: string;
  risk: string;
}

interface TopPerformer {
  name: string;
  avatar: string;
  avgScore: number;
  modules: number;
  badge: string;
}

interface UpcomingDeadline {
  assignment: string;
  dueDate: string;
  studentsCompleted: number;
  totalStudents: number;
}

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('Medical Batch 2024');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [classStats, setClassStats] = useState<ClassStats>({
    totalStudents: 0,
    averagePerformance: 0,
    modulesAssigned: 0,
    totalModules: 0,
    atRiskStudents: 0
  });
  const [modulePerformance, setModulePerformance] = useState<ModulePerformance[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const [totalStudents, setTotalStudents] = useState(156);
  const [userName, setUserName] = useState('Instructor');
  const [userInitials, setUserInitials] = useState('IN');

  useEffect(() => {
    fetchUserInfo();
    fetchDashboardData();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userResponse = await axios.get(`${API_BASE_URL}/auth/check`, { withCredentials: true });
      if (userResponse.data.isAuthenticated && userResponse.data.user) {
        const name = userResponse.data.user.name || 'Instructor';
        setUserName(name);
        // Get initials from name
        const initials = name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
        setUserInitials(initials);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        statsResponse,
        modulePerfResponse,
        submissionsResponse,
        atRiskResponse,
        topPerformersResponse,
        deadlinesResponse
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/instructor/class-stats`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/instructor/module-performance`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/instructor/recent-submissions`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/instructor/at-risk-students`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/instructor/top-performers`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/instructor/upcoming-deadlines`, { withCredentials: true })
      ]);

      if (statsResponse.data.success) {
        setClassStats(statsResponse.data.data);
      }

      if (modulePerfResponse.data.success) {
        setModulePerformance(modulePerfResponse.data.data);
        setTotalStudents(modulePerfResponse.data.totalStudents || 156);
      }

      if (submissionsResponse.data.success) {
        setRecentSubmissions(submissionsResponse.data.data);
      }

      if (atRiskResponse.data.success) {
        setAtRiskStudents(atRiskResponse.data.data);
      }

      if (topPerformersResponse.data.success) {
        setTopPerformers(topPerformersResponse.data.data);
      }

      if (deadlinesResponse.data.success) {
        setUpcomingDeadlines(deadlinesResponse.data.data);
      }

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const displayClassStats = [
    { 
      label: 'Total Students', 
      value: classStats.totalStudents.toString(), 
      icon: Users, 
      color: 'from-cyan-500 to-teal-500', 
      change: null 
    },
    { 
      label: 'Average Performance', 
      value: `${classStats.averagePerformance}%`, 
      icon: Target, 
      color: 'from-purple-500 to-indigo-500', 
      change: null 
    },
    { 
      label: 'Modules Assigned', 
      value: `${classStats.modulesAssigned}/${classStats.totalModules}`, 
      icon: BookOpen, 
      color: 'from-emerald-500 to-green-500', 
      change: null 
    },
    { 
      label: 'At-Risk Students', 
      value: classStats.atRiskStudents.toString(), 
      icon: AlertCircle, 
      color: 'from-red-500 to-orange-500', 
      change: null 
    }
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
              <span className="text-white">VRMTS</span>
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
            <button
              onClick={() => navigate('/instructor/settings')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center font-bold">
              {userInitials}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {userName} 👋</h2>
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <span className="ml-3 text-slate-400">Loading dashboard data...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {displayClassStats.map((stat, idx) => (
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
        )}

        {!loading && (
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
                {modulePerformance.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p>No module performance data available yet.</p>
                  </div>
                ) : (
                  modulePerformance.map((module, idx) => (
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
                            {module.completed}/{totalStudents} completed
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
                        style={{ width: `${totalStudents > 0 ? (module.completed / totalStudents) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  ))
                )}
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
                {recentSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p>No recent quiz submissions.</p>
                  </div>
                ) : (
                  recentSubmissions.map((submission, idx) => (
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
                  ))
                )}
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
                {atRiskStudents.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-sm">
                    <p>No at-risk students identified.</p>
                  </div>
                ) : (
                  atRiskStudents.map((student, idx) => (
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
                  ))
                )}
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
                {topPerformers.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-sm">
                    <p>No top performers data available yet.</p>
                  </div>
                ) : (
                  topPerformers.map((student, idx) => (
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
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                Upcoming Deadlines
              </h4>
              <div className="space-y-4">
                {upcomingDeadlines.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-sm">
                    <p>No upcoming deadlines.</p>
                  </div>
                ) : (
                  upcomingDeadlines.map((deadline, idx) => (
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
                  ))
                )}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-2xl p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                AI Insights
              </h4>
              <div className="space-y-3 text-sm">
                <div className="text-center py-4 text-slate-400 text-sm">
                  <p>AI insights will appear here once available.</p>
                </div>
              </div>
              <button className="mt-4 w-full py-2 px-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-sm font-medium transition-all">
                View All Insights
              </button>
            </div>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}