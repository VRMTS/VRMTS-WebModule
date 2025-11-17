create database vrmts;
use vrmts;

CREATE TABLE User (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastLogin DATETIME,
    userType ENUM('student', 'teacher', 'admin') NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_userType (userType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Student (
    studentId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT UNIQUE NOT NULL,
    enrollmentNumber VARCHAR(50) UNIQUE,
    enrollmentDate DATE,
    enrollmentModuleId INT,
    currentGrade VARCHAR(10),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
    INDEX idx_enrollmentNumber (enrollmentNumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Teacher (
    teacherId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT UNIQUE NOT NULL,
    department VARCHAR(100),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Admin (
    adminId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT UNIQUE NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO User (email, passwordHash, name, userType, isActive) 
VALUES (
  'test@example.com', 
  'password123',
  'Test User',
  'student',
  TRUE
);



-- ============================================
-- Anatomy Content Management
-- ============================================

CREATE TABLE AnatomySystem (
    systemId INT PRIMARY KEY AUTO_INCREMENT,
    systemName VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE AnatomyModel (
    modelId INT PRIMARY KEY AUTO_INCREMENT,
    systemId INT,
    modelName VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    thumbnailPath VARCHAR(500),
    filePath VARCHAR(500),
    metadata JSON,
    tags JSON,
    render3D BOOLEAN DEFAULT TRUE,
    oeDealer BOOLEAN DEFAULT FALSE,
    interactionType VARCHAR(50),
    FOREIGN KEY (systemId) REFERENCES AnatomySystem(systemId) ON DELETE SET NULL,
    INDEX idx_systemId (systemId),
    INDEX idx_modelName (modelName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Module and Content Management
-- ============================================

CREATE TABLE Module (
    moduleId INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    difficultyLevel ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_difficultyLevel (difficultyLevel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ModuleContent (
    contentId INT PRIMARY KEY AUTO_INCREMENT,
    moduleId INT NOT NULL,
    modelId INT,
    contentType ENUM('video', 'text', 'interactive', '3d_model', 'quiz') NOT NULL,
    filePath VARCHAR(500),
    title VARCHAR(255),
    displayOrder INT DEFAULT 0,
    durationMinutes INT,
    trackProgress BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (moduleId) REFERENCES Module(moduleId) ON DELETE CASCADE,
    FOREIGN KEY (modelId) REFERENCES AnatomyModel(modelId) ON DELETE SET NULL,
    INDEX idx_moduleId (moduleId),
    INDEX idx_contentType (contentType),
    INDEX idx_displayOrder (displayOrder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE StudentModuleAssignment (
    assignmentId INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT NOT NULL,
    moduleId INT NOT NULL,
    hoursSpent DECIMAL(5,2) DEFAULT 0,
    knowledge DECIMAL(5,2) DEFAULT 0,
    progress DECIMAL(5,2) DEFAULT 0,
    status ENUM('not_started', 'in_progress', 'completed', 'archived') DEFAULT 'not_started',
    completedAt DATETIME,
    assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES Student(studentId) ON DELETE CASCADE,
    FOREIGN KEY (moduleId) REFERENCES Module(moduleId) ON DELETE CASCADE,
    INDEX idx_studentId (studentId),
    INDEX idx_moduleId (moduleId),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Learning Sessions and Analytics
-- ============================================

CREATE TABLE LearningSession (
    sessionId INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT NOT NULL,
    moduleId INT,
    startTime DATETIME NOT NULL,
    endTime DATETIME,
    sessionType ENUM('study', 'quiz', 'practice', 'review') DEFAULT 'study',
    duration INT, -- in minutes
    recordActivity BOOLEAN DEFAULT TRUE,
    generateAnalytics BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (studentId) REFERENCES Student(studentId) ON DELETE CASCADE,
    FOREIGN KEY (moduleId) REFERENCES Module(moduleId) ON DELETE SET NULL,
    INDEX idx_studentId (studentId),
    INDEX idx_moduleId (moduleId),
    INDEX idx_startTime (startTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE SessionAnalytics (
    analyticsId INT PRIMARY KEY AUTO_INCREMENT,
    sessionId INT NOT NULL,
    engagementScore DECIMAL(5,2),
    interactionCount INT DEFAULT 0,
    timeSpent INT, -- in minutes
    fingoff BOOLEAN DEFAULT FALSE,
    focusAreas JSON,
    FOREIGN KEY (sessionId) REFERENCES LearningSession(sessionId) ON DELETE CASCADE,
    INDEX idx_sessionId (sessionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE WeaknessProfile (
    profileId INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT NOT NULL,
    weakTopics JSON,
    weakAreas JSON,
    improvementPattern JSON,
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES Student(studentId) ON DELETE CASCADE,
    INDEX idx_studentId (studentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Quiz and Assessment System
-- ============================================

CREATE TABLE QuestionBank (
    bankId INT PRIMARY KEY AUTO_INCREMENT,
    questionType ENUM('multiple_choice', 'true_false', 'short_answer') NOT NULL,
    difficulty VARCHAR(50),
    topic VARCHAR(100),
    systemId INT,
    correctAnswer TEXT,
    options JSON,
    explanation TEXT,
    getByDifficultyLevel VARCHAR(50),
    getByTopic VARCHAR(100),
    FOREIGN KEY (systemId) REFERENCES AnatomySystem(systemId) ON DELETE SET NULL,
    INDEX idx_questionType (questionType),
    INDEX idx_difficulty (difficulty),
    INDEX idx_topic (topic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Quiz (
    quizId INT PRIMARY KEY AUTO_INCREMENT,
    moduleId INT NOT NULL,
    timeLimit INT, -- in minutes
    totalQuestions INT NOT NULL,
    passingScore DECIMAL(5,2) DEFAULT 60.00,
    generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (moduleId) REFERENCES Module(moduleId) ON DELETE CASCADE,
    INDEX idx_moduleId (moduleId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE QuizQuestion (
    questionId INT PRIMARY KEY AUTO_INCREMENT,
    quizId INT,
    bankId INT,
    questionText TEXT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    points DECIMAL(4,2) DEFAULT 1.00,
    displayOrder INT DEFAULT 0,
    validateAnswer BOOLEAN DEFAULT TRUE,
    getDifficulty VARCHAR(50),
    FOREIGN KEY (quizId) REFERENCES Quiz(quizId) ON DELETE CASCADE,
    FOREIGN KEY (bankId) REFERENCES QuestionBank(bankId) ON DELETE SET NULL,
    INDEX idx_quizId (quizId),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE QuizAttempt (
    attemptId INT PRIMARY KEY AUTO_INCREMENT,
    quizId INT NOT NULL,
    studentId INT NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME,
    status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
    startedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    submitAnswers JSON,
    finishAt DATETIME,
    getScore DECIMAL(5,2),
    FOREIGN KEY (quizId) REFERENCES Quiz(quizId) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES Student(studentId) ON DELETE CASCADE,
    INDEX idx_quizId (quizId),
    INDEX idx_studentId (studentId),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE AnswerRecord (
    recordId INT PRIMARY KEY AUTO_INCREMENT,
    attemptId INT NOT NULL,
    questionId INT NOT NULL,
    studentAnswer TEXT,
    isCorrect BOOLEAN,
    pointsEarned DECIMAL(4,2) DEFAULT 0,
    timeSpent INT, -- in seconds
    recordAnswer BOOLEAN DEFAULT TRUE,
    validate BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (attemptId) REFERENCES QuizAttempt(attemptId) ON DELETE CASCADE,
    FOREIGN KEY (questionId) REFERENCES QuizQuestion(questionId) ON DELETE CASCADE,
    INDEX idx_attemptId (attemptId),
    INDEX idx_questionId (questionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- AI Features

CREATE TABLE AIChat (
    chatId INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT NOT NULL,
    moduleId INT,
    question TEXT NOT NULL,
    response TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    context TEXT,
    sentiment VARCHAR(50),
    optResponse JSON,
    rateResponse DECIMAL(3,2),
    FOREIGN KEY (studentId) REFERENCES Student(studentId) ON DELETE CASCADE,
    FOREIGN KEY (moduleId) REFERENCES Module(moduleId) ON DELETE SET NULL,
    INDEX idx_studentId (studentId),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE AIFeedback (
    feedbackId INT PRIMARY KEY AUTO_INCREMENT,
    attemptId INT,
    studentId INT NOT NULL,
    feedbackText TEXT NOT NULL,
    improvementSuggestions TEXT,
    confidenceScore DECIMAL(5,2),
    generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    generateAttempt BOOLEAN DEFAULT TRUE,
    deliver BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (attemptId) REFERENCES QuizAttempt(attemptId) ON DELETE SET NULL,
    FOREIGN KEY (studentId) REFERENCES Student(studentId) ON DELETE CASCADE,
    INDEX idx_studentId (studentId),
    INDEX idx_attemptId (attemptId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Model Interaction Tracking

CREATE TABLE ModelInteraction (
    interactionId INT PRIMARY KEY AUTO_INCREMENT,
    sessionId INT,
    modelId INT,
    interactionType ENUM('view', 'rotate', 'zoom', 'annotate', 'dissect') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    durationSeconds INT,
    metadata JSON,
    record BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (sessionId) REFERENCES LearningSession(sessionId) ON DELETE CASCADE,
    FOREIGN KEY (modelId) REFERENCES AnatomyModel(modelId) ON DELETE CASCADE,
    INDEX idx_sessionId (sessionId),
    INDEX idx_modelId (modelId),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Reporting and Analytics
-- ============================================

CREATE TABLE AnalyticsData (
    dataId INT PRIMARY KEY AUTO_INCREMENT,
    studentId INT NOT NULL,
    date DATE NOT NULL,
    studyTimeMinutes INT DEFAULT 0,
    quizzesAttempted INT DEFAULT 0,
    modelsViewed INT DEFAULT 0,
    averageScore DECIMAL(5,2),
    generateDashboard BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (studentId) REFERENCES Student(studentId) ON DELETE CASCADE,
    INDEX idx_studentId (studentId),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ReportRequest (
    requestId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    reportType ENUM('student_progress', 'class_performance', 'module_analytics', 'system_usage') NOT NULL,
    requestedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    filePath VARCHAR(500),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE SystemReport (
    reportId INT PRIMARY KEY AUTO_INCREMENT,
    adminId INT NOT NULL,
    reportType ENUM('usage', 'performance', 'analytics', 'audit') NOT NULL,
    period VARCHAR(50),
    generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    filePath VARCHAR(500),
    format ENUM('pdf', 'csv', 'json', 'xlsx') DEFAULT 'pdf',
    distribute BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (adminId) REFERENCES Admin(adminId) ON DELETE CASCADE,
    INDEX idx_adminId (adminId),
    INDEX idx_reportType (reportType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Notification System
-- ============================================

CREATE TABLE Notification (
    notificationId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead BOOLEAN DEFAULT FALSE,
    notificationType ENUM('info', 'warning', 'success', 'reminder') DEFAULT 'info',
    markAsRead BOOLEAN DEFAULT FALSE,
    delete_ BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_isRead (isRead),
    INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data Insertion
-- ============================================

-- Insert sample users
INSERT INTO User (email, passwordHash, name, userType) VALUES
('adm@test.com', 'adm123', 'Admin User', 'admin'),
('teac@test.com', 'tea123', 'Teacher User', 'teacher'),
('stud@test.com', 'stu123', 'Student User', 'student');


-- Insert admin
INSERT INTO Admin (userId, roleLevel) VALUES (1, 'super_admin');

-- Insert teacher
INSERT INTO Teacher (userId, department, qualification) VALUES (2, 'Anatomy', 'PhD in Human Anatomy');

-- Insert student
INSERT INTO Student (userId, enrollmentNumber, enrollmentDate) VALUES (3, 'STU2024001', '2024-01-15');

-- Insert anatomy systems
INSERT INTO AnatomySystem (systemName, description, category) VALUES
('Skeletal System', 'The framework of bones and cartilage', 'Musculoskeletal'),
('Cardiovascular System', 'The heart and blood vessels', 'Circulatory'),
('Nervous System', 'Brain, spinal cord, and nerves', 'Neural'),
('Respiratory System', 'Organs involved in breathing', 'Respiratory'),
('Digestive System', 'Organs for food processing', 'Digestive');

-- Insert modules
INSERT INTO Module (title, difficultyLevel, estimatedHours, description) VALUES
('Introduction to Human Anatomy', 'beginner', 10.0, 'Basic overview of human body systems'),
('Advanced Skeletal System', 'advanced', 15.0, 'Detailed study of bones and joints'),
('Cardiovascular Physiology', 'intermediate', 12.0, 'Understanding heart and circulation');

-- ============================================
-- Useful Views
-- ============================================

CREATE VIEW vw_StudentProgress AS
SELECT 
    s.studentId,
    u.name AS studentName,
    u.email,
    COUNT(DISTINCT sma.moduleId) AS modulesEnrolled,
    SUM(CASE WHEN sma.status = 'completed' THEN 1 ELSE 0 END) AS modulesCompleted,
    AVG(sma.progress) AS averageProgress,
    SUM(sma.hoursSpent) AS totalHoursSpent
FROM Student s
INNER JOIN User u ON s.userId = u.userId
LEFT JOIN StudentModuleAssignment sma ON s.studentId = sma.studentId
GROUP BY s.studentId, u.name, u.email;

CREATE VIEW vw_QuizPerformance AS
SELECT 
    s.studentId,
    u.name AS studentName,
    q.quizId,
    m.title AS moduleTitle,
    qa.attemptId,
    qa.getScore AS score,
    qa.status,
    qa.startedAt
FROM Student s
INNER JOIN User u ON s.userId = u.userId
INNER JOIN QuizAttempt qa ON s.studentId = qa.studentId
INNER JOIN Quiz q ON qa.quizId = q.quizId
INNER JOIN Module m ON q.moduleId = m.moduleId;

CREATE VIEW vw_ModuleEngagement AS
SELECT 
    m.moduleId,
    m.title,
    COUNT(DISTINCT sma.studentId) AS studentsEnrolled,
    AVG(sma.progress) AS averageProgress,
    SUM(sma.hoursSpent) AS totalHoursSpent,
    COUNT(DISTINCT ls.sessionId) AS totalSessions
FROM Module m
LEFT JOIN StudentModuleAssignment sma ON m.moduleId = sma.moduleId
LEFT JOIN LearningSession ls ON m.moduleId = ls.moduleId
GROUP BY m.moduleId, m.title;

-- ============================================
-- End of Schema
-- ============================================



-- Additional tables for user settings not in original schema

CREATE TABLE UserPreferences (
    preferenceId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL UNIQUE,
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'en',
    timeZone VARCHAR(50) DEFAULT 'UTC+05:00',
    dateFormat VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    defaultView VARCHAR(20) DEFAULT 'grid',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE UserAccessibility (
    accessibilityId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL UNIQUE,
    textSize INT DEFAULT 16,
    highContrast BOOLEAN DEFAULT FALSE,
    reduceMotion BOOLEAN DEFAULT FALSE,
    screenReader BOOLEAN DEFAULT FALSE,
    keyboardNav BOOLEAN DEFAULT TRUE,
    captions BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE UserNotifications (
    notificationId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL UNIQUE,
    assignments BOOLEAN DEFAULT TRUE,
    quizDeadlines BOOLEAN DEFAULT TRUE,
    performance BOOLEAN DEFAULT TRUE,
    announcements BOOLEAN DEFAULT FALSE,
    emailDigest VARCHAR(20) DEFAULT 'weekly',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add some sample data for testing
INSERT INTO UserPreferences (userId, theme, language) VALUES (3, 'dark', 'en');
INSERT INTO UserAccessibility (userId) VALUES (3);
INSERT INTO UserNotifications (userId) VALUES (3);




-- updated
ALTER TABLE Quiz
  ADD COLUMN title VARCHAR(255) NULL AFTER quizId,
  ADD COLUMN description TEXT NULL AFTER title,
  ADD COLUMN isCustom BOOLEAN NOT NULL DEFAULT FALSE AFTER passingScore,
  MODIFY COLUMN moduleId INT NULL;

CREATE INDEX idx_quiz_isCustom ON Quiz(isCustom);
CREATE INDEX idx_quiz_title ON Quiz(title);
CREATE INDEX idx_quiz_generatedAt ON Quiz(generatedAt);

-- Down
ALTER TABLE Quiz
  DROP INDEX idx_quiz_isCustom,
  DROP INDEX idx_quiz_title,
  DROP INDEX idx_quiz_generatedAt;

ALTER TABLE Quiz
  DROP COLUMN title,
  DROP COLUMN description,
  DROP COLUMN isCustom,
  MODIFY COLUMN moduleId INT NOT NULL;
