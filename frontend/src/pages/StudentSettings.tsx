import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Shield, Bell, Globe, Monitor, Sun, Moon, Eye, Lock, Key, Smartphone, Clock, Save, Camera, AlertCircle, Check } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [timeZone, setTimeZone] = useState('UTC+05:00 Pakistan Standard Time');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [defaultView, setDefaultView] = useState('Grid View');
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
    <PageLayout
      title="Settings"
      subtitle="Manage your account and preferences"
      breadcrumbLabel="Settings"
      userType="student"
      headerRight={
        <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium text-slate-200">
          {userData.firstName[0]}{userData.lastName[0]}
        </div>
      }
    >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-slate-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-slate-400" />
                  Account information
                </h3>

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
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
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
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
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
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
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
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
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
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
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
                      className="w-full px-3 py-2.5 bg-slate-800/40 border border-white/10 rounded-lg text-slate-500 cursor-not-allowed text-sm"
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
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
                  <Monitor className="w-5 h-5 text-slate-400" />
                  Preferences
                </h3>

                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium mb-4 text-slate-300">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-lg border transition-colors ${
                        theme === 'light' ? 'border-slate-500 bg-slate-700/80 text-white' : 'border-white/10 hover:border-slate-600 text-slate-400'
                      }`}
                    >
                      <Sun className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                      <div className="font-medium text-sm">Light</div>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-lg border transition-colors ${
                        theme === 'dark' ? 'border-slate-500 bg-slate-700/80 text-white' : 'border-white/10 hover:border-slate-600 text-slate-400'
                      }`}
                    >
                      <Moon className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                      <div className="font-medium text-sm">Dark</div>
                    </button>
                    <button
                      onClick={() => setTheme('auto')}
                      className={`p-4 rounded-lg border transition-colors ${
                        theme === 'auto' ? 'border-slate-500 bg-slate-700/80 text-white' : 'border-white/10 hover:border-slate-600 text-slate-400'
                      }`}
                    >
                      <Monitor className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                      <div className="font-medium text-sm">Auto</div>
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
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
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
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
                  >
                    <option value="UTC-08:00 Pacific Time">UTC-08:00 Pacific Time</option>
                    <option value="UTC-05:00 Eastern Time">UTC-05:00 Eastern Time</option>
                    <option value="UTC+00:00 GMT">UTC+00:00 GMT</option>
                    <option value="UTC+01:00 Central European Time">UTC+01:00 Central European Time</option>
                    <option value="UTC+05:00 Pakistan Standard Time">UTC+05:00 Pakistan Standard Time</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                {/* Default View */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300">
                    Default Dashboard View
                  </label>
                  <select
                    value={defaultView}
                    onChange={(e) => setDefaultView(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
                  >
                    <option value="Grid View">Grid View</option>
                    <option value="List View">List View</option>
                  </select>
                </div>
              </div>
            </div>
            )}

            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-slate-400" />
                  Accessibility
                </h3>

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
                      className="flex-1 accent-slate-500"
                    />
                    <span className="text-xl text-slate-400">A</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Adjust the size of text across the platform</p>
                </div>

                {/* High Contrast Mode */}
                <div className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">High Contrast Mode</h4>
                    <p className="text-sm text-slate-400">Increase contrast for better visibility</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                  </label>
                </div>

                {/* Reduce Motion */}
                <div className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Reduce Motion</h4>
                    <p className="text-sm text-slate-400">Minimize animations and transitions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                  </label>
                </div>

                {/* Screen Reader */}
                <div className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Screen Reader Optimization</h4>
                    <p className="text-sm text-slate-400">Enhanced compatibility with screen readers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                  </label>
                </div>

                {/* Keyboard Navigation */}
                <div className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Enhanced Keyboard Navigation</h4>
                    <p className="text-sm text-slate-400">Show keyboard shortcuts and focus indicators</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                  </label>
                </div>

                {/* Captions */}
                <div className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Auto-Enable Captions</h4>
                    <p className="text-sm text-slate-400">Show captions for video content by default</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-slate-400" />
                  Notifications
                </h3>

                {/* Email Notifications */}
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Email Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg border border-white/10">
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
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg border border-white/10">
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
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg border border-white/10">
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
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg border border-white/10">
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
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
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
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
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
                    <Smartphone className="w-5 h-5 text-slate-400" />
                    Push Notifications
                  </h4>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
                    <p className="text-sm text-slate-400 mb-4">Enable browser notifications to get instant updates</p>
                    <button type="button" className="px-4 py-2.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors">
                      Enable push notifications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-slate-400" />
                  Security
                </h3>

                {/* Change Password */}
                <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-slate-400" />
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
                        className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
                      />
                    </div>
                    <button className="w-full py-3 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors transition-all">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10">
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
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-700/80 border border-white/10 flex items-center justify-center">
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

                    <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-700/80 border border-white/10 flex items-center justify-center">
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

                    <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-700/80 border border-white/10 flex items-center justify-center">
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
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <div>
                          <p className="text-sm font-medium">Password changed successfully</p>
                          <p className="text-xs text-slate-400">October 15, 2025 at 2:30 PM</p>
                        </div>
                      </div>
                      <AlertCircle className="w-5 h-5 text-slate-500" />
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        <div>
                          <p className="text-sm font-medium">Login from new device</p>
                          <p className="text-xs text-slate-400">October 12, 2025 at 9:15 AM</p>
                        </div>
                      </div>
                      <AlertCircle className="w-5 h-5 text-slate-500" />
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-lg border border-white/10 flex items-center justify-between">
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
                <div className="p-4 bg-slate-800/50 border border-white/10 rounded-lg">
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
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-end gap-3">
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save changes
              </button>
            </div>
          </div>
        </div>
    </PageLayout>
  );
}
