import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Clock, Trophy, Target, Calendar, Download, Filter, Brain, Zap, BookOpen, Activity, Eye, CheckCircle2, XCircle, AlertCircle, TrendingDown, Award, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

const API_BASE_URL = 'http://localhost:8080/api';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/analytics/student`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const result = await response.json();
        if (result.success && result.data) {
          setAnalyticsData(result.data);
        } else {
          throw new Error(result.message || 'Failed to load analytics data');
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-slate-200">Error loading analytics</h2>
          <p className="text-slate-400 mb-4">{error || 'Analytics data not available'}</p>
          <button onClick={() => navigate('/studentdashboard')} className="px-5 py-2.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors">
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const maxStudyHours = Math.max(...(analyticsData.studyTime || []).map((d: any) => d.hours || 0), 1);

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
    <PageLayout
      title="Analytics"
      subtitle="Your learning progress and performance"
      breadcrumbLabel="Analytics"
      activeNav="analytics"
      userType="student"
      headerRight={
        <button className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      }
    >
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-slate-800/50 border border-white/10 rounded-lg">
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
              className="px-3 py-2 bg-slate-800/60 border border-white/10 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-slate-600"
            >
              <option value="all">All Modules</option>
              <option value="cardiovascular">Cardiovascular</option>
              <option value="nervous">Nervous System</option>
              <option value="skeletal">Skeletal</option>
              <option value="muscular">Muscular</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-slate-700/80">
                <Clock className="w-5 h-5 text-slate-300" />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-xl font-semibold text-slate-100">{analyticsData.overview.totalStudyTime}h</div>
            <div className="text-slate-500 text-sm">Total study time</div>
          </div>
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-slate-700/80">
                <Target className="w-5 h-5 text-slate-300" />
              </div>
              <span className="text-xs text-slate-500">+5%</span>
            </div>
            <div className="text-xl font-semibold text-slate-100">{analyticsData.overview.averageScore}%</div>
            <div className="text-slate-500 text-sm">Average score</div>
          </div>
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-slate-700/80">
                <BookOpen className="w-5 h-5 text-slate-300" />
              </div>
            </div>
            <div className="text-xl font-semibold text-slate-100">
              {analyticsData.overview.modulesCompleted}/{analyticsData.overview.totalModules}
            </div>
            <div className="text-slate-500 text-sm">Modules completed</div>
          </div>
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2.5 rounded-lg bg-slate-700/80">
                <Zap className="w-5 h-5 text-slate-300" />
              </div>
            </div>
            <div className="text-xl font-semibold text-slate-100">{analyticsData.overview.currentStreak}</div>
            <div className="text-slate-500 text-sm">Day streak</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              Score progress over time
            </h3>
            <div className="space-y-3">
              {analyticsData.scoreProgress.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{item.month}</span>
                    <span className="font-medium text-slate-200">{item.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-800/60 border border-white/5 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <TrendingUp className="w-4 h-4 text-slate-500" />
                <span>+20% improvement since August</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-400" />
              Weekly study pattern
            </h3>
            <div className="flex items-end justify-between gap-2 h-40">
              {analyticsData.studyTime.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-cyan-500 rounded-t transition-all hover:opacity-90"
                      style={{ height: `${(item.hours / maxStudyHours) * 100}%` }}
                      title={`${item.hours}h`}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-slate-800/60 rounded-lg">
                <div className="text-slate-500 mb-0.5">Most active</div>
                <div className="font-medium text-slate-200">{analyticsData.learningPattern.mostActiveDay}</div>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-lg">
                <div className="text-slate-500 mb-0.5">Avg session</div>
                <div className="font-medium text-slate-200">{analyticsData.learningPattern.avgSessionLength}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-slate-400" />
            Module performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-3 font-medium text-slate-500">Module</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-500">Progress</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-500">Avg score</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-500">Time spent</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-500">Last activity</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.modulePerformance.map((module, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-200">{module.module}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-28 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${module.progress}%` }} />
                        </div>
                        <span className="text-slate-400 w-8">{module.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-medium ${
                        module.avgScore >= 90 ? 'text-emerald-400' :
                        module.avgScore >= 80 ? 'text-slate-200' :
                        module.avgScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {module.avgScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{module.timeSpent}</td>
                    <td className="py-3 px-3 text-slate-500 text-xs">{module.lastAttempt}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        module.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/50 text-slate-400'
                      }`}>
                        {module.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {module.status === 'completed' ? 'Completed' : 'In progress'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-slate-400" />
              Question type performance
            </h3>
            <div className="space-y-4">
              {analyticsData.questionTypePerformance.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <div>
                      <div className="font-medium text-slate-200">{item.type}</div>
                      <div className="text-slate-500">{item.correct} of {item.total} correct</div>
                    </div>
                    <span className="font-medium text-slate-200">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.percentage >= 85 ? 'bg-emerald-500' :
                        item.percentage >= 75 ? 'bg-cyan-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-slate-400" />
              Your learning pattern
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/60 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 text-sm">Most active day</span>
                <span className="font-medium text-slate-200">{analyticsData.learningPattern.mostActiveDay}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 text-sm">Peak study time</span>
                <span className="font-medium text-slate-200">{analyticsData.learningPattern.mostActiveTime}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 text-sm">Avg session length</span>
                <span className="font-medium text-slate-200">{analyticsData.learningPattern.avgSessionLength}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 text-sm">Preferred format</span>
                <span className="font-medium text-slate-200">{analyticsData.learningPattern.preferredFormat}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-slate-400" />
              Your strengths
            </h3>
            <div className="space-y-3">
              {analyticsData.strengths.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-800/60 border border-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-200">{item.topic}</span>
                    <span className="text-sm font-medium text-emerald-400">{item.mastery}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{item.questions} questions answered</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-slate-400" />
              Areas for improvement
            </h3>
            <div className="space-y-3">
              {analyticsData.weaknesses.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-800/60 border border-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-200">{item.topic}</span>
                    <span className="text-sm font-medium text-amber-400">{item.mastery}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{item.questions} questions answered</span>
                    <button type="button" className="text-xs px-2.5 py-1 bg-slate-600 hover:bg-slate-500 rounded transition-colors">
                      Practice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Recent activity
          </h3>
          <div className="space-y-2">
            {analyticsData.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-medium text-slate-200 text-sm">{activity.action}</span>
                    <span className="text-xs text-slate-500 flex-shrink-0">{activity.date}</span>
                  </div>
                  <div className="text-xs text-slate-500">{activity.module}</div>
                  {activity.score != null && (
                    <div className="text-xs text-slate-400 mt-1">Score: {activity.score}%{activity.time ? ` • ${activity.time}` : ''}</div>
                  )}
                  {activity.duration && <div className="text-xs text-slate-500 mt-0.5">{activity.duration}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-slate-400" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {analyticsData.achievements.map((achievement, idx) => {
              const IconComponent = getAchievementIcon(achievement.icon);
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-colors ${
                    achievement.unlocked ? 'bg-slate-800/60 border-white/10' : 'bg-slate-800/40 border-white/5 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${achievement.unlocked ? 'bg-slate-600' : 'bg-slate-700'}`}>
                      <IconComponent className="w-4 h-4 text-slate-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${achievement.unlocked ? 'text-slate-200' : 'text-slate-500'}`}>
                        {achievement.name}
                      </div>
                      {achievement.unlocked && achievement.date && (
                        <div className="text-xs text-slate-500">{achievement.date}</div>
                      )}
                      {!achievement.unlocked && <div className="text-xs text-slate-500">Locked</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-700/80 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">AI-powered insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-800/60 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-sm text-slate-200">Strong progress</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Your score has improved by 20% over the last 3 months. Excelling in visual identification questions.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-sm text-slate-200">Optimal study time</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Performance is 15% higher during afternoon sessions (2PM–6PM). Consider scheduling quizzes then.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-sm text-slate-200">Focus area</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Heart Valves questions need attention. Accuracy is 20% below average. We recommend reviewing this topic.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-sm text-slate-200">Study consistency</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Excellent consistency with a 12-day streak. Similar patterns show 25% better retention.
                  </p>
                </div>
              </div>
              <button type="button" className="px-4 py-2.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Get personalized study plan
              </button>
            </div>
          </div>
        </div>
    </PageLayout>
  );
}