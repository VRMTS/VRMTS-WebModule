const db = require('../config/db');

// Get available modules for quiz selection
const getQuizModules = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const connection = await db();

    // Get studentId from userId
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentId = students[0].studentId;

    // Get modules with quiz information (only assigned modules for the student)
    const [modules] = await connection.execute(`
      SELECT
        m.moduleId,
        m.title AS name,
        m.description,
        m.difficultyLevel as difficulty,
        COUNT(DISTINCT q.quizId) as quizCount,
        COUNT(DISTINCT qq.questionId) as totalQuestions
      FROM Module m
      LEFT JOIN StudentModuleAssignment sma ON m.moduleId = sma.moduleId AND sma.studentId = ?
      LEFT JOIN Quiz q ON m.moduleId = q.moduleId
      LEFT JOIN QuizQuestion qq ON q.quizId = qq.quizId
      LEFT JOIN QuestionBank qb ON qq.bankId = qb.bankId
      WHERE sma.studentId IS NOT NULL
      GROUP BY m.moduleId, m.title, m.description, m.difficultyLevel
      ORDER BY m.title ASC
    `, [studentId]);

    await connection.end();

    res.json({
      success: true,
      data: modules
    });

  } catch (error) {
    console.error('Error fetching quiz modules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz modules',
      error: error.message
    });
  }
};

// Get quiz statistics for the student
const getQuizStats = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const connection = await db();

    // Get studentId from userId
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentId = students[0].studentId;

    // Get overall quiz statistics
    const [stats] = await connection.execute(`
      SELECT
        COUNT(DISTINCT qa.attemptId) as totalAttempts,
        COUNT(DISTINCT CASE WHEN qa.status = 'completed' THEN qa.attemptId END) as completedAttempts,
        COUNT(DISTINCT CASE WHEN qa.status = 'completed' AND qa.getScore >= COALESCE(q.passingScore, 60) THEN qa.attemptId END) as passedAttempts,
        AVG(qa.getScore) as averageScore,
        MAX(qa.getScore) as highestScore,
        SUM(TIMESTAMPDIFF(MINUTE, qa.startTime, qa.endTime)) as totalTimeSpent,
        COUNT(DISTINCT q.quizId) as uniqueQuizzesTaken
      FROM QuizAttempt qa
      JOIN Quiz q ON qa.quizId = q.quizId
      WHERE qa.studentId = ?
    `, [studentId]);

    await connection.end();

    const statData = stats[0] || {
      totalAttempts: 0,
      completedAttempts: 0,
      passedAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      totalTimeSpent: 0,
      uniqueQuizzesTaken: 0
    };

    // Transform to match frontend interface
    const transformedStats = {
      quizzesTaken: statData.uniqueQuizzesTaken,
      averageScore: Math.round(statData.averageScore || 0),
      passRate: statData.completedAttempts > 0 ? Math.round((statData.passedAttempts / statData.completedAttempts) * 100) : 0,
      totalTime: Math.round((statData.totalTimeSpent || 0) / 60) // Convert minutes to hours
    };

    res.json({
      success: true,
      data: transformedStats
    });

  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz statistics',
      error: error.message
    });
  }
};

// Start a module quiz
const startModuleQuiz = async (req, res) => {
  let connection = null;
  try {
    // Validate session
    if (!req.session?.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userId = req.session.user.userId;
    const moduleId = parseInt(req.params.moduleId, 10);
    
    if (isNaN(moduleId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid module ID'
      });
    }

    connection = await db();

    // Get studentId from userId
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentId = students[0].studentId;

    // Verify module exists
    const [modules] = await connection.execute(
      'SELECT moduleId, title FROM Module WHERE moduleId = ?',
      [moduleId]
    );

    if (modules.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Quiz configuration
    const quizSize = 10;
    const timeLimit = 15;
    const passingScore = 60;

    // Get random questions from QuestionBank (moduleId column doesn't exist, so we select all)
    // Try to get questionText if column exists, otherwise we'll construct it
    // Note: LIMIT cannot be parameterized in some MySQL versions, so we use template literal (safe since quizSize is controlled)
    let questions;
    try {
      [questions] = await connection.execute(
        `SELECT bankId, difficulty, topic, options, questionType, correctAnswer, explanation, questionText FROM QuestionBank ORDER BY RAND() LIMIT ${parseInt(quizSize)}`
      );
    } catch (e) {
      // If questionText column doesn't exist, select without it
      [questions] = await connection.execute(
        `SELECT bankId, difficulty, topic, options, questionType, correctAnswer, explanation FROM QuestionBank ORDER BY RAND() LIMIT ${parseInt(quizSize)}`
      );
    }

    if (questions.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'No questions available for this module'
      });
    }

    // Map difficulty to ENUM values
    const mapDifficulty = (difficulty) => {
      if (!difficulty) return 'medium';
      const lower = difficulty.toLowerCase();
      if (lower === 'easy' || lower === 'beginner') return 'easy';
      if (lower === 'hard' || lower === 'advanced' || lower === 'expert') return 'hard';
      return 'medium';
    };

    // Helper to extract question text - use actual questionText if available, otherwise try to get from existing QuizQuestion
    const getQuestionText = async (question, connection) => {
      // If questionText exists in the result, use it
      if (question.questionText) {
        return question.questionText;
      }
      
      // Try to get questionText from existing QuizQuestion records with same bankId
      try {
        const [existingQuestions] = await connection.execute(
          'SELECT questionText FROM QuizQuestion WHERE bankId = ? AND questionText IS NOT NULL AND questionText != "" LIMIT 1',
          [question.bankId]
        );
        if (existingQuestions.length > 0 && existingQuestions[0].questionText) {
          return existingQuestions[0].questionText;
        }
      } catch (e) {
        // If query fails, continue to fallback
      }
      
      // Otherwise, try to construct a meaningful question from topic
      if (question.topic) {
        return `What is related to ${question.topic}?`;
      }
      return 'Quiz Question';
    };

    // Start transaction - create quiz, add questions, create attempt
    await connection.beginTransaction();

    try {
      // Create quiz - use basic schema (moduleId, timeLimit, totalQuestions, passingScore)
      const [quizResult] = await connection.execute(
        'INSERT INTO Quiz (moduleId, timeLimit, totalQuestions, passingScore) VALUES (?, ?, ?, ?)',
        [moduleId, timeLimit, quizSize, passingScore]
      );

      const quizId = quizResult.insertId;

      // Insert questions into QuizQuestion
      for (let i = 0; i < questions.length; i++) {
        const mappedDifficulty = mapDifficulty(questions[i].difficulty);
        const questionText = await getQuestionText(questions[i], connection);
        
        await connection.execute(
          'INSERT INTO QuizQuestion (quizId, bankId, questionText, difficulty, points, displayOrder) VALUES (?, ?, ?, ?, 1, ?)',
          [quizId, questions[i].bankId, questionText, mappedDifficulty, i + 1]
        );
      }

      // Create quiz attempt
      const [attemptResult] = await connection.execute(
        'INSERT INTO QuizAttempt (studentId, quizId, startTime, status) VALUES (?, ?, NOW(), "in_progress")',
        [studentId, quizId]
      );

      const attemptId = attemptResult.insertId;

      // Commit transaction
      await connection.commit();
      await connection.end();

      res.json({
        success: true,
        data: {
          attemptId,
          quizId,
          timeLimit,
          totalQuestions: questions.length,
          passingScore,
          questionsAssigned: questions.length
        }
      });

    } catch (transactionError) {
      // Rollback on any error
      await connection.rollback();
      throw transactionError;
    }

  } catch (error) {
    console.error('Error starting module quiz:', error);
    
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error closing connection:', closeError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to start quiz',
      error: error.message
    });
  }
};

// Start a timed exam
const startTimedExam = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { timeLimit, questionCount, selectedModules } = req.body;
    const connection = await db();

    // Get studentId from userId
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentId = students[0].studentId;

    // For custom quizzes, use first selected module or first available module as moduleId
    let quizModuleId = null;
    if (selectedModules && selectedModules.length > 0) {
      quizModuleId = selectedModules[0];
    } else {
      // Get first available module
      const [firstModule] = await connection.execute('SELECT moduleId FROM Module LIMIT 1');
      quizModuleId = firstModule.length > 0 ? firstModule[0].moduleId : 1;
    }

    // Create a custom quiz for timed exam
    const [quizResult] = await connection.execute(
      'INSERT INTO Quiz (moduleId, timeLimit, totalQuestions, passingScore) VALUES (?, ?, ?, 60)',
      [quizModuleId, timeLimit, questionCount]
    );

    const quizId = quizResult.insertId;

    let questions = [];

    // Helper function to map difficulty to ENUM values
    const mapDifficulty = (difficulty) => {
      if (!difficulty) return 'medium';
      const lower = difficulty.toLowerCase();
      if (lower === 'easy' || lower === 'beginner') return 'easy';
      if (lower === 'hard' || lower === 'advanced' || lower === 'expert') return 'hard';
      return 'medium';
    };

    // Helper to get question text - use actual questionText if available
    const getQuestionText = (question) => {
      if (question.questionText) {
        return question.questionText;
      }
      return question.topic 
        ? `What is related to ${question.topic}?` 
        : 'Quiz Question';
    };

    // Select random questions (moduleId column doesn't exist in QuestionBank)
    // Try to get questionText if column exists
    // LIMIT cannot be parameterized, so we use template literal (safe after validation)
    const safeQuestionCount = parseInt(questionCount) || 20;
    let allQuestions;
    try {
      [allQuestions] = await connection.execute(
        `SELECT bankId, difficulty, topic, options, questionType, correctAnswer, explanation, questionText FROM QuestionBank ORDER BY RAND() LIMIT ${safeQuestionCount}`
      );
    } catch (e) {
      // If questionText column doesn't exist, select without it
      [allQuestions] = await connection.execute(
        `SELECT bankId, difficulty, topic, options, questionType, correctAnswer, explanation FROM QuestionBank ORDER BY RAND() LIMIT ${safeQuestionCount}`
      );
    }
    questions = allQuestions;

    if (questions.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'No questions available for the selected modules'
      });
    }

    // Insert questions into QuizQuestion
    for (let i = 0; i < questions.length; i++) {
      const mappedDifficulty = mapDifficulty(questions[i].difficulty);
      const questionText = getQuestionText(questions[i]);
      await connection.execute(
        'INSERT INTO QuizQuestion (quizId, bankId, questionText, difficulty, points, displayOrder) VALUES (?, ?, ?, ?, 1, ?)',
        [quizId, questions[i].bankId, questionText, mappedDifficulty, i + 1]
      );
    }

    // Create quiz attempt
    const [attemptResult] = await connection.execute(
      'INSERT INTO QuizAttempt (studentId, quizId, startTime, status) VALUES (?, ?, NOW(), "in_progress")',
      [studentId, quizId]
    );

    const attemptId = attemptResult.insertId;

    await connection.end();

    res.json({
      success: true,
      data: {
        attemptId,
        quizId,
        timeLimit,
        totalQuestions: questions.length,
        passingScore: 60,
        questionsAssigned: questions.length
      }
    });

  } catch (error) {
    console.error('Error starting timed exam:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start timed exam',
      error: error.message
    });
  }
};

// Start an adaptive test
const startAdaptiveTest = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { targetDifficulty, questionCount } = req.body;
    const connection = await db();

    // Get studentId from userId
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentId = students[0].studentId;

    // For adaptive test, use first available module as moduleId
    const [firstModule] = await connection.execute('SELECT moduleId FROM Module LIMIT 1');
    const quizModuleId = firstModule.length > 0 ? firstModule[0].moduleId : 1;

    // Create a custom quiz for adaptive test
    const [quizResult] = await connection.execute(
      'INSERT INTO Quiz (moduleId, timeLimit, totalQuestions, passingScore) VALUES (?, 45, ?, 70)',
      [quizModuleId, questionCount]
    );

    const quizId = quizResult.insertId;

    // Helper function to map difficulty to ENUM values
    const mapDifficulty = (difficulty) => {
      if (!difficulty) return 'medium';
      const lower = difficulty.toLowerCase();
      if (lower === 'easy' || lower === 'beginner') return 'easy';
      if (lower === 'hard' || lower === 'advanced' || lower === 'expert') return 'hard';
      return 'medium'; // default to medium for intermediate or any other value
    };

    // Map targetDifficulty to match QuestionBank difficulty values
    // QuestionBank might use 'beginner', 'intermediate', 'advanced' while QuizQuestion uses 'easy', 'medium', 'hard'
    let searchDifficulty = targetDifficulty;
    if (targetDifficulty === 'easy' || targetDifficulty === 'beginner') {
      searchDifficulty = 'easy';
    } else if (targetDifficulty === 'hard' || targetDifficulty === 'advanced') {
      searchDifficulty = 'hard';
    } else {
      searchDifficulty = 'medium'; // intermediate or medium
    }

    // Helper to get question text - use actual questionText if available
    const getQuestionText = (question) => {
      if (question.questionText) {
        return question.questionText;
      }
      return question.topic 
        ? `What is related to ${question.topic}?` 
        : 'Quiz Question';
    };

    // Select questions based on difficulty
    // Try to get questionText if column exists
    // LIMIT cannot be parameterized, so we use template literal (safe after validation)
    const safeQuestionCount = parseInt(questionCount) || 18;
    let questions;
    try {
      [questions] = await connection.execute(
        `SELECT bankId, difficulty, topic, options, questionType, correctAnswer, explanation, questionText FROM QuestionBank WHERE difficulty = ? OR difficulty = ? ORDER BY RAND() LIMIT ${safeQuestionCount}`,
        [targetDifficulty, searchDifficulty]
      );
    } catch (e) {
      // If questionText column doesn't exist, select without it
      [questions] = await connection.execute(
        `SELECT bankId, difficulty, topic, options, questionType, correctAnswer, explanation FROM QuestionBank WHERE difficulty = ? OR difficulty = ? ORDER BY RAND() LIMIT ${safeQuestionCount}`,
        [targetDifficulty, searchDifficulty]
      );
    }

    if (questions.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'No questions available for the selected difficulty level'
      });
    }

    // Insert questions into QuizQuestion
    for (let i = 0; i < questions.length; i++) {
      const mappedDifficulty = mapDifficulty(questions[i].difficulty);
      const questionText = getQuestionText(questions[i]);
      await connection.execute(
        'INSERT INTO QuizQuestion (quizId, bankId, questionText, difficulty, points, displayOrder) VALUES (?, ?, ?, ?, 1, ?)',
        [quizId, questions[i].bankId, questionText, mappedDifficulty, i + 1]
      );
    }

    // Create quiz attempt
    const [attemptResult] = await connection.execute(
      'INSERT INTO QuizAttempt (studentId, quizId, startTime, status) VALUES (?, ?, NOW(), "in_progress")',
      [studentId, quizId]
    );

    const attemptId = attemptResult.insertId;

    await connection.end();

    res.json({
      success: true,
      data: {
        attemptId,
        quizId,
        timeLimit: 45,
        totalQuestions: questionCount,
        passingScore: 70
      }
    });

  } catch (error) {
    console.error('Error starting adaptive test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start adaptive test',
      error: error.message
    });
  }
};

// Get previous quiz attempts
const getQuizAttempts = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const connection = await db();

    // Get studentId from userId
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentId = students[0].studentId;

    // Get quiz attempts with details
    const [attempts] = await connection.execute(`
      SELECT
        qa.attemptId,
        qa.startTime,
        qa.endTime,
        qa.status,
        qa.getScore,
        m.title as moduleTitle,
        q.timeLimit,
        q.totalQuestions,
        COALESCE(q.passingScore, 60) as passingScore
      FROM QuizAttempt qa
      JOIN Quiz q ON qa.quizId = q.quizId
      LEFT JOIN Module m ON q.moduleId = m.moduleId
      WHERE qa.studentId = ?
      ORDER BY qa.startTime DESC
    `, [studentId]);

    await connection.end();

    // Transform data to match frontend interface with defensive defaults
    const transformedAttempts = attempts.map(attempt => {
      const start = attempt.startTime ? new Date(attempt.startTime) : null;
      const end = attempt.endTime ? new Date(attempt.endTime) : null;
      const quizTitle = attempt.moduleTitle || '';

      return {
        date: start ? start.toLocaleDateString() : 'N/A',
        type: 'Module Quiz',
        module: attempt.moduleTitle || quizTitle || 'Quiz',
        score: typeof attempt.getScore === 'number' ? attempt.getScore : 0,
        time: end && start ? `${Math.floor((end.getTime() - start.getTime()) / (1000 * 60))}m` : 'N/A',
        status: attempt.status === 'completed'
          ? ((typeof attempt.getScore === 'number' ? attempt.getScore : 0) >= (attempt.passingScore || 60) ? 'passed' : 'failed')
          : (attempt.status || 'in_progress')
      };
    });

    res.json({
      success: true,
      data: transformedAttempts
    });

  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz attempts',
      error: error.message
    });
  }
};

// Submit an answer for a specific question in a quiz attempt
const submitAnswer = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    // Handle both route formats: /attempt/:attemptId/answer and /submit-answer
    const attemptId = req.params.attemptId || req.body.attemptId;
    const { questionId, answer, timeSpent } = req.body;

    if (!attemptId || !questionId) {
      return res.status(400).json({
        success: false,
        message: 'Attempt ID and Question ID are required'
      });
    }

    const connection = await db();

    // Get studentId from userId
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentId = students[0].studentId;

    // Verify the attempt belongs to the student and is still in progress
    const [attempts] = await connection.execute(
      'SELECT qa.attemptId, qa.status, qq.questionId, qb.correctAnswer, qq.points FROM QuizAttempt qa JOIN QuizQuestion qq ON qa.quizId = qq.quizId JOIN QuestionBank qb ON qq.bankId = qb.bankId WHERE qa.attemptId = ? AND qa.studentId = ? AND qq.questionId = ?',
      [attemptId, studentId, questionId]
    );

    if (attempts.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt or question not found'
      });
    }

    const attempt = attempts[0];

    if (attempt.status !== 'in_progress') {
      await connection.end();
      return res.status(400).json({
        success: false,
        message: 'Quiz attempt is no longer in progress'
      });
    }

    // Check if answer is correct (handle string comparison, case-insensitive, trim whitespace)
    const normalizedAnswer = String(answer || '').trim();
    const normalizedCorrect = String(attempt.correctAnswer || '').trim();
    const isCorrect = normalizedAnswer.toLowerCase() === normalizedCorrect.toLowerCase();
    const pointsEarned = isCorrect ? (attempt.points || 1) : 0;

    // Insert or update answer record
    await connection.execute(
      'INSERT INTO AnswerRecord (attemptId, questionId, studentAnswer, isCorrect, pointsEarned, timeSpent, recordAnswer, validate) VALUES (?, ?, ?, ?, ?, ?, TRUE, TRUE) ON DUPLICATE KEY UPDATE studentAnswer = VALUES(studentAnswer), isCorrect = VALUES(isCorrect), pointsEarned = VALUES(pointsEarned), timeSpent = VALUES(timeSpent)',
      [attemptId, questionId, answer, isCorrect, pointsEarned, timeSpent || 0]
    );

    await connection.end();

    res.json({
      success: true,
      data: {
        isCorrect,
        pointsEarned,
        correctAnswer: attempt.correctAnswer
      }
    });

  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer',
      error: error.message
    });
  }
};

// Get quiz progress for a specific attempt
const getQuizProgress = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { attemptId } = req.params;

    const connection = await db();

    // Get studentId from userId
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentId = students[0].studentId;

    // Get attempt details and progress
    const [attempts] = await connection.execute(`
      SELECT
        qa.attemptId,
        qa.startTime,
        qa.status,
        q.quizId,
        q.timeLimit,
        q.totalQuestions,
        COUNT(ar.recordId) as answeredQuestions,
        SUM(ar.pointsEarned) as totalPointsEarned,
        SUM(ar.timeSpent) as totalTimeSpent
      FROM QuizAttempt qa
      JOIN Quiz q ON qa.quizId = q.quizId
      LEFT JOIN AnswerRecord ar ON qa.attemptId = ar.attemptId
      WHERE qa.attemptId = ? AND qa.studentId = ?
      GROUP BY qa.attemptId, qa.startTime, qa.status, q.quizId, q.timeLimit, q.totalQuestions
    `, [attemptId, studentId]);

    if (attempts.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    const attempt = attempts[0];

    // Get question statuses
    const [questionStatuses] = await connection.execute(`
      SELECT
        qq.questionId,
        qq.displayOrder,
        CASE WHEN ar.recordId IS NOT NULL THEN TRUE ELSE FALSE END as isAnswered,
        ar.isCorrect,
        ar.pointsEarned,
        ar.timeSpent
      FROM QuizQuestion qq
      JOIN Quiz q ON qq.quizId = q.quizId
      JOIN QuizAttempt qa ON q.quizId = qa.quizId
      LEFT JOIN AnswerRecord ar ON qq.questionId = ar.questionId AND qa.attemptId = ar.attemptId
      WHERE qa.attemptId = ?
      ORDER BY qq.displayOrder ASC
    `, [attemptId]);

    await connection.end();

    const progress = {
      attemptId: attempt.attemptId,
      status: attempt.status,
      startTime: attempt.startTime,
      timeLimit: attempt.timeLimit,
      totalQuestions: attempt.totalQuestions,
      answeredQuestions: attempt.answeredQuestions || 0,
      totalPointsEarned: attempt.totalPointsEarned || 0,
      totalTimeSpent: attempt.totalTimeSpent || 0,
      progressPercentage: Math.round(((attempt.answeredQuestions || 0) / attempt.totalQuestions) * 100),
      questions: questionStatuses.map(q => ({
        questionId: q.questionId,
        displayOrder: q.displayOrder,
        isAnswered: q.isAnswered,
        isCorrect: q.isCorrect,
        pointsEarned: q.pointsEarned || 0,
        timeSpent: q.timeSpent || 0
      }))
    };

    res.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Error fetching quiz progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz progress',
      error: error.message
    });
  }
};

// Finish a quiz attempt
const finishQuiz = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { attemptId } = req.params;

    const connection = await db();

    // Get studentId from userId
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentId = students[0].studentId;

    // Get attempt details and calculate final score
    const [attempts] = await connection.execute(`
      SELECT
        qa.attemptId,
        qa.status,
        q.quizId,
        q.passingScore,
        q.totalQuestions,
        COUNT(ar.recordId) as answeredQuestions,
        SUM(ar.pointsEarned) as totalPointsEarned,
        SUM(qq.points) as totalPossiblePoints,
        TIMESTAMPDIFF(MINUTE, qa.startTime, NOW()) as timeSpent
      FROM QuizAttempt qa
      JOIN Quiz q ON qa.quizId = q.quizId
      LEFT JOIN QuizQuestion qq ON q.quizId = qq.quizId
      LEFT JOIN AnswerRecord ar ON qa.attemptId = ar.attemptId AND qq.questionId = ar.questionId
      WHERE qa.attemptId = ? AND qa.studentId = ?
      GROUP BY qa.attemptId, qa.status, q.quizId, q.passingScore, q.totalQuestions, qa.startTime
    `, [attemptId, studentId]);

    if (attempts.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    const attempt = attempts[0];

    if (attempt.status !== 'in_progress') {
      await connection.end();
      return res.status(400).json({
        success: false,
        message: 'Quiz attempt is not in progress'
      });
    }

    // Calculate final score
    const totalPossiblePoints = attempt.totalPossiblePoints || attempt.totalQuestions; // fallback if points not set
    const totalPointsEarned = attempt.totalPointsEarned || 0;
    const score = totalPossiblePoints > 0 ? Math.round((totalPointsEarned / totalPossiblePoints) * 100) : 0;
    const passed = score >= (attempt.passingScore || 60);
    const correctAnswers = Math.round((totalPointsEarned / (totalPossiblePoints / attempt.totalQuestions)) || 0);
    const incorrectAnswers = attempt.answeredQuestions - correctAnswers;
    const skippedQuestions = attempt.totalQuestions - attempt.answeredQuestions;

    // Get all questions with answers for detailed results
    const [questionDetails] = await connection.execute(`
      SELECT
        qq.questionId,
        qq.questionText,
        qq.displayOrder,
        qq.difficulty,
        qb.questionType,
        qb.options,
        qb.correctAnswer,
        qb.explanation,
        ar.studentAnswer,
        ar.isCorrect,
        ar.pointsEarned,
        ar.timeSpent
      FROM QuizQuestion qq
      JOIN QuestionBank qb ON qq.bankId = qb.bankId
      JOIN Quiz q ON qq.quizId = q.quizId
      JOIN QuizAttempt qa ON q.quizId = qa.quizId
      LEFT JOIN AnswerRecord ar ON qq.questionId = ar.questionId AND qa.attemptId = ar.attemptId
      WHERE qa.attemptId = ?
      ORDER BY qq.displayOrder ASC
    `, [attemptId]);

    // Get module title
    const [moduleInfo] = await connection.execute(`
      SELECT m.title as moduleTitle
      FROM Quiz q
      LEFT JOIN Module m ON q.moduleId = m.moduleId
      WHERE q.quizId = ?
    `, [attempt.quizId]);

    const moduleTitle = moduleInfo.length > 0 ? moduleInfo[0].moduleTitle : 'Quiz';

    // Update attempt with final results
    await connection.execute(
      'UPDATE QuizAttempt SET status = "completed", endTime = NOW(), submitAnswers = ?, finishAt = NOW(), getScore = ? WHERE attemptId = ?',
      [JSON.stringify({ answeredQuestions: attempt.answeredQuestions, totalPointsEarned: totalPointsEarned }), score, attemptId]
    );

    // Generate AI feedback if enabled
    let feedback = null;
    try {
      const [feedbackResult] = await connection.execute(
        'INSERT INTO AIFeedback (attemptId, studentId, feedbackText, improvementSuggestions, confidenceScore, generateAttempt) VALUES (?, ?, ?, ?, ?, TRUE)',
        [attemptId, studentId, `You scored ${score}% on this quiz. ${passed ? 'Great job!' : 'Keep practicing to improve your score.'}`, 'Focus on reviewing the questions you got wrong.', 0.8]
      );

      if (feedbackResult.insertId) {
        feedback = {
          feedbackId: feedbackResult.insertId,
          feedbackText: `You scored ${score}% on this quiz. ${passed ? 'Great job!' : 'Keep practicing to improve your score.'}`,
          improvementSuggestions: 'Focus on reviewing the questions you got wrong.',
          confidenceScore: 0.8
        };
      }
    } catch (feedbackError) {
      console.error('Error generating AI feedback:', feedbackError);
      // Continue without feedback if it fails
    }

    // Format questions for frontend
    const mapQuestionType = (questionType) => {
      if (!questionType) return 'MCQ';
      const type = questionType.toLowerCase();
      if (type === 'multiple_choice') return 'MCQ';
      if (type === 'labeling') return 'Labeling';
      if (type === 'drag_drop') return 'Drag & Drop';
      return 'MCQ';
    };

    const detailedQuestions = questionDetails.map(q => ({
      id: q.questionId,
      question: q.questionText || 'Question text not available',
      yourAnswer: q.studentAnswer || 'Not answered',
      correctAnswer: q.correctAnswer || 'N/A',
      isCorrect: q.isCorrect === 1 || q.isCorrect === true,
      type: mapQuestionType(q.questionType),
      explanation: q.explanation || 'No explanation available',
      pointsEarned: q.pointsEarned || 0,
      timeSpent: q.timeSpent || 0
    }));

    // Calculate question breakdown by type
    const questionBreakdown = detailedQuestions.reduce((acc, q) => {
      const type = q.type;
      if (!acc[type]) {
        acc[type] = { type, total: 0, correct: 0 };
      }
      acc[type].total++;
      if (q.isCorrect) {
        acc[type].correct++;
      }
      return acc;
    }, {});

    await connection.end();

    // Format time spent
    const timeSpentMinutes = attempt.timeSpent || 0;
    const hours = Math.floor(timeSpentMinutes / 60);
    const minutes = timeSpentMinutes % 60;
    const timeSpentFormatted = hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}`
      : `${minutes}:00`;

    res.json({
      success: true,
      data: {
        attemptId,
        score,
        passingScore: attempt.passingScore || 60,
        passed,
        totalQuestions: attempt.totalQuestions,
        correctAnswers,
        incorrectAnswers,
        skippedQuestions,
        answeredQuestions: attempt.answeredQuestions,
        totalPointsEarned,
        totalPossiblePoints,
        timeSpent: timeSpentFormatted,
        timeTaken: timeSpentMinutes * 60, // in seconds
        attemptDate: new Date().toLocaleString(),
        quizTitle: moduleTitle,
        module: moduleTitle,
        questionBreakdown: Object.values(questionBreakdown),
        detailedQuestions,
        feedback
      }
    });

  } catch (error) {
    console.error('Error finishing quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to finish quiz',
      error: error.message
    });
  }
};

// Get details of a specific quiz attempt
const getQuizAttempt = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { attemptId } = req.params;

    const connection = await db();

    // Get studentId from userId
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentId = students[0].studentId;

    // Get attempt details
    const [attempts] = await connection.execute(`
      SELECT
        qa.attemptId,
        qa.startTime,
        qa.endTime,
        qa.status,
        qa.getScore,
        qa.submitAnswers,
        q.quizId,
        q.timeLimit,
        q.totalQuestions,
        q.passingScore,
        m.title as moduleTitle,
        m.moduleId
      FROM QuizAttempt qa
      JOIN Quiz q ON qa.quizId = q.quizId
      LEFT JOIN Module m ON q.moduleId = m.moduleId
      WHERE qa.attemptId = ? AND qa.studentId = ?
    `, [attemptId, studentId]);

    if (attempts.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    const attempt = attempts[0];

    // Get questions and answers from QuizQuestion (which now contains the question data)
    const [questions] = await connection.execute(`
      SELECT
        qq.questionId,
        qq.questionText,
        qq.difficulty,
        qq.points,
        qb.questionType,
        qb.options,
        qb.correctAnswer,
        qb.explanation,
        ar.studentAnswer,
        ar.isCorrect,
        ar.pointsEarned,
        ar.timeSpent
      FROM QuizQuestion qq
      JOIN QuestionBank qb ON qq.bankId = qb.bankId
      JOIN Quiz q ON qq.quizId = q.quizId
      JOIN QuizAttempt qa ON q.quizId = qa.quizId
      LEFT JOIN AnswerRecord ar ON qq.questionId = ar.questionId AND qa.attemptId = ar.attemptId
      WHERE qa.attemptId = ?
      ORDER BY qq.displayOrder ASC
    `, [attemptId]);

    await connection.end();

    // Map questionType to frontend format
    const mapQuestionType = (questionType) => {
      if (!questionType) return 'mcq';
      const type = questionType.toLowerCase();
      if (type === 'multiple_choice') return 'mcq';
      if (type === 'labeling') return 'labeling';
      if (type === 'drag_drop') return 'drag-drop';
      return 'mcq'; // default
    };

    // Format questions for frontend
    const formattedQuestions = questions.map(q => {
      const parsedOptions = q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : [];
      const questionType = mapQuestionType(q.questionType);
      
      const baseQuestion = {
        id: q.questionId,
        question: q.questionText || 'Question text not available',
        type: questionType,
        difficulty: q.difficulty,
        points: q.points,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        studentAnswer: q.studentAnswer,
        isCorrect: q.isCorrect,
        hint: q.explanation || 'No hint available'
      };

      // Add type-specific fields
      if (questionType === 'mcq' && Array.isArray(parsedOptions)) {
        baseQuestion.options = parsedOptions;
      } else if (questionType === 'labeling') {
        // For labeling questions, create mock hotspots and labels from options
        baseQuestion.hotspots = parsedOptions.slice(0, 5).map((opt, idx) => ({
          id: `spot-${idx}`,
          x: 20 + (idx * 15),
          y: 30 + (idx % 2 * 20)
        }));
        baseQuestion.labels = Array.isArray(parsedOptions) ? parsedOptions : [];
      } else if (questionType === 'drag-drop') {
        // For drag-drop, create drop zones and items from options
        baseQuestion.dropZones = [
          { id: 'zone-1', description: 'Drop answer here' },
          { id: 'zone-2', description: 'Drop answer here' }
        ];
        baseQuestion.items = Array.isArray(parsedOptions) 
          ? parsedOptions.map((opt, idx) => ({ id: `item-${idx}`, text: opt }))
          : [];
      }

      return baseQuestion;
    });

    // Calculate results if quiz is completed
    let resultsData = null;
    if (attempt.status === 'completed' && attempt.getScore !== null) {
      // Calculate correct/incorrect answers
      const correctAnswers = formattedQuestions.filter(q => q.isCorrect === 1 || q.isCorrect === true).length;
      const incorrectAnswers = formattedQuestions.filter(q => q.studentAnswer && (q.isCorrect === 0 || q.isCorrect === false)).length;
      const skippedQuestions = formattedQuestions.filter(q => !q.studentAnswer).length;
      
      // Calculate question breakdown by type
      const questionBreakdown = formattedQuestions.reduce((acc, q) => {
        const type = q.type === 'mcq' ? 'MCQ' : q.type === 'labeling' ? 'Labeling' : q.type === 'drag-drop' ? 'Drag & Drop' : 'MCQ';
        if (!acc[type]) {
          acc[type] = { type, total: 0, correct: 0 };
        }
        acc[type].total++;
        if (q.isCorrect === 1 || q.isCorrect === true) {
          acc[type].correct++;
        }
        return acc;
      }, {});

      // Format time spent
      const timeSpentMinutes = attempt.endTime && attempt.startTime
        ? Math.floor((new Date(attempt.endTime) - new Date(attempt.startTime)) / (1000 * 60))
        : 0;
      const hours = Math.floor(timeSpentMinutes / 60);
      const minutes = timeSpentMinutes % 60;
      const timeSpentFormatted = hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}`
        : `${minutes}:00`;

      // Format detailed questions for results
      const detailedQuestions = formattedQuestions.map(q => ({
        id: q.id,
        question: q.question,
        yourAnswer: q.studentAnswer || 'Not answered',
        correctAnswer: q.correctAnswer || 'N/A',
        isCorrect: q.isCorrect === 1 || q.isCorrect === true,
        type: q.type === 'mcq' ? 'MCQ' : q.type === 'labeling' ? 'Labeling' : q.type === 'drag-drop' ? 'Drag & Drop' : 'MCQ',
        explanation: q.explanation || 'No explanation available'
      }));

      resultsData = {
        score: attempt.getScore || 0,
        passingScore: attempt.passingScore || 60,
        passed: (attempt.getScore || 0) >= (attempt.passingScore || 60),
        correctAnswers,
        incorrectAnswers,
        skippedQuestions,
        timeSpent: timeSpentFormatted,
        timeTaken: timeSpentMinutes * 60,
        attemptDate: attempt.endTime ? new Date(attempt.endTime).toLocaleString() : new Date().toLocaleString(),
        questionBreakdown: Object.values(questionBreakdown),
        detailedQuestions
      };
    }

    const attemptDetails = {
      attemptId: attempt.attemptId,
      title: attempt.moduleTitle || 'Quiz',
      module: attempt.moduleTitle || 'Module',
      startTime: attempt.startTime,
      endTime: attempt.endTime,
      status: attempt.status,
      score: attempt.getScore,
      timeLimit: attempt.timeLimit,
      totalQuestions: attempt.totalQuestions,
      passingScore: attempt.passingScore,
      moduleTitle: attempt.moduleTitle,
      moduleId: attempt.moduleId,
      questions: formattedQuestions,
      results: resultsData // Include results if completed
    };

    res.json({
      success: true,
      data: attemptDetails
    });

  } catch (error) {
    console.error('Error fetching quiz attempt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz attempt',
      error: error.message
    });
  }
};

module.exports = {
  getQuizModules,
  getQuizStats,
  startModuleQuiz,
  startTimedExam,
  startAdaptiveTest,
  getQuizAttempts,
  submitAnswer,
  getQuizProgress,
  finishQuiz,
  getQuizAttempt
};
