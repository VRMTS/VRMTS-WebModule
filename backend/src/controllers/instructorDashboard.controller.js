const db = require('../config/db');

// Get class statistics for instructor dashboard
const getClassStats = async (req, res) => {
  let connection;
  try {
    connection = await db();

    // Total students
    const [totalStudentsResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM Student s INNER JOIN User u ON s.userId = u.userId WHERE u.userType = "student" AND u.isActive = TRUE'
    );

    // Average performance from QuizAttempt.getScore
    const [avgPerformanceResult] = await connection.execute(`
      SELECT AVG(getScore) as avgScore
      FROM QuizAttempt
      WHERE status = 'completed' AND getScore IS NOT NULL
    `);

    // Modules assigned
    const [modulesAssignedResult] = await connection.execute(
      'SELECT COUNT(DISTINCT moduleId) as assignedModules FROM StudentModuleAssignment'
    );

    // Total modules
    const [totalModulesResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM Module'
    );

    // At-risk students: score < 60 OR missed deadlines
    const [atRiskResult] = await connection.execute(`
      SELECT COUNT(DISTINCT s.studentId) as atRiskCount
      FROM Student s
      INNER JOIN User u ON s.userId = u.userId
      WHERE s.studentId IN (
        SELECT studentId
        FROM QuizAttempt
        WHERE status = 'completed' AND getScore IS NOT NULL
        GROUP BY studentId
        HAVING AVG(getScore) < 60
      ) OR s.studentId IN (
        SELECT studentId
        FROM StudentModuleAssignment
        WHERE status != 'completed' AND status != 'archived'
        AND assignedAt IS NOT NULL
        AND assignedAt < DATE_SUB(NOW(), INTERVAL 14 DAY)
        GROUP BY studentId
        HAVING COUNT(*) >= 2
      )
    `);

    await connection.end();

    res.json({
      success: true,
      data: {
        totalStudents: totalStudentsResult[0]?.total || 0,
        averagePerformance: Math.round(avgPerformanceResult[0]?.avgScore || 0),
        modulesAssigned: modulesAssignedResult[0]?.assignedModules || 0,
        totalModules: totalModulesResult[0]?.total || 0,
        atRiskStudents: atRiskResult[0]?.atRiskCount || 0
      }
    });

  } catch (error) {
    console.error('Error in getClassStats:', error);
    if (connection) await connection.end().catch(() => {});
    res.status(500).json({
      success: false,
      message: 'Failed to fetch class stats',
      error: error.message
    });
  }
};

// Get module performance overview
const getModulePerformance = async (req, res) => {
  let connection;
  try {
    connection = await db();

    const [modulePerformance] = await connection.execute(`
      SELECT 
        m.moduleId,
        m.title as module,
        COUNT(DISTINCT CASE WHEN sma.status = 'completed' THEN sma.studentId END) as completed,
        AVG(CASE WHEN qa.status = 'completed' AND qa.getScore IS NOT NULL THEN qa.getScore END) as avgScore,
        AVG(sma.hoursSpent) as avgHoursSpent,
        COUNT(DISTINCT sma.studentId) as totalAssigned
      FROM Module m
      LEFT JOIN StudentModuleAssignment sma ON m.moduleId = sma.moduleId
      LEFT JOIN Quiz q ON m.moduleId = q.moduleId
      LEFT JOIN QuizAttempt qa ON q.quizId = qa.quizId AND qa.status = 'completed' AND qa.getScore IS NOT NULL
      GROUP BY m.moduleId, m.title
      ORDER BY avgScore DESC, completed DESC
      LIMIT 10
    `);

    const [totalStudentsResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM Student'
    );
    const totalStudents = totalStudentsResult[0]?.total || 1;

    await connection.end();

    const performance = modulePerformance.map(module => {
      const avgScore = Math.round(module.avgScore || 0);
      const completed = parseInt(module.completed || 0);
      const avgHours = parseFloat(module.avgHoursSpent || 0).toFixed(1);
      
      let status = 'average';
      if (avgScore >= 85) status = 'excellent';
      else if (avgScore >= 75) status = 'good';
      else if (avgScore >= 65) status = 'average';
      else if (avgScore >= 50) status = 'needs-attention';
      else if (avgScore > 0) status = 'poor';

      return {
        module: module.module || 'Unknown',
        completed: completed,
        avgScore: avgScore,
        timeSpent: `${avgHours}h`,
        status: status
      };
    });

    res.json({
      success: true,
      data: performance,
      totalStudents: totalStudents
    });

  } catch (error) {
    console.error('Error in getModulePerformance:', error);
    if (connection) await connection.end().catch(() => {});
    res.status(500).json({
      success: false,
      message: 'Failed to fetch module performance',
      error: error.message
    });
  }
};

// Get recent quiz submissions
const getRecentSubmissions = async (req, res) => {
  let connection;
  try {
    connection = await db();

    const [submissions] = await connection.execute(`
      SELECT 
        u.name as student,
        COALESCE(m.title, 'General Quiz') as module,
        qa.getScore as score,
        qa.finishAt as time
      FROM QuizAttempt qa
      INNER JOIN Student s ON qa.studentId = s.studentId
      INNER JOIN User u ON s.userId = u.userId
      INNER JOIN Quiz q ON qa.quizId = q.quizId
      LEFT JOIN Module m ON q.moduleId = m.moduleId
      WHERE qa.status = 'completed' 
      AND qa.finishAt IS NOT NULL 
      AND qa.getScore IS NOT NULL
      ORDER BY qa.finishAt DESC
      LIMIT 10
    `);

    await connection.end();

    const recentSubmissions = submissions.map(submission => {
      const score = Math.round(submission.score || 0);
      let status = 'average';
      if (score >= 80) status = 'excellent';
      else if (score >= 60) status = 'good';
      else if (score >= 50) status = 'needs-review';
      else status = 'poor';

      return {
        student: submission.student || 'Unknown',
        module: submission.module || 'General Quiz',
        score: score,
        time: getTimeAgo(submission.time),
        status: status
      };
    });

    res.json({
      success: true,
      data: recentSubmissions
    });

  } catch (error) {
    console.error('Error in getRecentSubmissions:', error);
    if (connection) await connection.end().catch(() => {});
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent submissions',
      error: error.message
    });
  }
};

// Get at-risk students
const getAtRiskStudents = async (req, res) => {
  let connection;
  try {
    connection = await db();

    const [atRiskStudents] = await connection.execute(`
      SELECT 
        u.name,
        s.studentId,
        AVG(CASE WHEN qa.status = 'completed' AND qa.getScore IS NOT NULL THEN qa.getScore END) as avgScore,
        COUNT(DISTINCT CASE 
          WHEN sma.status != 'completed' 
          AND sma.status != 'archived'
          AND sma.assignedAt IS NOT NULL
          AND sma.assignedAt < DATE_SUB(NOW(), INTERVAL 14 DAY) 
          THEN sma.assignmentId 
        END) as missedDeadlines,
        MAX(ls.startTime) as lastActive
      FROM Student s
      INNER JOIN User u ON s.userId = u.userId
      LEFT JOIN QuizAttempt qa ON s.studentId = qa.studentId AND qa.status = 'completed' AND qa.getScore IS NOT NULL
      LEFT JOIN StudentModuleAssignment sma ON s.studentId = sma.studentId
      LEFT JOIN LearningSession ls ON s.studentId = ls.studentId
      GROUP BY s.studentId, u.name
      HAVING (
        AVG(CASE WHEN qa.status = 'completed' AND qa.getScore IS NOT NULL THEN qa.getScore END) < 60
        AND AVG(CASE WHEN qa.status = 'completed' AND qa.getScore IS NOT NULL THEN qa.getScore END) IS NOT NULL
      ) OR (
        COUNT(DISTINCT CASE 
          WHEN sma.status != 'completed' 
          AND sma.status != 'archived'
          AND sma.assignedAt IS NOT NULL
          AND sma.assignedAt < DATE_SUB(NOW(), INTERVAL 14 DAY) 
          THEN sma.assignmentId 
        END) >= 2
      )
      ORDER BY avgScore ASC, missedDeadlines DESC
      LIMIT 10
    `);

    await connection.end();

    const students = atRiskStudents.map(student => {
      const avgScore = Math.round(student.avgScore || 0);
      const missedDeadlines = parseInt(student.missedDeadlines || 0);
      const lastActive = student.lastActive ? getTimeAgo(student.lastActive) : 'Never';
      
      let risk = 'medium';
      if ((avgScore > 0 && avgScore < 50) || missedDeadlines >= 4) risk = 'high';
      else if ((avgScore > 0 && avgScore < 60) || missedDeadlines >= 2) risk = 'medium';
      else risk = 'low';

      const initials = (student.name || '')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2) || 'ST';

      return {
        name: student.name || 'Unknown',
        avatar: initials,
        avgScore: avgScore,
        missedDeadlines: missedDeadlines,
        lastActive: lastActive,
        risk: risk
      };
    });

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Error in getAtRiskStudents:', error);
    if (connection) await connection.end().catch(() => {});
    res.status(500).json({
      success: false,
      message: 'Failed to fetch at-risk students',
      error: error.message
    });
  }
};

// Get top performers
const getTopPerformers = async (req, res) => {
  let connection;
  try {
    connection = await db();

    const [topPerformers] = await connection.execute(`
      SELECT 
        u.name,
        s.studentId,
        AVG(CASE WHEN qa.status = 'completed' AND qa.getScore IS NOT NULL THEN qa.getScore END) as avgScore,
        COUNT(DISTINCT sma.moduleId) as modules
      FROM Student s
      INNER JOIN User u ON s.userId = u.userId
      LEFT JOIN QuizAttempt qa ON s.studentId = qa.studentId AND qa.status = 'completed' AND qa.getScore IS NOT NULL
      LEFT JOIN StudentModuleAssignment sma ON s.studentId = sma.studentId
      GROUP BY s.studentId, u.name
      HAVING COUNT(qa.attemptId) > 0
      ORDER BY avgScore DESC, modules DESC
      LIMIT 10
    `);

    await connection.end();

    const performers = topPerformers.map((student, index) => {
      const avgScore = Math.round(student.avgScore || 0);
      const modules = parseInt(student.modules || 0);

      const initials = (student.name || '')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2) || 'ST';

      const badges = ['🏆', '🥇', '🥈', '🥉'];
      const badge = badges[index] || '⭐';

      return {
        name: student.name || 'Unknown',
        avatar: initials,
        avgScore: avgScore,
        modules: modules,
        badge: badge
      };
    });

    res.json({
      success: true,
      data: performers
    });

  } catch (error) {
    console.error('Error in getTopPerformers:', error);
    if (connection) await connection.end().catch(() => {});
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top performers',
      error: error.message
    });
  }
};

// Get upcoming deadlines
const getUpcomingDeadlines = async (req, res) => {
  let connection;
  try {
    connection = await db();

    const [deadlines] = await connection.execute(`
      SELECT 
        m.title as assignment,
        DATE_ADD(sma.assignedAt, INTERVAL 14 DAY) as dueDate,
        COUNT(DISTINCT CASE WHEN sma.status = 'completed' THEN sma.studentId END) as studentsCompleted,
        COUNT(DISTINCT sma.studentId) as totalStudents
      FROM StudentModuleAssignment sma
      INNER JOIN Module m ON sma.moduleId = m.moduleId
      WHERE sma.status != 'completed' 
      AND sma.status != 'archived'
      AND sma.assignedAt IS NOT NULL
      AND DATE_ADD(sma.assignedAt, INTERVAL 14 DAY) >= CURDATE()
      GROUP BY m.moduleId, m.title, DATE_ADD(sma.assignedAt, INTERVAL 14 DAY)
      ORDER BY dueDate ASC
      LIMIT 10
    `);

    await connection.end();

    const upcomingDeadlines = deadlines
      .map(deadline => {
        if (!deadline.dueDate) return null;
        try {
          const dueDate = new Date(deadline.dueDate);
          if (isNaN(dueDate.getTime())) return null;
          const month = dueDate.toLocaleString('default', { month: 'short' });
          const day = dueDate.getDate();
          return {
            assignment: deadline.assignment || 'Unknown',
            dueDate: `${month} ${day}`,
            studentsCompleted: parseInt(deadline.studentsCompleted || 0),
            totalStudents: parseInt(deadline.totalStudents || 0)
          };
        } catch (e) {
          return null;
        }
      })
      .filter(d => d !== null);

    res.json({
      success: true,
      data: upcomingDeadlines
    });

  } catch (error) {
    console.error('Error in getUpcomingDeadlines:', error);
    if (connection) await connection.end().catch(() => {});
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming deadlines',
      error: error.message
    });
  }
};

// Helper function to format time ago
function getTimeAgo(date) {
  if (!date) return 'Unknown';
  try {
    const now = new Date();
    const past = new Date(date);
    if (isNaN(past.getTime())) return 'Unknown';
    
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } catch (e) {
    return 'Unknown';
  }
}

module.exports = {
  getClassStats,
  getModulePerformance,
  getRecentSubmissions,
  getAtRiskStudents,
  getTopPerformers,
  getUpcomingDeadlines
};
