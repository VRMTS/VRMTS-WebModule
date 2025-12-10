use vrmts;

INSERT INTO User (email, passwordHash, name, userType, isActive) VALUES
('ad1@vrmts.edu', '1234', 'Dr. Sarah Mitchell', 'admin', TRUE),
('ad2@vrmts.edu', '1234', 'Prof. James Carter', 'admin', TRUE),
('te1@vrmts.edu', '1234', 'Dr. Emily Johnson', 'teacher', TRUE),
('te2@vrmts.edu', '1234', 'Dr. Michael Chen', 'teacher', TRUE),
('te3@vrmts.edu', '1234', 'Dr. Rachel Martinez', 'teacher', TRUE),
('st1@vrmts.edu', '1234', 'Alex Thompson', 'student', TRUE),
('st2@vrmts.edu', '1234', 'Maria Garcia', 'student', TRUE),
('st3@vrmts.edu', '1234', 'David Lee', 'student', TRUE),
('st@vrmts.edu', '1234', 'Sophie Williams', 'student', TRUE),
('st5@vrmts.edu', '1234', 'James Anderson', 'student', TRUE);

-- Insert role-specific data
INSERT INTO Admin (userId) VALUES (1), (2);
INSERT INTO Teacher (userId, department) VALUES 
(3, 'Anatomy & Physiology'),
(4, 'Neuroscience'),
(5, 'Clinical Sciences');

INSERT INTO Student (userId, enrollmentNumber, enrollmentDate, currentGrade) VALUES
(6, 'VRMTS2024001', '2024-01-15', 'A'),
(7, 'VRMTS2024002', '2024-01-15', 'B+'),
(8, 'VRMTS2024003', '2024-02-01', 'A-'),
(9, 'VRMTS2024004', '2024-02-01', 'B'),
(10, 'VRMTS2024005', '2024-02-15', 'A-');

-- User preferences for all users
INSERT INTO UserPreferences (userId, theme, language) VALUES
(1, 'dark', 'en'), (2, 'dark', 'en'), (3, 'dark', 'en'), (4, 'dark', 'en'), (5, 'dark', 'en'),
(6, 'dark', 'en'), (7, 'dark', 'en'), (8, 'dark', 'en'), (9, 'dark', 'en'), (10, 'dark', 'en');

INSERT INTO UserAccessibility (userId) VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);
INSERT INTO UserNotifications (userId) VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

INSERT INTO AnatomySystem (systemName, description, category) VALUES
('Anatomical Terminology', 'Foundation concepts, planes, and directional terms', 'Foundation'),
('Skeletal System', 'Bones, joints, and skeletal structure', 'Musculoskeletal'),
('Nervous System - Spinal', 'Spinal cord, spinal nerves, and reflexes', 'Neurological'),
('Nervous System - Brain', 'Brain structures and cranial nerves', 'Neurological'),
('Special Senses', 'Vision, hearing, taste, smell, and equilibrium', 'Sensory'),
('Respiratory System', 'Airways, lungs, and gas exchange', 'Respiratory'),
('Cardiovascular System', 'Heart, blood vessels, and circulation', 'Circulatory'),
('Digestive System', 'Alimentary canal and digestive organs', 'Digestive'),
('Urinary System', 'Kidneys and urinary tract', 'Excretory'),
('Reproductive System', 'Male and female reproductive organs', 'Reproductive'),
('Muscular System', 'Skeletal muscles and muscle groups', 'Musculoskeletal');

INSERT INTO Module (title, difficultyLevel, description) VALUES
('LAB 1: Anatomical Language', 'beginner', 'Introduction to anatomical terminology, body planes, directional terms, and anatomical position'),
('LAB 2: Bones and Bone Markings', 'beginner', 'Study of skeletal structure, bone classifications, and anatomical landmarks'),
('LAB 3: Spinal Cord and Spinal Nerves', 'intermediate', 'Examination of spinal cord anatomy, spinal nerve organization, and plexuses'),
('LAB 4: Brain and Cranial Nerves', 'advanced', 'Detailed study of brain structures, functional areas, and cranial nerves'),
('LAB 5: Special Senses', 'intermediate', 'Exploration of sensory organs including vision, hearing, taste, and smell'),
('LAB 6: Respiratory System', 'intermediate', 'Study of respiratory anatomy, gas exchange, and breathing mechanics'),
('LAB 7: The Cardiovascular System', 'intermediate', 'Comprehensive study of heart anatomy, blood vessels, and circulation'),
('LAB 8: Digestive System', 'intermediate', 'Examination of digestive organs and digestive processes'),
('LAB 9: Urinary and Reproductive Systems', 'advanced', 'Study of urinary tract and reproductive system structures'),
('LAB 10: The Muscular System', 'intermediate', 'Analysis of muscle anatomy, muscle groups, and functional movements');

INSERT INTO ModuleContent (moduleId, contentType, title, displayOrder, durationMinutes) VALUES
(1, 'video', 'Introduction to Anatomical Terminology', 1, 12),
(1, 'interactive', 'Body Planes and Sections', 2, 15),
(1, 'quiz', 'Anatomical Language Quiz', 3, 20),
(2, 'video', 'Skeletal System Overview', 1, 15),
(2, '3d_model', 'Complete Skeleton Model', 2, 25),
(2, 'quiz', 'Bones Quiz', 3, 25),
(3, 'video', 'Spinal Cord Anatomy', 1, 18),
(3, 'interactive', 'Spinal Nerves', 2, 20),
(3, 'quiz', 'Spinal System Quiz', 3, 25),
(4, 'video', 'Brain Structure', 1, 20),
(4, '3d_model', 'Brain Model', 2, 30),
(4, 'quiz', 'Brain Quiz', 3, 30),
(5, 'video', 'Special Senses Overview', 1, 15),
(5, '3d_model', 'Eye and Ear Models', 2, 25),
(5, 'quiz', 'Senses Quiz', 3, 25),
(6, 'video', 'Respiratory System', 1, 15),
(6, '3d_model', 'Lungs Model', 2, 25),
(6, 'quiz', 'Respiratory Quiz', 3, 25),
(7, 'video', 'Cardiovascular Overview', 1, 18),
(7, '3d_model', 'Heart Model', 2, 30),
(7, 'quiz', 'Cardiovascular Quiz', 3, 30),
(8, 'video', 'Digestive System', 1, 15),
(8, 'interactive', 'Digestive Process', 2, 20),
(8, 'quiz', 'Digestive Quiz', 3, 25),
(9, 'video', 'Urinary and Reproductive Systems', 1, 20),
(9, '3d_model', 'System Models', 2, 30),
(9, 'quiz', 'Systems Quiz', 3, 30),
(10, 'video', 'Muscular System', 1, 15),
(10, '3d_model', 'Muscle Groups', 2, 30),
(10, 'quiz', 'Muscular Quiz', 3, 25);

INSERT INTO AnatomyModel (systemId, modelName, version, thumbnailPath, filePath, render3D) VALUES
(2, 'Full Skeleton', '1.0', '/dummy/thumb/skeleton.jpg', '/dummy/models/skeleton.glb', TRUE),
(7, 'Heart Anatomy', '1.0', '/dummy/thumb/heart.jpg', '/dummy/models/heart.glb', TRUE),
(6, 'Lungs Model', '1.0', '/dummy/thumb/lungs.jpg', '/dummy/models/lungs.glb', TRUE),
(4, 'Brain Model', '1.0', '/dummy/thumb/brain.jpg', '/dummy/models/brain.glb', TRUE),
(11, 'Muscle System', '1.0', '/dummy/thumb/muscles.jpg', '/dummy/models/muscles.glb', TRUE);


-- Student 1 (Alex) - High performer, ahead
INSERT INTO StudentModuleAssignment (studentId, moduleId, hoursSpent, knowledge, progress, status, assignedAt, completedAt) VALUES
(1, 1, 5.0, 95.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 28 DAY)),
(1, 2, 8.0, 92.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 27 DAY), DATE_SUB(NOW(), INTERVAL 24 DAY)),
(1, 3, 7.5, 88.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 23 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY)),
(1, 4, 9.0, 90.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 19 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
(1, 5, 6.5, 85.00, 95.00, 'in_progress', DATE_SUB(NOW(), INTERVAL 14 DAY), NULL),
(1, 6, 0, 0, 0, 'not_started', DATE_SUB(NOW(), INTERVAL 5 DAY), NULL);

-- Student 2 (Maria) - Good performer
INSERT INTO StudentModuleAssignment (studentId, moduleId, hoursSpent, knowledge, progress, status, assignedAt, completedAt) VALUES
(2, 1, 4.5, 88.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 27 DAY)),
(2, 2, 7.0, 85.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 26 DAY), DATE_SUB(NOW(), INTERVAL 22 DAY)),
(2, 3, 6.0, 80.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 21 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY)),
(2, 4, 5.5, 78.00, 75.00, 'in_progress', DATE_SUB(NOW(), INTERVAL 17 DAY), NULL),
(2, 5, 0, 0, 0, 'not_started', DATE_SUB(NOW(), INTERVAL 10 DAY), NULL);

-- Student 3 (David) - Average performer
INSERT INTO StudentModuleAssignment (studentId, moduleId, hoursSpent, knowledge, progress, status, assignedAt, completedAt) VALUES
(3, 1, 5.5, 82.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 26 DAY)),
(3, 2, 6.5, 79.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY)),
(3, 3, 5.0, 75.00, 80.00, 'in_progress', DATE_SUB(NOW(), INTERVAL 19 DAY), NULL),
(3, 4, 0, 0, 0, 'not_started', DATE_SUB(NOW(), INTERVAL 12 DAY), NULL);

-- Student 4 (Sophie) - Struggling student
INSERT INTO StudentModuleAssignment (studentId, moduleId, hoursSpent, knowledge, progress, status, assignedAt, completedAt) VALUES
(4, 1, 6.0, 75.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 24 DAY)),
(4, 2, 8.5, 72.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 23 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY)),
(4, 3, 7.0, 68.00, 65.00, 'in_progress', DATE_SUB(NOW(), INTERVAL 17 DAY), NULL);

-- Student 5 (James) - New student
INSERT INTO StudentModuleAssignment (studentId, moduleId, hoursSpent, knowledge, progress, status, assignedAt, completedAt) VALUES
(5, 1, 3.5, 78.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY)),
(5, 2, 4.0, 80.00, 85.00, 'in_progress', DATE_SUB(NOW(), INTERVAL 11 DAY), NULL);


-- ============================================
INSERT INTO LearningSession (studentId, moduleId, startTime, endTime, sessionType, duration) VALUES
(1, 5, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), 'study', 60),
(2, 4, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR), 'study', 60),
(3, 3, DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR), 'practice', 60),
(4, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 45 MINUTE, 'study', 45),
(5, 2, DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), 'study', 60);

-- ============================================
-- STEP 9: Create Quizzes
-- ============================================
INSERT INTO Quiz (moduleId, title, timeLimit, totalQuestions, passingScore, isCustom) VALUES
(1, 'Anatomical Language Quiz', 20, 10, 70.00, FALSE),
(2, 'Bones and Markings Quiz', 25, 12, 70.00, FALSE),
(3, 'Spinal System Quiz', 25, 10, 70.00, FALSE),
(4, 'Brain Quiz', 30, 15, 70.00, FALSE),
(5, 'Special Senses Quiz', 25, 10, 70.00, FALSE),
(6, 'Respiratory Quiz', 25, 12, 70.00, FALSE),
(7, 'Cardiovascular Quiz', 30, 15, 70.00, FALSE),
(8, 'Digestive Quiz', 25, 12, 70.00, FALSE),
(9, 'Urinary & Reproductive Quiz', 30, 15, 70.00, FALSE),
(10, 'Muscular System Quiz', 25, 12, 70.00, FALSE);



INSERT INTO QuizAttempt (quizId, studentId, startTime, endTime, status, getScore, finishAt) VALUES
(1, 1, DATE_SUB(NOW(), INTERVAL 28 DAY), DATE_SUB(NOW(), INTERVAL 28 DAY) + INTERVAL 18 MINUTE, 'completed', 95.00, DATE_SUB(NOW(), INTERVAL 28 DAY) + INTERVAL 18 MINUTE),
(2, 1, DATE_SUB(NOW(), INTERVAL 24 DAY), DATE_SUB(NOW(), INTERVAL 24 DAY) + INTERVAL 22 MINUTE, 'completed', 92.00, DATE_SUB(NOW(), INTERVAL 24 DAY) + INTERVAL 22 MINUTE),
(1, 2, DATE_SUB(NOW(), INTERVAL 27 DAY), DATE_SUB(NOW(), INTERVAL 27 DAY) + INTERVAL 19 MINUTE, 'completed', 88.00, DATE_SUB(NOW(), INTERVAL 27 DAY) + INTERVAL 19 MINUTE),
(2, 2, DATE_SUB(NOW(), INTERVAL 22 DAY), DATE_SUB(NOW(), INTERVAL 22 DAY) + INTERVAL 23 MINUTE, 'completed', 85.00, DATE_SUB(NOW(), INTERVAL 22 DAY) + INTERVAL 23 MINUTE),
(1, 3, DATE_SUB(NOW(), INTERVAL 26 DAY), DATE_SUB(NOW(), INTERVAL 26 DAY) + INTERVAL 20 MINUTE, 'completed', 82.00, DATE_SUB(NOW(), INTERVAL 26 DAY) + INTERVAL 20 MINUTE);

-- ============================================
-- STEP 11: Analytics Data
-- ============================================
INSERT INTO AnalyticsData (studentId, date, studyTimeMinutes, quizzesAttempted, modelsViewed, averageScore) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 90, 1, 5, 92.00),
(1, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 75, 0, 4, NULL),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 60, 0, 3, NULL),
(2, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 80, 1, 6, 85.00),
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 60, 0, 4, NULL),
(3, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 70, 0, 3, NULL);

-- ============================================
-- STEP 12: Notifications
-- ============================================
INSERT INTO Notification (userId, title, message, createdAt, isRead, notificationType) VALUES
(6, 'Great Progress!', 'You have completed 4 modules!', NOW(), FALSE, 'success'),
(7, 'Quiz Available', 'New quiz available for Lab 4', DATE_SUB(NOW(), INTERVAL 2 HOUR), FALSE, 'info'),
(8, 'Keep Going', 'You are making good progress on Lab 3', DATE_SUB(NOW(), INTERVAL 1 DAY), TRUE, 'info'),
(9, 'Study Reminder', 'Continue your learning streak', DATE_SUB(NOW(), INTERVAL 3 HOUR), FALSE, 'reminder'),
(10, 'Welcome!', 'Welcome to VRMTS Learning Platform', DATE_SUB(NOW(), INTERVAL 15 DAY), TRUE, 'info');



select * from questionbank;
select * from quiz;