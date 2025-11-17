# VR Medical Training System (VRMTS)

## Frontend Screens

### Common Screens
- **Landing** (`/`) - Welcome page
- **Login** (`/login`) - User authentication
- **TestModelPage** (`/testmodel`) - 3D model testing page

### Student Screens
- **StudentDashboard** (`/studentdashboard`) - Student main dashboard
- **StudentSettings** (`/settings`) - Student settings and preferences
- **StudentAnalytics** (`/studentanalytics`) - Student performance analytics
- **ModulesList** (`/modules`) - List of available modules
- **ModuleExploration** (`/module/:id`) - Interactive module exploration
- **QuizSelection** (`/quizselection`) - Quiz selection interface
- **QuizTaking** (`/quizattempt/:attemptId`) - Quiz taking interface
- **QuizResult** (`/quizresult/:attemptId`) - Quiz results display

### Instructor Screens
- **InstructorDashboard** (`/instructordashboard`) - Instructor main dashboard
- **InstructorManageStudents** (`/instructor/students`) - Instructor student management

### Admin Screens
- **AdminDashboard** (`/admindashboard`) - Admin main dashboard

### Additional Pages (Not Routed)
- AssignModule - Module assignment interface
- ThreeViewer - 3D model viewer

## Backend APIs

The following API endpoints are implemented in the backend:

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /check` - Check authentication status

### Modules (`/api/modules`)
- `GET /` - Get available modules
- `GET /stats` - Get module statistics
- `POST /:moduleId/start` - Start a module

### Dashboard (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics
- `GET /recent-modules` - Get recent modules
- `GET /recent-activity` - Get recent activity
- `GET /upcoming-deadlines` - Get upcoming deadlines

### User Management (`/api/user`)
- `GET /settings` - Get user settings
- `PUT /account` - Update account info
- `PUT /preferences` - Update preferences
- `PUT /accessibility` - Update accessibility settings
- `PUT /notifications` - Update notification settings
- `PUT /password` - Change password

### Quiz (`/api/quiz`)
- `GET /modules` - Get quiz modules
- `GET /stats` - Get quiz statistics
- `GET /attempts` - Get quiz attempts
- `POST /module/:moduleId/start` - Start module quiz
- `POST /timed-exam/start` - Start timed exam
- `POST /adaptive/start` - Start adaptive test
- `POST /attempt/:attemptId/answer` - Submit quiz answer
- `GET /attempt/:attemptId/progress` - Get quiz progress
- `POST /attempt/:attemptId/finish` - Finish quiz attempt
- `GET /attempt/:attemptId` - Get quiz attempt details

### Module Exploration (`/api/explore`)
- `GET /:moduleId/details` - Get module details
- `GET /:moduleId/bookmarks` - Get bookmarks
- `POST /:moduleId/bookmarks` - Save bookmark
- `GET /:moduleId/notes` - Get notes
- `POST /:moduleId/notes` - Save notes
- `POST /:moduleId/interactions` - Log interaction
- `POST /:moduleId/chat` - AI chat interaction
- `GET /:moduleId/progress` - Get progress
- `PUT /:moduleId/progress` - Update progress

### Analytics (`/api/analytics`)
- `GET /student` - Get detailed student analytics (overview, score progress, study time, module performance, question type performance, recent activity, strengths, weaknesses, learning patterns, achievements)

### Test
- `GET /api/test` - API test endpoint

## Next Targets: Frontend-Backend Integration

The following frontend pages need to be connected to backend APIs (currently using mock data or not fetching from backend):

### Student Screens
- **StudentDashboard** - Connect to `/api/dashboard` endpoints for stats, recent modules, activity, and deadlines
- **StudentAnalytics** - Connect to `/api/analytics/student` for detailed analytics data
- **ModulesList** - Connect to `/api/modules` for available modules and stats
- **ModuleExploration** - Connect to `/api/explore/:moduleId` endpoints for details, bookmarks, notes, interactions, chat, and progress
- **QuizSelection** - Connect to `/api/quiz/modules` and `/api/quiz/stats`
- **QuizTaking** - Connect to `/api/quiz/attempt/:attemptId` endpoints for progress, submitting answers, and finishing
- **QuizResult** - Connect to `/api/quiz/attempt/:attemptId` for attempt details

### Instructor Screens
- **InstructorDashboard** - Connect to `/api/dashboard` endpoints (may require role-specific data)
- **InstructorManageStudents** - Connect to `/api/user` endpoints for student management (may require additional instructor-specific APIs)

### Admin Screens
- **AdminDashboard** - Connect to `/api/dashboard` endpoints (may require admin-specific data and additional admin APIs)

### Additional Pages (Not Routed)
- **AssignModule** - Implement backend connection for module assignment functionality (likely requires new API endpoints)
