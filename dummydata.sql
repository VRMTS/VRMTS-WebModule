-- ============================================
-- Dummy Data for Test User Dashboard
-- ============================================
use vrmts;

-- Get the studentId for test user (email: test@example.com)
SET @testStudentId = (SELECT studentId FROM Student WHERE userId = (SELECT userId FROM User WHERE email = 'test@example.com'));

-- ============================================
-- Student Module Assignments
-- ============================================

-- Active/In-Progress Modules
INSERT INTO StudentModuleAssignment (studentId, moduleId, hoursSpent, knowledge, progress, status, assignedAt) VALUES
(@testStudentId, 1, 8.5, 75.00, 65.00, 'in_progress', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(@testStudentId, 3, 6.0, 85.00, 80.00, 'in_progress', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(@testStudentId, 5, 4.5, 65.00, 50.00, 'in_progress', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Completed Modules
INSERT INTO StudentModuleAssignment (studentId, moduleId, hoursSpent, knowledge, progress, status, completedAt, assignedAt) VALUES
(@testStudentId, 7, 5.0, 92.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
(@testStudentId, 11, 4.0, 88.00, 100.00, 'completed', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY));

-- Not Started Modules
INSERT INTO StudentModuleAssignment (studentId, moduleId, hoursSpent, knowledge, progress, status, assignedAt) VALUES
(@testStudentId, 2, 0, 0, 0, 'not_started', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(@testStudentId, 4, 0, 0, 0, 'not_started', NOW()),
(@testStudentId, 6, 0, 0, 0, 'not_started', NOW());

-- ============================================
-- Learning Sessions
-- ============================================

INSERT INTO LearningSession (studentId, moduleId, startTime, endTime, sessionType, duration) VALUES
(@testStudentId, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), 'study', 60),
(@testStudentId, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 45 MINUTE, 'study', 45),
(@testStudentId, 5, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR), 'practice', 60),
(@testStudentId, 7, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 30 MINUTE, 'quiz', 30),
(@testStudentId, 11, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 50 MINUTE, 'study', 50),
(@testStudentId, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY) + INTERVAL 90 MINUTE, 'study', 90),
(@testStudentId, 3, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 75 MINUTE, 'study', 75);

-- Get session IDs for analytics
SET @session1 = LAST_INSERT_ID();
SET @session2 = @session1 + 1;
SET @session3 = @session1 + 2;

-- ============================================
-- Session Analytics
-- ============================================

INSERT INTO SessionAnalytics (sessionId, engagementScore, interactionCount, timeSpent) VALUES
(@session1, 87.50, 45, 60),
(@session2, 92.00, 38, 45),
(@session3, 78.00, 52, 60);

-- ============================================
-- Quizzes
-- ============================================

-- Create quizzes for modules
INSERT INTO Quiz (moduleId, timeLimit, totalQuestions, passingScore) VALUES
(1, 30, 10, 70.00),
(7, 20, 8, 70.00),
(11, 25, 10, 70.00);

SET @quiz1 = LAST_INSERT_ID();
SET @quiz2 = @quiz1 + 1;
SET @quiz3 = @quiz1 + 2;

-- ============================================
-- Quiz Attempts
-- ============================================

INSERT INTO QuizAttempt (quizId, studentId, startTime, endTime, status, getScore, finishAt) VALUES
(@quiz1, @testStudentId, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 28 MINUTE, 'completed', 85.00, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 28 MINUTE),
(@quiz2, @testStudentId, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 18 MINUTE, 'completed', 92.00, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 18 MINUTE),
(@quiz3, @testStudentId, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 23 MINUTE, 'completed', 88.00, DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 23 MINUTE);

-- ============================================
-- Analytics Data (Daily Study Tracking)
-- ============================================

INSERT INTO AnalyticsData (studentId, date, studyTimeMinutes, quizzesAttempted, modelsViewed, averageScore) VALUES
(@testStudentId, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 90, 0, 5, NULL),
(@testStudentId, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 75, 1, 4, 88.00),
(@testStudentId, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 60, 0, 3, NULL),
(@testStudentId, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 0, 0, 0, NULL),
(@testStudentId, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 80, 1, 6, 92.00),
(@testStudentId, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 50, 0, 2, NULL),
(@testStudentId, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 105, 1, 8, 85.00),
(@testStudentId, CURDATE(), 60, 0, 4, NULL);

-- ============================================
-- Weakness Profile
-- ============================================

INSERT INTO WeaknessProfile (studentId, weakTopics, weakAreas, improvementPattern) VALUES
(@testStudentId, 
 JSON_ARRAY('Blood Circulation', 'Heart Valves', 'Bone Structure'),
 JSON_ARRAY('Cardiovascular System', 'Skeletal System'),
 JSON_OBJECT('trend', 'improving', 'recentScores', JSON_ARRAY(75, 80, 85)));

-- ============================================
-- AI Chat History
-- ============================================

INSERT INTO AIChat (studentId, moduleId, question, response, timestamp, sentiment, rateResponse) VALUES
(@testStudentId, 1, 'What are the main chambers of the heart?', 'The heart has four main chambers: two atria (upper chambers) and two ventricles (lower chambers). The right atrium receives deoxygenated blood from the body, the right ventricle pumps it to the lungs, the left atrium receives oxygenated blood from the lungs, and the left ventricle pumps it to the body.', DATE_SUB(NOW(), INTERVAL 2 DAY), 'neutral', 4.5),
(@testStudentId, 3, 'How many bones are in the human body?', 'An adult human body typically has 206 bones. However, babies are born with approximately 270 bones, and as they grow, some of these bones fuse together.', DATE_SUB(NOW(), INTERVAL 4 DAY), 'positive', 5.0),
(@testStudentId, 5, 'Explain the process of breathing', 'Breathing involves two phases: inhalation and exhalation. During inhalation, the diaphragm contracts and moves downward, creating negative pressure that draws air into the lungs. During exhalation, the diaphragm relaxes, and air is pushed out of the lungs.', DATE_SUB(NOW(), INTERVAL 1 DAY), 'neutral', 4.0);

-- ============================================
-- Notifications
-- ============================================

INSERT INTO Notification (userId, title, message, createdAt, isRead, notificationType) VALUES
((SELECT userId FROM User WHERE email = 'test@example.com'), 'Quiz Available', 'A new quiz is available for Cardiovascular System module', DATE_SUB(NOW(), INTERVAL 3 HOUR), FALSE, 'info'),
((SELECT userId FROM User WHERE email = 'test@example.com'), 'Great Progress!', 'You have completed 2 modules this week. Keep up the excellent work!', DATE_SUB(NOW(), INTERVAL 1 DAY), FALSE, 'success'),
((SELECT userId FROM User WHERE email = 'test@example.com'), 'Study Reminder', 'You have not studied for 2 days. Continue your learning streak!', DATE_SUB(NOW(), INTERVAL 5 HOUR), TRUE, 'reminder'),
((SELECT userId FROM User WHERE email = 'test@example.com'), 'Module Unlocked', 'Nervous System module is now available for you', DATE_SUB(NOW(), INTERVAL 2 DAY), TRUE, 'info');

-- ============================================
-- Model Interactions (for VR/3D engagement tracking)
-- ============================================

-- First, let's add some anatomy models
INSERT INTO AnatomyModel (systemId, modelName, version, thumbnailPath, filePath, render3D, interactionType) VALUES
(2, 'Heart 3D Model', '1.0', '/models/thumbnails/heart.jpg', '/models/3d/heart.glb', TRUE, 'interactive'),
(1, 'Skeleton Full Body', '1.0', '/models/thumbnails/skeleton.jpg', '/models/3d/skeleton.glb', TRUE, 'interactive'),
(4, 'Lungs Model', '1.0', '/models/thumbnails/lungs.jpg', '/models/3d/lungs.glb', TRUE, 'interactive');

SET @model1 = LAST_INSERT_ID();
SET @model2 = @model1 + 1;
SET @model3 = @model1 + 2;

INSERT INTO ModelInteraction (sessionId, modelId, interactionType, timestamp, durationSeconds) VALUES
(@session1, @model1, 'view', DATE_SUB(NOW(), INTERVAL 2 HOUR), 180),
(@session1, @model1, 'rotate', DATE_SUB(NOW(), INTERVAL 2 HOUR) + INTERVAL 3 MINUTE, 120),
(@session1, @model1, 'zoom', DATE_SUB(NOW(), INTERVAL 2 HOUR) + INTERVAL 5 MINUTE, 60),
(@session2, @model2, 'view', DATE_SUB(NOW(), INTERVAL 1 DAY), 240),
(@session2, @model2, 'rotate', DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 4 MINUTE, 180),
(@session3, @model3, 'view', DATE_SUB(NOW(), INTERVAL 3 HOUR), 150);

-- ============================================
-- Update Student Profile with Current Data
-- ============================================

UPDATE Student 
SET 
  enrollmentNumber = 'VRMTS2024001',
  enrollmentDate = DATE_SUB(CURDATE(), INTERVAL 30 DAY),
  currentGrade = 'B+'
WHERE studentId = @testStudentId;




INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation, getByDifficultyLevel, getByTopic) VALUES
('multiple_choice', 'easy', 'Skeletal System Basics', 1, 
 'The framework of bones and cartilage that supports the body', 
 JSON_ARRAY('The framework of bones and cartilage that supports the body', 'The system that pumps blood', 'The network of nerves', 'The respiratory organs'),
 'The skeletal system provides structural support, protects internal organs, and enables movement.',
 'easy', 'Skeletal System'),

('multiple_choice', 'medium', 'Bone Structure', 1,
 '206',
 JSON_ARRAY('195', '206', '215', '180'),
 'An adult human skeleton typically contains 206 bones, though this number can vary slightly between individuals.',
 'medium', 'Skeletal System'),

('true_false', 'easy', 'Bone Composition', 1,
 'true',
 JSON_ARRAY('true', 'false'),
 'Bones are living tissue that contains cells, blood vessels, and nerves. They constantly remodel throughout life.',
 'easy', 'Skeletal System'),

('multiple_choice', 'hard', 'Bone Types', 1,
 'Irregular',
 JSON_ARRAY('Long', 'Short', 'Flat', 'Irregular'),
 'Vertebrae are classified as irregular bones due to their complex shape that does not fit into other categories.',
 'hard', 'Skeletal System'),

('short_answer', 'medium', 'Joint Function', 1,
 'Connects bones and allows movement',
 NULL,
 'Joints are connections between bones that provide mobility and mechanical support. Different types of joints allow different ranges of motion.',
 'medium', 'Skeletal System');

-- Cardiovascular System Questions (systemId = 2)

INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation, getByDifficultyLevel, getByTopic) VALUES
('multiple_choice', 'easy', 'Heart Chambers', 2,
 '4',
 JSON_ARRAY('2', '3', '4', '5'),
 'The human heart has four chambers: two atria (upper chambers) and two ventricles (lower chambers).',
 'easy', 'Cardiovascular System'),

('true_false', 'easy', 'Blood Flow', 2,
 'false',
 JSON_ARRAY('true', 'false'),
 'Arteries carry blood away from the heart (not always oxygenated - pulmonary artery carries deoxygenated blood).',
 'easy', 'Cardiovascular System'),

('multiple_choice', 'medium', 'Heart Valves', 2,
 'Mitral valve',
 JSON_ARRAY('Aortic valve', 'Mitral valve', 'Tricuspid valve', 'Pulmonary valve'),
 'The mitral valve (bicuspid valve) is located between the left atrium and left ventricle.',
 'medium', 'Cardiovascular System'),

('multiple_choice', 'hard', 'Cardiac Cycle', 2,
 'Systole',
 JSON_ARRAY('Diastole', 'Systole', 'Arrhythmia', 'Bradycardia'),
 'Systole refers to the contraction phase of the cardiac cycle when the heart pumps blood out.',
 'hard', 'Cardiovascular System'),

('short_answer', 'medium', 'Blood Vessels', 2,
 'Exchange of nutrients and waste between blood and tissues',
 NULL,
 'Capillaries are tiny blood vessels where gas exchange, nutrient delivery, and waste removal occur at the cellular level.',
 'medium', 'Cardiovascular System');

-- Nervous System Questions (systemId = 3)

INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation, getByDifficultyLevel, getByTopic) VALUES
('multiple_choice', 'easy', 'Brain Structure', 3,
 'Brain and spinal cord',
 JSON_ARRAY('Brain only', 'Brain and spinal cord', 'All nerves in the body', 'Spinal cord only'),
 'The central nervous system (CNS) consists of the brain and spinal cord.',
 'easy', 'Nervous System'),

('true_false', 'medium', 'Neuron Function', 3,
 'true',
 JSON_ARRAY('true', 'false'),
 'Neurons communicate through electrical impulses and chemical signals (neurotransmitters) across synapses.',
 'medium', 'Nervous System'),

('multiple_choice', 'medium', 'Brain Regions', 3,
 'Cerebellum',
 JSON_ARRAY('Cerebrum', 'Cerebellum', 'Medulla', 'Thalamus'),
 'The cerebellum is primarily responsible for coordinating movement, balance, and posture.',
 'medium', 'Nervous System'),

('multiple_choice', 'hard', 'Neurotransmitters', 3,
 'Dopamine',
 JSON_ARRAY('Serotonin', 'GABA', 'Dopamine', 'Acetylcholine'),
 'Dopamine is associated with reward, motivation, and motor control. Deficiency is linked to Parkinson\'s disease.',
 'hard', 'Nervous System'),

('short_answer', 'easy', 'Nerve Cells', 3,
 'Basic functional unit of the nervous system that transmits signals',
 NULL,
 'A neuron (nerve cell) is the fundamental unit of the nervous system, specialized for transmitting information.',
 'easy', 'Nervous System');

-- Respiratory System Questions (systemId = 4)

INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation, getByDifficultyLevel, getByTopic) VALUES
('multiple_choice', 'easy', 'Breathing', 4,
 'Diaphragm',
 JSON_ARRAY('Heart', 'Lungs', 'Diaphragm', 'Trachea'),
 'The diaphragm is the primary muscle of respiration. Its contraction expands the chest cavity for inhalation.',
 'easy', 'Respiratory System'),

('true_false', 'easy', 'Gas Exchange', 4,
 'true',
 JSON_ARRAY('true', 'false'),
 'Alveoli are tiny air sacs in the lungs where oxygen enters the blood and carbon dioxide is removed.',
 'easy', 'Respiratory System'),

('multiple_choice', 'medium', 'Lung Anatomy', 4,
 '3 on right, 2 on left',
 JSON_ARRAY('2 on right, 3 on left', '3 on right, 2 on left', '2 on each side', '3 on each side'),
 'The right lung has three lobes while the left lung has two lobes to accommodate the heart.',
 'medium', 'Respiratory System'),

('multiple_choice', 'hard', 'Respiratory Control', 4,
 'Medulla oblongata',
 JSON_ARRAY('Cerebellum', 'Hypothalamus', 'Medulla oblongata', 'Pons'),
 'The medulla oblongata contains the respiratory center that controls the rate and depth of breathing.',
 'hard', 'Respiratory System'),

('short_answer', 'medium', 'Air Pathway', 4,
 'Tube connecting the larynx to the bronchi',
 NULL,
 'The trachea (windpipe) is a tube reinforced with cartilage rings that carries air between the larynx and bronchi.',
 'medium', 'Respiratory System');

-- Digestive System Questions (systemId = 5)

INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation, getByDifficultyLevel, getByTopic) VALUES
('multiple_choice', 'easy', 'Digestive Process', 5,
 'Stomach',
 JSON_ARRAY('Esophagus', 'Stomach', 'Small intestine', 'Large intestine'),
 'The stomach is a muscular organ that stores food and begins protein digestion with acid and enzymes.',
 'easy', 'Digestive System'),

('true_false', 'medium', 'Nutrient Absorption', 5,
 'true',
 JSON_ARRAY('true', 'false'),
 'The small intestine is the primary site of nutrient absorption, with a large surface area due to villi and microvilli.',
 'medium', 'Digestive System'),

('multiple_choice', 'medium', 'Digestive Organs', 5,
 'Liver',
 JSON_ARRAY('Pancreas', 'Liver', 'Gallbladder', 'Spleen'),
 'The liver is the largest internal organ and produces bile to help digest fats.',
 'medium', 'Digestive System'),

('multiple_choice', 'hard', 'Enzyme Function', 5,
 'Pancreas',
 JSON_ARRAY('Stomach', 'Liver', 'Pancreas', 'Gallbladder'),
 'The pancreas produces digestive enzymes (amylase, lipase, proteases) and hormones like insulin.',
 'hard', 'Digestive System'),

('short_answer', 'easy', 'Large Intestine', 5,
 'Absorbs water and forms waste',
 NULL,
 'The large intestine (colon) absorbs water and electrolytes from undigested material and forms feces.',
 'easy', 'Digestive System');

-- General Anatomy Questions

INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation, getByDifficultyLevel, getByTopic) VALUES
('multiple_choice', 'medium', 'Body Planes', NULL,
 'Sagittal',
 JSON_ARRAY('Frontal', 'Transverse', 'Sagittal', 'Oblique'),
 'The sagittal plane divides the body into left and right portions. The midsagittal plane divides it into equal halves.',
 'medium', 'Anatomical Terminology'),

('true_false', 'easy', 'Anatomical Position', NULL,
 'true',
 JSON_ARRAY('true', 'false'),
 'In anatomical position, the body is upright, facing forward, with arms at sides and palms facing forward.',
 'easy', 'Anatomical Terminology'),

('multiple_choice', 'hard', 'Cell Biology', NULL,
 'Mitochondria',
 JSON_ARRAY('Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'),
 'Mitochondria are the powerhouses of the cell, generating ATP through cellular respiration.',
 'hard', 'Cell Biology'),

('short_answer', 'medium', 'Tissue Types', NULL,
 'Epithelial, connective, muscle, and nervous tissue',
 NULL,
 'The four primary tissue types are epithelial (covering/lining), connective (support), muscle (movement), and nervous (signaling).',
 'medium', 'Histology');


select * from user;
