USE vrmts;

-- ============================================
-- QUESTION BANK - LAB 1: Anatomical Language
-- ============================================
INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation) VALUES
('multiple_choice', 'easy', 'Anatomical Terminology', 1, 'Toward the head', 
JSON_ARRAY('Toward the head', 'Toward the feet', 'Toward the front', 'Toward the back'),
'Superior means toward the head or upper part of a structure'),

('multiple_choice', 'easy', 'Anatomical Terminology', 1, 'Divides body into left and right', 
JSON_ARRAY('Divides body into left and right', 'Divides body into front and back', 'Divides body into top and bottom', 'Divides body diagonally'),
'The sagittal plane divides the body into left and right portions'),

('multiple_choice', 'medium', 'Anatomical Terminology', 1, 'Away from the point of attachment', 
JSON_ARRAY('Toward the point of attachment', 'Away from the point of attachment', 'Toward the midline', 'Away from the midline'),
'Distal means away from the point of attachment or origin'),

('multiple_choice', 'medium', 'Anatomical Terminology', 1, 'Closer to the surface', 
JSON_ARRAY('Deeper inside', 'Closer to the surface', 'Toward the back', 'Toward the front'),
'Superficial refers to structures closer to the body surface'),

('multiple_choice', 'easy', 'Body Planes', 1, 'Frontal plane', 
JSON_ARRAY('Sagittal plane', 'Transverse plane', 'Frontal plane', 'Oblique plane'),
'The frontal (coronal) plane divides the body into anterior and posterior portions'),

('multiple_choice', 'medium', 'Anatomical Position', 1, 'Standing upright, arms at sides, palms forward', 
JSON_ARRAY('Standing upright, arms at sides, palms forward', 'Lying down, arms crossed', 'Standing upright, arms raised', 'Sitting position'),
'Anatomical position is the standard reference position in anatomy'),

('multiple_choice', 'hard', 'Anatomical Terminology', 1, 'Ipsilateral', 
JSON_ARRAY('On opposite sides', 'Ipsilateral', 'Above', 'Below'),
'Ipsilateral means on the same side of the body'),

('multiple_choice', 'medium', 'Body Cavities', 1, 'Thoracic cavity', 
JSON_ARRAY('Abdominal cavity', 'Pelvic cavity', 'Thoracic cavity', 'Cranial cavity'),
'The thoracic cavity contains the heart and lungs'),

('multiple_choice', 'easy', 'Anatomical Terminology', 1, 'Toward the back', 
JSON_ARRAY('Toward the front', 'Toward the back', 'Toward the side', 'Toward the middle'),
'Posterior means toward the back of the body'),

('multiple_choice', 'medium', 'Directional Terms', 1, 'Lateral', 
JSON_ARRAY('Medial', 'Lateral', 'Proximal', 'Distal'),
'Lateral means away from the midline of the body');

-- ============================================
-- QUESTION BANK - LAB 2: Bones and Markings
-- ============================================
INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation) VALUES
('multiple_choice', 'easy', 'Skeletal System', 2, '206', 
JSON_ARRAY('195', '206', '215', '220'),
'The adult human skeleton typically contains 206 bones'),

('multiple_choice', 'medium', 'Bone Types', 2, 'Humerus', 
JSON_ARRAY('Vertebra', 'Patella', 'Humerus', 'Scapula'),
'The humerus is classified as a long bone'),

('multiple_choice', 'medium', 'Skull', 2, 'Frontal bone', 
JSON_ARRAY('Occipital bone', 'Frontal bone', 'Temporal bone', 'Sphenoid bone'),
'The frontal bone forms the forehead'),

('multiple_choice', 'hard', 'Bone Markings', 2, 'Foramen', 
JSON_ARRAY('Ridge', 'Foramen', 'Process', 'Fossa'),
'A foramen is a hole or opening in a bone for nerves and blood vessels'),

('multiple_choice', 'easy', 'Vertebral Column', 2, '7', 
JSON_ARRAY('5', '7', '12', '5'),
'There are 7 cervical vertebrae in the neck'),

('multiple_choice', 'medium', 'Appendicular Skeleton', 2, 'Clavicle and scapula', 
JSON_ARRAY('Humerus and radius', 'Clavicle and scapula', 'Sternum and ribs', 'Femur and tibia'),
'The pectoral girdle consists of the clavicle and scapula'),

('multiple_choice', 'hard', 'Joint Types', 2, 'Ball-and-socket', 
JSON_ARRAY('Hinge', 'Pivot', 'Ball-and-socket', 'Gliding'),
'The shoulder joint is a ball-and-socket joint allowing multi-axial movement'),

('multiple_choice', 'medium', 'Lower Limb', 2, 'Femur', 
JSON_ARRAY('Humerus', 'Tibia', 'Femur', 'Radius'),
'The femur is the longest and strongest bone in the body'),

('multiple_choice', 'easy', 'Bone Structure', 2, 'Compact bone', 
JSON_ARRAY('Spongy bone', 'Compact bone', 'Cartilage', 'Marrow'),
'The dense outer layer of bone is called compact bone'),

('multiple_choice', 'medium', 'Thoracic Cage', 2, '12 pairs', 
JSON_ARRAY('10 pairs', '11 pairs', '12 pairs', '13 pairs'),
'Humans typically have 12 pairs of ribs'),

('multiple_choice', 'hard', 'Bone Markings', 2, 'Condyle', 
JSON_ARRAY('Tubercle', 'Condyle', 'Spine', 'Crest'),
'A condyle is a rounded articular projection at a joint'),

('multiple_choice', 'medium', 'Axial Skeleton', 2, '80', 
JSON_ARRAY('70', '80', '90', '100'),
'The axial skeleton contains approximately 80 bones');

-- ============================================
-- QUESTION BANK - LAB 3: Spinal Cord
-- ============================================
INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation) VALUES
('multiple_choice', 'easy', 'Spinal Cord', 3, 'At L1-L2 vertebral level', 
JSON_ARRAY('At L1-L2 vertebral level', 'At L5 vertebral level', 'At T12 vertebral level', 'At S1 vertebral level'),
'The spinal cord typically ends at the L1-L2 vertebral level'),

('multiple_choice', 'medium', 'Spinal Nerves', 3, '31 pairs', 
JSON_ARRAY('28 pairs', '31 pairs', '33 pairs', '35 pairs'),
'There are 31 pairs of spinal nerves in humans'),

('multiple_choice', 'hard', 'Nerve Plexuses', 3, 'Brachial plexus', 
JSON_ARRAY('Cervical plexus', 'Brachial plexus', 'Lumbar plexus', 'Sacral plexus'),
'The brachial plexus innervates the upper limb'),

('multiple_choice', 'medium', 'Spinal Cord Anatomy', 3, 'Gray matter', 
JSON_ARRAY('White matter', 'Gray matter', 'Meninges', 'Cerebrospinal fluid'),
'The butterfly-shaped central region contains gray matter with neuron cell bodies'),

('multiple_choice', 'easy', 'Meninges', 3, 'Dura mater', 
JSON_ARRAY('Pia mater', 'Arachnoid mater', 'Dura mater', 'Epidural space'),
'The dura mater is the outermost protective layer of the meninges'),

('multiple_choice', 'medium', 'Reflexes', 3, 'Monosynaptic reflex', 
JSON_ARRAY('Polysynaptic reflex', 'Monosynaptic reflex', 'Crossed reflex', 'Withdrawal reflex'),
'The patellar (knee-jerk) reflex is a monosynaptic reflex'),

('multiple_choice', 'hard', 'Spinal Tracts', 3, 'Dorsal columns', 
JSON_ARRAY('Spinothalamic tract', 'Dorsal columns', 'Corticospinal tract', 'Spinocerebellar tract'),
'The dorsal columns carry proprioception and fine touch information'),

('multiple_choice', 'medium', 'Spinal Segments', 3, '8 pairs', 
JSON_ARRAY('7 pairs', '8 pairs', '12 pairs', '5 pairs'),
'There are 8 pairs of cervical spinal nerves'),

('multiple_choice', 'easy', 'Cauda Equina', 3, 'Bundle of nerve roots', 
JSON_ARRAY('Part of brain', 'Bundle of nerve roots', 'Type of vertebra', 'Spinal ligament'),
'The cauda equina is a bundle of spinal nerve roots at the lower end of the spinal cord'),

('multiple_choice', 'medium', 'Dermatomes', 3, 'Area of skin innervated by a single spinal nerve', 
JSON_ARRAY('Type of skin cell', 'Area of skin innervated by a single spinal nerve', 'Layer of epidermis', 'Skin receptor'),
'A dermatome is the area of skin supplied by a single spinal nerve');

-- ============================================
-- QUESTION BANK - LAB 4: Brain
-- ============================================
INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation) VALUES
('multiple_choice', 'easy', 'Brain Structure', 4, 'Cerebrum', 
JSON_ARRAY('Cerebellum', 'Cerebrum', 'Brainstem', 'Diencephalon'),
'The cerebrum is the largest part of the brain'),

('multiple_choice', 'medium', 'Brain Lobes', 4, 'Occipital lobe', 
JSON_ARRAY('Frontal lobe', 'Parietal lobe', 'Temporal lobe', 'Occipital lobe'),
'The occipital lobe processes visual information'),

('multiple_choice', 'hard', 'Cranial Nerves', 4, '12 pairs', 
JSON_ARRAY('10 pairs', '12 pairs', '14 pairs', '16 pairs'),
'There are 12 pairs of cranial nerves'),

('multiple_choice', 'medium', 'Brainstem', 4, 'Medulla oblongata', 
JSON_ARRAY('Pons', 'Medulla oblongata', 'Midbrain', 'Thalamus'),
'The medulla oblongata controls vital functions like breathing and heart rate'),

('multiple_choice', 'easy', 'Brain Protection', 4, 'Cerebrospinal fluid', 
JSON_ARRAY('Blood', 'Cerebrospinal fluid', 'Lymph', 'Plasma'),
'Cerebrospinal fluid cushions and protects the brain'),

('multiple_choice', 'hard', 'Diencephalon', 4, 'Thalamus', 
JSON_ARRAY('Hypothalamus', 'Thalamus', 'Pituitary', 'Pineal gland'),
'The thalamus acts as a relay station for sensory information'),

('multiple_choice', 'medium', 'Motor Control', 4, 'Frontal lobe', 
JSON_ARRAY('Frontal lobe', 'Parietal lobe', 'Temporal lobe', 'Occipital lobe'),
'The primary motor cortex is located in the frontal lobe'),

('multiple_choice', 'easy', 'Cerebellum', 4, 'Coordination and balance', 
JSON_ARRAY('Memory', 'Coordination and balance', 'Vision', 'Hearing'),
'The cerebellum coordinates movement and maintains balance'),

('multiple_choice', 'hard', 'Limbic System', 4, 'Hippocampus', 
JSON_ARRAY('Amygdala', 'Hippocampus', 'Thalamus', 'Hypothalamus'),
'The hippocampus is critical for forming new memories'),

('multiple_choice', 'medium', 'Cranial Nerves', 4, 'Vagus nerve (CN X)', 
JSON_ARRAY('Trigeminal nerve (CN V)', 'Facial nerve (CN VII)', 'Vagus nerve (CN X)', 'Hypoglossal nerve (CN XII)'),
'The vagus nerve has the most widespread distribution in the body'),

('multiple_choice', 'hard', 'Ventricular System', 4, 'Four ventricles', 
JSON_ARRAY('Two ventricles', 'Three ventricles', 'Four ventricles', 'Five ventricles'),
'The brain contains four interconnected ventricles filled with CSF'),

('multiple_choice', 'medium', 'Brain Hemispheres', 4, 'Corpus callosum', 
JSON_ARRAY('Corpus callosum', 'Cerebellum', 'Medulla', 'Pons'),
'The corpus callosum connects the left and right cerebral hemispheres'),

('multiple_choice', 'easy', 'Brain Tissue', 4, 'Gray matter', 
JSON_ARRAY('White matter', 'Gray matter', 'Meninges', 'Ventricles'),
'The cerebral cortex consists primarily of gray matter'),

('multiple_choice', 'hard', 'Basal Ganglia', 4, 'Motor control and learning', 
JSON_ARRAY('Vision processing', 'Hearing processing', 'Motor control and learning', 'Smell processing'),
'The basal ganglia are involved in motor control and procedural learning'),

('multiple_choice', 'medium', 'Brainstem Components', 4, 'Midbrain, pons, medulla', 
JSON_ARRAY('Cerebrum, cerebellum, diencephalon', 'Midbrain, pons, medulla', 'Thalamus, hypothalamus, pituitary', 'Frontal, parietal, temporal'),
'The brainstem consists of the midbrain, pons, and medulla oblongata');

-- ============================================
-- QUESTION BANK - LAB 5: Special Senses
-- ============================================
INSERT INTO QuestionBank (questionType, difficulty, topic, systemId, correctAnswer, options, explanation) VALUES
('multiple_choice', 'easy', 'Vision', 5, 'Retina', 
JSON_ARRAY('Cornea', 'Lens', 'Retina', 'Iris'),
'The retina contains photoreceptor cells (rods and cones)'),

('multiple_choice', 'medium', 'Hearing', 5, 'Cochlea', 
JSON_ARRAY('Semicircular canals', 'Cochlea', 'Vestibule', 'Tympanic membrane'),
'The cochlea contains the organ of Corti for hearing'),

('multiple_choice', 'hard', 'Eye Anatomy', 5, 'Accommodation', 
JSON_ARRAY('Pupillary reflex', 'Accommodation', 'Convergence', 'Diplopia'),
'Accommodation is the process of changing lens shape to focus on near objects'),

('multiple_choice', 'medium', 'Taste', 5, 'Five basic tastes', 
JSON_ARRAY('Three basic tastes', 'Four basic tastes', 'Five basic tastes', 'Six basic tastes'),
'There are five basic taste sensations: sweet, sour, salty, bitter, and umami'),

('multiple_choice', 'easy', 'Ear Anatomy', 5, 'Eardrum', 
JSON_ARRAY('Ossicles', 'Eardrum', 'Cochlea', 'Semicircular canals'),
'The tympanic membrane is commonly called the eardrum'),

('multiple_choice', 'hard', 'Vision', 5, 'Fovea centralis', 
JSON_ARRAY('Optic disc', 'Fovea centralis', 'Macula lutea', 'Ora serrata'),
'The fovea centralis has the highest concentration of cones for sharp central vision'),

('multiple_choice', 'medium', 'Equilibrium', 5, 'Vestibular apparatus', 
JSON_ARRAY('Cochlea', 'Vestibular apparatus', 'Ossicles', 'Eustachian tube'),
'The vestibular apparatus detects head position and movement'),

('multiple_choice', 'easy', 'Smell', 5, 'Olfactory epithelium', 
JSON_ARRAY('Nasal conchae', 'Olfactory epithelium', 'Nasal septum', 'Paranasal sinuses'),
'Olfactory receptors are located in the olfactory epithelium'),

('multiple_choice', 'medium', 'Eye Structures', 5, 'Aqueous humor', 
JSON_ARRAY('Vitreous humor', 'Aqueous humor', 'Tears', 'Blood'),
'Aqueous humor fills the anterior chamber of the eye'),

('multiple_choice', 'hard', 'Hearing Mechanism', 5, 'Hair cells', 
JSON_ARRAY('Rods', 'Cones', 'Hair cells', 'Ganglion cells'),
'Mechanoreceptor hair cells in the organ of Corti transduce sound vibrations');

-- ============================================
-- Now link questions to quizzes
-- ============================================

-- First, get the starting bankId for reference
SET @bank_start = (SELECT MIN(bankId) FROM QuestionBank WHERE topic = 'Anatomical Terminology');

-- Quiz 1: Anatomical Language (Questions 1-10)
INSERT INTO QuizQuestion (quizId, bankId, questionText, difficulty, points, displayOrder) VALUES
(1, @bank_start + 0, 'What does the term "superior" mean in anatomical terminology?', 'easy', 1.00, 1),
(1, @bank_start + 1, 'Which plane divides the body into left and right portions?', 'easy', 1.00, 2),
(1, @bank_start + 2, 'What does "distal" mean?', 'medium', 1.50, 3),
(1, @bank_start + 3, 'What does "superficial" mean?', 'medium', 1.50, 4),
(1, @bank_start + 4, 'Which plane divides the body into anterior and posterior portions?', 'easy', 1.00, 5),
(1, @bank_start + 5, 'What is the correct anatomical position?', 'medium', 1.50, 6),
(1, @bank_start + 6, 'What term describes structures on the same side of the body?', 'hard', 2.00, 7),
(1, @bank_start + 7, 'Which cavity contains the heart and lungs?', 'medium', 1.50, 8),
(1, @bank_start + 8, 'What does "posterior" mean?', 'easy', 1.00, 9),
(1, @bank_start + 9, 'What term means "away from the midline"?', 'medium', 1.50, 10);

-- Quiz 2: Bones and Markings (Questions 11-22)
SET @bank_skeletal = (SELECT MIN(bankId) FROM QuestionBank WHERE topic = 'Skeletal System');

INSERT INTO QuizQuestion (quizId, bankId, questionText, difficulty, points, displayOrder) VALUES
(2, @bank_skeletal + 0, 'How many bones are in the adult human skeleton?', 'easy', 1.00, 1),
(2, @bank_skeletal + 1, 'Which of the following is a long bone?', 'medium', 1.50, 2),
(2, @bank_skeletal + 2, 'Which bone forms the forehead?', 'medium', 1.50, 3),
(2, @bank_skeletal + 3, 'What is a foramen?', 'hard', 2.00, 4),
(2, @bank_skeletal + 4, 'How many cervical vertebrae are there?', 'easy', 1.00, 5),
(2, @bank_skeletal + 5, 'What bones make up the pectoral girdle?', 'medium', 1.50, 6),
(2, @bank_skeletal + 6, 'What type of joint is the shoulder?', 'hard', 2.00, 7),
(2, @bank_skeletal + 7, 'Which is the longest bone in the body?', 'medium', 1.50, 8),
(2, @bank_skeletal + 8, 'What is the dense outer layer of bone called?', 'easy', 1.00, 9),
(2, @bank_skeletal + 9, 'How many pairs of ribs do humans have?', 'medium', 1.50, 10),
(2, @bank_skeletal + 10, 'What is a condyle?', 'hard', 2.00, 11),
(2, @bank_skeletal + 11, 'How many bones are in the axial skeleton?', 'medium', 1.50, 12);

-- Quiz 3: Spinal System (Questions 23-32)
SET @bank_spinal = (SELECT MIN(bankId) FROM QuestionBank WHERE topic = 'Spinal Cord');

INSERT INTO QuizQuestion (quizId, bankId, questionText, difficulty, points, displayOrder) VALUES
(3, @bank_spinal + 0, 'Where does the spinal cord typically end?', 'easy', 1.00, 1),
(3, @bank_spinal + 1, 'How many pairs of spinal nerves are there?', 'medium', 1.50, 2),
(3, @bank_spinal + 2, 'Which plexus innervates the upper limb?', 'hard', 2.00, 3),
(3, @bank_spinal + 3, 'What is found in the central region of the spinal cord?', 'medium', 1.50, 4),
(3, @bank_spinal + 4, 'What is the outermost layer of the meninges?', 'easy', 1.00, 5),
(3, @bank_spinal + 5, 'What type of reflex is the knee-jerk reflex?', 'medium', 1.50, 6),
(3, @bank_spinal + 6, 'Which tract carries proprioception information?', 'hard', 2.00, 7),
(3, @bank_spinal + 7, 'How many pairs of cervical spinal nerves are there?', 'medium', 1.50, 8),
(3, @bank_spinal + 8, 'What is the cauda equina?', 'easy', 1.00, 9),
(3, @bank_spinal + 9, 'What is a dermatome?', 'medium', 1.50, 10);

-- Quiz 4: Brain (Questions 33-47)
SET @bank_brain = (SELECT MIN(bankId) FROM QuestionBank WHERE topic = 'Brain Structure');

INSERT INTO QuizQuestion (quizId, bankId, questionText, difficulty, points, displayOrder) VALUES
(4, @bank_brain + 0, 'What is the largest part of the brain?', 'easy', 1.00, 1),
(4, @bank_brain + 1, 'Which lobe processes visual information?', 'medium', 1.50, 2),
(4, @bank_brain + 2, 'How many pairs of cranial nerves are there?', 'hard', 2.00, 3),
(4, @bank_brain + 3, 'Which brainstem structure controls vital functions?', 'medium', 1.50, 4),
(4, @bank_brain + 4, 'What fluid cushions the brain?', 'easy', 1.00, 5),
(4, @bank_brain + 5, 'Which structure relays sensory information?', 'hard', 2.00, 6),
(4, @bank_brain + 6, 'Where is the primary motor cortex located?', 'medium', 1.50, 7),
(4, @bank_brain + 7, 'What is the cerebellum responsible for?', 'easy', 1.00, 8),
(4, @bank_brain + 8, 'Which structure is critical for forming new memories?', 'hard', 2.00, 9),
(4, @bank_brain + 9, 'Which cranial nerve has the most widespread distribution?', 'medium', 1.50, 10),
(4, @bank_brain + 10, 'How many ventricles are in the brain?', 'hard', 2.00, 11),
(4, @bank_brain + 11, 'What connects the cerebral hemispheres?', 'medium', 1.50, 12),
(4, @bank_brain + 12, 'What tissue makes up the cerebral cortex?', 'easy', 1.00, 13),
(4, @bank_brain + 13, 'What are the basal ganglia involved in?', 'hard', 2.00, 14),
(4, @bank_brain + 14, 'What are the three components of the brainstem?', 'medium', 1.50, 15);

-- Quiz 5: Special Senses (Questions 48-57)
SET @bank_senses = (SELECT MIN(bankId) FROM QuestionBank WHERE topic = 'Vision');

INSERT INTO QuizQuestion (quizId, bankId, questionText, difficulty, points, displayOrder) VALUES
(5, @bank_senses + 0, 'Which structure contains photoreceptor cells?', 'easy', 1.00, 1),
(5, @bank_senses + 1, 'Which structure contains the organ of Corti?', 'medium', 1.50, 2),
(5, @bank_senses + 2, 'What is the process of changing lens shape called?', 'hard', 2.00, 3),
(5, @bank_senses + 3, 'How many basic taste sensations are there?', 'medium', 1.50, 4),
(5, @bank_senses + 4, 'What is the common name for the tympanic membrane?', 'easy', 1.00, 5),
(5, @bank_senses + 5, 'Which area has the highest concentration of cones?', 'hard', 2.00, 6),
(5, @bank_senses + 6, 'Which apparatus detects head position?', 'medium', 1.50, 7),
(5, @bank_senses + 7, 'Where are olfactory receptors located?', 'easy', 1.00, 8),
(5, @bank_senses + 8, 'What fills the anterior chamber of the eye?', 'medium', 1.50, 9),
(5, @bank_senses + 9, 'What cells transduce sound vibrations?', 'hard', 2.00, 10);

-- ============================================
-- ANSWER RECORDS for completed quiz attempts
-- ============================================

-- Get the starting questionId for each quiz
SET @q1_start = (SELECT MIN(questionId) FROM QuizQuestion WHERE quizId = 1);
SET @q2_start = (SELECT MIN(questionId) FROM QuizQuestion WHERE quizId = 2);

-- Student 1, Quiz 1 (Attempt 1) - Score: 95.00
INSERT INTO AnswerRecord (attemptId, questionId, studentAnswer, isCorrect, pointsEarned, timeSpent) VALUES
(1, @q1_start + 0, 'Toward the head', TRUE, 1.00, 45),
(1, @q1_start + 1, 'Divides body into left and right', TRUE, 1.00, 52),
(1, @q1_start + 2, 'Away from the point of attachment', TRUE, 1.50, 68),
(1, @q1_start + 3, 'Closer to the surface', TRUE, 1.50, 55),
(1, @q1_start + 4, 'Frontal plane', TRUE, 1.00, 48),
(1, @q1_start + 5, 'Standing upright, arms at sides, palms forward', TRUE, 1.50, 72),
(1, @q1_start + 6, 'Ipsilateral', TRUE, 2.00, 95),
(1, @q1_start + 7, 'Thoracic cavity', TRUE, 1.50, 58),
(1, @q1_start + 8, 'Toward the front', FALSE, 0.00, 42),  -- Wrong answer
(1, @q1_start + 9, 'Lateral', TRUE, 1.50, 65);

-- Student 1, Quiz 2 (Attempt 2) - Score: 92.00
INSERT INTO AnswerRecord (attemptId, questionId, studentAnswer, isCorrect, pointsEarned, timeSpent) VALUES
(2, @q2_start + 0, '206', TRUE, 1.00, 38),
(2, @q2_start + 1, 'Humerus', TRUE, 1.50, 62),
(2, @q2_start + 2, 'Frontal bone', TRUE, 1.50, 58),
(2, @q2_start + 3, 'Foramen', TRUE, 2.00, 88),
(2, @q2_start + 4, '7', TRUE, 1.00, 35),
(2, @q2_start + 5, 'Clavicle and scapula', TRUE, 1.50, 65),
(2, @q2_start + 6, 'Ball-and-socket', TRUE, 2.00, 92),
(2, @q2_start + 7, 'Femur', TRUE, 1.50, 48),
(2, @q2_start + 8, 'Spongy bone', FALSE, 0.00, 45),  -- Wrong answer
(2, @q2_start + 9, '12 pairs', TRUE, 1.50, 52),
(2, @q2_start + 10, 'Tubercle', FALSE, 0.00, 78),  -- Wrong answer
(2, @q2_start + 11, '80', TRUE, 1.50, 68);

-- Student 2, Quiz 1 (Attempt 3) - Score: 88.00
INSERT INTO AnswerRecord (attemptId, questionId, studentAnswer, isCorrect, pointsEarned, timeSpent) VALUES
(3, @q1_start + 0, 'Toward the head', TRUE, 1.00, 50),
(3, @q1_start + 1, 'Divides body into left and right', TRUE, 1.00, 55),
(3, @q1_start + 2, 'Toward the point of attachment', FALSE, 0.00, 72),  -- Wrong answer
(3, @q1_start + 3, 'Closer to the surface', TRUE, 1.50, 58),
(3, @q1_start + 4, 'Frontal plane', TRUE, 1.00, 45),
(3, @q1_start + 5, 'Standing upright, arms at sides, palms forward', TRUE, 1.50, 68),
(3, @q1_start + 6, 'On opposite sides', FALSE, 0.00, 88),  -- Wrong answer
(3, @q1_start + 7, 'Thoracic cavity', TRUE, 1.50, 52),
(3, @q1_start + 8, 'Toward the back', TRUE, 1.00, 48),
(3, @q1_start + 9, 'Lateral', TRUE, 1.50, 62);

-- Student 2, Quiz 2 (Attempt 4) - Score: 85.00
INSERT INTO AnswerRecord (attemptId, questionId, studentAnswer, isCorrect, pointsEarned, timeSpent) VALUES
(4, @q2_start + 0, '206', TRUE, 1.00, 42),
(4, @q2_start + 1, 'Humerus', TRUE, 1.50, 58),
(4, @q2_start + 2, 'Frontal bone', TRUE, 1.50, 62),
(4, @q2_start + 3, 'Ridge', FALSE, 0.00, 85),  -- Wrong answer
(4, @q2_start + 4, '7', TRUE, 1.00, 38),
(4, @q2_start + 5, 'Clavicle and scapula', TRUE, 1.50, 68),
(4, @q2_start + 6, 'Hinge', FALSE, 0.00, 92),  -- Wrong answer
(4, @q2_start + 7, 'Femur', TRUE, 1.50, 48),
(4, @q2_start + 8, 'Compact bone', TRUE, 1.00, 42),
(4, @q2_start + 9, '12 pairs', TRUE, 1.50, 55),
(4, @q2_start + 10, 'Condyle', TRUE, 2.00, 88),
(4, @q2_start + 11, '70', FALSE, 0.00, 72);  -- Wrong answer

-- Student 3, Quiz 1 (Attempt 5) - Score: 82.00
INSERT INTO AnswerRecord (attemptId, questionId, studentAnswer, isCorrect, pointsEarned, timeSpent) VALUES
(5, @q1_start + 0, 'Toward the head', TRUE, 1.00, 48),
(5, @q1_start + 1, 'Divides body into left and right', TRUE, 1.00, 58),
(5, @q1_start + 2, 'Away from the point of attachment', TRUE, 1.50, 75),
(5, @q1_start + 3, 'Deeper inside', FALSE, 0.00, 82),  -- Wrong answer
(5, @q1_start + 4, 'Frontal plane', TRUE, 1.00, 52),
(5, @q1_start + 5, 'Standing upright, arms raised', FALSE, 0.00, 78),  -- Wrong answer
(5, @q1_start + 6, 'On opposite sides', FALSE, 0.00, 95),  -- Wrong answer
(5, @q1_start + 7, 'Thoracic cavity', TRUE, 1.50, 62),
(5, @q1_start + 8, 'Toward the back', TRUE, 1.00, 55),
(5, @q1_start + 9, 'Lateral', TRUE, 1.50, 68);

-- ============================================
-- Summary Statistics
-- ============================================
-- Total Questions in Bank: 57
-- Total Quiz Questions Created: 57
-- Total Answer Records: 50
-- Quizzes with Questions: 5 out of 10
-- Students with Answer Records: 3 (Alex, Maria, David)
-- Average Quiz Completion Time: ~20 minutes
-- ============================================



SELECT 
    quizId,
    title,
    description,
    timeLimit,
    totalQuestions,
    passingScore,
    isCustom,
    generatedAt
FROM Quiz
WHERE moduleId = 1; 


SELECT 
    qa.attemptId,
    qa.quizId,
    q.title as quiz_title,
    qa.startTime,
    qa.endTime,
    qa.status,
    qa.getScore,
    TIMESTAMPDIFF(MINUTE, qa.startTime, qa.endTime) as duration_minutes,
    CASE 
        WHEN qa.getScore >= q.passingScore THEN 'Passed'
        WHEN qa.getScore < q.passingScore THEN 'Failed'
        ELSE 'Not Graded'
    END as result
FROM QuizAttempt qa
INNER JOIN Quiz q ON qa.quizId = q.quizId
WHERE qa.studentId = 1  -- Replace with student ID
ORDER BY qa.startTime DESC;

select * from questionbank;
select * from quizquestion;

