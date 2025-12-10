import React, { useState } from 'react';
import { Users, Search, Filter, Download, Upload, Mail, MoreVertical, TrendingUp, TrendingDown, Clock, Target, BookOpen, Award, AlertTriangle, CheckCircle, XCircle, Eye, Edit, Trash2, Send, X, Calendar, BarChart3, Activity, MessageSquare } from 'lucide-react';

interface Activity {
  type: 'quiz' | 'study';
  module: string;
  score?: number;
  duration?: string;
  date: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  avatar: string;
  enrolled: string;
  modulesCompleted: number;
  totalModules: number;
  avgScore: number;
  lastActive: string;
  status: 'excellent' | 'good' | 'average' | 'at-risk';
  trend: 'up' | 'down' | 'neutral';
  studyTime: string;
  quizzesTaken: number;
  achievements: number;
  weakAreas: string[];
  recentActivity: Activity[];
}

export default function VRMTSStudentManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Student['status']>('all');

  const students: Student[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@university.edu',
      avatar: 'SJ',
      enrolled: 'Aug 2024',
      modulesCompleted: 8,
      totalModules: 12,
      avgScore: 94,
      lastActive: '2 hours ago',
      status: 'excellent',
      trend: 'up',
      studyTime: '48.5h',
      quizzesTaken: 24,
      achievements: 12,
      weakAreas: ['None identified'],
      recentActivity: [
        { type: 'quiz', module: 'Cardiovascular', score: 96, date: '2 hours ago' },
        { type: 'study', module: 'Nervous System', duration: '2.5h', date: '1 day ago' }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@university.edu',
      avatar: 'MC',
      enrolled: 'Aug 2024',
      modulesCompleted: 5,
      totalModules: 12,
      avgScore: 62,
      lastActive: '2 days ago',
      status: 'at-risk',
      trend: 'down',
      studyTime: '18.2h',
      quizzesTaken: 12,
      achievements: 4,
      weakAreas: ['Muscular System', 'Cardiovascular System'],
      recentActivity: [
        { type: 'quiz', module: 'Muscular System', score: 45, date: '2 days ago' },
        { type: 'study', module: 'Skeletal System', duration: '1h', date: '3 days ago' }
      ]
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.d@university.edu',
      avatar: 'ED',
      enrolled: 'Aug 2024',
      modulesCompleted: 7,
      totalModules: 12,
      avgScore: 88,
      lastActive: '5 hours ago',
      status: 'good',
      trend: 'up',
      studyTime: '42.3h',
      quizzesTaken: 21,
      achievements: 9,
      weakAreas: ['Respiratory System'],
      recentActivity: [
        { type: 'quiz', module: 'Skeletal System', score: 91, date: '5 hours ago' },
        { type: 'study', module: 'Respiratory System', duration: '3h', date: '1 day ago' }
      ]
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.w@university.edu',
      avatar: 'JW',
      enrolled: 'Aug 2024',
      modulesCompleted: 4,
      totalModules: 12,
      avgScore: 58,
      lastActive: '5 days ago',
      status: 'at-risk',
      trend: 'down',
      studyTime: '15.7h',
      quizzesTaken: 9,
      achievements: 3,
      weakAreas: ['Cardiovascular System', 'Nervous System', 'Muscular System'],
      recentActivity: [
        { type: 'quiz', module: 'Cardiovascular', score: 42, date: '5 days ago' },
        { type: 'study', module: 'Nervous System', duration: '45m', date: '1 week ago' }
      ]
    },
    {
      id: 5,
      name: 'Olivia Brown',
      email: 'olivia.b@university.edu',
      avatar: 'OB',
      enrolled: 'Aug 2024',
      modulesCompleted: 7,
      totalModules: 12,
      avgScore: 91,
      lastActive: '1 hour ago',
      status: 'excellent',
      trend: 'up',
      studyTime: '45.8h',
      quizzesTaken: 22,
      achievements: 11,
      weakAreas: ['None identified'],
      recentActivity: [
        { type: 'quiz', module: 'Respiratory System', score: 94, date: '1 hour ago' },
        { type: 'study', module: 'Digestive System', duration: '2h', date: '6 hours ago' }
      ]
    },
    {
      id: 6,
      name: 'Sophia Lee',
      email: 'sophia.l@university.edu',
      avatar: 'SL',
      enrolled: 'Aug 2024',
      modulesCompleted: 8,
      totalModules: 12,
      avgScore: 89,
      lastActive: '3 hours ago',
      status: 'good',
      trend: 'up',
      studyTime: '51.2h',
      quizzesTaken: 25,
      achievements: 10,
      weakAreas: ['Muscular System'],
      recentActivity: [
        { type: 'quiz', module: 'Nervous System', score: 87, date: '3 hours ago' },
        { type: 'study', module: 'Cardiovascular', duration: '3.5h', date: '1 day ago' }
      ]
    },
    {
      id: 7,
      name: 'Liam Martinez',
      email: 'liam.m@university.edu',
      avatar: 'LM',
      enrolled: 'Aug 2024',
      modulesCompleted: 6,
      totalModules: 12,
      avgScore: 75,
      lastActive: '1 day ago',
      status: 'average',
      trend: 'neutral',
      studyTime: '32.4h',
      quizzesTaken: 18,
      achievements: 7,
      weakAreas: ['Nervous System', 'Respiratory System'],
      recentActivity: [
        { type: 'quiz', module: 'Skeletal System', score: 78, date: '1 day ago' },
        { type: 'study', module: 'Muscular System', duration: '2h', date: '2 days ago' }
      ]
    },
    {
      id: 8,
      name: 'Ava Thompson',
      email: 'ava.t@university.edu',
      avatar: 'AT',
      enrolled: 'Aug 2024',
      modulesCompleted: 6,
      totalModules: 12,
      avgScore: 83,
      lastActive: '4 hours ago',
      status: 'good',
      trend: 'up',
      studyTime: '38.9h',
      quizzesTaken: 19,
      achievements: 8,
      weakAreas: ['Cardiovascular System'],
      recentActivity: [
        { type: 'quiz', module: 'Respiratory System', score: 85, date: '4 hours ago' },
        { type: 'study', module: 'Cardiovascular', duration: '2.5h', date: '1 day ago' }
      ]
    }
  ];

  const getStatusColor = (status: Student['status']): string => {
    const colors: Record<Student['status'], string> = {
      'excellent': 'from-emerald-500 to-green-500',
      'good': 'from-cyan-500 to-teal-500',
      'average': 'from-yellow-500 to-orange-500',
      'at-risk': 'from-red-500 to-orange-500'
    };
    return colors[status];
  };

  const getStatusBadge = (status: Student['status']): string => {
    const badges: Record<Student['status'], string> = {
      'excellent': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'good': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'average': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'at-risk': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return badges[status];
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">
              <span className="text-white">VRMTS</span>
            </h1>
            <nav className="hidden md:flex gap-6">
              <button className="text-slate-400 hover:text-white transition-colors">Dashboard</button>
              <button className="text-cyan-400 font-medium">Students</button>
              <button className="text-slate-400 hover:text-white transition-colors">Modules</button>
              <button className="text-slate-400 hover:text-white transition-colors">Analytics</button>
            </nav>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center font-bold">
            DR
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-cyan-400" />
              Student Management
            </h2>
            <p className="text-slate-400">Manage and monitor student progress</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg hover:border-cyan-400/50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg hover:border-cyan-400/50 transition-all flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email All
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                const statusOptions = ['all', 'excellent', 'good', 'average', 'at-risk'] as const;
                const value = e.target.value;
                if (statusOptions.includes(value as typeof statusOptions[number])) {
                  setFilterStatus(value as typeof statusOptions[number]);
                }
              }}
              className="px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400/50"
            >
              <option value="all">All Status</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM11 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM11 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold mb-1">{students.length}</div>
            <div className="text-sm text-slate-400">Total Students</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {students.filter(s => s.status === 'excellent' || s.status === 'good').length}
            </div>
            <div className="text-sm text-slate-400">Performing Well</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {students.filter(s => s.status === 'at-risk').length}
            </div>
            <div className="text-sm text-slate-400">At Risk</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-cyan-400 mb-1">78%</div>
            <div className="text-sm text-slate-400">Avg Class Score</div>
          </div>
        </div>

        {/* Students Grid/Table View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-cyan-400/50 transition-all cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getStatusColor(student.status)} flex items-center justify-center font-bold`}>
                      {student.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{student.name}</h4>
                      <p className="text-xs text-slate-400">{student.email}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-white/5 rounded transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusBadge(student.status)}`}>
                      {student.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Average Score</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{student.avgScore}%</span>
                      {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                      {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{student.modulesCompleted}/{student.totalModules} modules</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getStatusColor(student.status)}`}
                        style={{ width: `${(student.modulesCompleted / student.totalModules) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {student.lastActive}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {student.achievements} badges
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                  <button className="flex-1 py-2 px-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button className="flex-1 py-2 px-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
                    <Send className="w-3 h-3" />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">Student</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">Avg Score</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">Progress</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">Study Time</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">Last Active</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getStatusColor(student.status)} flex items-center justify-center font-bold text-sm`}>
                            {student.avatar}
                          </div>
                          <div>
                            <div className="font-semibold">{student.name}</div>
                            <div className="text-xs text-slate-400">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs border ${getStatusBadge(student.status)}`}>
                          {student.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{student.avgScore}%</span>
                          {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                          {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-32">
                          <div className="text-xs text-slate-400 mb-1">
                            {student.modulesCompleted}/{student.totalModules}
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${getStatusColor(student.status)}`}
                              style={{ width: `${(student.modulesCompleted / student.totalModules) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{student.studyTime}</td>
                      <td className="p-4 text-sm text-slate-400">{student.lastActive}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-cyan-400" />
                          </button>
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <Send className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getStatusColor(selectedStudent.status)} flex items-center justify-center font-bold text-xl`}>
                    {selectedStudent.avatar}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                    <p className="text-slate-400">{selectedStudent.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-cyan-400 mb-2">
                      <Target className="w-5 h-5" />
                      <span className="text-xs">Avg Score</span>
                    </div>
                    <div className="text-2xl font-bold">{selectedStudent.avgScore}%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-xs">Modules</span>
                    </div>
                    <div className="text-2xl font-bold">{selectedStudent.modulesCompleted}/{selectedStudent.totalModules}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-xs">Study Time</span>
                    </div>
                    <div className="text-2xl font-bold">{selectedStudent.studyTime}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <Award className="w-5 h-5" />
                      <span className="text-xs">Achievements</span>
                    </div>
                    <div className="text-2xl font-bold">{selectedStudent.achievements}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/30 rounded-xl p-5">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      Recent Activity
                    </h4>
                    <div className="space-y-3">
                      {selectedStudent.recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex gap-3 pb-3 border-b border-white/5 last:border-0">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            {activity.type === 'quiz' ? <Target className="w-4 h-4 text-cyan-400" /> : <BookOpen className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.type === 'quiz' ? 'Quiz' : 'Study Session'}</p>
                            <p className="text-xs text-slate-400">{activity.module}</p>
                            {activity.score && <p className="text-xs text-emerald-400 font-medium">Score: {activity.score}%</p>}
                            {activity.duration && <p className="text-xs text-slate-400">{activity.duration}</p>}
                            <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-5">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      Areas Needing Attention
                    </h4>
                    <div className="space-y-2">
                      {selectedStudent.weakAreas.map((area, idx) => (
                        <div key={idx} className={`p-3 rounded-lg ${area === 'None identified' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
                          <p className={`text-sm ${area === 'None identified' ? 'text-emerald-400' : 'text-orange-400'}`}>{area}</p>
                        </div>
                      ))}
                    </div>
                    {selectedStudent.weakAreas[0] !== 'None identified' && (
                      <button className="mt-4 w-full py-2 px-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-sm font-medium transition-all">
                        Assign Remedial Modules
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-xl p-5">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Performance Overview
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Quiz Performance</span>
                        <span className="font-semibold">{selectedStudent.avgScore}%</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getStatusColor(selectedStudent.status)}`}
                          style={{ width: `${selectedStudent.avgScore}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Module Completion</span>
                        <span className="font-semibold">{Math.round((selectedStudent.modulesCompleted / selectedStudent.totalModules) * 100)}%</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                          style={{ width: `${(selectedStudent.modulesCompleted / selectedStudent.totalModules) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                  <button className="flex-1 py-3 px-4 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    View Full Analytics
                  </button>
                  <button className="py-3 px-4 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-lg transition-all">
                    <Edit className="w-4 h-4" />
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