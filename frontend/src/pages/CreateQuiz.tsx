import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Sparkles,
    Upload,
    ArrowLeft,
    Save,
    Trash2,
    CheckCircle,
    List,
    Type,
    AlignLeft,
    Loader2
} from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

type CreationMode = 'selection' | 'manual' | 'pdf' | 'ai';
type QuestionType = 'mcq' | 'short' | 'blank';

interface Question {
    id: string;
    type: QuestionType;
    question: string;
    options?: string[];
    correctAnswer?: string;
    points: number;
}

interface ModuleOption {
    moduleId: number;
    title: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

export default function CreateQuiz() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<CreationMode>('selection');
    const [quizTitle, setQuizTitle] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [moduleList, setModuleList] = useState<ModuleOption[]>([]);
    const [isLoadingModules, setIsLoadingModules] = useState(false);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setIsLoadingModules(true);
                const response = await axios.get(`${API_BASE_URL}/modules/all`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setModuleList(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching modules:', error);
            } finally {
                setIsLoadingModules(false);
            }
        };

        fetchModules();
    }, []);

    const instructorNav = [
        { key: 'dashboard' as const, label: 'Dashboard', path: '/instructordashboard' },
        { key: 'students' as const, label: 'Students', path: '/instructor/students' },
        { key: 'modules' as const, label: 'Modules', path: '/modules' },
        { key: 'quiz' as const, label: 'Quiz', path: '/instructor/create-quiz' },
        { key: 'analytics' as const, label: 'Analytics', path: '/studentanalytics' },
    ];

    const addQuestion = (type: QuestionType) => {
        const newQuestion: Question = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            question: '',
            points: 1,
            options: type === 'mcq' ? ['', '', '', ''] : undefined,
        };
        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
    };

    const handleCreateQuiz = async () => {
        if (!quizTitle || !selectedModule || questions.length === 0) {
            alert("Please provide a title, select a module, and add at least one question.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                title: quizTitle,
                description: `Custom quiz for ${moduleList.find(m => m.moduleId === parseInt(selectedModule))?.title || 'selected module'}`,
                moduleId: parseInt(selectedModule),
                questions: questions.map(q => ({
                    question: q.question,
                    type: q.type,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    points: q.points
                })),
                timeLimit: 20, // Default 20 mins for custom quizzes
                passingScore: 60
            };

            const response = await axios.post(`${API_BASE_URL}/quiz/create`, payload, {
                withCredentials: true
            });

            if (response.data.success) {
                alert("Quiz published successfully!");
                navigate('/instructordashboard');
            }
        } catch (error: any) {
            console.error('Error creating quiz:', error);
            alert(error.response?.data?.message || "Failed to publish quiz. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <button
                onClick={() => setMode('manual')}
                className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 text-center hover:border-cyan-500/50 hover:bg-slate-800 transition-all group"
            >
                <div className="w-16 h-16 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Type className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Manual Entry</h3>
                <p className="text-slate-400 text-sm">Create MCQs, short questions, and fill-in-the-blanks yourself.</p>
            </button>

            <button
                onClick={() => setMode('pdf')}
                className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/50 hover:bg-slate-800 transition-all group"
            >
                <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload PDF</h3>
                <p className="text-slate-400 text-sm">Upload a document and we'll extract questions from it.</p>
            </button>

            <button
                onClick={() => setMode('ai')}
                className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 text-center hover:border-emerald-500/50 hover:bg-slate-800 transition-all group"
            >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Generated</h3>
                <p className="text-slate-400 text-sm">Generate a comprehensive quiz using AI based on your topic.</p>
            </button>
        </div>
    );

    const renderManualMode = () => (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Quiz Title</label>
                        <input
                            type="text"
                            value={quizTitle}
                            onChange={(e) => setQuizTitle(e.target.value)}
                            placeholder="e.g. Cardiovascular System Essentials"
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Target Module</label>
                        <select
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        >
                            <option value="">{isLoadingModules ? 'Loading modules...' : 'Select a module'}</option>
                            {moduleList.map((mod) => (
                                <option key={mod.moduleId} value={mod.moduleId}>
                                    {mod.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {questions.map((q, index) => (
                    <div key={q.id} className="bg-slate-800/50 border border-white/10 rounded-xl p-6 relative group">
                        <button
                            onClick={() => removeQuestion(q.id)}
                            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-slate-300">
                                {index + 1}
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'short' ? 'Short Question' : 'Fill in the Blank'}
                            </span>
                        </div>

                        <input
                            type="text"
                            value={q.question}
                            onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                            placeholder="Enter your question here..."
                            className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-cyan-500/50"
                        />

                        {q.type === 'mcq' && q.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOpts = [...q.options!];
                                                    newOpts[optIdx] = e.target.value;
                                                    updateQuestion(q.id, { options: newOpts });
                                                }}
                                                placeholder={`Option ${optIdx + 1}`}
                                                className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                            />
                                        </div>
                                        <button
                                            onClick={() => updateQuestion(q.id, { correctAnswer: opt })}
                                            className={`px-3 rounded-lg border transition-colors ${q.correctAnswer === opt && opt !== ''
                                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                                : 'bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(q.type === 'short' || q.type === 'blank') && (
                            <input
                                type="text"
                                value={q.correctAnswer}
                                onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}
                                placeholder="Enter correct answer (for auto-grading)..."
                                className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-3 justify-center py-6 border-2 border-dashed border-white/5 rounded-xl">
                <button
                    onClick={() => addQuestion('mcq')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-white/10"
                >
                    <List className="w-4 h-4" /> Add MCQ
                </button>
                <button
                    onClick={() => addQuestion('short')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-white/10"
                >
                    <AlignLeft className="w-4 h-4" /> Add Short Question
                </button>
                <button
                    onClick={() => addQuestion('blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-white/10"
                >
                    <Type className="w-4 h-4" /> Add Fill-in-the-Blank
                </button>
            </div>

            <div className="flex justify-end gap-3 mt-8">
                <button
                    onClick={() => setMode('selection')}
                    className="px-6 py-2.5 bg-slate-800 text-white rounded-lg font-medium border border-white/10 hover:bg-slate-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleCreateQuiz}
                    disabled={isSubmitting || !quizTitle || questions.length === 0}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Publish Quiz
                </button>
            </div>
        </div>
    );

    const renderPDFMode = () => (
        <div className="max-w-xl mx-auto mt-12 text-center">
            <div className="bg-slate-800/50 border-2 border-dashed border-white/10 rounded-2xl p-12 transition-all hover:border-purple-500/30">
                <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload your PDF document</h3>
                <p className="text-slate-400 mb-8">We'll analyze the content and generate relevant questions automatically.</p>

                <label className="cursor-pointer">
                    <input type="file" className="hidden" accept=".pdf" />
                    <span className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-all inline-block shadow-lg shadow-purple-900/20">
                        Select File
                    </span>
                </label>
                <p className="text-xs text-slate-500 mt-4">Supported format: .pdf (Max 10MB)</p>
            </div>

            <button
                onClick={() => setMode('selection')}
                className="mt-8 text-slate-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to selection
            </button>
        </div>
    );

    const renderAIMode = () => (
        <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI Quiz Generator</h3>
                <p className="text-slate-400 mb-6">Describe the topic or paste the content you want to generate a quiz from.</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Topic / Content Description</label>
                        <textarea
                            rows={6}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                            placeholder="e.g. Generate 10 MCQs about cellular respiration and its stages..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Number of Questions</label>
                            <input type="number" defaultValue={10} className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Difficulty Level</label>
                            <select className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500">
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Generate Quiz
                    </button>
                </div>
            </div>

            <button
                onClick={() => setMode('selection')}
                className="mt-8 text-slate-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to selection
            </button>
        </div>
    );

    return (
        <PageLayout
            title="Create New Quiz"
            subtitle={
                mode === 'manual' ? "Create questions manually for your students" :
                    mode === 'pdf' ? "Convert PDF document to an interactive quiz" :
                        mode === 'ai' ? "Harness AI to build comprehensive assessments" :
                            "Choose your preferred way to create an assessment"
            }
            breadcrumbLabel="Create Quiz"
            activeNav="none"
            userType="instructor"
            navItems={instructorNav}
        >
            <div className="mb-8">
                {mode !== 'selection' && (
                    <button
                        onClick={() => setMode('selection')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Selection Mode
                    </button>
                )}

                {mode === 'selection' && renderSelection()}
                {mode === 'manual' && renderManualMode()}
                {mode === 'pdf' && renderPDFMode()}
                {mode === 'ai' && renderAIMode()}
            </div>
        </PageLayout>
    );
}
