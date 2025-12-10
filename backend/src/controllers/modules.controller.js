const db = require('../config/db');

// Get all modules for the current student
const getModules = async (req, res) => {
  try {
    const userId = req.session.user.userId;

    const connection = await db();

    // First get the studentId from the Student table
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(403).json({
        success: false,
        message: 'User is not a student'
      });
    }

    const studentId = students[0].studentId;

    // Get all modules with their assignment status for the student
    const [modules] = await connection.execute(`
      SELECT
        m.moduleId,
        m.title as name,
        m.description,
        m.difficultyLevel as difficulty,
        m.createdAt,
        sma.hoursSpent,
        sma.knowledge,
        sma.progress,
        sma.status,
        sma.completedAt,
        sma.assignedAt
      FROM Module m
      LEFT JOIN StudentModuleAssignment sma ON m.moduleId = sma.moduleId AND sma.studentId = ?
      WHERE sma.studentId IS NOT NULL
      ORDER BY m.createdAt DESC
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

      // Calculate duration and parts (simplified)
      const parts = 10; // Assume 10 parts per module
      const completedParts = Math.floor((module.progress || 0) / 10);
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
        quizScore: null, // TODO: Implement quiz scores later
        parts,
        completedParts,
        hoursSpent: module.hoursSpent || 0
      };
    });

    await connection.end();

    res.json({
      success: true,
      data: transformedModules
    });

  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch modules',
      error: error.message
    });
  }
};

// Get modules stats for the current student
const getModulesStats = async (req, res) => {
  try {
    const userId = req.session.user.userId;

    const connection = await db();

    // First get the studentId from the Student table
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(403).json({
        success: false,
        message: 'User is not a student'
      });
    }

    const studentId = students[0].studentId;

    // Get stats from StudentModuleAssignment
    const [stats] = await connection.execute(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as inProgress,
        AVG(progress) as avgProgress
      FROM StudentModuleAssignment
      WHERE studentId = ?
    `, [studentId]);

    const statData = stats[0];

    await connection.end();

    res.json({
      success: true,
      data: {
        total: statData.total || 0,
        completed: statData.completed || 0,
        inProgress: statData.inProgress || 0,
        avgProgress: Math.round(statData.avgProgress || 0)
      }
    });

  } catch (error) {
    console.error('Error fetching modules stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch modules stats',
      error: error.message
    });
  }
};

// Start a module for the current student
const startModule = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const moduleId = req.params.moduleId;

    const connection = await db();

    // First get the studentId from the Student table
    const [students] = await connection.execute(
      'SELECT studentId FROM Student WHERE userId = ?',
      [userId]
    );

    if (students.length === 0) {
      await connection.end();
      return res.status(403).json({
        success: false,
        message: 'User is not a student'
      });
    }

    const studentId = students[0].studentId;

    // Check if assignment already exists
    const [existing] = await connection.execute(
      'SELECT * FROM StudentModuleAssignment WHERE studentId = ? AND moduleId = ?',
      [studentId, moduleId]
    );

    if (existing.length > 0) {
      // Update existing assignment to in_progress
      await connection.execute(
        'UPDATE StudentModuleAssignment SET status = "in_progress", assignedAt = NOW() WHERE studentId = ? AND moduleId = ?',
        [studentId, moduleId]
      );
    } else {
      // Create new assignment
      await connection.execute(
        'INSERT INTO StudentModuleAssignment (studentId, moduleId, status, assignedAt) VALUES (?, ?, "in_progress", NOW())',
        [studentId, moduleId]
      );
    }

    await connection.end();

    res.json({
      success: true,
      message: 'Module started successfully'
    });

  } catch (error) {
    console.error('Error starting module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start module',
      error: error.message
    });
  }
};

module.exports = { getModules, getModulesStats, startModule };
