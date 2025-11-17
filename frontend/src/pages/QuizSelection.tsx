import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, Zap, Target, ChevronRight, ChevronLeft, Trophy, TrendingUp, Calendar, Filter, Search, Play, BarChart3, CheckCircle2, XCircle, Award, Loader2 } from 'lucide-react';

const USE_DUMMY_DATA = true; // Always use dummy data, no backend

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

interface QuizAttempt {
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

// Dummy data for development
const dummyModules: Module[] = [
  { moduleId: 1, name: "Cardiovascular System", description: "Heart and blood vessels", difficulty: "intermediate", estimatedTime: 20, quizCount: 5, totalQuestions: 50, avgDifficulty: 3.2 },
  { moduleId: 2, name: "Respiratory System", description: "Lungs and breathing", difficulty: "beginner", estimatedTime: 15, quizCount: 3, totalQuestions: 30, avgDifficulty: 2.8 },
  { moduleId: 3, name: "Nervous System", description: "Brain and nerves", difficulty: "advanced", estimatedTime: 25, quizCount: 4, totalQuestions: 40, avgDifficulty: 4.1 },
  { moduleId: 4, name: "Digestive System", description: "Stomach and intestines", difficulty: "intermediate", estimatedTime: 18, quizCount: 3, totalQuestions: 35, avgDifficulty: 3.5 },
  { moduleId: 5, name: "Muscular System", description: "Muscles and movement", difficulty: "beginner", estimatedTime: 12, quizCount: 2, totalQuestions: 25, avgDifficulty: 2.5 }
];

const dummyStats: QuizStats = {
  quizzesTaken: 12,
  averageScore: 78,
  passRate: 85,
  totalTime: 8
};

const dummyAttempts: QuizAttempt[] = [
  { date: "2024-01-15", type: "Module Quiz", module: "Cardiovascular System", score: 85, time: "18m", status: "passed" },
  { date: "2024-01-14", type: "Timed Exam", module: "Multiple Modules", score: 72, time: "25m", status: "passed" },
  { date: "2024-01-13", type: "Adaptive Test", module: "Dynamic", score: 68, time: "22m", status: "failed" },
  { date: "2024-01-12", type: "Module Quiz", module: "Respiratory System", score: 92, time: "15m", status: "passed" },
  { date: "2024-01-11", type: "Timed Exam", module: "Multiple Modules", score: 76, time: "30m", status: "passed" }
];

export default function QuizSelection() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedModules, setSelectedModules] = useState<number[]>([]);
  const [timeLimit, setTimeLimit] = useState('30');
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [loading, setLoading] = useState(!USE_DUMMY_DATA);
  const [error, setError] = useState('');
  const [modules, setModules] = useState<Module[]>(USE_DUMMY_DATA ? dummyModules : []);
  const [stats, setStats] = useState<QuizStats>(USE_DUMMY_DATA ? dummyStats : {
    quizzesTaken: 0,
    averageScore: 0,
    passRate: 0,
    totalTime: 0
  });
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>(USE_DUMMY_DATA ? dummyAttempts : []);
  const [startingQuiz, setStartingQuiz] = useState(false);

  // Initialize with dummy data
  useEffect(() => {
    setSelectedModule(dummyModules[0]);
    setLoading(false);
  }, []);

  const handleStartModuleQuiz = () => {
    if (!selectedModule) return;
    navigate(`/quizattempt/${Date.now()}`);
  };

  // Start a module quiz directly by moduleId (used when selecting from dropdown)
  const startQuizForModule = (moduleId: number) => {
    navigate(`/quizattempt/${Date.now()}`);
  };

  const handleStartTimedExam = () => {
    if (selectedModules.length === 0) return;
    navigate(`/quizattempt/${Date.now()}`);
  };

  const handleStartAdaptiveTest = () => {
    navigate(`/quizattempt/${Date.now()}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/studentdashboard')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">
              <span className="text-white">VRMTS</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-cyan-400" />
            Test Your Knowledge
          </h2>
          <p className="text-slate-400">Choose your assessment type and prove your mastery</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsDisplay.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quiz Type Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Module Quiz */}
          <div
            onClick={handleStartModuleQuiz}
            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-cyan-400/50 transition-all hover:scale-105 cursor-pointer group"
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Module Quiz</h3>
              <p className="text-slate-400 text-sm">Test your knowledge on a specific anatomy module</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Question Type:</span>
                <span className="font-medium">MCQ & Labeling</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Duration:</span>
                <span className="font-medium">15-20 mins</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Questions:</span>
                <span className="font-medium">10-15</span>
              </div>
            </div>

            {/* Module Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-slate-300">
                Select Module
              </label>
              <select
                value={selectedModule?.moduleId || ''}
                onChange={async (e) => {
                  const module = modules.find(m => m.moduleId === parseInt(e.target.value));
                  setSelectedModule(module || null);
                  if (module) {
                    // Immediately start the quiz for the selected module
                    await startQuizForModule(module.moduleId);
                  }
                }}
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <option>Loading modules...</option>
                ) : modules.length === 0 ? (
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

            <button
              onClick={handleStartModuleQuiz}
              disabled={startingQuiz}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl font-semibold hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {startingQuiz ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              Start Quiz
            </button>
          </div>

          {/* Timed Exam */}
          <div
            onClick={handleStartTimedExam}
            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-400/50 transition-all hover:scale-105 cursor-pointer group"
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Timed Examination</h3>
              <p className="text-slate-400 text-sm">Comprehensive test with a strict time limit</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Question Type:</span>
                <span className="font-medium">All Types</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Duration:</span>
                <span className="font-medium">Custom</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Questions:</span>
                <span className="font-medium">20-30</span>
              </div>
            </div>

            {/* Module Multi-Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-3 text-slate-300">
                Select Modules
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {modules.map(module => (
                  <label key={module.moduleId} className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(module.moduleId)}
                      onChange={() => toggleModuleSelection(module.moduleId)}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-sm">{module.name.split(' ')[0]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Limit */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-slate-300">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                min="15"
                max="120"
              />
            </div>

            <button
              onClick={handleStartTimedExam}
              disabled={startingQuiz}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl font-semibold hover:from-purple-400 hover:to-indigo-400 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {startingQuiz ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              Start Exam
            </button>
          </div>

          {/* Adaptive Test */}
          <div
            onClick={handleStartAdaptiveTest}
            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-emerald-400/50 transition-all hover:scale-105 cursor-pointer group"
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Adaptive Test</h3>
              <p className="text-slate-400 text-sm">AI-adjusted difficulty based on your performance</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Question Type:</span>
                <span className="font-medium">Dynamic</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Duration:</span>
                <span className="font-medium">20-25 mins</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Questions:</span>
                <span className="font-medium">15-20</span>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1 text-emerald-400">AI Recommendation</h4>
                  <p className="text-xs text-slate-400">Based on your performance, we recommend focusing on the Cardiovascular and Respiratory systems.</p>
                </div>
              </div>
            </div>

            {/* Estimated Duration */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-300">Estimated Duration</span>
                <span className="font-medium">~22 mins</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <button
              onClick={handleStartAdaptiveTest}
              disabled={startingQuiz}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl font-semibold hover:from-emerald-400 hover:to-green-400 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {startingQuiz ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              Begin Test
            </button>
          </div>
        </div>

        {/* Previous Attempts Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-cyan-400" />
              Previous Attempts
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/5'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search attempts..."
                  className="pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-sm w-64"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-white/10">
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
                {previousAttempts.map((attempt, idx) => (
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
                      <span className={`text-sm font-bold ${
                        attempt.score >= 80 ? 'text-emerald-400' :
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
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        attempt.status === 'passed'
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
                      <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 ml-auto">
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
            <p className="text-sm text-slate-400">Showing 1-5 of 24 attempts</p>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg font-medium text-sm">1</button>
              <button className="px-3 py-1 hover:bg-white/5 rounded-lg font-medium text-sm">2</button>
              <button className="px-3 py-1 hover:bg-white/5 rounded-lg font-medium text-sm">3</button>
              <button className="px-3 py-1 hover:bg-white/5 rounded-lg font-medium text-sm">...</button>
              <button className="px-3 py-1 hover:bg-white/5 rounded-lg font-medium text-sm">5</button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
}