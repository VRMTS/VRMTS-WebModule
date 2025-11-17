import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Brain, BookOpen, Trophy, Clock, TrendingUp, Zap, Target, Award, MessageSquare, Settings, Bell, Search, ChevronRight, Lock, Play, BarChart3, Calendar } from 'lucide-react';

interface Module {
  moduleId: number;
  name: string;
  category?: string;
  icon?: string;
  description: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'locked' | 'not_started';
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  quizScore: number | null;
  parts: number;
  completedParts: number;
  hoursSpent?: number;
}

interface Stats {
  modulesCompleted: number;
  totalModules: number;
  averageScore: number;
  studyStreak: number;
  totalHours: number;
}

interface Activity {
  action: string;
  module: string;
  score?: number;
  time: string;
}

interface Deadline {
  id: number;
  title: string;
  dueDate: string;
  daysUntil: number;
}

const API_BASE_URL = 'http://localhost:8080/api';

export default function VRDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('modules');
  const [showNotifications, setShowNotifications] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [stats, setStats] = useState<Stats>({
    modulesCompleted: 0,
    totalModules: 0,
    averageScore: 0,
    studyStreak: 0,
    totalHours: 0
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('Student');

  const achievements = [
    { name: 'First Steps', icon: '🎯', unlocked: true },
    { name: 'Quiz Master', icon: '🏆', unlocked: true },
    { name: 'Week Warrior', icon: '⚡', unlocked: true },
    { name: 'Perfect Score', icon: '💯', unlocked: false },
    { name: 'Marathon', icon: '🔥', unlocked: false }
  ];

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user info and dashboard data in parallel
      const [userResponse, statsResponse, modulesResponse, activityResponse, deadlinesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/auth/check`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/dashboard/stats`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/dashboard/recent-modules`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/dashboard/recent-activity`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/dashboard/upcoming-deadlines`, { withCredentials: true })
      ]);

      if (userResponse.data.isAuthenticated) {
        setUserName(userResponse.data.user.name || 'Student');
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (modulesResponse.data.success) {
        setModules(modulesResponse.data.data);
      }

      if (activityResponse.data.success) {
        setRecentActivity(activityResponse.data.data);
      }

      if (deadlinesResponse.data.success) {
        setUpcomingDeadlines(deadlinesResponse.data.data);
      }

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Transform stats for display
  const displayStats = [
    {
      label: 'Modules Completed',
      value: `${stats.modulesCompleted}/${stats.totalModules}`,
      icon: BookOpen,
      color: 'from-cyan-500 to-teal-500'
    },
    {
      label: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: Target,
      color: 'from-purple-500 to-indigo-500',
      trend: stats.averageScore > 0 ? '+5%' : undefined
    },
    {
      label: 'Study Streak',
      value: `${stats.studyStreak} days`,
      icon: Zap,
      color: 'from-emerald-500 to-green-500'
    },
    {
      label: 'Total Hours',
      value: `${stats.totalHours}h`,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500'
    }
  ];

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
              <button className="text-cyan-400 font-medium">Dashboard</button>
              <button className="text-slate-400 hover:text-white transition-colors" onClick={() => navigate('/modules')}>Modules</button>
              <button className="text-slate-400 hover:text-white transition-colors" onClick={() => navigate('/quizselection')}>Quiz</button>
              <button className="text-slate-400 hover:text-white transition-colors" onClick={() => navigate('/studentanalytics')}>Analytics</button>
              <button className="text-slate-400 hover:text-white transition-colors">VR Lab</button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h2>
          <p className="text-slate-400">Ready to continue your anatomy journey?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {displayStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend && (
                  <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.trend}
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
            {/* Modules Section */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Brain className="w-6 h-6 text-cyan-400" />
                  Your Learning Modules
                </h3>
                <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300 flex items-center gap-1" onClick={() => navigate('/modules')}>
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.slice(0, 4).map((module) => (
                  <div
                    key={module.moduleId}
                    onClick={() => module.status !== 'locked' && navigate(`/module/${module.moduleId}`)}
                    className={`relative group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border rounded-xl p-5 transition-all hover:scale-102 hover:shadow-xl hover:shadow-cyan-500/10 ${
                      module.status === 'locked'
                        ? 'border-slate-700/50 opacity-60'
                        : 'border-white/10 hover:border-cyan-400/50 cursor-pointer'
                    }`}
                  >
                    {module.status === 'locked' && (
                      <div className="absolute top-3 right-3">
                        <Lock className="w-5 h-5 text-slate-500" />
                      </div>
                    )}

                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{module.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{module.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.duration}
                          </span>
                          {module.quizScore && (
                            <span className="flex items-center gap-1">
                              <Trophy className="w-3 h-3 text-yellow-400" />
                              {module.quizScore}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {module.status !== 'locked' && (
                      <>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                module.status === 'completed'
                                  ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                  : 'bg-gradient-to-r from-cyan-500 to-teal-500'
                              }`}
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                        </div>

                        <button className="mt-3 w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-sm hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/50">
                          {module.status === 'completed' ? (
                            <>Review <ChevronRight className="w-4 h-4" /></>
                          ) : (
                            <>Continue <Play className="w-4 h-4" /></>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/quizselection')}
                className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl p-6 text-left hover:scale-105 transition-all hover:border-purple-400"
              >
                <Trophy className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="font-semibold mb-1">Take Quiz</h4>
                <p className="text-sm text-slate-400">Test your knowledge</p>
              </button>
              
              <button className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 rounded-xl p-6 text-left hover:scale-105 transition-all hover:border-cyan-400">
                <Brain className="w-8 h-8 text-cyan-400 mb-3" />
                <h4 className="font-semibold mb-1">VR Lab</h4>
                <p className="text-sm text-slate-400">Immersive learning</p>
              </button>
              
              <button
                onClick={() => navigate('/studentanalytics')}
                className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-6 text-left hover:scale-105 transition-all hover:border-emerald-400"
              >
                <BarChart3 className="w-8 h-8 text-emerald-400 mb-3" />
                <h4 className="font-semibold mb-1">Analytics</h4>
                <p className="text-sm text-slate-400">Track progress</p>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">AI Assistant</h4>
                  <p className="text-xs text-slate-400">Always here to help</p>
                </div>
              </div>
              <button className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-sm hover:from-cyan-400 hover:to-teal-400 transition-all">
                Ask a Question
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                Recent Activity
              </h4>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex gap-3 pb-3 border-b border-white/5 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-slate-400">{activity.module}</p>
                      {activity.score && (
                        <p className="text-xs text-emerald-400 font-medium">Score: {activity.score}%</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>



            {/* Upcoming Deadlines */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                Upcoming
              </h4>
              <div className="space-y-3">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.map((deadline) => {
                    const date = new Date(deadline.dueDate);
                    const month = date.toLocaleDateString('en-US', { month: 'short' });
                    const day = date.getDate();
                    return (
                      <div key={`${deadline.id}-${deadline.dueDate}`} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex flex-col items-center justify-center">
                          <span className="text-xs text-slate-400">{month}</span>
                          <span className="font-bold">{day}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{deadline.title}</p>
                          <p className="text-xs text-slate-400">Due in {deadline.daysUntil} days</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-400">No upcoming deadlines</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
