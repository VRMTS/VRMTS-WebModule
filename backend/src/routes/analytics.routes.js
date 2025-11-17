const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all analytics routes
router.use(authMiddleware);

// Get student analytics data
router.get('/student', async (req, res) => {
  try {
    const userId = req.session.user.userId;

    // Check if user is a student
    if (req.session.user.userType !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can view analytics.'
      });
    }

    const connection = await require('../config/db')();

    // Get overview stats
    const [overviewResult] = await connection.execute(`
      SELECT
        COUNT(DISTINCT CASE WHEN ma.status = 'completed' THEN ma.moduleId END) as modulesCompleted,
        COUNT(DISTINCT m.moduleId) as totalModules,
        COALESCE(AVG(qa.score), 0) as averageScore,
        COALESCE(SUM(TIMESTAMPDIFF(MINUTE, ma.startTime, ma.endTime)), 0) / 60 as totalStudyTime,
        COUNT(DISTINCT qa.quizAttemptId) as quizzesTaken,
        COALESCE(MAX(streak.currentStreak), 0) as currentStreak,
        COALESCE(MAX(streak.longestStreak), 0) as longestStreak,
        COUNT(DISTINCT ma.moduleAttemptId) as totalSessions
      FROM Module m
      LEFT JOIN ModuleAttempt ma ON m.moduleId = ma.moduleId AND ma.userId = ?
      LEFT JOIN QuizAttempt qa ON qa.moduleId = m.moduleId AND qa.userId = ?
      LEFT JOIN (
        SELECT userId, currentStreak, longestStreak
        FROM UserStreak
        WHERE userId = ?
      ) streak ON streak.userId = ?
    `, [userId, userId, userId, userId]);

    // Get score progress over time (last 4 months)
    const [scoreProgress] = await connection.execute(`
      SELECT
        DATE_FORMAT(qa.attemptDate, '%b') as month,
        ROUND(AVG(qa.score)) as score
      FROM QuizAttempt qa
      WHERE qa.userId = ? AND qa.attemptDate >= DATE_SUB(NOW(), INTERVAL 4 MONTH)
      GROUP BY DATE_FORMAT(qa.attemptDate, '%Y-%m')
      ORDER BY qa.attemptDate
    `, [userId]);

    // Get weekly study time
    const [studyTime] = await connection.execute(`
      SELECT
        DAYNAME(ma.startTime) as day,
        ROUND(SUM(TIMESTAMPDIFF(MINUTE, ma.startTime, ma.endTime)) / 60, 1) as hours
      FROM ModuleAttempt ma
      WHERE ma.userId = ? AND ma.startTime >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DAYOFWEEK(ma.startTime), DAYNAME(ma.startTime)
      ORDER BY DAYOFWEEK(ma.startTime)
    `, [userId]);

    // Get module performance
    const [modulePerformance] = await connection.execute(`
      SELECT
        m.name as module,
        COALESCE(ma.progress, 0) as progress,
        COALESCE(AVG(qa.score), 0) as avgScore,
        COALESCE(SUM(TIMESTAMPDIFF(MINUTE, ma.startTime, ma.endTime)), 0) / 60 as timeSpent,
        MAX(ma.lastAccessed) as lastAttempt,
        CASE
          WHEN ma.status = 'completed' THEN 'completed'
          ELSE 'in-progress'
        END as status
      FROM Module m
      LEFT JOIN ModuleAttempt ma ON m.moduleId = ma.moduleId AND ma.userId = ?
      LEFT JOIN QuizAttempt qa ON qa.moduleId = m.moduleId AND qa.userId = ?
      GROUP BY m.moduleId, m.name, ma.progress, ma.status
      ORDER BY m.name
    `, [userId, userId]);

    // Get question type performance
    const [questionTypePerformance] = await connection.execute(`
      SELECT
        qt.type,
        COUNT(q.questionId) as total,
        SUM(CASE WHEN qar.isCorrect = 1 THEN 1 ELSE 0 END) as correct,
        ROUND((SUM(CASE WHEN qar.isCorrect = 1 THEN 1 ELSE 0 END) / COUNT(q.questionId)) * 100) as percentage
      FROM Question q
      JOIN QuestionType qt ON q.questionTypeId = qt.questionTypeId
      JOIN QuizAttempt qa ON qa.quizId = q.quizId
      JOIN QuestionAttemptResult qar ON qar.questionId = q.questionId AND qar.quizAttemptId = qa.quizAttemptId
      WHERE qa.userId = ?
      GROUP BY qt.type
    `, [userId]);

    // Get recent activity
    const [recentActivity] = await connection.execute(`
      SELECT
        DATE_FORMAT(COALESCE(qa.attemptDate, ma.startTime), '%M %d, %Y') as date,
        CASE
          WHEN qa.quizAttemptId IS NOT NULL THEN 'Completed Quiz'
          ELSE 'Studied Module'
        END as action,
        COALESCE(m.name, m2.name) as module,
        qa.score,
        COALESCE(TIMESTAMPDIFF(MINUTE, ma.startTime, ma.endTime), 0) as duration,
        DATE_FORMAT(COALESCE(qa.attemptDate, ma.startTime), '%H:%i') as time
      FROM (
        SELECT qa.quizAttemptId, qa.attemptDate, qa.moduleId, qa.score, NULL as startTime, NULL as endTime
        FROM QuizAttempt qa
        WHERE qa.userId = ?
        UNION ALL
        SELECT NULL, NULL, ma.moduleId, NULL, ma.startTime, ma.endTime
        FROM ModuleAttempt ma
        WHERE ma.userId = ?
      ) activities
      LEFT JOIN QuizAttempt qa ON activities.quizAttemptId = qa.quizAttemptId
      LEFT JOIN Module m ON qa.moduleId = m.moduleId
      LEFT JOIN ModuleAttempt ma ON activities.startTime = ma.startTime AND activities.endTime = ma.endTime
      LEFT JOIN Module m2 ON ma.moduleId = m2.moduleId
      WHERE COALESCE(qa.attemptDate, ma.startTime) IS NOT NULL
      ORDER BY COALESCE(qa.attemptDate, ma.startTime) DESC
      LIMIT 5
    `, [userId, userId]);

    // Get strengths (topics with >90% mastery)
    const [strengths] = await connection.execute(`
      SELECT
        t.name as topic,
        ROUND(AVG(qar.isCorrect) * 100) as mastery,
        COUNT(q.questionId) as questions
      FROM Topic t
      JOIN Question q ON t.topicId = q.topicId
      JOIN QuizAttempt qa ON qa.quizId = q.quizId
      JOIN QuestionAttemptResult qar ON qar.questionId = q.questionId AND qar.quizAttemptId = qa.quizAttemptId
      WHERE qa.userId = ?
      GROUP BY t.topicId, t.name
      HAVING mastery > 90
      ORDER BY mastery DESC
      LIMIT 3
    `, [userId]);

    // Get weaknesses (topics with <75% mastery)
    const [weaknesses] = await connection.execute(`
      SELECT
        t.name as topic,
        ROUND(AVG(qar.isCorrect) * 100) as mastery,
        COUNT(q.questionId) as questions
      FROM Topic t
      JOIN Question q ON t.topicId = q.topicId
      JOIN QuizAttempt qa ON qa.quizId = q.quizId
      JOIN QuestionAttemptResult qar ON qar.questionId = q.questionId AND qar.quizAttemptId = qa.quizAttemptId
      WHERE qa.userId = ?
      GROUP BY t.topicId, t.name
      HAVING mastery < 75
      ORDER BY mastery ASC
      LIMIT 3
    `, [userId]);

    // Get learning pattern
    const [learningPattern] = await connection.execute(`
      SELECT
        CASE DAYOFWEEK(ma.startTime)
          WHEN 1 THEN 'Sunday'
          WHEN 2 THEN 'Monday'
          WHEN 3 THEN 'Tuesday'
          WHEN 4 THEN 'Wednesday'
          WHEN 5 THEN 'Thursday'
          WHEN 6 THEN 'Friday'
          WHEN 7 THEN 'Saturday'
        END as mostActiveDay,
        COUNT(*) as sessions
      FROM ModuleAttempt ma
      WHERE ma.userId = ?
      GROUP BY DAYOFWEEK(ma.startTime)
      ORDER BY sessions DESC
      LIMIT 1
    `, [userId]);

    const [timePattern] = await connection.execute(`
      SELECT
        CONCAT(FLOOR(HOUR(ma.startTime)/6)*6, '-', FLOOR(HOUR(ma.startTime)/6)*6 + 6, 'PM') as timeRange,
        COUNT(*) as sessions
      FROM ModuleAttempt ma
      WHERE ma.userId = ?
      GROUP BY FLOOR(HOUR(ma.startTime)/6)
      ORDER BY sessions DESC
      LIMIT 1
    `, [userId]);

    const [avgSession] = await connection.execute(`
      SELECT ROUND(AVG(TIMESTAMPDIFF(MINUTE, ma.startTime, ma.endTime))) as avgSessionLength
      FROM ModuleAttempt ma
      WHERE ma.userId = ?
    `, [userId]);

    // Get achievements
    const [achievements] = await connection.execute(`
      SELECT
        name,
        icon,
        unlocked,
        DATE_FORMAT(unlockedAt, '%M %d') as date
      FROM Achievement a
      LEFT JOIN UserAchievement ua ON a.achievementId = ua.achievementId AND ua.userId = ?
      ORDER BY a.achievementId
    `, [userId]);

    await connection.end();

    const analyticsData = {
      overview: {
        totalStudyTime: overviewResult[0].totalStudyTime?.toFixed(1) || '0.0',
        modulesCompleted: overviewResult[0].modulesCompleted,
        totalModules: overviewResult[0].totalModules,
        averageScore: Math.round(overviewResult[0].averageScore),
        quizzesTaken: overviewResult[0].quizzesTaken,
        currentStreak: overviewResult[0].currentStreak,
        longestStreak: overviewResult[0].longestStreak,
        totalSessions: overviewResult[0].totalSessions
      },
      scoreProgress: scoreProgress.map(row => ({
        month: row.month,
        score: row.score
      })),
      studyTime: studyTime.map(row => ({
        day: row.day.substring(0, 3), // Short day name
        hours: row.hours
      })),
      modulePerformance: modulePerformance.map(row => ({
        module: row.module,
        progress: row.progress,
        avgScore: Math.round(row.avgScore),
        timeSpent: `${row.timeSpent?.toFixed(1) || '0.0'}h`,
        lastAttempt: row.lastAttempt ? new Date(row.lastAttempt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }) + ' ago' : 'Never',
        status: row.status
      })),
      questionTypePerformance: questionTypePerformance.map(row => ({
        type: row.type,
        correct: row.correct,
        total: row.total,
        percentage: row.percentage
      })),
      recentActivity: recentActivity.map(row => ({
        date: row.date,
        action: row.action,
        module: row.module,
        score: row.score,
        duration: row.duration ? `${row.duration}m` : null,
        time: row.time
      })),
      strengths: strengths.map(row => ({
        topic: row.topic,
        mastery: row.mastery,
        questions: row.questions
      })),
      weaknesses: weaknesses.map(row => ({
        topic: row.topic,
        mastery: row.mastery,
        questions: row.questions
      })),
      learningPattern: {
        mostActiveDay: learningPattern[0]?.mostActiveDay || 'N/A',
        mostActiveTime: timePattern[0]?.timeRange?.replace('PM', 'PM') || 'N/A',
        avgSessionLength: avgSession[0]?.avgSessionLength ? `${Math.round(avgSession[0].avgSessionLength)} mins` : 'N/A',
        preferredFormat: 'VR Sessions' // Default assumption
      },
      achievements: achievements.map(row => ({
        name: row.name,
        icon: row.icon,
        unlocked: !!row.unlocked,
        date: row.date
      }))
    };

    res.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
});

module.exports = router;
