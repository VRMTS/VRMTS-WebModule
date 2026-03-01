import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, BookOpen, TrendingUp, AlertCircle, Clock, Target, Award, MessageSquare, Settings, Bell, ChevronRight, Plus, Download, Send, BarChart3, Activity, CheckCircle, AlertTriangle, Calendar, Eye, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

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
        atRiskResponse,
        topPerformersResponse,
        deadlinesResponse
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/instructor/class-stats`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/instructor/module-performance`, { withCredentials: true }),
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

  const instructorNav = [
    { key: 'dashboard' as const, label: 'Dashboard', path: '/instructordashboard' },
    { key: 'students' as const, label: 'Students', path: '/instructor/students' },
    { key: 'modules' as const, label: 'Modules', path: '/modules' },
    { key: 'quiz' as const, label: 'Quiz', path: '/instructor/create-quiz' },
    { key: 'analytics' as const, label: 'Analytics', path: '/studentanalytics' },
  ];

  const headerRight = (
    <>
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="px-3 py-2 bg-slate-800/60 border border-white/10 rounded-md text-sm text-slate-200 focus:outline-none focus:border-slate-600"
      >
        <option>Medical Batch 2024</option>
        <option>Medical Batch 2023</option>
        <option>Nursing Program A</option>
      </select>
      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
        <Bell className="w-5 h-5" />
      </button>
      <button onClick={() => navigate('/instructor/settings')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
        <Settings className="w-5 h-5" />
      </button>
      <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium text-slate-200">
        {userInitials}
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-slate-200">{error}</h3>
          <button onClick={fetchDashboardData} className="mt-4 px-5 py-2.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Instructor dashboard"
      subtitle={`Welcome back, ${userName}`}
      breadcrumbLabel="Dashboard"
      activeNav="dashboard"
      userType="instructor"
      navItems={instructorNav}
      headerRight={headerRight}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 border border-white/10 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export report
          </button>
          <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 border border-white/10 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Assign module
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {displayClassStats.map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-slate-700/80">
                <stat.icon className="w-5 h-5 text-slate-300" />
              </div>
              {stat.change && (
                <span className="text-xs font-medium flex items-center gap-1 text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {stat.change}
                </span>
              )}
            </div>
            <div className="text-xl font-semibold text-slate-100">{stat.value}</div>
            <div className="text-slate-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                Module performance
              </h3>
              <button className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                View analytics <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {modulePerformance.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No module performance data yet.</div>
              ) : (
                modulePerformance.map((module, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-100">{module.module}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{module.completed}/{totalStudents} completed</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Avg: {module.timeSpent}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-slate-100">{module.avgScore}%</div>
                        <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(module.status)}`}>
                          {module.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${totalStudents > 0 ? (module.completed / totalStudents) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/instructor/create-quiz')}
              className="bg-slate-800/50 border border-white/10 rounded-lg p-5 text-left hover:border-slate-600 transition-colors"
            >
              <Plus className="w-6 h-6 text-slate-400 mb-2" />
              <h4 className="font-medium text-slate-100 mb-0.5">Create quiz</h4>
              <p className="text-sm text-slate-500">New assessment</p>
            </button>
            <button className="bg-slate-800/50 border border-white/10 rounded-lg p-5 text-left hover:border-slate-600 transition-colors">
              <Send className="w-6 h-6 text-slate-400 mb-2" />
              <h4 className="font-medium text-slate-100 mb-0.5">Send message</h4>
              <p className="text-sm text-slate-500">Contact students</p>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <h4 className="font-medium text-slate-100 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              At-risk students
            </h4>
            <div className="space-y-3">
              {atRiskStudents.length === 0 ? (
                <p className="text-sm text-slate-500">No at-risk students identified.</p>
              ) : (
                atRiskStudents.map((student, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${getRiskColor(student.risk)}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-medium text-slate-200">
                        {student.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-100">{student.name}</p>
                        <p className="text-xs text-slate-500">Avg: {student.avgScore}%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{student.missedDeadlines} missed deadlines</span>
                      <span>{student.lastActive}</span>
                    </div>
                    <button className="mt-2 w-full py-1.5 px-3 bg-slate-600 hover:bg-slate-500 rounded text-xs font-medium transition-colors">
                      Send reminder
                    </button>
                  </div>
                ))
              )}
            </div>
            <button className="mt-3 w-full py-2 px-3 bg-slate-600 hover:bg-slate-500 rounded-md text-sm font-medium transition-colors">
              View all at-risk
            </button>
          </div>

          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <h4 className="font-medium text-slate-100 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-400" />
              Top performers
            </h4>
            <div className="space-y-3">
              {topPerformers.length === 0 ? (
                <p className="text-sm text-slate-500">No top performers data yet.</p>
              ) : (
                topPerformers.map((student, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                      <Award className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-medium text-slate-200">
                      {student.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-100">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.modules} modules</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-400">{student.avgScore}%</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <h4 className="font-medium text-slate-100 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Upcoming deadlines
            </h4>
            <div className="space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming deadlines.</p>
              ) : (
                upcomingDeadlines.map((deadline, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-sm font-medium text-slate-200">{deadline.assignment}</p>
                    <p className="text-xs text-slate-500">Due: {deadline.dueDate}</p>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Completion</span>
                      <span>{deadline.studentsCompleted}/{deadline.totalStudents}</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(deadline.studentsCompleted / deadline.totalStudents) * 100}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <h4 className="font-medium text-slate-100 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              AI insights
            </h4>
            <p className="text-sm text-slate-500 mb-3">AI insights will appear here once available.</p>
            <button className="w-full py-2 px-3 bg-slate-600 hover:bg-slate-500 rounded-md text-sm font-medium transition-colors">
              View all insights
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}