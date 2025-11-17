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
  try {
    const userId = req.session.user.userId;
    const { moduleId } = req.params;
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

    // Get quiz for the module
    const [quizzes] = await connection.execute(
      'SELECT q.quizId, q.timeLimit, q.totalQuestions, q.passingScore, m.systemId FROM Quiz q JOIN Module m ON q.moduleId = m.moduleId WHERE q.moduleId = ? LIMIT 1',
      [moduleId]
    );

    if (quizzes.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'No quiz found for this module'
      });
    }

    const quiz = quizzes[0];

    // Check if quiz has questions, if not, populate it
    const [existingQuestions] = await connection.execute(
      'SELECT COUNT(*) as count FROM QuizQuestion WHERE quizId = ?',
      [quiz.quizId]
    );

    if (existingQuestions[0].count === 0) {
      // Get random questions from QuestionBank for this system
      const [questions] = await connection.execute(
        'SELECT bankId FROM QuestionBank WHERE systemId = ? ORDER BY RAND() LIMIT ?',
        [quiz.systemId, quiz.totalQuestions]
      );

      if (questions.length < quiz.totalQuestions) {
        // If not enough questions for this system, get from general questions
        const [generalQuestions] = await connection.execute(
          'SELECT bankId FROM QuestionBank WHERE systemId IS NULL ORDER BY RAND() LIMIT ?',
          [quiz.totalQuestions - questions.length]
        );
        questions.push(...generalQuestions);
      }

      // Add questions to quiz
      for (let i = 0; i < Math.min(questions.length, quiz.totalQuestions); i++) {
        await connection.execute(
          'INSERT INTO QuizQuestion (quizId, bankId, displayOrder, points) VALUES (?, ?, ?, ?)',
          [quiz.quizId, questions[i].bankId, i + 1, 1] // Default 1 point per question
        );
      }
    }

    // Create quiz attempt
    const [attemptResult] = await connection.execute(
      'INSERT INTO QuizAttempt (studentId, quizId, startTime, status) VALUES (?, ?, NOW(), "in_progress")',
      [studentId, quiz.quizId]
    );

    const attemptId = attemptResult.insertId;

    await connection.end();

    res.json({
      success: true,
      data: {
        attemptId,
        quizId: quiz.quizId,
        timeLimit: quiz.timeLimit,
        totalQuestions: quiz.totalQuestions,
        passingScore: quiz.passingScore
      }
    });

  } catch (error) {
    console.error('Error starting module quiz:', error);
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
    const { timeLimit, questionCount } = req.body;
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

    // Create a custom quiz for timed exam
    const [quizResult] = await connection.execute(
      'INSERT INTO Quiz (title, description, timeLimit, totalQuestions, passingScore, isCustom) VALUES (?, ?, ?, ?, 60, TRUE)',
      [`Timed Exam - ${timeLimit}min`, `Custom timed exam with ${questionCount} questions`, timeLimit, questionCount]
    );

    const quizId = quizResult.insertId;

    // Select random questions
    const [questions] = await connection.execute(
      'SELECT bankId FROM QuestionBank ORDER BY RAND() LIMIT ?',
      [questionCount]
    );

    // Add questions to quiz
    for (let i = 0; i < questions.length; i++) {
      await connection.execute(
        'INSERT INTO QuizQuestion (quizId, bankId, displayOrder) VALUES (?, ?, ?)',
        [quizId, questions[i].bankId, i + 1]
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
        totalQuestions: questionCount,
        passingScore: 60
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

    // Create a custom quiz for adaptive test
    const [quizResult] = await connection.execute(
      'INSERT INTO Quiz (title, description, timeLimit, totalQuestions, passingScore, isCustom) VALUES (?, ?, ?, ?, 70, TRUE)',
      [`Adaptive Test - ${targetDifficulty}`, `Adaptive test with ${questionCount} questions`, 45, questionCount]
    );

    const quizId = quizResult.insertId;

    // Select questions based on difficulty
    const [questions] = await connection.execute(
      'SELECT bankId FROM QuestionBank WHERE difficulty = ? ORDER BY RAND() LIMIT ?',
      [targetDifficulty, questionCount]
    );

    // Add questions to quiz
    for (let i = 0; i < questions.length; i++) {
      await connection.execute(
        'INSERT INTO QuizQuestion (quizId, bankId, displayOrder) VALUES (?, ?, ?)',
        [quizId, questions[i].bankId, i + 1]
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
    const { attemptId, questionId, answer, timeSpent } = req.body;

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

    // Check if answer is correct
    const isCorrect = answer === attempt.correctAnswer;
    const pointsEarned = isCorrect ? attempt.points : 0;

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
    const studentId = req.session.user.userId;
    const { attemptId } = req.params;

    const connection = await db();

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
    const studentId = req.session.user.userId;
    const { attemptId } = req.params;

    const connection = await db();

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
    const score = totalPossiblePoints > 0 ? Math.round((attempt.totalPointsEarned / totalPossiblePoints) * 100) : 0;
    const passed = score >= (attempt.passingScore || 60);

    // Update attempt with final results
    await connection.execute(
      'UPDATE QuizAttempt SET status = "completed", endTime = NOW(), submitAnswers = ?, finishAt = NOW(), getScore = ? WHERE attemptId = ?',
      [JSON.stringify({ answeredQuestions: attempt.answeredQuestions, totalPointsEarned: attempt.totalPointsEarned }), score, attemptId]
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

    await connection.end();

    res.json({
      success: true,
      data: {
        attemptId,
        score,
        passed,
        totalQuestions: attempt.totalQuestions,
        answeredQuestions: attempt.answeredQuestions,
        totalPointsEarned: attempt.totalPointsEarned,
        totalPossiblePoints,
        timeSpent: attempt.timeSpent,
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
    const studentId = req.session.user.userId;
    const { attemptId } = req.params;

    const connection = await db();

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

    // Get questions and answers
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

    const attemptDetails = {
      attemptId: attempt.attemptId,
      startTime: attempt.startTime,
      endTime: attempt.endTime,
      status: attempt.status,
      score: attempt.getScore,
      timeLimit: attempt.timeLimit,
      totalQuestions: attempt.totalQuestions,
      passingScore: attempt.passingScore,
      moduleTitle: attempt.moduleTitle,
      moduleId: attempt.moduleId,
      questions: questions.map(q => ({
        questionId: q.questionId,
        questionText: q.questionText,
        difficulty: q.difficulty,
        points: q.points,
        questionType: q.questionType,
        options: q.options ? JSON.parse(q.options) : null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        studentAnswer: q.studentAnswer,
        isCorrect: q.isCorrect,
        pointsEarned: q.pointsEarned || 0,
        timeSpent: q.timeSpent || 0
      }))
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
