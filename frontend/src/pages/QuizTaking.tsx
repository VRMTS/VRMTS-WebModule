import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Flag, ChevronLeft, ChevronRight, MessageCircle, Eye, EyeOff, Save, AlertCircle, CheckCircle, Circle, XCircle, Lightbulb, Brain } from 'lucide-react';

export default function QuizTaking() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [draggedLabels, setDraggedLabels] = useState<Record<string, string>>({});
  const [showQuestionNav, setShowQuestionNav] = useState(true);

  // Mock quiz data - this would come from your backend
  const quizData = {
    title: "Cardiovascular System Quiz",
    module: "Cardiovascular System",
    totalQuestions: 15,
    timeLimit: 1800,
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'Which chamber of the heart receives oxygenated blood from the lungs?',
        options: [
          'Right Atrium',
          'Right Ventricle',
          'Left Atrium',
          'Left Ventricle'
        ],
        hint: 'Think about where oxygenated blood enters the heart after leaving the lungs.'
      },
      {
        id: 2,
        type: 'mcq',
        question: 'What is the largest artery in the human body?',
        options: [
          'Pulmonary Artery',
          'Aorta',
          'Carotid Artery',
          'Femoral Artery'
        ],
        hint: 'This vessel carries oxygenated blood from the left ventricle to the rest of the body.'
      },
      {
        id: 3,
        type: 'labeling',
        question: 'Label the following parts of the heart on the diagram below:',
        image: 'heart-diagram',
        labels: ['Aorta', 'Left Atrium', 'Right Ventricle', 'Pulmonary Artery'],
        hotspots: [
          { id: 'spot1', x: 45, y: 20, label: null },
          { id: 'spot2', x: 30, y: 40, label: null },
          { id: 'spot3', x: 60, y: 60, label: null },
          { id: 'spot4', x: 55, y: 25, label: null }
        ],
        hint: 'Start from the top of the heart and work your way down.'
      },
      {
        id: 4,
        type: 'mcq',
        question: 'What is the normal resting heart rate for adults (beats per minute)?',
        options: [
          '40-60 bpm',
          '60-100 bpm',
          '100-120 bpm',
          '120-140 bpm'
        ],
        hint: 'The normal range is between 60 and 100 beats per minute.'
      },
      {
        id: 5,
        type: 'drag-drop',
        question: 'Match the following blood vessels to their correct descriptions:',
        items: [
          { id: 'item1', text: 'Arteries', matched: false },
          { id: 'item2', text: 'Veins', matched: false },
          { id: 'item3', text: 'Capillaries', matched: false }
        ],
        dropZones: [
          { id: 'zone1', description: 'Carry oxygenated blood away from the heart', correctItem: 'item1' },
          { id: 'zone2', description: 'Tiny vessels where gas exchange occurs', correctItem: 'item3' },
          { id: 'zone3', description: 'Return deoxygenated blood to the heart', correctItem: 'item2' }
        ],
        hint: 'Think about the direction of blood flow and the function of each vessel type.'
      },
      {
        id: 6,
        type: 'mcq',
        question: 'Which valve prevents backflow of blood from the left ventricle into the left atrium?',
        options: [
          'Tricuspid Valve',
          'Mitral Valve',
          'Aortic Valve',
          'Pulmonary Valve'
        ],
        hint: 'This valve is also known as the bicuspid valve.'
      },
      {
        id: 7,
        type: 'mcq',
        question: 'What is the primary function of red blood cells?',
        options: [
          'Fighting infections',
          'Blood clotting',
          'Transporting oxygen',
          'Producing antibodies'
        ],
        hint: 'These cells contain hemoglobin, which binds to oxygen.'
      }
    ]
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          // Auto-submit quiz
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
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
    const isMarked = markedForReview.has(questionId);
    const isCurrent = quizData.questions[currentQuestion].id === questionId;

    if (isCurrent) return 'current';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  const question = quizData.questions[currentQuestion];
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
                <span className="text-white">VR</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">MTS</span>
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
                    {question.question}
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
                  {question.options?.map((option, idx) => (
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
                      {question.hotspots?.map((spot) => (
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
                    {question.labels?.map((label, idx) => (
                      <button
                        key={idx}
                        className="p-4 bg-slate-800/50 border border-white/10 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-center font-medium"
                      >
                        {label}
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
                    {question.dropZones?.map((zone) => (
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
                                {question.items.find(item => item.id === draggedLabels[zone.id])?.text}
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
                      {question.items?.map((item) => {
                        const isUsed = Object.values(draggedLabels).includes(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              // Simple click to add to first available zone
                              const emptyZone = question.dropZones.find(z => !draggedLabels[z.id]);
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

                  <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Progress
                  </button>
                </div>

                {currentQuestion === quizData.questions.length - 1 ? (
                  <button
                    onClick={() => navigate('/quizresult/1')}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Submit Quiz
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
                    {quizData.questions.map((q, idx) => {
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