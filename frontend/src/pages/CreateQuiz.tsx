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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 text-blue-50">
            <button
                onClick={() => setMode('manual')}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-10 text-center hover:border-emerald-500/50 hover:bg-neutral-950 transition-all group"
            >
                <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500/10 transition-colors">
                    <Type className="w-8 h-8 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">Manual Entry</h3>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Create MCQs, short questions, and fill-in-the-blanks yourself.</p>
            </button>

            <button
                onClick={() => setMode('pdf')}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-10 text-center hover:border-emerald-500/50 hover:bg-neutral-950 transition-all group"
            >
                <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500/10 transition-colors">
                    <Upload className="w-8 h-8 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">Upload PDF</h3>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Upload a document and we'll extract questions from it.</p>
            </button>

            <button
                onClick={() => setMode('ai')}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-10 text-center hover:border-emerald-500/50 hover:bg-neutral-950 transition-all group"
            >
                <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500/10 transition-colors">
                    <Sparkles className="w-8 h-8 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">AI Generated</h3>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Generate a comprehensive quiz using AI based on your topic.</p>
            </button>
        </div>
    );

    const renderManualMode = () => (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Quiz Title</label>
                        <input
                            type="text"
                            value={quizTitle}
                            onChange={(e) => setQuizTitle(e.target.value)}
                            placeholder="e.g. Cardiovascular System Essentials"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 text-sm font-bold uppercase tracking-tight focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Target Module</label>
                        <select
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 text-sm font-bold uppercase tracking-tight focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
                        >
                            <option value="">{isLoadingModules ? 'Loading...' : 'Select a module'}</option>
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
                    <div key={q.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 relative group">
                        <button
                            onClick={() => removeQuestion(q.id)}
                            className="absolute top-6 right-6 p-2 text-neutral-600 hover:text-rose-500 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-8 h-8 bg-neutral-950 border border-neutral-800 rounded text-xs font-bold text-neutral-400 flex items-center justify-center">
                                {index + 1}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'short' ? 'Short Question' : 'Fill in the Blank'}
                            </span>
                        </div>

                        <input
                            type="text"
                            value={q.question}
                            onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                            placeholder="Enter your question here..."
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-4 text-neutral-200 mb-6 focus:outline-none focus:border-emerald-500/50 text-sm font-bold uppercase tracking-tight"
                        />

                        {q.type === 'mcq' && q.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex gap-3">
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
                                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-200 focus:outline-none focus:border-emerald-500/50"
                                            />
                                        </div>
                                        <button
                                            onClick={() => updateQuestion(q.id, { correctAnswer: opt })}
                                            className={`px-4 rounded-lg border transition-all ${q.correctAnswer === opt && opt !== ''
                                                ? 'bg-emerald-500 text-neutral-950 border-emerald-500'
                                                : 'bg-neutral-950 border-neutral-800 text-neutral-600 hover:text-neutral-400 box-content'
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
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-200 focus:outline-none focus:border-emerald-500/50"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-4 justify-center py-10 border border-dashed border-neutral-800 rounded-lg bg-neutral-900/50">
                <button
                    onClick={() => addQuestion('mcq')}
                    className="flex items-center gap-3 px-6 py-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                >
                    <List className="w-4 h-4" /> Add MCQ
                </button>
                <button
                    onClick={() => addQuestion('short')}
                    className="flex items-center gap-3 px-6 py-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                >
                    <AlignLeft className="w-4 h-4" /> Add Short Question
                </button>
                <button
                    onClick={() => addQuestion('blank')}
                    className="flex items-center gap-3 px-6 py-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                >
                    <Type className="w-4 h-4" /> Add Fill-in-the-Blank
                </button>
            </div>

            <div className="flex justify-end gap-4 mt-12">
                <button
                    onClick={() => setMode('selection')}
                    className="px-8 py-3 bg-neutral-950 text-neutral-500 hover:text-white rounded border border-neutral-800 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 transition-all"
                >
                    Discard Changes
                </button>
                <button
                    onClick={handleCreateQuiz}
                    disabled={isSubmitting || !quizTitle || questions.length === 0}
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Publish Quiz
                </button>
            </div>
        </div>
    );

    const renderPDFMode = () => (
        <div className="max-w-xl mx-auto mt-12 text-center">
            <div className="bg-neutral-900 border border-dashed border-neutral-800 rounded-lg p-12 transition-all hover:border-emerald-500/30">
                <div className="w-20 h-20 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">Upload your PDF document</h3>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-8 leading-relaxed">We'll analyze the content and generate relevant questions automatically.</p>

                <label className="cursor-pointer">
                    <input type="file" className="hidden" accept=".pdf" />
                    <span className="px-10 py-3 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded text-[10px] font-bold uppercase tracking-[0.2em] inline-block transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        Select File
                    </span>
                </label>
                <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest mt-6">Supported format: .pdf (Max 10MB)</p>
            </div>

            <button
                onClick={() => setMode('selection')}
                className="mt-8 text-neutral-500 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors text-[10px] font-bold uppercase tracking-widest"
            >
                <ArrowLeft className="w-4 h-4" /> Selection mode
            </button>
        </div>
    );

    const renderAIMode = () => (
        <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-10">
                <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">AI Quiz Generator</h3>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-8 leading-relaxed">Describe the topic or paste the content you want to generate a quiz from.</p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Topic / Content Description</label>
                        <textarea
                            rows={6}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-4 text-neutral-200 text-sm font-bold uppercase tracking-tight focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-neutral-800"
                            placeholder="e.g. Generate 10 MCQs about cellular respiration and its stages..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Questions Count</label>
                            <input type="number" defaultValue={10} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 text-sm font-bold uppercase tracking-tight outline-none focus:border-emerald-500/50" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Difficulty</label>
                            <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-200 text-sm font-bold uppercase tracking-tight outline-none focus:border-emerald-500/50 appearance-none">
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3">
                        <Sparkles className="w-4 h-4" />
                        Generate Quiz
                    </button>
                </div>
            </div>

            <button
                onClick={() => setMode('selection')}
                className="mt-8 text-neutral-500 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors text-[10px] font-bold uppercase tracking-widest"
            >
                <ArrowLeft className="w-4 h-4" /> Selection mode
            </button>
        </div>
    );

    return (
        <PageLayout
            title="Create New Quiz"
            subtitle={
                mode === 'manual' ? "Create questions manually for your students" :
                    mode === 'pdf' ? "Convert PDF document to an interactive quiz" :
                        mode === 'ai' ? "Harness AI to build comprehensive quizzes" :
                            "Choose how you want to create your quiz"
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
                        Go Back
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
