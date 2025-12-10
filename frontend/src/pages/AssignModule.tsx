import React, { useState } from 'react';
import { BookOpen, Users, Calendar, Clock, Target, ChevronRight, Plus, Save, Send, X, CheckCircle, Lock, Award, FileText, AlertCircle, Search, Filter, Edit, Trash2, Copy, Eye } from 'lucide-react';

export default function VRMTSModuleAssignment() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedModules, setSelectedModules] = useState<number[]>([]);
  const [assignmentType, setAssignmentType] = useState('class');
  const [requireQuiz, setRequireQuiz] = useState(true);
  const [lockPrerequisites, setLockPrerequisites] = useState(true);

  const modules = [
    {
      id: 1,
      name: 'Cardiovascular System',
      thumbnail: '🫀',
      difficulty: 'Intermediate',
      duration: '4-5 hours',
      prerequisites: [],
      description: 'Study the heart, blood vessels, and circulatory system',
      topics: 12,
      quizzes: 3
    },
    {
      id: 2,
      name: 'Nervous System',
      thumbnail: '🧠',
      difficulty: 'Advanced',
      duration: '5-6 hours',
      prerequisites: ['Basic Anatomy'],
      description: 'Explore the brain, spinal cord, and neural pathways',
      topics: 15,
      quizzes: 4
    },
    {
      id: 3,
      name: 'Skeletal System',
      thumbnail: '🦴',
      difficulty: 'Beginner',
      duration: '3-4 hours',
      prerequisites: [],
      description: 'Learn about bones, joints, and skeletal structure',
      topics: 10,
      quizzes: 2
    },
    {
      id: 4,
      name: 'Muscular System',
      thumbnail: '💪',
      difficulty: 'Intermediate',
      duration: '4-5 hours',
      prerequisites: ['Skeletal System'],
      description: 'Understanding muscles, tendons, and movement',
      topics: 11,
      quizzes: 3
    },
    {
      id: 5,
      name: 'Respiratory System',
      thumbnail: '🫁',
      difficulty: 'Intermediate',
      duration: '3-4 hours',
      prerequisites: [],
      description: 'Study lungs, airways, and breathing mechanisms',
      topics: 9,
      quizzes: 2
    },
    {
      id: 6,
      name: 'Digestive System',
      thumbnail: '🫃',
      difficulty: 'Intermediate',
      duration: '4-5 hours',
      prerequisites: [],
      description: 'Explore the digestive tract and nutrient processing',
      topics: 13,
      quizzes: 3
    }
  ];

  const students = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@university.edu', avatar: 'SJ', class: 'Medical Batch 2024' },
    { id: 2, name: 'Michael Chen', email: 'michael.c@university.edu', avatar: 'MC', class: 'Medical Batch 2024' },
    { id: 3, name: 'Emma Davis', email: 'emma.d@university.edu', avatar: 'ED', class: 'Medical Batch 2024' },
    { id: 4, name: 'James Wilson', email: 'james.w@university.edu', avatar: 'JW', class: 'Medical Batch 2024' },
    { id: 5, name: 'Olivia Brown', email: 'olivia.b@university.edu', avatar: 'OB', class: 'Medical Batch 2024' },
    { id: 6, name: 'Sophia Lee', email: 'sophia.l@university.edu', avatar: 'SL', class: 'Medical Batch 2024' }
  ];

  const activeAssignments = [
    {
      id: 1,
      modules: ['Cardiovascular System', 'Respiratory System'],
      assignedTo: 'Medical Batch 2024',
      studentCount: 156,
      completed: 89,
      startDate: '2024-12-01',
      dueDate: '2024-12-15',
      status: 'active',
      requiresQuiz: true,
      passingScore: 70
    },
    {
      id: 2,
      modules: ['Nervous System'],
      assignedTo: 'Medical Batch 2024',
      studentCount: 156,
      completed: 134,
      startDate: '2024-11-20',
      dueDate: '2024-12-18',
      status: 'active',
      requiresQuiz: true,
      passingScore: 75
    },
    {
      id: 3,
      modules: ['Skeletal System', 'Muscular System'],
      assignedTo: 'Selected Students (12)',
      studentCount: 12,
      completed: 8,
      startDate: '2024-12-05',
      dueDate: '2024-12-20',
      status: 'active',
      requiresQuiz: false,
      passingScore: null
    },
    {
      id: 4,
      modules: ['Digestive System'],
      assignedTo: 'Medical Batch 2023',
      studentCount: 142,
      completed: 142,
      startDate: '2024-11-01',
      dueDate: '2024-11-30',
      status: 'completed',
      requiresQuiz: true,
      passingScore: 70
    }
  ];

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleModuleSelection = (moduleId: number) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'Beginner': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Intermediate': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Advanced': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return colors[difficulty] || colors['Intermediate'];
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'overdue': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status] || colors['active'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">
              <span className="text-white">VRMTS</span>
            </h1>
            <nav className="hidden md:flex gap-6">
              <button className="text-slate-400 hover:text-white transition-colors">Dashboard</button>
              <button className="text-slate-400 hover:text-white transition-colors">Students</button>
              <button className="text-cyan-400 font-medium">Modules</button>
              <button className="text-slate-400 hover:text-white transition-colors">Analytics</button>
            </nav>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center font-bold">
            DR
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-cyan-400" />
              Module Assignment
            </h2>
            <p className="text-slate-400">Assign learning modules to students and track progress</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            <Plus className="w-5 h-5" />
            Create Assignment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-slate-400 text-sm">Active Assignments</span>
            </div>
            <div className="text-2xl font-bold">{activeAssignments.filter(a => a.status === 'active').length}</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">Completed</span>
            </div>
            <div className="text-2xl font-bold">{activeAssignments.filter(a => a.status === 'completed').length}</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-slate-400 text-sm">Students Enrolled</span>
            </div>
            <div className="text-2xl font-bold">156</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Target className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-slate-400 text-sm">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold">73%</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Active Assignments</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg hover:border-cyan-400/50 transition-all text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {activeAssignments.map((assignment) => (
              <div 
                key={assignment.id}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-400/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">{assignment.modules.join(' + ')}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">Assigned to: <span className="text-white font-medium">{assignment.assignedTo}</span></p>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-2 text-slate-400">
                        <Users className="w-4 h-4" />
                        {assignment.studentCount} students
                      </span>
                      <span className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      {assignment.requiresQuiz && (
                        <span className="flex items-center gap-2 text-cyan-400">
                          <Target className="w-4 h-4" />
                          Quiz Required ({assignment.passingScore}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Completion Progress</span>
                    <span>{assignment.completed}/{assignment.studentCount} ({Math.round((assignment.completed / assignment.studentCount) * 100)}%)</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                      style={{ width: `${(assignment.completed / assignment.studentCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-2xl font-bold">Create New Assignment</h3>
                  <p className="text-slate-400 text-sm mt-1">Assign modules to students with custom settings</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">1</div>
                    Select Recipients
                  </h4>
                  
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setAssignmentType('class')}
                      className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                        assignmentType === 'class'
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                          : 'bg-slate-800/30 border-white/10 text-slate-400 hover:border-cyan-400/30'
                      }`}
                    >
                      <Users className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Entire Class</div>
                    </button>
                    <button
                      onClick={() => setAssignmentType('individual')}
                      className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                        assignmentType === 'individual'
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                          : 'bg-slate-800/30 border-white/10 text-slate-400 hover:border-cyan-400/30'
                      }`}
                    >
                      <Target className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Individual Students</div>
                    </button>
                  </div>

                  {assignmentType === 'class' ? (
                    <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400/50">
                      <option>Medical Batch 2024 (156 students)</option>
                      <option>Medical Batch 2023 (142 students)</option>
                      <option>Nursing Program A (89 students)</option>
                    </select>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">{selectedStudents.length} students selected</span>
                        <button 
                          onClick={() => setSelectedStudents(students.map(s => s.id))}
                          className="text-sm text-cyan-400 hover:text-cyan-300"
                        >
                          Select All
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-2 bg-slate-800/30 rounded-lg p-3">
                        {students.map((student) => (
                          <label 
                            key={student.id}
                            className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => toggleStudentSelection(student.id)}
                              className="w-4 h-4 rounded border-white/20 text-cyan-500"
                            />
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-xs font-bold">
                              {student.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{student.name}</div>
                              <div className="text-xs text-slate-400">{student.email}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">2</div>
                    Select Modules
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules.map((module) => (
                      <label
                        key={module.id}
                        className={`relative cursor-pointer transition-all ${
                          selectedModules.includes(module.id) ? 'ring-2 ring-cyan-500' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedModules.includes(module.id)}
                          onChange={() => toggleModuleSelection(module.id)}
                          className="sr-only"
                        />
                        <div className={`bg-slate-800/50 border rounded-xl p-4 hover:border-cyan-400/50 transition-all ${
                          selectedModules.includes(module.id) ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10'
                        }`}>
                          <div className="flex items-start gap-3 mb-3">
                            <div className="text-3xl">{module.thumbnail}</div>
                            <div className="flex-1">
                              <h5 className="font-semibold mb-1">{module.name}</h5>
                              <p className="text-xs text-slate-400 line-clamp-2">{module.description}</p>
                            </div>
                            {selectedModules.includes(module.id) && (
                              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs">
                            <span className={`px-2 py-1 rounded-full border ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty}
                            </span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {module.duration}
                            </span>
                            <span className="text-slate-400">{module.topics} topics</span>
                          </div>

                          {module.prerequisites.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/5">
                              <span className="text-xs text-orange-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Requires: {module.prerequisites.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-slate-400">
                    {selectedModules.length} module(s) selected
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">3</div>
                    Set Parameters
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400/50"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400/50"
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors">
                      <div>
                        <div className="font-medium">Lock Prerequisites</div>
                        <div className="text-sm text-slate-400">Students must complete prerequisite modules first</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={lockPrerequisites}
                        onChange={(e) => setLockPrerequisites(e.target.checked)}
                        className="w-5 h-5 rounded border-white/20 text-cyan-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors">
                      <div>
                        <div className="font-medium">Require Quiz Completion</div>
                        <div className="text-sm text-slate-400">Students must pass the quiz to complete the module</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={requireQuiz}
                        onChange={(e) => setRequireQuiz(e.target.checked)}
                        className="w-5 h-5 rounded border-white/20 text-cyan-500"
                      />
                    </label>

                    {requireQuiz && (
                      <div className="ml-4 p-4 bg-slate-800/30 rounded-lg">
                        <label className="block text-sm font-medium mb-2">Passing Score Threshold</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="50"
                            max="100"
                            defaultValue="70"
                            className="flex-1"
                          />
                          <span className="text-lg font-bold text-cyan-400 min-w-16">70%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">4</div>
                    Add Instructions (Optional)
                  </h4>

                  <textarea
                    placeholder="Add custom instructions or guidelines for students..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400/50 resize-none"
                  ></textarea>

                  <button className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Attach Resources
                  </button>
                </div>
              </div>

              <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-6 flex items-center justify-between">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-slate-800/50 border border-white/10 rounded-lg hover:border-cyan-400/50 transition-all flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save as Draft
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25">
                    <Send className="w-4 h-4" />
                    Assign Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}