import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Shield, Bell, Globe, Monitor, Sun, Moon, Eye, Lock, Key, Smartphone, Clock, Save, Camera, ChevronLeft, AlertCircle, Check } from 'lucide-react';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    assignments: true,
    quizDeadlines: true,
    performance: true,
    announcements: false,
    emailDigest: 'weekly'
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567',
    institution: 'Medical University',
    studentId: '22i-1239',
    bio: ''
  });

  // Load user settings on component mount
  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/settings', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(prev => ({ ...prev, ...data.account }));
        if (data.preferences) {
          setTheme(data.preferences.theme || 'dark');
          setLanguage(data.preferences.language || 'en');
        }
        if (data.notifications) {
          setNotifications(prev => ({ ...prev, ...data.notifications }));
        }
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const promises = [];

      // Save account info
      if (activeTab === 'account') {
        promises.push(
          fetch('http://localhost:8080/api/user/account', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
          })
        );
      }

      // Save preferences
      if (activeTab === 'preferences') {
        promises.push(
          fetch('http://localhost:8080/api/user/preferences', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              theme,
              language,
              timeZone: 'UTC+05:00 Pakistan Standard Time',
              dateFormat: 'MM/DD/YYYY',
              defaultView: 'Grid View'
            })
          })
        );
      }

      // Save notifications
      if (activeTab === 'notifications') {
        promises.push(
          fetch('http://localhost:8080/api/user/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(notifications)
          })
        );
      }

      // Save accessibility (simplified - you can expand this)
      if (activeTab === 'accessibility') {
        promises.push(
          fetch('http://localhost:8080/api/user/accessibility', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              textSize: 16,
              highContrast: false,
              reduceMotion: false,
              screenReader: false,
              keyboardNav: true,
              captions: false
            })
          })
        );
      }

      await Promise.all(promises);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account Info', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">
              <span className="text-white">VRMTS</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center font-bold">
              {userData.firstName[0]}{userData.lastName[0]}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Profile & Settings</h2>
          <p className="text-slate-400">Manage your account and customize your experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 text-cyan-400'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <User className="w-7 h-7 text-cyan-400" />
                    Account Information
                  </h3>
                </div>

                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userData.firstName || ''}
                      onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userData.lastName || ''}
                      onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userData.email || ''}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userData.phone || ''}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      Institution
                    </label>
                    <input
                      type="text"
                      value={userData.institution || ''}
                      onChange={(e) => setUserData({...userData, institution: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={userData.studentId || ''}
                      disabled
                      className="w-full px-4 py-3 bg-slate-800/30 border border-white/5 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={userData.bio || ''}
                    onChange={(e) => setUserData({...userData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Monitor className="w-7 h-7 text-cyan-400" />
                    Preferences
                  </h3>
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium mb-4 text-slate-300">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        theme === 'light'
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Sun className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                      <div className="font-medium">Light</div>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Moon className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                      <div className="font-medium">Dark</div>
                    </button>
                    <button
                      onClick={() => setTheme('auto')}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        theme === 'auto'
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Monitor className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                      <div className="font-medium">Auto</div>
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>

                {/* Time Zone */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Time Zone
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors">
                    <option>UTC-08:00 Pacific Time</option>
                    <option>UTC-05:00 Eastern Time</option>
                    <option>UTC+00:00 GMT</option>
                    <option>UTC+01:00 Central European Time</option>
                    <option>UTC+05:00 Pakistan Standard Time</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Date Format
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                {/* Default View */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Default Dashboard View
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors">
                    <option>Grid View</option>
                    <option>List View</option>
                    <option>Compact View</option>
                  </select>
                </div>
              </div>
            )}

            {/* Accessibility Tab */}
            {activeTab === 'accessibility' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Eye className="w-7 h-7 text-cyan-400" />
                    Accessibility
                  </h3>
                </div>

                {/* Text Size */}
                <div>
                  <label className="block text-sm font-medium mb-4 text-slate-300">
                    Text Size
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">A</span>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      value={16}
                      className="flex-1 accent-cyan-500"
                    />
                    <span className="text-xl text-slate-400">A</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Adjust the size of text across the platform</p>
                </div>

                {/* High Contrast Mode */}
                <div className="flex items-start justify-between p-6 bg-slate-800/30 rounded-xl border border-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">High Contrast Mode</h4>
                    <p className="text-sm text-slate-400">Increase contrast for better visibility</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                  </label>
                </div>

                {/* Reduce Motion */}
                <div className="flex items-start justify-between p-6 bg-slate-800/30 rounded-xl border border-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Reduce Motion</h4>
                    <p className="text-sm text-slate-400">Minimize animations and transitions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                  </label>
                </div>

                {/* Screen Reader */}
                <div className="flex items-start justify-between p-6 bg-slate-800/30 rounded-xl border border-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Screen Reader Optimization</h4>
                    <p className="text-sm text-slate-400">Enhanced compatibility with screen readers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                  </label>
                </div>

                {/* Keyboard Navigation */}
                <div className="flex items-start justify-between p-6 bg-slate-800/30 rounded-xl border border-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Enhanced Keyboard Navigation</h4>
                    <p className="text-sm text-slate-400">Show keyboard shortcuts and focus indicators</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                  </label>
                </div>

                {/* Captions */}
                <div className="flex items-start justify-between p-6 bg-slate-800/30 rounded-xl border border-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Auto-Enable Captions</h4>
                    <p className="text-sm text-slate-400">Show captions for video content by default</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Bell className="w-7 h-7 text-cyan-400" />
                    Notifications
                  </h3>
                </div>

                {/* Email Notifications */}
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Email Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-6 bg-slate-800/30 rounded-xl border border-white/5">
                      <div className="flex-1">
                        <h5 className="font-medium mb-1">Assignment Notifications</h5>
                        <p className="text-sm text-slate-400">Get notified when new modules are assigned</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.assignments}
                          onChange={(e) => setNotifications({...notifications, assignments: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between p-6 bg-slate-800/30 rounded-xl border border-white/5">
                      <div className="flex-1">
                        <h5 className="font-medium mb-1">Quiz Deadlines</h5>
                        <p className="text-sm text-slate-400">Reminders about upcoming quiz deadlines</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.quizDeadlines}
                          onChange={(e) => setNotifications({...notifications, quizDeadlines: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between p-6 bg-slate-800/30 rounded-xl border border-white/5">
                      <div className="flex-1">
                        <h5 className="font-medium mb-1">Performance Reports</h5>
                        <p className="text-sm text-slate-400">Weekly summary of your progress and performance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.performance}
                          onChange={(e) => setNotifications({...notifications, performance: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between p-6 bg-slate-800/30 rounded-xl border border-white/5">
                      <div className="flex-1">
                        <h5 className="font-medium mb-1">System Announcements</h5>
                        <p className="text-sm text-slate-400">Updates about new features and system maintenance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.announcements}
                          onChange={(e) => setNotifications({...notifications, announcements: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Email Digest Frequency */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Email Digest Frequency
                  </label>
                  <select
                    value={notifications.emailDigest}
                    onChange={(e) => setNotifications({...notifications, emailDigest: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                  >
                    <option value="realtime">Real-time (as they happen)</option>
                    <option value="daily">Daily digest</option>
                    <option value="weekly">Weekly digest</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                {/* Push Notifications */}
                <div>
                  <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                    Push Notifications
                  </h4>
                  <div className="p-6 bg-slate-800/30 rounded-xl border border-white/5">
                    <p className="text-sm text-slate-400 mb-4">Enable browser notifications to get instant updates</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all">
                      Enable Push Notifications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Shield className="w-7 h-7 text-cyan-400" />
                    Security
                  </h3>
                </div>

                {/* Change Password */}
                <div className="p-6 bg-slate-800/30 rounded-xl border border-white/5">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-cyan-400" />
                    Change Password
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="p-6 bg-slate-800/30 rounded-xl border border-white/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Key className="w-5 h-5 text-cyan-400" />
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-700 text-slate-400 text-xs rounded-full">Disabled</span>
                  </div>
                  <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors">
                    Enable Two-Factor Authentication
                  </button>
                </div>

                {/* Active Sessions */}
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-white/5 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center">
                          <Monitor className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <h5 className="font-medium flex items-center gap-2">
                            Chrome on Windows
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Current</span>
                          </h5>
                          <p className="text-sm text-slate-400">Islamabad, Pakistan • Last active: Now</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-xl border border-white/5 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h5 className="font-medium">Safari on iPhone</h5>
                          <p className="text-sm text-slate-400">Rawalpindi, Pakistan • 2 days ago</p>
                        </div>
                      </div>
                      <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                        Revoke
                      </button>
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-xl border border-white/5 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                          <Monitor className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h5 className="font-medium">Firefox on Mac</h5>
                          <p className="text-sm text-slate-400">Islamabad, Pakistan • 5 days ago</p>
                        </div>
                      </div>
                      <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                        Revoke
                      </button>
                    </div>
                  </div>

                  <button className="mt-4 w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-medium transition-colors">
                    Log Out All Other Sessions
                  </button>
                </div>

                {/* Account Activity */}
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Recent Account Activity</h4>
                  <div className="space-y-2">
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <div>
                          <p className="text-sm font-medium">Password changed successfully</p>
                          <p className="text-xs text-slate-400">October 15, 2025 at 2:30 PM</p>
                        </div>
                      </div>
                      <AlertCircle className="w-5 h-5 text-slate-500" />
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        <div>
                          <p className="text-sm font-medium">Login from new device</p>
                          <p className="text-xs text-slate-400">October 12, 2025 at 9:15 AM</p>
                        </div>
                      </div>
                      <AlertCircle className="w-5 h-5 text-slate-500" />
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <div>
                          <p className="text-sm font-medium">Email verified</p>
                          <p className="text-xs text-slate-400">October 10, 2025 at 11:45 AM</p>
                        </div>
                      </div>
                      <AlertCircle className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <h4 className="font-semibold mb-2 text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Danger Zone
                  </h4>
                  <p className="text-sm text-slate-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg font-medium transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Save Button (Fixed at bottom) */}
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
              <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
