import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, LogOut } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

type NavKey = 'dashboard' | 'modules' | 'quiz' | 'analytics' | 'students' | 'none';

export interface NavItemConfig {
  key: NavKey;
  label: string;
  path: string;
}

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbLabel: string;
  activeNav?: NavKey;
  /** Student: go to studentdashboard. Instructor: go to instructordashboard. */
  userType?: 'student' | 'instructor' | 'admin';
  /** Override default nav items (e.g. for instructor: Dashboard, Students, Modules, Analytics) */
  navItems?: NavItemConfig[];
  children: React.ReactNode;
  /** Optional right-side header content (e.g. user menu, actions) */
  headerRight?: React.ReactNode;
}

export function PageLayout({
  title,
  subtitle,
  breadcrumbLabel,
  activeNav = 'none',
  userType = 'student',
  navItems: navItemsProp,
  children,
  headerRight,
}: PageLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // still redirect on network error so user can log in again
    }
    navigate('/login');
  };

  const dashboardPath =
    userType === 'instructor'
      ? '/instructordashboard'
      : userType === 'admin'
        ? '/admindashboard'
        : '/studentdashboard';

  const defaultNav: NavItemConfig[] = [
    { key: 'dashboard', label: 'Dashboard', path: dashboardPath },
    { key: 'modules', label: 'Modules', path: '/modules' },
    { key: 'quiz', label: 'Quiz', path: '/quizselection' },
    ...(userType === 'student' ? [{ key: 'analytics' as const, label: 'Analytics', path: '/studentanalytics' }] : []),
  ];
  const navItems = navItemsProp ?? defaultNav;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-lg font-semibold text-white">VRMTS</h1>
              <nav className="hidden md:flex gap-5 text-sm">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.path)}
                    className={
                      activeNav === item.key
                        ? 'text-slate-200'
                        : 'text-slate-400 hover:text-white transition-colors'
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {headerRight}
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Home
                  className="w-4 h-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => navigate(dashboardPath)}
                  aria-label="Dashboard"
                />
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-300">{breadcrumbLabel}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {subtitle && (
              <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
