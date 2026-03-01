# Frontend–Backend API Connectivity

## Backend API base
- **Base URL:** `http://localhost:8080/api`
- **Auth:** Session-based (cookies, `credentials: 'include'` / `withCredentials: true`)

---

## 1. CONNECTED (frontend calls backend)

### Auth (`/api/auth`)
| API | Method | Used by | Purpose |
|-----|--------|---------|---------|
| `/api/auth/login` | POST | **Login** | Log in (email, password) |
| `/api/auth/check` | GET | **StudentDashboard**, **InstructorDashboard** | Check session, get user type/name, redirect if not authenticated |
| `/api/auth/logout` | POST | (not used in frontend grep) | Log out |

### Modules (`/api/modules`)
| API | Method | Used by | Purpose |
|-----|--------|---------|---------|
| `/api/modules` | GET | **ModulesList**, **QuizSelection** | List modules (with progress, status, etc.) |
| `/api/modules/stats` | GET | (backend exists; frontend used to use it, then removed from ModulesList) | Module stats (total, completed, in progress, avg progress) |
| `/api/modules/:moduleId/start` | POST | **ModulesList** | Start a module (then navigate to lab or module page) |

### Dashboard – Student (`/api/dashboard`)
| API | Method | Used by | Purpose |
|-----|--------|---------|---------|
| `/api/dashboard/stats` | GET | **StudentDashboard** | Stats (modules completed, average score, streak, total hours) |
| `/api/dashboard/recent-modules` | GET | **StudentDashboard** | Recent modules for “Your learning modules” |
| `/api/dashboard/recent-activity` | GET | **StudentDashboard** | Recent activity list |
| `/api/dashboard/upcoming-deadlines` | GET | **StudentDashboard** | Upcoming deadlines |

### Dashboard – Instructor (`/api/instructor`)
| API | Method | Used by | Purpose |
|-----|--------|---------|---------|
| `/api/instructor/class-stats` | GET | **InstructorDashboard** | Total students, avg performance, modules assigned, at-risk count |
| `/api/instructor/module-performance` | GET | **InstructorDashboard** | Per-module completion and scores |
| `/api/instructor/recent-submissions` | GET | **InstructorDashboard** | Recent quiz submissions |
| `/api/instructor/at-risk-students` | GET | **InstructorDashboard** | At-risk students list |
| `/api/instructor/top-performers` | GET | **InstructorDashboard** | Top performers |
| `/api/instructor/upcoming-deadlines` | GET | **InstructorDashboard** | Upcoming deadlines |

### Quiz (`/api/quiz`)
| API | Method | Used by | Purpose |
|-----|--------|---------|---------|
| `/api/quiz/modules` | GET | (backend: getQuizModules; frontend uses `/api/modules` for list) | Quiz-specific module list (QuizSelection uses `/api/modules`) |
| `/api/quiz/stats` | GET | **QuizSelection** | Quiz stats (taken, average score, pass rate, total time) |
| `/api/quiz/attempts` | GET | **QuizSelection** | Previous quiz attempts for “Previous attempts” |
| `/api/quiz/module/:moduleId/start` | POST | **QuizSelection**, **ModulesList** (for “Take quiz”) | Start a module quiz → get `attemptId` |
| `/api/quiz/timed-exam/start` | POST | **QuizSelection** | Start timed exam |
| `/api/quiz/adaptive/start` | POST | **QuizSelection** | Start adaptive test |
| `/api/quiz/attempt/:attemptId` | GET | **QuizTaking** (load), **QuizResult** | Get attempt (questions, state, results) |
| `/api/quiz/submit-answer` | POST | **QuizTaking** | Submit a single answer |
| `/api/quiz/attempt/:attemptId/finish` | POST | **QuizTaking** | Finish attempt and get results |

### User / Settings (`/api/user`)
| API | Method | Used by | Purpose |
|-----|--------|---------|---------|
| `/api/user/settings` | GET | **StudentSettings**, **InstructorSettings** | Load all user settings |
| `/api/user/account` | PUT | **StudentSettings**, **InstructorSettings** | Update account info |
| `/api/user/preferences` | PUT | **StudentSettings**, **InstructorSettings** | Update preferences (e.g. theme, language) |
| `/api/user/notifications` | PUT | **StudentSettings**, **InstructorSettings** | Update notification settings |
| `/api/user/accessibility` | PUT | **StudentSettings**, **InstructorSettings** | Update accessibility settings |
| `/api/user/password` | PUT | (backend only) | Change password |

### Analytics (`/api/analytics`)
| API | Method | Used by | Purpose |
|-----|--------|---------|---------|
| `/api/analytics/student` | GET | **StudentAnalytics** | Student analytics (overview, progress, strengths/weaknesses, etc.) |

---

## 2. BACKEND EXISTS BUT FRONTEND DOES NOT CALL IT

### Module exploration (`/api/explore`)
Backend routes (under `/api/explore`) exist; **no frontend page** currently calls them.

| API | Method | Purpose |
|-----|--------|---------|
| `/api/explore/:moduleId/details` | GET | Module details for exploration |
| `/api/explore/:moduleId/bookmarks` | GET | Get bookmarks |
| `/api/explore/:moduleId/bookmarks` | POST | Save bookmark |
| `/api/explore/:moduleId/notes` | GET | Get notes |
| `/api/explore/:moduleId/notes` | POST | Save notes |
| `/api/explore/:moduleId/interactions` | POST | Log interaction |
| `/api/explore/:moduleId/chat` | POST | Chat with AI |
| `/api/explore/:moduleId/progress` | GET | Get progress |
| `/api/explore/:moduleId/progress` | PUT | Update progress |

- **ModuleExploration.tsx** – Uses only local/mock data (sections, bookmarks, anatomy parts). **Not connected** to `/api/explore`.

### Other backend-only
- `/api/auth/logout` – Implemented; not referenced in current frontend grep.
- `/api/modules/stats` – Implemented; frontend no longer uses it (stats row removed from ModulesList).
- `/api/quiz/attempt/:attemptId/progress` – Implemented; frontend does not call it (QuizTaking uses `attempt/:attemptId` and submit/finish).
- `/api/quiz/modules` – Backend has `getQuizModules`; frontend uses `/api/modules` for the module list in QuizSelection.

---

## 3. NOT CONNECTED (frontend only / mock data)

### Pages with no backend API calls
- **AdminDashboard** – All data is local state (systemStats, systemHealth, recentActivity, userStats, storageStats, classes). No `fetch`/axios to backend.
- **AdminSettings** – UI only; comment says “connect to your API later”. No backend calls.
- **AssignModule** – No `fetch`/axios. Not connected.
- **InstructorManageStudents** – Student list and behavior are hardcoded/mock. No backend calls.
- **GuestLab** – No API usage. Not connected.
- **Lab1Explore** – No API usage. Loads 3D from CDN/local scripts only. Not connected.
- **Lab2Explore** – Same as Lab1. Not connected.
- **ModuleExploration** – Uses local state for sections, bookmarks, anatomy parts. Does **not** call `/api/explore/*`.
- **Landing** – No API calls (static/marketing page).
- **testmodel.tsx** – 3D/test only. No API.

### Data that is mock/static on connected pages
- **StudentDashboard** – “Achievements” list is hardcoded (icons/names). Rest comes from dashboard APIs.
- **InstructorDashboard** – Class dropdown options (e.g. “Medical Batch 2024”) are hardcoded; stats and lists come from instructor APIs.
- **QuizSelection** – “Previous attempts” table may use API data; filters/pagination (e.g. “Showing 1-5 of 24”) can be client-side only depending on backend response.
- **StudentAnalytics** – If backend returns full structure, most data is from API; any fallback or default content could be local.

---

## 4. SUMMARY TABLE

| Page / feature | Connected? | APIs used |
|----------------|------------|-----------|
| **Login** | Yes | POST `/api/auth/login` |
| **StudentDashboard** | Yes | GET auth/check, dashboard/stats, recent-modules, recent-activity, upcoming-deadlines |
| **InstructorDashboard** | Yes | GET auth/check, instructor/class-stats, module-performance, recent-submissions, at-risk-students, top-performers, upcoming-deadlines |
| **ModulesList** | Yes | GET modules, POST modules/:id/start, POST quiz/module/:id/start |
| **QuizSelection** | Yes | GET modules, quiz/stats, quiz/attempts; POST quiz/module/:id/start, timed-exam/start, adaptive/start |
| **QuizTaking** | Yes | GET quiz/attempt/:id; POST quiz/submit-answer, quiz/attempt/:id/finish |
| **QuizResult** | Yes | GET quiz/attempt/:id |
| **StudentAnalytics** | Yes | GET analytics/student |
| **StudentSettings** | Yes | GET user/settings; PUT user/account, preferences, notifications, accessibility |
| **InstructorSettings** | Yes | Same user APIs as StudentSettings |
| **ModuleExploration** | No | None (mock data) |
| **Lab1Explore** | No | None |
| **Lab2Explore** | No | None |
| **GuestLab** | No | None |
| **InstructorManageStudents** | No | None (mock students) |
| **AssignModule** | No | None |
| **AdminDashboard** | No | None (mock data) |
| **AdminSettings** | No | None |
| **Landing** | No | N/A (static) |

---

## 5. APIs BY BACKEND ROUTE PREFIX

- **`/api/auth`** – login, check, logout  
- **`/api/modules`** – list modules, get stats, start module  
- **`/api/dashboard`** – student dashboard (stats, recent modules, activity, deadlines)  
- **`/api/instructor`** – instructor dashboard (class stats, module performance, submissions, at-risk, top performers, deadlines)  
- **`/api/quiz`** – modules list for quiz, stats, attempts, start module/timed/adaptive, get attempt, submit answer, finish attempt, progress  
- **`/api/user`** – settings (get), account, preferences, notifications, accessibility, password  
- **`/api/analytics`** – student analytics  
- **`/api/explore`** – module details, bookmarks, notes, interactions, chat, progress (all implemented on backend; **no frontend caller**)
