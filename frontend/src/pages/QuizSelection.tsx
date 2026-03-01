import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, Zap, Target, ChevronRight, ChevronLeft, Trophy, TrendingUp, Calendar, Filter, Search, Play, BarChart3, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

interface Module {
  moduleId: number;
  name: string;
  description?: string;
  difficulty?: string;
  estimatedTime?: number;
  quizCount?: number;
  totalQuestions?: number;
  avgDifficulty?: number;
}

interface Quiz {
  quizId: number;
  title: string;
  description: string;
  totalQuestions: number;
  timeLimit: number;
  passingScore: number;
}

interface QuizAttempt {
  attemptId?: number;
  quizId?: number;
  date: string;
  type: string;
  module: string;
  score: number;
  time: string;
  status: string;
}

interface QuizStats {
  quizzesTaken: number;
  averageScore: number;
  passRate: number;
  totalTime: number;
}

// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

export default function QuizSelection() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedModules, setSelectedModules] = useState<number[]>([]);
  const [timeLimit, setTimeLimit] = useState('30');
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [stats, setStats] = useState<QuizStats>({
    quizzesTaken: 0,
    averageScore: 0,
    passRate: 0,
    totalTime: 0
  });
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([]);
  const [startingQuiz, setStartingQuiz] = useState(false);
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>([]);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [attemptsPage, setAttemptsPage] = useState(1);
  const ATTEMPTS_PER_PAGE = 5;

  const totalAttemptsPages = Math.max(1, Math.ceil(previousAttempts.length / ATTEMPTS_PER_PAGE));
  const paginatedAttempts = previousAttempts.slice(
    (attemptsPage - 1) * ATTEMPTS_PER_PAGE,
    attemptsPage * ATTEMPTS_PER_PAGE
  );

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch modules
        const modulesResponse = await fetch(`${API_BASE_URL}/modules`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!modulesResponse.ok) {
          throw new Error('Failed to fetch modules');
        }

        const modulesData = await modulesResponse.json();
        setModules(modulesData.data || []);

        // Set first module as selected if available
        if (modulesData.data && modulesData.data.length > 0) {
          setSelectedModule(modulesData.data[0]);
        }

        // Fetch stats
        const statsResponse = await fetch(`${API_BASE_URL}/quiz/stats`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.data || {
            quizzesTaken: 0,
            averageScore: 0,
            passRate: 0,
            totalTime: 0
          });
        }

        // Fetch attempts
        const attemptsResponse = await fetch(`${API_BASE_URL}/quiz/attempts`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (attemptsResponse.ok) {
          const attemptsData = await attemptsResponse.json();
          setPreviousAttempts(attemptsData.data || []);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error fetching quiz data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch custom quizzes when module changes
  useEffect(() => {
    const fetchCustomQuizzes = async () => {
      if (!selectedModule) return;
      try {
        setLoadingCustom(true);
        const response = await fetch(`${API_BASE_URL}/quiz/module/${selectedModule.moduleId}/custom`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setCustomQuizzes(data.data || []);
          setSelectedQuizId(null); // Reset selection
        }
      } catch (err) {
        console.error('Error fetching custom quizzes:', err);
      } finally {
        setLoadingCustom(false);
      }
    };

    fetchCustomQuizzes();
  }, [selectedModule]);

  const handleStartModuleQuiz = async () => {
    if (!selectedModule) return;
    setStartingQuiz(true);
    try {
      // If a custom quiz is selected, we might need a different endpoint or pass ID
      const endpoint = selectedQuizId
        ? `${API_BASE_URL}/quiz/module/${selectedModule.moduleId}/start?quizId=${selectedQuizId}`
        : `${API_BASE_URL}/quiz/module/${selectedModule.moduleId}/start`;

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start quiz');
      }

      const data = await response.json();
      if (data.success) {
        navigate(`/quizattempt/${data.data.attemptId}`);
      } else {
        throw new Error(data.message || 'Failed to start quiz');
      }
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to start quiz');
    } finally {
      setStartingQuiz(false);
    }
  };


  const handleStartTimedExam = async () => {
    if (selectedModules.length === 0) return;
    setStartingQuiz(true);
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/timed-exam/start`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeLimit: parseInt(timeLimit),
          questionCount: 20
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start timed exam');
      }

      const data = await response.json();
      if (data.success) {
        navigate(`/quizattempt/${data.data.attemptId}`);
      } else {
        throw new Error(data.message || 'Failed to start timed exam');
      }
    } catch (err) {
      console.error('Error starting timed exam:', err);
      setError(err instanceof Error ? err.message : 'Failed to start timed exam');
    } finally {
      setStartingQuiz(false);
    }
  };

  const handleStartAdaptiveTest = async () => {
    setStartingQuiz(true);
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/adaptive/start`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetDifficulty: 'intermediate',
          questionCount: 18
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start adaptive test');
      }

      const data = await response.json();
      if (data.success) {
        navigate(`/quizattempt/${data.data.attemptId}`);
      } else {
        throw new Error(data.message || 'Failed to start adaptive test');
      }
    } catch (err) {
      console.error('Error starting adaptive test:', err);
      setError(err instanceof Error ? err.message : 'Failed to start adaptive test');
    } finally {
      setStartingQuiz(false);
    }
  };

  const toggleModuleSelection = (moduleId: number) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const statsDisplay = [
    { label: 'Quizzes Taken', value: stats.quizzesTaken.toString(), icon: Trophy, color: 'from-yellow-500 to-orange-500' },
    { label: 'Average Score', value: `${stats.averageScore}%`, icon: Target, color: 'from-cyan-500 to-teal-500' },
    { label: 'Pass Rate', value: `${stats.passRate}%`, icon: TrendingUp, color: 'from-emerald-500 to-green-500' },
    { label: 'Total Time', value: `${stats.totalTime}h`, icon: Clock, color: 'from-purple-500 to-indigo-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageLayout
        title="Quiz"
        subtitle="Choose your assessment type"
        breadcrumbLabel="Quiz"
        activeNav="quiz"
        userType="student"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsDisplay.map((stat, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2.5 rounded-lg bg-slate-700/80">
                  <stat.icon className="w-5 h-5 text-slate-300" />
                </div>
              </div>
              <div className="text-xl font-semibold text-slate-100">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div
            onClick={handleStartModuleQuiz}
            className="bg-slate-800/50 border border-white/10 rounded-lg p-6 hover:border-slate-600 transition-colors cursor-pointer group"
          >
            <div className="mb-4">
              <div className="w-12 h-12 rounded-lg bg-slate-700/80 flex items-center justify-center mb-3">
                <Brain className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-1">Module quiz</h3>
              <p className="text-slate-500 text-sm">Test your knowledge on a specific anatomy module</p>
            </div>
            <div className="space-y-3 mb-4 text-sm text-slate-400">
              <div className="flex justify-between"><span>Question type</span><span className="text-slate-200">MCQ & Labeling</span></div>
              <div className="flex justify-between"><span>Duration</span><span className="text-slate-200">15-20 mins</span></div>
              <div className="flex justify-between"><span>Questions</span><span className="text-slate-200">10-15</span></div>
            </div>
            <div className="mb-4" onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-medium mb-2 text-slate-400">Select module</label>
              <select
                value={selectedModule?.moduleId || ''}
                onChange={(e) => {
                  const module = modules.find(m => m.moduleId === parseInt(e.target.value));
                  setSelectedModule(module || null);
                }}
                className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-md text-slate-200 focus:outline-none focus:border-slate-600 text-sm"
                disabled={loading}
              >
                {modules.length === 0 ? (
                  <option>No modules available</option>
                ) : (
                  modules.map(module => (
                    <option key={module.moduleId} value={module.moduleId.toString()}>
                      {module.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="mb-4" onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-medium mb-2 text-slate-400">Select quiz</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                <button
                  onClick={() => setSelectedQuizId(null)}
                  className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${selectedQuizId === null ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-slate-800/60 border-white/10 text-slate-300 hover:border-slate-600'}`}
                >
                  <div className="text-sm font-medium">Random Practice</div>
                  <div className="text-xs text-slate-500">10-15 random questions from bank</div>
                </button>

                {customQuizzes.map(quiz => (
                  <button
                    key={quiz.quizId}
                    onClick={() => setSelectedQuizId(quiz.quizId)}
                    className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${selectedQuizId === quiz.quizId ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/60 border-white/10 text-slate-300 hover:border-slate-600'}`}
                  >
                    <div className="text-sm font-medium">{quiz.title}</div>
                    <div className="text-xs text-slate-500">{quiz.totalQuestions} questions • {quiz.timeLimit} mins</div>
                  </button>
                ))}

                {loadingCustom && <div className="text-center py-2"><Loader2 className="w-4 h-4 animate-spin mx-auto text-slate-500" /></div>}
                {!loadingCustom && customQuizzes.length === 0 && <div className="text-xs text-slate-600 text-center py-2 italic whitespace-normal">No custom quizzes found for this module</div>}
              </div>
            </div>
            <button
              disabled={startingQuiz}
              className={`w-full py-2.5 px-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${previousAttempts.some(a => a.status === 'in_progress' && (
                selectedQuizId
                  ? a.quizId === selectedQuizId
                  : (a.type === 'Practice' && (a.module === selectedModule?.name || a.module === `Practice: ${selectedModule?.name}`))
              ))
                ? 'bg-amber-600 hover:bg-amber-500'
                : 'bg-slate-600 hover:bg-slate-500'
                }`}
            >
              {startingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {previousAttempts.some(a => a.status === 'in_progress' && (
                selectedQuizId
                  ? a.quizId === selectedQuizId
                  : (a.type === 'Practice' && (a.module === selectedModule?.name || a.module === `Practice: ${selectedModule?.name}`))
              ))
                ? (selectedQuizId ? 'Resume assessment' : 'Resume practice')
                : (selectedQuizId ? 'Start assessment' : 'Start practice')
              }
            </button>
          </div>

          <div
            onClick={handleStartTimedExam}
            className="bg-slate-800/50 border border-white/10 rounded-lg p-6 hover:border-slate-600 transition-colors cursor-pointer group"
          >
            <div className="mb-4">
              <div className="w-12 h-12 rounded-lg bg-slate-700/80 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-1">Timed examination</h3>
              <p className="text-slate-500 text-sm">Comprehensive test with a strict time limit</p>
            </div>

            <div className="space-y-3 mb-4 text-sm text-slate-400">
              <div className="flex justify-between"><span>Question type</span><span className="text-slate-200">All types</span></div>
              <div className="flex justify-between"><span>Duration</span><span className="text-slate-200">Custom</span></div>
              <div className="flex justify-between"><span>Questions</span><span className="text-slate-200">20-30</span></div>
            </div>
            <div className="mb-4" onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-medium mb-2 text-slate-400">Select modules</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {modules.map(module => (
                  <label key={module.moduleId} className="flex items-center gap-2 p-2 bg-slate-800/40 rounded-md cursor-pointer hover:bg-slate-800/60 transition-colors">
                    <input type="checkbox" checked={selectedModules.includes(module.moduleId)} onChange={() => toggleModuleSelection(module.moduleId)} className="w-4 h-4 accent-slate-500" />
                    <span className="text-sm text-slate-200">{module.name.split(' ')[0]}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-4" onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-medium mb-2 text-slate-400">Time limit (minutes)</label>
              <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-md text-slate-200 focus:outline-none focus:border-slate-600 text-sm" min="15" max="120" />
            </div>
            <button disabled={startingQuiz} className="w-full py-2.5 px-3 bg-slate-600 hover:bg-slate-500 rounded-md font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {startingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Start exam
            </button>
          </div>

          <div onClick={handleStartAdaptiveTest} className="bg-slate-800/50 border border-white/10 rounded-lg p-6 hover:border-slate-600 transition-colors cursor-pointer group">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-lg bg-slate-700/80 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-1">Adaptive test</h3>
              <p className="text-slate-500 text-sm">AI-adjusted difficulty based on your performance</p>
            </div>
            <div className="space-y-3 mb-4 text-sm text-slate-400">
              <div className="flex justify-between"><span>Question type</span><span className="text-slate-200">Dynamic</span></div>
              <div className="flex justify-between"><span>Duration</span><span className="text-slate-200">20-25 mins</span></div>
              <div className="flex justify-between"><span>Questions</span><span className="text-slate-200">15-20</span></div>
            </div>
            <div className="mb-4 p-3 bg-slate-800/60 border border-white/5 rounded-md">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-xs text-slate-300 mb-0.5">AI recommendation</h4>
                  <p className="text-xs text-slate-500">Based on your performance, we recommend focusing on Cardiovascular and Respiratory systems.</p>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Estimated duration</span><span>~22 mins</span></div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <button disabled={startingQuiz} className="w-full py-2.5 px-3 bg-slate-600 hover:bg-slate-500 rounded-md font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {startingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Begin test
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-400" />
              Previous attempts
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-md transition-colors ${showFilters ? 'bg-slate-600 text-white' : 'bg-slate-800/60 text-slate-500 hover:text-slate-300'}`}>
                <Filter className="w-4 h-4" />
              </button>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Search attempts..." className="pl-9 pr-3 py-2 bg-slate-800/60 border border-white/10 rounded-md focus:outline-none focus:border-slate-600 text-sm w-48 text-slate-200 placeholder-slate-500" />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mb-4 p-4 bg-slate-800/40 rounded-lg border border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-2 text-slate-400">Difficulty</label>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-sm"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-2 text-slate-400">Status</label>
                  <select className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-sm">
                    <option>All Status</option>
                    <option>Passed</option>
                    <option>Failed</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-2 text-slate-400">Date Range</label>
                  <select className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-sm">
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Attempts Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Module</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Score</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Time</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Status</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAttempts.map((attempt, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{attempt.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium">{attempt.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm">{attempt.module}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-bold ${attempt.score >= 80 ? 'text-emerald-400' :
                        attempt.score >= 70 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                        {attempt.score}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-400">{attempt.time}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${attempt.status === 'passed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        {attempt.status === 'passed' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {attempt.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => attempt.attemptId && navigate(`/quizresult/${attempt.attemptId}`)}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!attempt.attemptId || (attempt.status !== 'passed' && attempt.status !== 'failed')}
                      >
                        Review <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-slate-400">
              Showing {previousAttempts.length === 0 ? 0 : (attemptsPage - 1) * ATTEMPTS_PER_PAGE + 1}-
              {Math.min(attemptsPage * ATTEMPTS_PER_PAGE, previousAttempts.length)} of {previousAttempts.length} attempts
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAttemptsPage(p => Math.max(1, p - 1))}
                disabled={attemptsPage <= 1}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalAttemptsPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setAttemptsPage(p)}
                  className={`px-3 py-1 rounded-md font-medium text-sm transition-colors ${attemptsPage === p ? 'bg-slate-600 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setAttemptsPage(p => Math.min(totalAttemptsPages, p + 1))}
                disabled={attemptsPage >= totalAttemptsPages}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
      <style>{`
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 3px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.5); border-radius: 3px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.7); }
    `}</style>
    </>
  );
}