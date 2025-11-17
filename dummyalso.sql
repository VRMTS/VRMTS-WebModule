use vrmts;

INSERT INTO Module (title, difficultyLevel, description) VALUES
('Cardiovascular System', 'intermediate', 'Explore the heart, blood vessels, and circulation pathways'),
('Nervous System', 'advanced', 'Study the brain, spinal cord, and neural pathways'),
('Skeletal System', 'beginner', 'Learn about bones, joints, and skeletal structure'),
('Muscular System', 'intermediate', 'Understand muscle groups, tendons, and movement'),
('Respiratory System', 'beginner', 'Discover lungs, airways, and breathing mechanics'),
('Digestive System', 'intermediate', 'Explore organs involved in digestion and absorption'),
('Visual System', 'beginner', 'Study the eye structure and visual processing'),
('Auditory System', 'beginner', 'Learn about ear anatomy and hearing mechanisms'),
('Lymphatic System', 'intermediate', 'Understand lymph nodes, vessels, and immune function'),
('Endocrine System', 'advanced', 'Explore glands and hormonal regulation'),
('Integumentary System', 'beginner', 'Study skin layers, hair, and nails'),
('Urinary System', 'intermediate', 'Learn about kidneys and waste elimination');

-- Add some module content
INSERT INTO ModuleContent (moduleId, contentType, title, displayOrder, durationMinutes) VALUES
(1, 'video', 'Introduction to the Heart', 1, 15),
(1, 'interactive', 'Heart Anatomy 3D Model', 2, 20),
(1, 'text', 'Blood Circulation Pathways', 3, 10),
(1, 'quiz', 'Cardiovascular Quiz', 4, 20);