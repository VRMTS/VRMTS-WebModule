import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, TrendingUp, ChevronRight, ChevronDown, ChevronUp, RotateCcw, Home, BarChart3, CheckCircle2, XCircle, AlertCircle, Award, Brain, Zap, BookOpen, Share2, Download } from 'lucide-react';

export default function QuizResults() {
  const navigate = useNavigate();
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const resultsData = {
    score: 85,
    passingScore: 70,
    totalQuestions: 15,
    correctAnswers: 13,
    incorrectAnswers: 2,
    skippedQuestions: 0,
    timeSpent: '18:45',
    timeTaken: 1125,
    attemptDate: 'October 30, 2025 at 2:45 PM',
    quizTitle: 'Cardiovascular System Quiz',
    module: 'Cardiovascular System',
    passed: true,
    previousAttempts: [
      { date: 'Oct 15, 2025', score: 78 },
      { date: 'Oct 8, 2025', score: 72 },
      { date: 'Sep 28, 2025', score: 65 }
    ],
    averageScore: 75,
    classAverage: 72,
    topScore: 95,
    rank: 12,
    totalStudents: 45,
    questionBreakdown: [
      { type: 'MCQ', total: 10, correct: 9 },
      { type: 'Labeling', total: 3, correct: 2 },
      { type: 'Drag & Drop', total: 2, correct: 2 }
    ],
    detailedQuestions: [
      {
        id: 1,
        question: 'Which chamber of the heart receives oxygenated blood from the lungs?',
        yourAnswer: 'Left Atrium',
        correctAnswer: 'Left Atrium',
        isCorrect: true,
        type: 'MCQ',
        explanation: 'The left atrium receives oxygenated blood from the pulmonary veins after gas exchange in the lungs.'
      },
      {
        id: 2,
        question: 'What is the largest artery in the human body?',
        yourAnswer: 'Aorta',
        correctAnswer: 'Aorta',
        isCorrect: true,
        type: 'MCQ',
        explanation: 'The aorta is the main and largest artery in the human body, carrying oxygenated blood from the left ventricle to the rest of the body.'
      },
      {
        id: 3,
        question: 'Label the following parts of the heart on the diagram below:',
        yourAnswer: 'Partially correct (3/4 labels)',
        correctAnswer: 'All labels correct',
        isCorrect: false,
        type: 'Labeling',
        explanation: 'You correctly identified the Aorta, Left Atrium, and Right Ventricle, but incorrectly labeled the Pulmonary Artery.',
        relatedTopics: ['Heart Anatomy', 'Major Blood Vessels']
      },
      {
        id: 4,
        question: 'What is the normal resting heart rate for adults?',
        yourAnswer: '60-100 bpm',
        correctAnswer: '60-100 bpm',
        isCorrect: true,
        type: 'MCQ',
        explanation: 'The normal resting heart rate for adults ranges from 60 to 100 beats per minute.'
      },
      {
        id: 5,
        question: 'Match the blood vessels to their descriptions',
        yourAnswer: 'All correct',
        correctAnswer: 'All correct',
        isCorrect: true,
        type: 'Drag & Drop',
        explanation: 'Excellent work! You correctly matched all blood vessel types with their functions.'
      },
      {
        id: 6,
        question: 'Which valve prevents backflow from the left ventricle?',
        yourAnswer: 'Aortic Valve',
        correctAnswer: 'Mitral Valve',
        isCorrect: false,
        type: 'MCQ',
        explanation: 'The mitral valve (bicuspid valve) prevents backflow from the left ventricle into the left atrium. The aortic valve prevents backflow from the aorta into the left ventricle.',
        relatedTopics: ['Heart Valves', 'Cardiac Cycle']
      }
    ],
    weakAreas: [
      { topic: 'Heart Valves', accuracy: 60, questionsCount: 3 },
      { topic: 'Blood Vessel Types', accuracy: 75, questionsCount: 2 }
    ],
    strongAreas: [
      { topic: 'Heart Chambers', accuracy: 100, questionsCount: 4 },
      { topic: 'Blood Flow', accuracy: 90, questionsCount: 3 }
    ],
    recommendations: [
      'Review the anatomy and function of heart valves',
      'Practice labeling major blood vessels',
      'Study the cardiac cycle in more detail'
    ],
    badges: [
      { name: 'First Try Pass', icon: '🎯', earned: true },
      { name: 'Speed Demon', icon: '⚡', earned: false },
      { name: 'Perfect Score', icon: '💯', earned: false }
    ]
  };

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-white">VRMTS</span>
          </h1>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 ${
            resultsData.passed 
              ? 'bg-emerald-500/20 border border-emerald-500/50'
              : 'bg-red-500/20 border border-red-500/50'
          }`}>
            {resultsData.passed ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-lg">Passed!</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-400" />
                <span className="text-red-400 font-bold text-lg">Not Passed</span>
              </>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3">Great Job!</h2>
          <p className="text-slate-400 mb-8">{resultsData.quizTitle}</p>

          <div className="mb-6">
            <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent inline-block">
              {resultsData.score}%
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-400">{resultsData.correctAnswers}</div>
              <p className="text-sm text-slate-400">Correct</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <XCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-400">{resultsData.incorrectAnswers}</div>
              <p className="text-sm text-slate-400">Incorrect</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyan-400">{resultsData.timeSpent}</div>
              <p className="text-sm text-slate-400">Time</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <Target className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">{resultsData.rank}/{resultsData.totalStudents}</div>
              <p className="text-sm text-slate-400">Rank</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/studentdashboard')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/quizselection')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </button>
            <button
              onClick={() => navigate('/studentanalytics')}
              className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyan-400" />
              Question Types
            </h3>
            <div className="space-y-4">
              {resultsData.questionBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="text-sm text-slate-400">{item.correct}/{item.total}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                      style={{ width: `${(item.correct / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Comparison
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Your Score</span>
                  <span className="text-xl font-bold text-cyan-400">{resultsData.score}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                    style={{ width: `${resultsData.score}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Class Average</span>
                  <span className="text-xl font-bold text-slate-400">{resultsData.classAverage}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-600 rounded-full"
                    style={{ width: `${resultsData.classAverage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Top Score</span>
                  <span className="text-xl font-bold text-emerald-400">{resultsData.topScore}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                    style={{ width: `${resultsData.topScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              Badges
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {resultsData.badges.map((badge, idx) => (
                <div 
                  key={idx}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-3 ${
                    badge.earned
                      ? 'bg-yellow-500/20 border border-yellow-500/50'
                      : 'bg-slate-800/30 border border-slate-700/30 opacity-40'
                  }`}
                >
                  <span className="text-3xl mb-2">{badge.icon}</span>
                  <span className="text-xs text-center leading-tight font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-cyan-400" />
              Progress
            </h3>
            <div className="space-y-3">
              {[...resultsData.previousAttempts, { date: 'Current', score: resultsData.score, isCurrent: true }].map((attempt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    'isCurrent' in attempt && attempt.isCurrent
                      ? 'bg-cyan-500/20 border border-cyan-500/50'
                      : 'bg-slate-800/30'
                  }`}
                >
                  <span className="text-sm font-medium">{attempt.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-cyan-400">{attempt.score}%</span>
                    {'isCurrent' in attempt && attempt.isCurrent && (
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">New</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              Analysis
            </h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-emerald-400 mb-3">Strong Areas</h4>
              <div className="space-y-2">
                {resultsData.strongAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                    <span className="text-sm">{area.topic}</span>
                    <span className="text-sm font-bold text-emerald-400">{area.accuracy}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-yellow-400 mb-3">Needs Work</h4>
              <div className="space-y-2">
                {resultsData.weakAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <span className="text-sm">{area.topic}</span>
                    <span className="text-sm font-bold text-yellow-400">{area.accuracy}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 text-purple-400">AI Recommendations</h3>
              <p className="text-slate-300 mb-4">Based on your performance:</p>
              <ul className="space-y-2 mb-6">
                {resultsData.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{rec}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 rounded-xl font-medium transition-all flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Study Topics
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <AlertCircle className="w-7 h-7 text-cyan-400" />
            Question Review
          </h3>
          
          <div className="space-y-3">
            {resultsData.detailedQuestions.map((q) => (
              <div 
                key={q.id}
                className={`border rounded-xl overflow-hidden ${
                  q.isCorrect 
                    ? 'border-emerald-500/30 bg-emerald-500/5' 
                    : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                <button
                  onClick={() => toggleQuestion(q.id)}
                  className="w-full p-6 flex items-start justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 text-left">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      q.isCorrect 
                        ? 'bg-emerald-500/20 border border-emerald-500/50' 
                        : 'bg-red-500/20 border border-red-500/50'
                    }`}>
                      {q.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-slate-400">Q{q.id}</span>
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full">{q.type}</span>
                      </div>
                      <p className="font-medium mb-2">{q.question}</p>
                      <div className="text-sm">
                        <span className={q.isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                          Your: {q.yourAnswer}
                        </span>
                        {!q.isCorrect && (
                          <span className="text-slate-400 ml-4">
                            Correct: {q.correctAnswer}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedQuestion === q.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {expandedQuestion === q.id && (
                  <div className="px-6 pb-6 pt-4 border-t border-white/10">
                    <h4 className="font-semibold mb-2 text-cyan-400">Explanation:</h4>
                    <p className="text-slate-300 mb-4">{q.explanation}</p>
                    
                    {q.relatedTopics && (
                      <div>
                        <h4 className="font-semibold mb-2 text-purple-400">Related:</h4>
                        <div className="flex flex-wrap gap-2">
                          {q.relatedTopics.map((topic, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}