import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Flag, ChevronLeft, ChevronRight, MessageCircle, Eye, EyeOff, Save, AlertCircle, CheckCircle, Circle, XCircle, Lightbulb, Brain } from 'lucide-react';

export default function QuizTaking() {
  const navigate = useNavigate();
  const { attemptId } = useParams<{ attemptId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [draggedLabels, setDraggedLabels] = useState<Record<string, string>>({});
  const [showQuestionNav, setShowQuestionNav] = useState(true);
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<number>>(new Set());
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const handleSubmitQuiz = async () => {
    if (submitting || autoSubmitted) return;

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/api/quiz/attempt/${attemptId}/finish`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      if (data.success) {
        // Navigate to results page with the attempt ID
        navigate(`/quizresult/${attemptId}`);
      } else {
        throw new Error(data.message || 'Failed to submit quiz');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveProgress = async () => {
    // Placeholder for save progress functionality
    console.log('Save progress clicked');
    // TODO: Implement save progress API call
  };

  // Fetch quiz data
  useEffect(() => {
    const fetchQuizData = async () => {
      console.log('DEBUG: fetchQuizData called with attemptId:', attemptId);
      if (!attemptId) {
        console.log('DEBUG: No attemptId provided');
        setError('No attempt ID provided');
        setLoading(false);
        return;
      }

      try {
        const fetchUrl = `http://localhost:8080/api/quiz/attempt/${attemptId}`;
        console.log('DEBUG: Fetching quiz data from:', fetchUrl);
        const response = await fetch(fetchUrl, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('DEBUG: Response status:', response.status);
        console.log('DEBUG: Response ok:', response.ok);

        if (response.status === 404) {
          console.log('DEBUG: Quiz attempt not found (404)');
          throw new Error('Quiz attempt not found. Please start a new quiz from the quiz selection page.');
        }

        if (!response.ok) {
          console.log('DEBUG: Response not ok, throwing error');
          throw new Error('Failed to fetch quiz data');
        }

        const data = await response.json();
        console.log('DEBUG: Response data:', data);

        if (data.success) {
          console.log('DEBUG: Data success, setting quizData:', data.data);
          console.log('DEBUG: Questions in data:', data.data.questions ? data.data.questions.length : 'No questions array');
          // Check if questions are assigned
          if (!data.data.questions || data.data.questions.length === 0) {
            console.log('DEBUG: No questions assigned to this attempt');
            throw new Error('No questions assigned to this quiz attempt. Please start a new quiz from the quiz selection page.');
          }
          setQuizData(data.data);
          // Set timer from backend data (convert minutes to seconds)
          setTimeRemaining(data.data.timeLimit * 60);
        } else {
          console.log('DEBUG: Data not success, message:', data.message);
          throw new Error(data.message || 'Failed to load quiz');
        }
      } catch (err) {
        console.log('DEBUG: Error in fetchQuizData:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        console.log('DEBUG: fetchQuizData completed, setting loading to false');
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [attemptId]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0 && !autoSubmitted) {
          clearInterval(timer);
          // Auto-submit quiz when time runs out (only once)
          setAutoSubmitted(true);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = async (questionId: number, answer: any) => {
    // Update local state immediately for UI responsiveness
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Submit answer to backend
    try {
      const response = await fetch(`http://localhost:8080/api/quiz/submit-answer`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attemptId: parseInt(attemptId!),
          questionId,
          answer,
          timeSpent: 0 // TODO: Track actual time spent per question
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();
      if (data.success) {
        // Mark answer as submitted
        setSubmittedAnswers(prev => new Set(prev).add(questionId));
      } else {
        console.error('Failed to submit answer:', data.message);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      // Could show a toast notification here
    }
  };

  const toggleMarkForReview = (questionId: number) => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowHint(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowHint(false);
    }
  };

  const handleDrop = (itemId: string, zoneId: string) => {
    setDraggedLabels(prev => ({
      ...prev,
      [zoneId]: itemId
    }));
  };

  const getQuestionStatus = (questionId: number) => {
    const isAnswered = answers[questionId] !== undefined;
    const isSubmitted = submittedAnswers.has(questionId);
    const isMarked = markedForReview.has(questionId);
    const isCurrent = quizData.questions[currentQuestion].id === questionId;

    if (isCurrent) return 'current';
    if (isMarked) return 'marked';
    if (isSubmitted) return 'submitted';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Quiz</h2>
          <p className="text-slate-400 mb-4">{error || 'Quiz data not available'}</p>
          <button
            onClick={() => navigate('/quizselection')}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-medium transition-colors"
          >
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  console.log('DEBUG: Rendering quiz, quizData:', quizData);
  console.log('DEBUG: Questions array:', quizData.questions);
  console.log('DEBUG: Questions length:', quizData.questions ? quizData.questions.length : 'No questions');
  console.log('DEBUG: Current question index:', currentQuestion);

  const question = quizData.questions[currentQuestion];
  console.log('DEBUG: Current question object:', question);

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Fixed Header */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">
                <span className="text-white">VRMTS</span>
              </h1>
              <div className="h-6 w-px bg-white/10"></div>
              <div>
                <h2 className="font-semibold">{quizData.title}</h2>
                <p className="text-xs text-slate-400">{quizData.module}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                timeRemaining < 300 
                  ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                  : 'bg-slate-800/50 border-white/10'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>

              {/* Question Counter */}
              <div className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl">
                <span className="font-semibold">{currentQuestion + 1}</span>
                <span className="text-slate-400"> / {quizData.questions.length}</span>
              </div>

              {/* Exit Button */}
              <button 
                onClick={() => setShowExitModal(true)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 font-medium transition-colors"
              >
                Exit Quiz
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question Card */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm font-medium">
                      Question {currentQuestion + 1}
                    </span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-sm">
                      {question.type === 'mcq' ? 'Multiple Choice' : 
                       question.type === 'labeling' ? 'Labeling' : 
                       'Drag & Drop'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold leading-relaxed">
                    {question.question || 'Question text not available'}
                  </h3>
                </div>
                
                <button
                  onClick={() => toggleMarkForReview(question.id)}
                  className={`p-3 rounded-xl border transition-all ${
                    markedForReview.has(question.id)
                      ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                      : 'bg-slate-800/50 border-white/10 hover:border-yellow-500/30'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* MCQ Options */}
              {question.type === 'mcq' && (
                <div className="space-y-3">
                  {question.options?.map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(question.id, option)}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                        answers[question.id] === option
                          ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-800/30 border-white/10 hover:border-cyan-500/50 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        answers[question.id] === option
                          ? 'border-cyan-500 bg-cyan-500'
                          : 'border-slate-600'
                      }`}>
                        {answers[question.id] === option && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Labeling Question */}
              {question.type === 'labeling' && (
                <div className="space-y-6">
                  {/* Diagram with Hotspots */}
                  <div className="relative bg-slate-800/30 rounded-xl p-8 border border-white/10">
                    {/* Mock Heart Diagram */}
                    <div className="relative mx-auto" style={{ width: '400px', height: '400px' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-64 h-64 text-cyan-400/20" />
                      </div>
                      
                      {/* Hotspots */}
                      {question.hotspots?.map((spot: any) => (
                        <div
                          key={spot.id}
                          className="absolute"
                          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        >
                          <div className="relative">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                              answers[question.id]?.[spot.id]
                                ? 'bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-500/50'
                                : 'bg-slate-900 border-cyan-400 hover:scale-110'
                            }`}>
                              {answers[question.id]?.[spot.id] ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                              ) : (
                                <Circle className="w-4 h-4 text-cyan-400" />
                              )}
                            </div>
                            {answers[question.id]?.[spot.id] && (
                              <div className="absolute left-10 top-0 bg-slate-900 border border-cyan-500/30 rounded-lg px-3 py-1 whitespace-nowrap">
                                <span className="text-sm font-medium">{answers[question.id][spot.id]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Label Options */}
                  <div className="grid grid-cols-2 gap-3">
                    {question.labels?.map((label: string, idx: number) => (
                      <button
                        key={idx}
                        className="p-4 bg-slate-800/50 border border-white/10 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-center font-medium"
                      >
                        {label || `Label ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Drag & Drop Question */}
              {question.type === 'drag-drop' && (
                <div className="space-y-6">
                  {/* Drop Zones */}
                  <div className="space-y-4">
                    {question.dropZones?.map((zone: any) => (
                      <div
                        key={zone.id}
                        className="p-6 bg-slate-800/30 border-2 border-dashed border-white/20 rounded-xl hover:border-cyan-500/50 transition-all"
                      >
                        <p className="text-slate-300 mb-3">{zone.description}</p>
                        <div className={`min-h-16 p-4 rounded-lg border-2 transition-all ${
                          draggedLabels[zone.id]
                            ? 'bg-cyan-500/20 border-cyan-500'
                            : 'bg-slate-800/50 border-white/10'
                        }`}>
                          {draggedLabels[zone.id] ? (
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {question.items.find((item: any) => item.id === draggedLabels[zone.id])?.text}
                              </span>
                              <button
                                onClick={() => setDraggedLabels(prev => {
                                  const newState = { ...prev };
                                  delete newState[zone.id];
                                  return newState;
                                })}
                                className="text-red-400 hover:text-red-300"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-sm">Drop answer here</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Draggable Items */}
                  <div>
                    <p className="text-sm text-slate-400 mb-3">Available Items:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {question.items?.map((item: any) => {
                        const isUsed = Object.values(draggedLabels).includes(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              // Simple click to add to first available zone
                              const emptyZone = question.dropZones.find((z: any) => !draggedLabels[z.id]);
                              if (emptyZone && !isUsed) {
                                handleDrop(item.id, emptyZone.id);
                              }
                            }}
                            disabled={isUsed}
                            className={`p-4 rounded-xl border-2 font-medium transition-all ${
                              isUsed
                                ? 'bg-slate-800/30 border-white/5 text-slate-600 cursor-not-allowed'
                                : 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-cyan-500/30 hover:border-cyan-500 hover:scale-105 cursor-grab active:cursor-grabbing'
                            }`}
                          >
                            {item.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Hint Section */}
              {showHint && (
                <div className="mt-6 p-5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-1">Hint</h4>
                      <p className="text-sm text-slate-300">{question.hint}</p>
                      <p className="text-xs text-yellow-600 mt-2">⚠️ Using hints may affect your final score</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-xl font-medium transition-colors flex items-center gap-2"
                  >
                    <Lightbulb className="w-5 h-5" />
                    {showHint ? 'Hide' : 'Show'} Hint
                  </button>

                  <button
                    onClick={handleSaveProgress}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Progress
                  </button>
                </div>

                {currentQuestion === quizData.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 rounded-xl font-medium transition-all flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Questions</h4>
                <button
                  onClick={() => setShowQuestionNav(!showQuestionNav)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {showQuestionNav ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {showQuestionNav && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Answered</p>
                      <p className="text-lg font-bold text-cyan-400">{answeredCount}/{quizData.questions.length}</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Marked</p>
                      <p className="text-lg font-bold text-yellow-400">{markedForReview.size}</p>
                    </div>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {quizData.questions.map((q: any, idx: number) => {
                      const status = getQuestionStatus(q.id);
                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            setCurrentQuestion(idx);
                            setShowHint(false);
                          }}
                          className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                            status === 'current'
                              ? 'bg-gradient-to-br from-cyan-500 to-teal-500 text-white ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950'
                              : status === 'marked'
                              ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                              : status === 'submitted'
                              ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                              : status === 'answered'
                              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                              : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:border-cyan-500/50'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-500 to-teal-500"></div>
                      <span className="text-slate-400">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50"></div>
                      <span className="text-slate-400">Submitted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
                      <span className="text-slate-400">Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/50"></div>
                      <span className="text-slate-400">Marked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-slate-800/50 border border-white/10"></div>
                      <span className="text-slate-400">Unanswered</span>
                    </div>
                  </div>

                  {/* AI Assistant */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl">
                    <button className="w-full flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium text-sm">Ask AI Assistant</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Exit Quiz?</h3>
                <p className="text-slate-400 text-sm">
                  Are you sure you want to exit? Your progress will be saved, but the timer will continue running.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors"
              >
                Continue Quiz
              </button>
              <button
                onClick={() => {/* Handle exit */}}
                className="flex-1 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl font-medium transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}