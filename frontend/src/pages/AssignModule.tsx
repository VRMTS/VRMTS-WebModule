import React, { useState } from 'react';
import { BookOpen, Users, Calendar, Clock, Target, ChevronRight, Plus, Save, Send, X, CheckCircle, Lock, Award, FileText, AlertCircle, Search, Filter, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

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
      'Beginner': 'bg-neutral-950 text-emerald-500 border-emerald-500/20',
      'Intermediate': 'bg-neutral-950 text-cyan-400 border-cyan-500/20',
      'Advanced': 'bg-neutral-950 text-purple-400 border-purple-500/20'
    };
    return colors[difficulty] || colors['Intermediate'];
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-neutral-950 text-cyan-400 border-cyan-500/20',
      'completed': 'bg-neutral-950 text-emerald-500 border-emerald-500/20',
      'overdue': 'bg-neutral-950 text-rose-500 border-rose-500/20'
    };
    return colors[status] || colors['active'];
  };

  return (
    <PageLayout
      title="Module Assignment"
      subtitle="Assign learning modules to students and track progress"
      breadcrumbLabel="Modules"
      activeNav="modules"
      userType="instructor"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-3 text-white tracking-tight uppercase">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            Module List
          </h2>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Assignments', value: activeAssignments.filter(a => a.status === 'active').length, icon: BookOpen, color: 'text-cyan-500' },
            { label: 'Completed', value: activeAssignments.filter(a => a.status === 'completed').length, icon: CheckCircle, color: 'text-emerald-500' },
            { label: 'Students Enrolled', value: 156, icon: Users, color: 'text-purple-500' },
            { label: 'Avg Completion', value: '73%', icon: Target, color: 'text-yellow-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Active Assignments</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-all flex items-center gap-2">
                <Filter className="w-3 h-3" />
                Filter
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {activeAssignments.map((assignment) => (
              <div 
                key={assignment.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-sm font-bold text-white tracking-tight">{assignment.modules.join(' + ')}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 font-medium mb-3">Assigned to: <span className="text-neutral-300">{assignment.assignedTo}</span></p>
                    
                    <div className="flex items-center gap-6 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {assignment.studentCount} students
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      {assignment.requiresQuiz && (
                        <span className="flex items-center gap-2 text-cyan-500">
                          <Target className="w-3 h-3" />
                          Quiz Required ({assignment.passingScore}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-neutral-800 rounded transition-colors text-neutral-600 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-neutral-800 rounded transition-colors text-neutral-600 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-neutral-800 rounded transition-colors text-neutral-600 hover:text-white">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-neutral-800 rounded transition-colors text-rose-500/60 hover:text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-1.5">
                    <span>Completion Progress</span>
                    <span>{assignment.completed}/{assignment.studentCount} ({Math.round((assignment.completed / assignment.studentCount) * 100)}%)</span>
                  </div>
                  <div className="h-1 bg-neutral-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500"
                      style={{ width: `${(assignment.completed / assignment.studentCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showCreateModal && (
          <div className="fixed inset-0 bg-neutral-950/80 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight uppercase">Create New Assignment</h3>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1">Assign modules to students with custom settings</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="p-8 space-y-10">
                <div>
                  <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4 flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">01</span>
                    Select Recipients
                  </h4>
                  
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setAssignmentType('class')}
                      className={`flex-1 py-4 px-4 rounded border transition-all flex flex-col items-center gap-2 ${
                        assignmentType === 'class'
                          ? 'bg-neutral-950 border-emerald-500/50 text-emerald-500'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-600 hover:border-neutral-700'
                      }`}
                    >
                      <Users className="w-5 h-5" />
                      <div className="text-[10px] font-bold uppercase tracking-widest">Entire Class</div>
                    </button>
                    <button
                      onClick={() => setAssignmentType('individual')}
                      className={`flex-1 py-4 px-4 rounded border transition-all flex flex-col items-center gap-2 ${
                        assignmentType === 'individual'
                          ? 'bg-neutral-950 border-emerald-500/50 text-emerald-500'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-600 hover:border-neutral-700'
                      }`}
                    >
                      <Target className="w-5 h-5" />
                      <div className="text-[10px] font-bold uppercase tracking-widest">Individual Students</div>
                    </button>
                  </div>

                  {assignmentType === 'class' ? (
                    <select className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-400 focus:outline-none focus:border-neutral-700">
                      <option>Medical Batch 2024 (156 students)</option>
                      <option>Medical Batch 2023 (142 students)</option>
                      <option>Nursing Program A (89 students)</option>
                    </select>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{selectedStudents.length} students selected</span>
                        <button 
                          onClick={() => setSelectedStudents(students.map(s => s.id))}
                          className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest"
                        >
                          Select All
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-2 bg-neutral-950 border border-neutral-800 rounded-lg p-3">
                        {students.map((student) => (
                          <label 
                            key={student.id}
                            className={`flex items-center gap-3 p-3 rounded border transition-all cursor-pointer ${
                              selectedStudents.includes(student.id) ? 'bg-neutral-900 border-neutral-700' : 'bg-neutral-950 border-transparent hover:bg-neutral-900'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => toggleStudentSelection(student.id)}
                              className="sr-only"
                            />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              selectedStudents.includes(student.id) ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-500'
                            }`}>
                              {student.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="text-[10px] font-bold text-white uppercase tracking-widest">{student.name}</div>
                              <div className="text-[9px] text-neutral-600 font-medium">{student.email}</div>
                            </div>
                            {selectedStudents.includes(student.id) && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4 flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">02</span>
                    Select Modules
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules.map((module) => (
                      <label
                        key={module.id}
                        className={`relative cursor-pointer transition-all ${
                          selectedModules.includes(module.id) ? 'ring-1 ring-emerald-500 rounded-lg' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedModules.includes(module.id)}
                          onChange={() => toggleModuleSelection(module.id)}
                          className="sr-only"
                        />
                        <div className={`bg-neutral-950 border rounded-lg p-4 hover:border-neutral-700 transition-all ${
                          selectedModules.includes(module.id) ? 'border-emerald-500/50 bg-neutral-900' : 'border-neutral-800'
                        }`}>
                          <div className="flex items-start gap-4 mb-4">
                            <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{module.thumbnail}</div>
                            <div className="flex-1">
                              <h5 className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">{module.name}</h5>
                              <p className="text-[10px] text-neutral-500 font-medium line-clamp-2">{module.description}</p>
                            </div>
                            {selectedModules.includes(module.id) && (
                              <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-neutral-950" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-tight">
                            <span className={`px-2 py-0.5 rounded border ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty}
                            </span>
                            <span className="text-neutral-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {module.duration}
                            </span>
                            <span className="text-neutral-600">{module.topics} topics</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">03</span>
                    Parameters
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-bold text-white uppercase tracking-widest mb-3">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-400 focus:outline-none focus:border-neutral-700"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white uppercase tracking-widest mb-3">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-400 focus:outline-none focus:border-neutral-700"
                      />
                    </div>
                  </div>

                  <div className="mt-10 space-y-3">
                    <label className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded hover:border-neutral-700 cursor-pointer transition-all group">
                      <div>
                        <div className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Lock Prerequisites</div>
                        <div className="text-[9px] text-neutral-600 font-medium">Students must complete prerequisite modules sequentially</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={lockPrerequisites}
                        onChange={(e) => setLockPrerequisites(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded hover:border-neutral-700 cursor-pointer transition-all group">
                      <div>
                        <div className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Require Quiz Completion</div>
                        <div className="text-[9px] text-neutral-600 font-medium">Validation assessment required to finalize module</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={requireQuiz}
                        onChange={(e) => setRequireQuiz(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    {requireQuiz && (
                      <div className="ml-6 p-6 bg-neutral-900 border-l border-emerald-500/20 rounded-r">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Passing Score Threshold</label>
                        <div className="flex items-center gap-6">
                          <input
                            type="range"
                            min="50"
                            max="100"
                            defaultValue="70"
                            className="flex-1 accent-emerald-500 h-1.5 bg-neutral-950 rounded-full appearance-none cursor-pointer"
                          />
                          <span className="text-lg font-bold text-emerald-500 min-w-16">70%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4 flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">04</span>
                    Instructions
                  </h4>

                  <textarea
                    placeholder="ENTER GUIDELINES OR CUSTOM INSTRUCTIONS..."
                    rows={4}
                    className="w-full px-4 py-4 bg-neutral-950 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-400 focus:outline-none focus:border-neutral-700 resize-none"
                  ></textarea>

                  <button className="mt-4 text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Attach Supplementary Resources
                  </button>
                </div>
              </div>

              <div className="sticky bottom-0 bg-neutral-950 border-t border-neutral-800 p-8 flex items-center justify-between">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-8 py-3 bg-neutral-900 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-neutral-900 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-all flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Draft
                  </button>
                  <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                    <Send className="w-4 h-4" />
                    Assign Module
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </PageLayout>
  );
}