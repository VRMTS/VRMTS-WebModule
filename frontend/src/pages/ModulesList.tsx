import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search, Filter, Grid3x3, List, Clock, Trophy, Lock, Play,
  CheckCircle2, Circle, Home, ChevronRight, TrendingUp, Brain,
  Heart, Bone, Dumbbell, Wind, Aperture, Eye, Ear, Activity
} from 'lucide-react';

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
  total: number;
  completed: number;
  inProgress: number;
  avgProgress: number;
}

const API_BASE_URL = 'http://localhost:8080/api';

// Icon mapping based on module name
const getModuleIcon = (moduleName: string) => {
  const name = moduleName.toLowerCase();
  if (name.includes('cardio') || name.includes('heart')) return { emoji: '🫀', Component: Heart };
  if (name.includes('nervous') || name.includes('brain')) return { emoji: '🧠', Component: Brain };
  if (name.includes('skeletal') || name.includes('bone')) return { emoji: '🦴', Component: Bone };
  if (name.includes('muscular') || name.includes('muscle')) return { emoji: '💪', Component: Dumbbell };
  if (name.includes('respiratory') || name.includes('lung')) return { emoji: '🫁', Component: Wind };
  if (name.includes('digestive')) return { emoji: '🫃', Component: Aperture };
  if (name.includes('visual') || name.includes('eye')) return { emoji: '👁️', Component: Eye };
  if (name.includes('auditory') || name.includes('ear')) return { emoji: '👂', Component: Ear };
  if (name.includes('lymphatic')) return { emoji: '💧', Component: Activity };
  if (name.includes('endocrine')) return { emoji: '⚡', Component: Activity };
  if (name.includes('integumentary') || name.includes('skin')) return { emoji: '🖐️', Component: Activity };
  if (name.includes('urinary') || name.includes('kidney')) return { emoji: '🫘', Component: Activity };
  return { emoji: '📚', Component: Activity };
};

// Category mapping based on module name
const getModuleCategory = (moduleName: string) => {
  const name = moduleName.toLowerCase();
  if (name.includes('cardio') || name.includes('lymph')) return 'cardiovascular';
  if (name.includes('nervous') || name.includes('endocrine')) return 'nervous';
  if (name.includes('skeletal') || name.includes('bone')) return 'skeletal';
  if (name.includes('muscular') || name.includes('muscle')) return 'muscular';
  if (name.includes('respiratory') || name.includes('lung')) return 'respiratory';
  if (name.includes('visual') || name.includes('auditory') || name.includes('sensory')) return 'sensory';
  return 'other';
};

export default function ModulesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    avgProgress: 0
  });

  const categories = [
    { id: 'all', name: 'All Modules', count: modules.length },
    { id: 'cardiovascular', name: 'Cardiovascular', count: modules.filter(m => getModuleCategory(m.name) === 'cardiovascular').length },
    { id: 'nervous', name: 'Nervous System', count: modules.filter(m => getModuleCategory(m.name) === 'nervous').length },
    { id: 'skeletal', name: 'Skeletal', count: modules.filter(m => getModuleCategory(m.name) === 'skeletal').length },
    { id: 'muscular', name: 'Muscular', count: modules.filter(m => getModuleCategory(m.name) === 'muscular').length },
    { id: 'respiratory', name: 'Respiratory', count: modules.filter(m => getModuleCategory(m.name) === 'respiratory').length },
    { id: 'sensory', name: 'Sensory', count: modules.filter(m => getModuleCategory(m.name) === 'sensory').length }
  ];

  // Fetch modules from API
  useEffect(() => {
    fetchModules();
    fetchStats();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/modules`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const modulesData = response.data.data.map((module: any) => ({
          ...module,
          category: getModuleCategory(module.name),
          icon: getModuleIcon(module.name).emoji,
          duration: `${Math.ceil((module.parts || 10) * 0.3)}-${Math.ceil((module.parts || 10) * 0.4)} hours`,
          parts: module.parts || 10,
          completedParts: module.completedParts || 0
        }));
        setModules(modulesData);
      }
    } catch (error: any) {
      console.error('Error fetching modules:', error);
      setError('Failed to load modules. Please try again.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/modules/stats`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const data = response.data.data;
        setStats({
          total: data.total || 0,
          completed: data.completed || 0,
          inProgress: data.inProgress || 0,
          avgProgress: Math.round(data.avgProgress || 0)
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStartModule = async (moduleId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/modules/${moduleId}/start`, {}, {
        withCredentials: true
      });
      navigate(`/module/${moduleId}`);
    } catch (error) {
      console.error('Error starting module:', error);
    }
  };

  const navigateToDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/check`, { withCredentials: true });
      if (response.data.isAuthenticated) {
        const dashboardPath = response.data.user.userType === 'student' ? '/studentdashboard' : '/instructordashboard';
        navigate(dashboardPath);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/login');
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesCategory = filterCategory === 'all' || module.category === filterCategory;
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedModules = [...filteredModules].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'progress':
        return b.progress - a.progress;
      case 'difficulty':
        const difficultyOrder: Record<string, number> = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'recommended':
      default:
        // Sort by in-progress first, then not-started, then completed
        const statusOrder: Record<string, number> = { 'in_progress': 1, 'not_started': 2, 'completed': 3, 'locked': 4 };
        return statusOrder[a.status] - statusOrder[b.status];
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-xl text-slate-300">Loading modules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-semibold mb-2 text-red-400">{error}</h3>
          <button 
            onClick={fetchModules}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">
                <span className="text-white">VRMTS</span>
              </h1>
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <Home className="w-4 h-4 cursor-pointer hover:text-cyan-400 transition-colors" onClick={navigateToDashboard} />
                <ChevronRight className="w-4 h-4" />
                <span className="text-cyan-400">All Modules</span>
              </div>
            <nav className="hidden md:flex gap-6">
              <button className="text-slate-400 hover:text-white transition-colors" onClick={navigateToDashboard}>Dashboard</button>
              <button className="text-cyan-400 font-medium">Modules</button>
              <button className="text-slate-400 hover:text-white transition-colors" onClick={() => navigate('/quizselection')}>Quiz</button>
              <button className="text-slate-400 hover:text-white transition-colors">Analytics</button>
              <button className="text-slate-400 hover:text-white transition-colors">VR Lab</button>
            </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">{stats.avgProgress}% Average Progress</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-1">Learning Modules</h2>
            <p className="text-slate-400 text-sm">Explore human anatomy through interactive 3D experiences</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Modules</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500">
                <Grid3x3 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Completed</p>
                <p className="text-3xl font-bold text-emerald-400">{stats.completed}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">In Progress</p>
                <p className="text-3xl font-bold text-cyan-400">{stats.inProgress}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Circle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Average Progress</p>
                <p className="text-3xl font-bold text-purple-400">{stats.avgProgress}%</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterCategory === cat.id
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat.name}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    filterCategory === cat.id ? 'bg-white/20' : 'bg-slate-700'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort & View Mode */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-400/50"
              >
                <option value="recommended">Recommended</option>
                <option value="name">Name</option>
                <option value="progress">Progress</option>
                <option value="difficulty">Difficulty</option>
              </select>

              <div className="flex border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800/50'}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800/50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedModules.map(module => (
              <ModuleCard key={module.moduleId} module={module} onStart={handleStartModule} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedModules.map(module => (
              <ModuleListItem key={module.moduleId} module={module} onStart={handleStartModule} />
            ))}
          </div>
        )}

        {filteredModules.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No modules found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
}

function ModuleCard({ module, onStart }: { module: Module; onStart: (id: number) => void }) {
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'text-emerald-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className={`relative group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border rounded-xl p-6 transition-all hover:scale-102 hover:shadow-xl ${
      module.status === 'locked'
        ? 'border-slate-700/50 opacity-70'
        : 'border-white/10 hover:border-cyan-400/50 hover:shadow-cyan-500/10 cursor-pointer'
    }`}
    onClick={() => module.status !== 'locked' && onStart(module.moduleId)}
    >
      {module.status === 'in_progress' && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          In Progress
        </div>
      )}
      {module.status === 'completed' && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Completed
        </div>
      )}
      {module.status === 'locked' && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Locked
        </div>
      )}
      {module.status === 'not_started' && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Not Started
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{module.icon}</div>
          <div>
            <h3 className="font-semibold text-lg mb-1">{module.name}</h3>
          </div>
        </div>
      </div>

      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{module.description}</p>

      <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{module.duration || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={getDifficultyColor(module.difficulty)}>{module.difficulty}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span>{module.completedParts}/{module.parts} parts</span>
        </div>
      </div>

      {module.status !== 'locked' && (
        <>
          <div className="mb-4">
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

          {module.quizScore !== null && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300">Best Score: </span>
              <span className="font-semibold text-yellow-400">{module.quizScore}%</span>
            </div>
          )}

          <button className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-sm hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/50">
            {module.status === 'completed' ? (
              <>Review Module</>
            ) : module.status === 'in_progress' ? (
              <>Continue Learning <Play className="w-4 h-4" /></>
            ) : (
              <>Start Module <Play className="w-4 h-4" /></>
            )}
          </button>
        </>
      )}
    </div>
  );
}

function ModuleListItem({ module, onStart }: { module: Module; onStart: (id: number) => void }) {
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'text-emerald-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className={`relative bg-slate-900/50 backdrop-blur-sm border rounded-xl p-6 transition-all ${
      module.status === 'locked'
        ? 'border-slate-700/50 opacity-70'
        : 'border-white/10 hover:border-cyan-400/50 cursor-pointer'
    }`}
    onClick={() => module.status !== 'locked' && onStart(module.moduleId)}
    >
      <div className="flex items-center gap-6">
        <div className="text-5xl">{module.icon}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-xl mb-1">{module.name}</h3>
              <p className="text-slate-400 text-sm">{module.description}</p>
            </div>
            {module.status === 'in_progress' && (
              <span className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                In Progress
              </span>
            )}
            {module.status === 'completed' && (
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Completed
              </span>
            )}
            {module.status === 'locked' && (
              <span className="bg-gradient-to-r from-slate-500 to-slate-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Locked
              </span>
            )}
            {module.status === 'not_started' && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Not Started
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">{module.duration || 'N/A'}</span>
            </div>
            <div className={getDifficultyColor(module.difficulty)}>
              {module.difficulty}
            </div>
            <div className="text-slate-400">
              {module.completedParts}/{module.parts} parts
            </div>
            {module.quizScore !== null && (
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">{module.quizScore}%</span>
              </div>
            )}
          </div>

          {module.status !== 'locked' && (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      module.status === 'completed'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                        : 'bg-gradient-to-r from-cyan-500 to-teal-500'
                    }`}
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-slate-400 w-12">{module.progress}%</span>
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-sm hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-2">
                {module.status === 'completed' ? 'Review' : module.status === 'in_progress' ? 'Continue' : 'Start'}
                <Play className="w-4 h-4" />
              </button>
            </div>
          )}

          {module.status === 'locked' && (
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-400">
                Complete prerequisites first
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}