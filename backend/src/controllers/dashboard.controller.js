const db = require('../config/db');

// Get dashboard stats for the current student
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.session.user.userId;

    const connection = await db();

    // Get student ID from user ID
    const [studentResult] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (studentResult.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const studentId = studentResult[0].studentId;

    // Get stats in parallel
    const [modulesStats] = await connection.execute(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        AVG(progress) as avgProgress,
        SUM(hoursSpent) as totalHours
      FROM StudentModuleAssignment
      WHERE studentId = ?
    `, [studentId]);

    const [quizStats] = await connection.execute(`
      SELECT
        COUNT(*) as totalQuizzes,
        AVG(qa.getScore) as avgScore
      FROM QuizAttempt qa
      INNER JOIN Quiz q ON qa.quizId = q.quizId
      WHERE qa.studentId = ? AND qa.status = 'completed'
    `, [studentId]);

    // Calculate study streak (consecutive days with activity in last 30 days)
    const [streakData] = await connection.execute(`
      SELECT
        DATE(startTime) as date,
        COUNT(*) as sessions
      FROM LearningSession
      WHERE studentId = ? AND startTime >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(startTime)
      ORDER BY date DESC
    `, [studentId]);

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = today;

    for (let i = 0; i < streakData.length; i++) {
      const sessionDate = streakData[i].date.toISOString().split('T')[0];
      if (sessionDate === checkDate) {
        streak++;
        // Move to previous day
        const prevDate = new Date(checkDate);
        prevDate.setDate(prevDate.getDate() - 1);
        checkDate = prevDate.toISOString().split('T')[0];
      } else {
        break;
      }
    }

    await connection.end();

    const stats = {
      modulesCompleted: modulesStats[0].completed || 0,
      totalModules: modulesStats[0].total || 0,
      averageScore: Math.round(quizStats[0].avgScore || 0),
      studyStreak: streak,
      totalHours: Math.round(modulesStats[0].totalHours || 0)
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// Get recent modules for dashboard
const getRecentModules = async (req, res) => {
  try {
    const userId = req.session.user.userId;

    const connection = await db();

    // Get student ID
    const [studentResult] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (studentResult.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const studentId = studentResult[0].studentId;

    // Get recent modules (limit to 4 for dashboard)
    const [modules] = await connection.execute(`
      SELECT
        m.moduleId,
        m.title as name,
        m.description,
        m.difficultyLevel as difficulty,
        sma.hoursSpent,
        sma.progress,
        sma.status,
        sma.completedAt
      FROM Module m
      INNER JOIN StudentModuleAssignment sma ON m.moduleId = sma.moduleId
      WHERE sma.studentId = ?
      ORDER BY sma.assignedAt DESC
      LIMIT 4
    `, [studentId]);

    // Transform data to match frontend interface
    const transformedModules = modules.map(module => {
      // Derive category from name
      const name = module.name.toLowerCase();
      let category = 'other';
      if (name.includes('cardio') || name.includes('lymph')) category = 'cardiovascular';
      else if (name.includes('nervous') || name.includes('endocrine')) category = 'nervous';
      else if (name.includes('skeletal') || name.includes('bone')) category = 'skeletal';
      else if (name.includes('muscular') || name.includes('muscle')) category = 'muscular';
      else if (name.includes('respiratory') || name.includes('lung')) category = 'respiratory';
      else if (name.includes('visual') || name.includes('auditory') || name.includes('sensory')) category = 'sensory';

      // Derive icon from name
      let icon = '📚';
      if (name.includes('cardio') || name.includes('heart')) icon = '🫀';
      else if (name.includes('nervous') || name.includes('brain')) icon = '🧠';
      else if (name.includes('skeletal') || name.includes('bone')) icon = '🦴';
      else if (name.includes('muscular') || name.includes('muscle')) icon = '💪';
      else if (name.includes('respiratory') || name.includes('lung')) icon = '🫁';
      else if (name.includes('digestive')) icon = '🫃';
      else if (name.includes('visual') || name.includes('eye')) icon = '👁️';
      else if (name.includes('auditory') || name.includes('ear')) icon = '👂';
      else if (name.includes('lymphatic')) icon = '💧';
      else if (name.includes('endocrine')) icon = '⚡';
      else if (name.includes('integumentary') || name.includes('skin')) icon = '🖐️';
      else if (name.includes('urinary') || name.includes('kidney')) icon = '🫘';

      // Calculate duration (simplified)
      const parts = 10;
      const duration = `${Math.ceil(parts * 0.3)}-${Math.ceil(parts * 0.4)} hours`;

      return {
        moduleId: module.moduleId,
        name: module.name,
        category,
        icon,
        description: module.description,
        progress: module.progress || 0,
        status: module.status || 'not_started',
        duration,
        difficulty: module.difficulty,
        quizScore: null, // TODO: Implement later
        parts,
        completedParts: Math.floor((module.progress || 0) / 10),
        hoursSpent: module.hoursSpent || 0
      };
    });

    await connection.end();

    res.json({
      success: true,
      data: transformedModules
    });

  } catch (error) {
    console.error('Error fetching recent modules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent modules',
      error: error.message
    });
  }
};

// Get recent activity for dashboard
const getRecentActivity = async (req, res) => {
  try {
    const userId = req.session.user.userId;

    const connection = await db();

    // Get student ID
    const [studentResult] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (studentResult.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const studentId = studentResult[0].studentId;

    // Get recent activity from multiple sources
    const [quizActivity] = await connection.execute(`
      SELECT
        'Completed quiz' as action,
        m.title as module,
        qa.getScore as score,
        qa.finishAt as time,
        'quiz' as type
      FROM QuizAttempt qa
      INNER JOIN Quiz q ON qa.quizId = q.quizId
      INNER JOIN Module m ON q.moduleId = m.moduleId
      WHERE qa.studentId = ? AND qa.status = 'completed'
      ORDER BY qa.finishAt DESC
      LIMIT 3
    `, [studentId]);

    const [sessionActivity] = await connection.execute(`
      SELECT
        CONCAT('Studied module') as action,
        m.title as module,
        NULL as score,
        ls.startTime as time,
        'study' as type
      FROM LearningSession ls
      INNER JOIN Module m ON ls.moduleId = m.moduleId
      WHERE ls.studentId = ? AND ls.endTime IS NOT NULL
      ORDER BY ls.startTime DESC
      LIMIT 3
    `, [studentId]);

    // Combine and sort activities
    const activities = [...quizActivity, ...sessionActivity]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5)
      .map(activity => ({
        action: activity.action,
        module: activity.module,
        score: activity.score,
        time: getTimeAgo(activity.time)
      }));

    await connection.end();

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: error.message
    });
  }
};

// Get upcoming deadlines
const getUpcomingDeadlines = async (req, res) => {
  try {
    const userId = req.session.user.userId;

    const connection = await db();

    // Get student ID
    const [studentResult] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (studentResult.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const studentId = studentResult[0].studentId;

    // Get upcoming quizzes (assuming quizzes have due dates, but schema doesn't have explicit due dates)
    // For now, get recent quizzes that haven't been completed
    const [upcomingQuizzes] = await connection.execute(`
      SELECT
        q.quizId,
        m.title as moduleTitle,
        'Quiz' as type,
        DATE_ADD(CURDATE(), INTERVAL FLOOR(RAND() * 14) + 1 DAY) as dueDate
      FROM Quiz q
      INNER JOIN Module m ON q.moduleId = m.moduleId
      LEFT JOIN QuizAttempt qa ON q.quizId = qa.quizId AND qa.studentId = ?
      WHERE qa.attemptId IS NULL OR qa.status != 'completed'
      ORDER BY RAND()
      LIMIT 2
    `, [studentId]);

    const deadlines = upcomingQuizzes.map(quiz => ({
      id: quiz.quizId,
      title: `${quiz.type}: ${quiz.moduleTitle}`,
      dueDate: quiz.dueDate,
      daysUntil: Math.ceil((new Date(quiz.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    }));

    await connection.end();

    res.json({
      success: true,
      data: deadlines
    });

  } catch (error) {
    console.error('Error fetching upcoming deadlines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming deadlines',
      error: error.message
    });
  }
};

// Helper function to format time ago
function getTimeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
}

module.exports = {
  getDashboardStats,
  getRecentModules,
  getRecentActivity,
  getUpcomingDeadlines
};
