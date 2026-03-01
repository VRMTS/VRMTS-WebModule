import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search, Grid3x3, List, Clock, Trophy, Lock, Play,
  CheckCircle2, BookOpen, AlertTriangle
} from 'lucide-react';
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

const API_BASE_URL = 'http://localhost:8080/api';

// Same icon for all modules; only the icon differs by status (in progress / completed / not started / locked)
const getStatusIcon = (status: Module['status']) => {
  switch (status) {
    case 'completed': return CheckCircle2;
    case 'in_progress': return Play;
    case 'locked': return Lock;
    case 'not_started':
    default: return BookOpen;
  }
};

export default function ModulesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statuses = [
    { id: 'all', name: 'All', count: modules.length },
    { id: 'completed', name: 'Completed', count: modules.filter(m => m.status === 'completed').length },
    { id: 'in_progress', name: 'In Progress', count: modules.filter(m => m.status === 'in_progress').length },
    { id: 'not_started', name: 'Not Started', count: modules.filter(m => m.status === 'not_started').length }
  ];

  useEffect(() => {
    fetchModules();
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
          duration: `${Math.ceil((module.parts || 10) * 0.3)}-${Math.ceil((module.parts || 10) * 0.4)} h`,
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

  const handleStartModule = async (moduleId: number, moduleName?: string) => {
    try {
      await axios.post(`${API_BASE_URL}/modules/${moduleId}/start`, {}, {
        withCredentials: true
      });
      // Check if this is LAB 1 module
      if (moduleId === 1 || (moduleName && (moduleName.toUpperCase().includes('LAB 1') || moduleName.toUpperCase().includes('LAB1')))) {
        navigate('/lab1explore');
      }
      // Check if this is LAB 2 module
      else if (moduleName && (moduleName.toUpperCase().includes('LAB 2') || moduleName.toUpperCase().includes('LAB2'))) {
        navigate('/lab2explore');
      } else {
        navigate(`/module/${moduleId}`);
      }
    } catch (error) {
      console.error('Error starting module:', error);
    }
  };

  const handleTakeQuiz = async (moduleId: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/quiz/module/${moduleId}/start`, {}, {
        withCredentials: true
      });

      if (response.data.success) {
        const { attemptId } = response.data.data;
        navigate(`/quizattempt/${attemptId}`);
      }
    } catch (error: any) {
      console.error('Error starting quiz:', error);
      if (error.response?.status === 404) {
        alert('No quiz available for this module yet.');
      } else {
        alert('Failed to start quiz. Please try again.');
      }
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesStatus = filterStatus === 'all' || module.status === filterStatus;
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
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
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-slate-200">{error}</h3>
          <button
            onClick={fetchModules}
            className="mt-4 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Learning modules"
      subtitle="Human anatomy — interactive 3D"
      breadcrumbLabel="Modules"
      activeNav="modules"
      userType="student"
    >
        <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search modules"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/60 border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
              />
            </div>
            <div className="flex items-center gap-1 rounded-md border border-white/10 overflow-hidden">
              {statuses.map(status => (
                <button
                  key={status.id}
                  onClick={() => setFilterStatus(status.id)}
                  className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    filterStatus === status.id
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status.name} ({status.count})
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800/60 border border-white/10 rounded-md px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-slate-600"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="name">Sort: Name</option>
              <option value="progress">Sort: Progress</option>
              <option value="difficulty">Sort: Difficulty</option>
            </select>
            <div className="flex border border-white/10 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-slate-600 text-white' : 'bg-slate-800/60 text-slate-500 hover:text-slate-300'}`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-slate-600 text-white' : 'bg-slate-800/60 text-slate-500 hover:text-slate-300'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
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
          <div className="text-center py-16 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-500" />
            <h3 className="text-lg font-medium text-slate-300 mb-1">No modules found</h3>
            <p className="text-sm">Adjust search or filters</p>
          </div>
        )}
    </PageLayout>
  );
}

function ModuleCard({ module, onStart }: { module: Module; onStart: (id: number, name?: string) => void }) {
  const IconComponent = getStatusIcon(module.status);
  const getDifficultyColor = (d: string) =>
    d === 'beginner' ? 'text-emerald-500' : d === 'intermediate' ? 'text-amber-500' : d === 'advanced' ? 'text-rose-500' : 'text-slate-400';

  const statusLabel = module.status === 'in_progress' ? 'In progress' : module.status === 'completed' ? 'Completed' : module.status === 'locked' ? 'Locked' : 'Not started';
  const statusClass = module.status === 'in_progress' ? 'bg-cyan-500/20 text-cyan-400' : module.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : module.status === 'locked' ? 'bg-slate-600/50 text-slate-400' : 'bg-slate-600/50 text-slate-400';

  return (
    <div
      className={`relative border rounded-lg p-5 transition-colors ${
        module.status === 'locked'
          ? 'bg-slate-800/40 border-slate-700/50 opacity-80'
          : 'bg-slate-800/50 border-white/10 hover:border-slate-600 cursor-pointer'
      }`}
      onClick={() => module.status !== 'locked' && onStart(module.moduleId, module.name)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-700/80 flex items-center justify-center text-slate-400">
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-slate-100 truncate">{module.name}</h3>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${statusClass}`}>{statusLabel}</span>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{module.description}</p>

      <div className="flex items-center gap-4 mb-3 text-xs text-slate-400">
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{module.duration ?? '—'}</span>
        <span className={getDifficultyColor(module.difficulty)}>{module.difficulty}</span>
        <span>{module.completedParts}/{module.parts} parts</span>
      </div>

      {module.status !== 'locked' && (
        <>
          <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{module.progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  module.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
          {module.quizScore !== null && (
            <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-400">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Best: {module.quizScore}%</span>
            </div>
          )}
          <button
            className="w-full py-2 px-3 bg-slate-600 hover:bg-slate-500 rounded-md text-sm font-medium text-slate-100 transition-colors flex items-center justify-center gap-2"
            onClick={(e) => { e.stopPropagation(); module.status !== 'locked' && onStart(module.moduleId, module.name); }}
          >
            {module.status === 'completed' ? 'Review' : module.status === 'in_progress' ? 'Continue' : 'Start'}
            <Play className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}

function ModuleListItem({ module, onStart }: { module: Module; onStart: (id: number, name?: string) => void }) {
  const IconComponent = getStatusIcon(module.status);
  const getDifficultyColor = (d: string) =>
    d === 'beginner' ? 'text-emerald-500' : d === 'intermediate' ? 'text-amber-500' : d === 'advanced' ? 'text-rose-500' : 'text-slate-400';

  const statusLabel = module.status === 'in_progress' ? 'In progress' : module.status === 'completed' ? 'Completed' : module.status === 'locked' ? 'Locked' : 'Not started';
  const statusClass = module.status === 'in_progress' ? 'bg-cyan-500/20 text-cyan-400' : module.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/50 text-slate-400';

  return (
    <div
      className={`flex items-center gap-6 border rounded-lg p-4 transition-colors ${
        module.status === 'locked'
          ? 'bg-slate-800/40 border-slate-700/50 opacity-80'
          : 'bg-slate-800/50 border-white/10 hover:border-slate-600 cursor-pointer'
      }`}
      onClick={() => module.status !== 'locked' && onStart(module.moduleId, module.name)}
    >
      <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-slate-700/80 flex items-center justify-center text-slate-400">
        <IconComponent className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-medium text-slate-100">{module.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded ${statusClass}`}>{statusLabel}</span>
        </div>
        <p className="text-slate-500 text-sm mt-0.5 line-clamp-1">{module.description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{module.duration ?? '—'}</span>
          <span className={getDifficultyColor(module.difficulty)}>{module.difficulty}</span>
          <span>{module.completedParts}/{module.parts} parts</span>
          {module.quizScore !== null && (
            <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-amber-500" />{module.quizScore}%</span>
          )}
        </div>
      </div>

      {module.status !== 'locked' && (
        <>
          <div className="hidden sm:block w-32 flex-shrink-0">
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${module.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
          <span className="hidden sm:block text-sm text-slate-400 w-10">{module.progress}%</span>
          <button
            className="flex-shrink-0 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md text-sm font-medium text-slate-100 transition-colors flex items-center gap-2"
            onClick={(e) => { e.stopPropagation(); module.status !== 'locked' && onStart(module.moduleId, module.name); }}
          >
            {module.status === 'completed' ? 'Review' : module.status === 'in_progress' ? 'Continue' : 'Start'}
            <Play className="w-3.5 h-3.5" />
          </button>
        </>
      )}

      {module.status === 'locked' && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Lock className="w-4 h-4" />
          <span>Complete prerequisites</span>
        </div>
      )}
    </div>
  );
}