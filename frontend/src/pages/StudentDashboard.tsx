import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Trophy, Clock, TrendingUp, Zap, Target, MessageSquare, Settings, Bell, ChevronRight, Lock, Play, BarChart3, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

interface Module {
  moduleId: number;
  name: string;
  category?: string;
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

const getStatusIcon = (status: Module['status']) => {
  switch (status) {
    case 'completed': return CheckCircle2;
    case 'in_progress': return Play;
    case 'locked': return Lock;
    default: return BookOpen;
  }
};

interface Stats {
  modulesCompleted: number;
  totalModules: number;
  averageScore: number;
  studyStreak: number;
  totalHours: number;
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
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('Student');

  const achievements = [
    { name: 'First Steps', Icon: Target, unlocked: true },
    { name: 'Quiz Master', Icon: Trophy, unlocked: true },
    { name: 'Week Warrior', Icon: Zap, unlocked: true },
    { name: 'Perfect Score', Icon: Target, unlocked: false },
    { name: 'Marathon', Icon: Zap, unlocked: false }
  ];

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user info first to check user type
      const userResponse = await axios.get(`${API_BASE_URL}/auth/check`, { withCredentials: true });

      // Redirect teachers to instructor dashboard
      if (userResponse.data.isAuthenticated && (userResponse.data.user.userType === 'teacher' || userResponse.data.user.userType === 'instructor')) {
        navigate('/instructordashboard');
        return;
      }

      // Fetch dashboard data in parallel
      const [statsResponse, modulesResponse, deadlinesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/dashboard/stats`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/dashboard/recent-modules`, { withCredentials: true }),
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading...</p>
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

  const headerRight = (
    <>
      <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
        <Bell className="w-5 h-5" />
      </button>
      <button onClick={() => navigate('/settings')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
        <Settings className="w-5 h-5" />
      </button>
      <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium text-slate-200">
        {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
      </div>
    </>
  );

  return (
    <PageLayout
      title="Dashboard"
      subtitle={`Welcome back, ${userName}`}
      breadcrumbLabel="Dashboard"
      activeNav="dashboard"
      userType="student"
      headerRight={headerRight}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {displayStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-slate-800/50 border border-white/10 rounded-lg p-5"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-slate-700/80">
                <stat.icon className="w-5 h-5 text-slate-300" />
              </div>
              {stat.trend && (
                <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {stat.trend}
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
              <h3 className="text-lg font-semibold text-slate-100">Your learning modules</h3>
              <button className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors" onClick={() => navigate('/modules')}>
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.slice(0, 4).map((module) => {
                const StatusIcon = getStatusIcon(module.status);
                return (
                  <div
                    key={module.moduleId}
                    onClick={() => {
                      if (module.status !== 'locked') {
                        if (module.name && (module.name.toUpperCase().includes('LAB 2') || module.name.toUpperCase().includes('LAB2'))) {
                          navigate('/lab2explore');
                        } else {
                          navigate(`/module/${module.moduleId}`);
                        }
                      }
                    }}
                    className={`border rounded-lg p-4 transition-colors ${module.status === 'locked'
                        ? 'bg-slate-800/40 border-slate-700/50 opacity-80'
                        : 'bg-slate-800/50 border-white/10 hover:border-slate-600 cursor-pointer'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-700/80 flex items-center justify-center text-slate-400">
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-100 truncate">{module.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{module.duration}</span>
                          {module.quizScore != null && (
                            <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-500" />{module.quizScore}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {module.status !== 'locked' && (
                      <>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${module.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                        </div>
                        <button
                          className="mt-2 w-full py-2 px-3 bg-slate-600 hover:bg-slate-500 rounded-md text-sm font-medium text-slate-100 transition-colors flex items-center justify-center gap-2"
                          onClick={(e) => { e.stopPropagation(); navigate(`/module/${module.moduleId}`); }}
                        >
                          {module.status === 'completed' ? 'Review' : 'Continue'}
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => navigate('/quizselection')} className="bg-slate-800/50 border border-white/10 rounded-lg p-5 text-left hover:border-slate-600 transition-colors">
              <Trophy className="w-6 h-6 text-slate-400 mb-2" />
              <h4 className="font-medium text-slate-100 mb-0.5">Take quiz</h4>
              <p className="text-sm text-slate-500">Test your knowledge</p>
            </button>
            <button onClick={() => navigate('/modules')} className="bg-slate-800/50 border border-white/10 rounded-lg p-5 text-left hover:border-slate-600 transition-colors">
              <BookOpen className="w-6 h-6 text-slate-400 mb-2" />
              <h4 className="font-medium text-slate-100 mb-0.5">Browse modules</h4>
              <p className="text-sm text-slate-500">Continue learning</p>
            </button>
            <button onClick={() => navigate('/studentanalytics')} className="bg-slate-800/50 border border-white/10 rounded-lg p-5 text-left hover:border-slate-600 transition-colors">
              <BarChart3 className="w-6 h-6 text-slate-400 mb-2" />
              <h4 className="font-medium text-slate-100 mb-0.5">Analytics</h4>
              <p className="text-sm text-slate-500">Track progress</p>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-slate-700/80 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-100">AI Assistant</h4>
                <p className="text-xs text-slate-500">Always here to help</p>
              </div>
            </div>
            <button className="w-full py-2.5 px-3 bg-slate-600 hover:bg-slate-500 rounded-md text-sm font-medium text-slate-100 transition-colors">
              Ask a question
            </button>
          </div>



          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <h4 className="font-medium text-slate-100 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
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
                      <div className="w-11 h-11 rounded-lg bg-slate-700/80 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-xs text-slate-500">{month}</span>
                        <span className="font-semibold text-slate-200">{day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200">{deadline.title}</p>
                        <p className="text-xs text-slate-500">Due in {deadline.daysUntil} days</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">No upcoming deadlines</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
