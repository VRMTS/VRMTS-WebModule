import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Target, Clock, TrendingUp, ChevronRight, ChevronDown, ChevronUp, RotateCcw, Home, BarChart3, CheckCircle2, XCircle, AlertCircle, Brain, BookOpen, Share2, Download, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

const API_BASE_URL = 'http://localhost:8080/api';

interface ResultsData {
  score: number;
  passingScore: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  timeSpent: string;
  timeTaken: number;
  attemptDate: string;
  quizTitle: string;
  module: string;
  passed: boolean;
  questionBreakdown: Array<{ type: string; correct: number; total: number }>;
  detailedQuestions: Array<{
    id: number;
    question: string;
    yourAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    type: string;
    explanation?: string;
    relatedTopics?: string[];
  }>;
  previousAttempts: Array<{ date: string; score: number; isCurrent?: boolean }>;
  classAverage: number;
  topScore: number;
  rank: number;
  totalStudents: number;
  weakAreas: Array<{ topic: string; accuracy: number }>;
  strongAreas: Array<{ topic: string; accuracy: number }>;
  recommendations: string[];
  badges: Array<{ icon?: string; name: string; earned?: boolean }>;
}

export default function QuizResults() {
  const navigate = useNavigate();
  const { attemptId } = useParams<{ attemptId: string }>();
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  // Fetch quiz results
  useEffect(() => {
    const fetchResults = async () => {
      if (!attemptId) {
        setError('No attempt ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First, get the attempt details (which includes all the results after finishing)
        const response = await fetch(`${API_BASE_URL}/quiz/attempt/${attemptId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz results');
        }

        const data = await response.json();
        if (data.success && data.data) {
          const attempt = data.data;

          // If quiz is completed, use results data, otherwise use attempt data
          const results = attempt.results || attempt;

          // Compute time spent from start/end if not in results (fallback)
          let timeSpent = results.timeSpent;
          if (!timeSpent && attempt.startTime && attempt.endTime) {
            const ms = new Date(attempt.endTime).getTime() - new Date(attempt.startTime).getTime();
            const mins = Math.floor(ms / 60000);
            const secs = Math.floor((ms % 60000) / 1000);
            timeSpent = mins >= 60
              ? `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
              : `${mins}:${String(secs).padStart(2, '0')}`;
          }

          // Format the data to match the expected structure
          const formattedData = {
            score: results.score || attempt.score || 0,
            passingScore: results.passingScore || attempt.passingScore || 60,
            totalQuestions: results.totalQuestions || attempt.totalQuestions || 0,
            correctAnswers: results.correctAnswers || 0,
            incorrectAnswers: results.incorrectAnswers || 0,
            skippedQuestions: results.skippedQuestions || 0,
            timeSpent: timeSpent || '0:00',
            timeTaken: results.timeTaken || 0,
            attemptDate: results.attemptDate || (attempt.endTime
              ? new Date(attempt.endTime).toLocaleString()
              : new Date().toLocaleString()),
            quizTitle: results.quizTitle || attempt.moduleTitle || attempt.title || 'Quiz',
            module: results.module || attempt.moduleTitle || attempt.module || 'Module',
            passed: results.passed !== undefined
              ? results.passed
              : (results.score || attempt.score || 0) >= (results.passingScore || attempt.passingScore || 60),
            questionBreakdown: results.questionBreakdown || [],
            detailedQuestions: (results.detailedQuestions || attempt.questions || []).map((q: Record<string, unknown>, idx: number) => ({
              id: (q.id ?? q.questionId ?? idx) as number,
              question: (q.question ?? q.questionText ?? 'Question') as string,
              yourAnswer: (q.yourAnswer ?? q.studentAnswer ?? 'Not answered') as string,
              correctAnswer: (q.correctAnswer ?? 'N/A') as string,
              isCorrect: q.isCorrect === true || q.isCorrect === 1,
              type: (q.type ?? 'MCQ') as string,
              explanation: (q.explanation as string) ?? undefined,
              relatedTopics: q.relatedTopics as string[] | undefined,
            })),
            previousAttempts: [], // Can be fetched separately if needed
            averageScore: results.score || attempt.score || 0,
            classAverage: 0, // Not available from current API
            topScore: 0, // Not available from current API
            rank: 0, // Not available from current API
            totalStudents: 0, // Not available from current API
            weakAreas: [],
            strongAreas: [],
            recommendations: (() => {
              const s = attempt.feedback?.improvementSuggestions;
              return Array.isArray(s) ? s : (s ? [String(s)] : []);
            })(),
            badges: []
          };

          setResultsData(formattedData);
        } else {
          throw new Error(data.message || 'Failed to load quiz results');
        }
      } catch (err) {
        console.error('Error fetching quiz results:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId]);

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !resultsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-slate-200">Error loading results</h2>
          <p className="text-slate-400 mb-4">{error || 'Quiz results not available'}</p>
          <button
            onClick={() => navigate('/quizselection')}
            className="px-5 py-2.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors"
          >
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  const headerRight = (
    <div className="flex items-center gap-3">
      <button className="h-10 px-4 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-black/20">
        <Share2 className="w-4 h-4 text-cyan-400" />
        <span className="hidden sm:inline">Share Report</span>
      </button>
      <button className="h-10 px-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-cyan-900/20">
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export PDF</span>
      </button>
    </div>
  );

  return (
    <PageLayout
      title="Quiz results"
      subtitle={resultsData?.quizTitle}
      breadcrumbLabel="Quiz"
      activeNav="quiz"
      userType="student"
      headerRight={headerRight}
    >
      <div className="space-y-6 animate-in fade-in duration-700">
        {/* Top Section: Score & Stats + Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score & Stats Card */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
            {/* Background Accent */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 transition-colors duration-1000 ${resultsData.passed ? 'bg-emerald-500' : 'bg-rose-500'}`} />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              {/* Circular Score Gauge */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="45"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-800/50"
                  />
                  <circle
                    cx="50" cy="50" r="45"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${283 * (resultsData.score / 100)} 283`}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-out ${resultsData.passed ? 'text-emerald-500' : 'text-rose-500'}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
                  <span className="text-5xl font-black tracking-tighter text-white">{resultsData.score}%</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total Score</span>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="flex-1 text-center md:text-left">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-[10px] font-bold uppercase tracking-wider ${resultsData.passed
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                  {resultsData.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {resultsData.passed ? 'Assessment Passed' : 'Minimum Score Not Met'}
                </div>

                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                  {resultsData.passed ? 'Excellent performance!' : 'Keep pushing forward!'}
                </h2>
                <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed font-medium">
                  {resultsData.passed
                    ? `You've successfully demonstrated mastery of ${resultsData.quizTitle}. Your results show solid understanding of the core concepts.`
                    : `You didn't reach the passing score of ${resultsData.passingScore}% this time. Review the recommendations below to strengthen your weak areas.`}
                </p>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm group-hover:border-white/10 transition-colors">
                    <div className="text-xl font-black text-emerald-400">{resultsData.correctAnswers}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Correct</div>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm group-hover:border-white/10 transition-colors">
                    <div className="text-xl font-black text-rose-400">{resultsData.incorrectAnswers}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Incorrect</div>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm group-hover:border-white/10 transition-colors">
                    <div className="text-xl font-black text-cyan-400">{resultsData.timeSpent}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benchmarking & Global Stats */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Performance Benchmarks
            </h3>

            <div className="space-y-6 flex-1">
              {/* Your Performance vs Target */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Your Current Score</span>
                  <span className="text-white">{resultsData.score}%</span>
                </div>
                <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full rounded-full transition-all duration-1000 ${resultsData.passed ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'}`} style={{ width: `${resultsData.score}%` }} />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Passing Threshold</span>
                  <span className="text-slate-500">{resultsData.passingScore}%</span>
                </div>
                <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-slate-700/50 rounded-full" style={{ width: `${resultsData.passingScore}%` }} />
                </div>
              </div>

              {resultsData.classAverage > 0 && (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Section Average</span>
                    <span className="text-slate-500">{resultsData.classAverage}%</span>
                  </div>
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-cyan-500/40 rounded-full" style={{ width: `${resultsData.classAverage}%` }} />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto pt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/quizselection')}
                  className="group/btn relative flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border border-white/5"
                >
                  <RotateCcw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                  Retake
                </button>
                <button
                  onClick={() => navigate('/studentdashboard')}
                  className="flex items-center justify-center gap-2 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-cyan-500/5"
                >
                  <Home className="w-4 h-4" /> Exit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Bar */}
        <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-purple-500/30 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/20 flex-shrink-0 relative">
            <Brain className="w-8 h-8 text-white relative z-10" />
            <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse blur-md" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-black text-purple-200 mb-1 flex items-center justify-center md:justify-start gap-2">
              Deep-Learning Insights
              <span className="px-2 py-0.5 bg-purple-500/20 text-[8px] uppercase tracking-tighter text-purple-400 border border-purple-500/30 rounded">Beta</span>
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              {resultsData.recommendations.length > 0
                ? resultsData.recommendations[0]
                : "Based on your performance patterns, focus on anatomical spatial relationships in the next module."}
            </p>
          </div>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-900/40 flex items-center gap-2 transform active:scale-95 transition-all">
            <BookOpen className="w-4 h-4" /> Study Roadmap
          </button>
        </div>

        {/* Detailed Question Review */}
        <div className="bg-slate-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Question Analysis</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">In-depth performance breakdown</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/40 p-2 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{resultsData.correctAnswers} Correct</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{resultsData.incorrectAnswers} Incorrect</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {resultsData.detailedQuestions.map((q, idx) => (
              <div key={q.id ?? idx} className="group">
                <div
                  className={`p-1 rounded-2xl transition-all duration-300 ${expandedQuestion === (q.id ?? idx)
                    ? 'bg-gradient-to-r from-slate-800 to-slate-800/50 shadow-xl'
                    : 'bg-transparent'
                    }`}
                >
                  <button
                    onClick={() => toggleQuestion(q.id ?? idx)}
                    className={`w-full text-left p-6 rounded-xl border transition-all flex items-center gap-6 ${q.isCorrect
                      ? 'border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/10 shadow-sm'
                      : 'border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/10 shadow-sm'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 transition-transform duration-300 group-hover:scale-105 ${q.isCorrect ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-rose-500/20 text-rose-400 bg-rose-500/5'
                      }`}>
                      {q.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node {String(idx + 1).padStart(2, '0')}</span>
                        <span className="px-2 py-0.5 bg-slate-800/60 text-[8px] font-black text-slate-400 rounded border border-white/5 uppercase tracking-tighter">{q.type}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-200 leading-snug">{q.question}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`text-[10px] font-bold uppercase transition-opacity ${expandedQuestion === (q.id ?? idx) ? 'opacity-0' : 'opacity-100'} text-slate-600 hidden md:block`}>
                        View Details
                      </div>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800/40 border border-white/5 transition-transform duration-300 ${expandedQuestion === (q.id ?? idx) ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </button>

                  {expandedQuestion === (q.id ?? idx) && (
                    <div className="px-8 py-8 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Response Validation</span>
                            <div className="space-y-3">
                              <div className={`p-4 rounded-xl border-l-4 ${q.isCorrect ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-rose-500/5 border-rose-500/30'} backdrop-blur-sm`}>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Your Submission</div>
                                <div className={`font-bold text-sm ${q.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>{q.yourAnswer}</div>
                              </div>
                              {!q.isCorrect && (
                                <div className="p-4 rounded-xl border-l-4 bg-emerald-500/5 border-emerald-500/30 backdrop-blur-sm">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Expected Root</div>
                                  <div className="font-bold text-sm text-emerald-400">{q.correctAnswer}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {q.relatedTopics && q.relatedTopics.length > 0 && (
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Tag Association</span>
                              <div className="flex flex-wrap gap-2">
                                {q.relatedTopics.map((topic, tIdx) => (
                                  <span key={tIdx} className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-default transition-all border border-white/5 hover:border-white/10">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-3">Synaptic Context</span>
                          <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 min-h-[140px] relative overflow-hidden group/card shadow-inner">
                            <Brain className="absolute -bottom-6 -right-6 w-24 h-24 text-purple-500/5 rotate-12" />
                            <p className="text-sm text-slate-300 leading-relaxed font-medium relative z-10 italic">
                              "{q.explanation || 'Anatomical logic for this node is being processed. Review core module documentation for detailed structural relationships.'}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}