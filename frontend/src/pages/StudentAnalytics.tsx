import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Clock, Trophy, Target, Calendar, ChevronLeft, Download, Filter, Brain, Zap, BookOpen, Activity, Eye, CheckCircle2, XCircle, AlertCircle, TrendingDown, Award } from 'lucide-react';

interface Overview {
  totalStudyTime: string;
  modulesCompleted: number;
  totalModules: number;
  averageScore: number;
  quizzesTaken: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
}

interface ScoreProgress {
  month: string;
  score: number;
}

interface StudyTime {
  day: string;
  hours: number;
}

interface ModulePerformance {
  module: string;
  progress: number;
  avgScore: number;
  timeSpent: string;
  lastAttempt: string;
  status: string;
}

interface QuestionTypePerformance {
  type: string;
  correct: number;
  total: number;
  percentage: number;
}

interface RecentActivity {
  date: string;
  action: string;
  module: string;
  score?: number;
  time?: string;
  duration?: string;
}

interface Strength {
  topic: string;
  mastery: number;
  questions: number;
}

interface Weakness {
  topic: string;
  mastery: number;
  questions: number;
}

interface LearningPattern {
  mostActiveDay: string;
  mostActiveTime: string;
  avgSessionLength: string;
  preferredFormat: string;
}

interface Achievement {
  name: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

interface AnalyticsData {
  overview: Overview;
  scoreProgress: ScoreProgress[];
  studyTime: StudyTime[];
  modulePerformance: ModulePerformance[];
  questionTypePerformance: QuestionTypePerformance[];
  recentActivity: RecentActivity[];
  strengths: Strength[];
  weaknesses: Weakness[];
  learningPattern: LearningPattern;
  achievements: Achievement[];
}

export default function StudentAnalytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedModule, setSelectedModule] = useState('all');

  const analyticsData: AnalyticsData = {
    overview: {
      totalStudyTime: '47.5',
      modulesCompleted: 8,
      totalModules: 12,
      averageScore: 85,
      quizzesTaken: 24,
      currentStreak: 12,
      longestStreak: 18,
      totalSessions: 45
    },
    scoreProgress: [
      { month: 'Aug', score: 65 },
      { month: 'Sep', score: 72 },
      { month: 'Oct', score: 78 },
      { month: 'Nov', score: 85 }
    ],
    studyTime: [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 3.2 },
      { day: 'Wed', hours: 1.8 },
      { day: 'Thu', hours: 4.1 },
      { day: 'Fri', hours: 2.9 },
      { day: 'Sat', hours: 5.5 },
      { day: 'Sun', hours: 3.8 }
    ],
    modulePerformance: [
      { module: 'Cardiovascular', progress: 100, avgScore: 88, timeSpent: '8.5h', lastAttempt: '2 days ago', status: 'completed' },
      { module: 'Nervous System', progress: 100, avgScore: 92, timeSpent: '12.3h', lastAttempt: '5 days ago', status: 'completed' },
      { module: 'Skeletal System', progress: 85, avgScore: 78, timeSpent: '6.2h', lastAttempt: '1 day ago', status: 'in-progress' },
      { module: 'Muscular System', progress: 65, avgScore: 75, timeSpent: '4.8h', lastAttempt: '3 days ago', status: 'in-progress' },
      { module: 'Respiratory', progress: 100, avgScore: 85, timeSpent: '7.1h', lastAttempt: '1 week ago', status: 'completed' },
      { module: 'Digestive System', progress: 40, avgScore: 71, timeSpent: '3.2h', lastAttempt: '4 days ago', status: 'in-progress' }
    ],
    questionTypePerformance: [
      { type: 'Multiple Choice', correct: 156, total: 180, percentage: 87 },
      { type: 'Labeling', correct: 42, total: 55, percentage: 76 },
      { type: 'Drag & Drop', correct: 35, total: 40, percentage: 88 }
    ],
    recentActivity: [
      { date: 'Oct 30, 2025', action: 'Completed Quiz', module: 'Skeletal System', score: 85, time: '15:24' },
      { date: 'Oct 29, 2025', action: 'Studied Module', module: 'Muscular System', duration: '2.5h' },
      { date: 'Oct 28, 2025', action: 'Completed Quiz', module: 'Nervous System', score: 92, time: '18:45' },
      { date: 'Oct 27, 2025', action: 'Studied Module', module: 'Cardiovascular', duration: '1.8h' },
      { date: 'Oct 26, 2025', action: 'Completed Quiz', module: 'Respiratory', score: 88, time: '16:32' }
    ],
    strengths: [
      { topic: 'Heart Anatomy', mastery: 95, questions: 24 },
      { topic: 'Blood Flow', mastery: 92, questions: 18 },
      { topic: 'Nerve Function', mastery: 90, questions: 22 }
    ],
    weaknesses: [
      { topic: 'Heart Valves', mastery: 65, questions: 12 },
      { topic: 'Bone Structure', mastery: 68, questions: 15 },
      { topic: 'Muscle Types', mastery: 72, questions: 10 }
    ],
    learningPattern: {
      mostActiveDay: 'Saturday',
      mostActiveTime: '2PM - 6PM',
      avgSessionLength: '63 mins',
      preferredFormat: 'VR Sessions'
    },
    achievements: [
      { name: 'First Quiz Completed', icon: 'Trophy', unlocked: true, date: 'Oct 15, 2025' },
      { name: 'Week Streak', icon: 'Zap', unlocked: true, date: 'Oct 20, 2025' },
      { name: 'Perfect Score', icon: 'Award', unlocked: true, date: 'Oct 25, 2025' },
      { name: 'Module Master', icon: 'Brain', unlocked: false },
      { name: 'Consistency King', icon: 'Target', unlocked: false },
      { name: 'Speed Demon', icon: 'Clock', unlocked: false }
    ]
  };

  const maxStudyHours = Math.max(...analyticsData.studyTime.map((d: any) => d.hours));

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return Trophy;
      case 'Zap': return Zap;
      case 'Award': return Award;
      case 'Brain': return Brain;
      case 'Target': return Target;
      case 'Clock': return Clock;
      default: return Trophy;
    }
  };

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
              <span className="text-white">VR</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">MTS</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
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
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            Your Analytics Dashboard
          </h2>
          <p className="text-slate-400">Track your progress and identify areas for improvement</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-400">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-400">Module:</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Modules</option>
              <option value="cardiovascular">Cardiovascular</option>
              <option value="nervous">Nervous System</option>
              <option value="skeletal">Skeletal</option>
              <option value="muscular">Muscular</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{analyticsData.overview.totalStudyTime}h</div>
            <div className="text-slate-400 text-sm">Total Study Time</div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-cyan-400 text-sm font-medium">+5%</span>
            </div>
            <div className="text-3xl font-bold mb-1">{analyticsData.overview.averageScore}%</div>
            <div className="text-slate-400 text-sm">Average Score</div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {analyticsData.overview.modulesCompleted}/{analyticsData.overview.totalModules}
            </div>
            <div className="text-slate-400 text-sm">Modules Completed</div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{analyticsData.overview.currentStreak}</div>
            <div className="text-slate-400 text-sm">Day Streak</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Progress Chart */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Score Progress Over Time
            </h3>
            <div className="space-y-4">
              {analyticsData.scoreProgress.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <span className="text-sm font-bold text-cyan-400">{item.score}%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-cyan-400">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">+20% improvement since August</span>
              </div>
            </div>
          </div>

          {/* Weekly Study Time Chart */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              Weekly Study Pattern
            </h3>
            <div className="flex items-end justify-between gap-2 h-48">
              {analyticsData.studyTime.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end h-full">
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-500 to-teal-500 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                      style={{ height: `${(item.hours / maxStudyHours) * 100}%` }}
                      title={`${item.hours}h`}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="text-slate-400 mb-1">Most Active</div>
                <div className="font-semibold">{analyticsData.learningPattern.mostActiveDay}</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="text-slate-400 mb-1">Avg Session</div>
                <div className="font-semibold">{analyticsData.learningPattern.avgSessionLength}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Module Performance Table */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            Module Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Module</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Progress</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Avg Score</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Time Spent</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Last Activity</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.modulePerformance.map((module, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium">{module.module}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-cyan-400">{module.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-bold ${
                        module.avgScore >= 90 ? 'text-emerald-400' :
                        module.avgScore >= 80 ? 'text-cyan-400' :
                        module.avgScore >= 70 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {module.avgScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-400">{module.timeSpent}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-400">{module.lastAttempt}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        module.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {module.status === 'completed' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {module.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Question Type Performance & Learning Pattern */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Question Type Performance */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-cyan-400" />
              Question Type Performance
            </h3>
            <div className="space-y-6">
              {analyticsData.questionTypePerformance.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold">{item.type}</div>
                      <div className="text-sm text-slate-400">{item.correct} of {item.total} correct</div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-400">{item.percentage}%</div>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.percentage >= 85 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                        item.percentage >= 75 ? 'bg-gradient-to-r from-cyan-500 to-teal-500' :
                        'bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Pattern */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-cyan-400" />
              Your Learning Pattern
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Most Active Day</span>
                  <span className="font-bold text-cyan-400">{analyticsData.learningPattern.mostActiveDay}</span>
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Peak Study Time</span>
                  <span className="font-bold text-purple-400">{analyticsData.learningPattern.mostActiveTime}</span>
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Avg Session Length</span>
                  <span className="font-bold text-emerald-400">{analyticsData.learningPattern.avgSessionLength}</span>
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Preferred Format</span>
                  <span className="font-bold text-orange-400">{analyticsData.learningPattern.preferredFormat}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-emerald-400" />
              Your Strengths
            </h3>
            <div className="space-y-3">
              {analyticsData.strengths.map((item, idx) => (
                <div key={idx} className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{item.topic}</span>
                    <span className="text-emerald-400 font-bold">{item.mastery}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>{item.questions} questions answered</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {analyticsData.weaknesses.map((item, idx) => (
                <div key={idx} className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{item.topic}</span>
                    <span className="text-yellow-400 font-bold">{item.mastery}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{item.questions} questions answered</span>
                    <button className="text-xs px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors">
                      Practice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-400" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {analyticsData.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-xs text-slate-400">{activity.date}</span>
                  </div>
                  <div className="text-sm text-slate-400">{activity.module}</div>
                  {activity.score && (
                    <div className="text-sm font-semibold text-cyan-400 mt-1">
                      Score: {activity.score}% • {activity.time}
                    </div>
                  )}
                  {activity.duration && (
                    <div className="text-sm text-purple-400 mt-1">{activity.duration}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-cyan-400" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.achievements.map((achievement, idx) => {
              const IconComponent = getAchievementIcon(achievement.icon);
              return (
                <div key={idx} className={`p-4 rounded-xl border transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-cyan-500/30'
                    : 'bg-slate-800/30 border-white/10 opacity-60'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-cyan-500 to-teal-500'
                        : 'bg-slate-700'
                    }`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                        {achievement.name}
                      </div>
                      {achievement.unlocked && achievement.date && (
                        <div className="text-xs text-cyan-400">{achievement.date}</div>
                      )}
                    </div>
                  </div>
                  {!achievement.unlocked && (
                    <div className="text-xs text-slate-500">Locked</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="mt-8 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 text-purple-400">AI-Powered Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">Strong Progress</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Your score has improved by 20% over the last 3 months. You're particularly excelling in visual identification questions.
                  </p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold text-cyan-400">Optimal Study Time</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Your performance is 15% higher during afternoon sessions (2PM-6PM). Consider scheduling important quizzes during this time.
                  </p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">Focus Area</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Heart Valves questions need attention. Your accuracy is 20% below your average. We recommend reviewing this topic.
                  </p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <span className="font-semibold text-orange-400">Study Consistency</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    You maintain excellent consistency with a 12-day streak. Students with similar patterns show 25% better retention.
                  </p>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 rounded-xl font-medium transition-all flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Get Personalized Study Plan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}