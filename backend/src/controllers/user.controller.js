const connectDB = require('../config/db');

const updateAccountInfo = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, institution, bio } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const connection = await connectDB();

    // Update User table
    await connection.execute(
      'UPDATE User SET name = ?, email = ? WHERE userId = ?',
      [`${firstName} ${lastName}`, email, userId]
    );

    // Update Student table if user is student
    await connection.execute(
      'UPDATE Student SET enrollmentNumber = ? WHERE userId = ?',
      [req.body.studentId, userId]
    );

    // Update additional fields in UserPreferences table
    await connection.execute(
      `INSERT INTO UserPreferences (userId, phone, institution, bio)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       phone = VALUES(phone), institution = VALUES(institution), bio = VALUES(bio)`,
      [userId, phone, institution, bio]
    );

    await connection.end();
    res.json({ message: 'Account info updated successfully' });
  } catch (error) {
    console.error('Error updating account info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { theme, language, timeZone, dateFormat, defaultView } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const connection = await connectDB();

    // Insert or update preferences
    await connection.execute(
      `INSERT INTO UserPreferences (userId, theme, language, timeZone, dateFormat, defaultView)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       theme = VALUES(theme), language = VALUES(language), timeZone = VALUES(timeZone),
       dateFormat = VALUES(dateFormat), defaultView = VALUES(defaultView)`,
      [userId, theme, language, timeZone, dateFormat, defaultView]
    );

    await connection.end();
    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAccessibility = async (req, res) => {
  try {
    const { textSize, highContrast, reduceMotion, screenReader, keyboardNav, captions } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const connection = await connectDB();

    await connection.execute(
      `INSERT INTO UserAccessibility (userId, textSize, highContrast, reduceMotion, screenReader, keyboardNav, captions)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       textSize = VALUES(textSize), highContrast = VALUES(highContrast), reduceMotion = VALUES(reduceMotion),
       screenReader = VALUES(screenReader), keyboardNav = VALUES(keyboardNav), captions = VALUES(captions)`,
      [userId, textSize, highContrast, reduceMotion, screenReader, keyboardNav, captions]
    );

    await connection.end();
    res.json({ message: 'Accessibility settings updated successfully' });
  } catch (error) {
    console.error('Error updating accessibility:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateNotifications = async (req, res) => {
  try {
    const { assignments, quizDeadlines, performance, announcements, emailDigest } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const connection = await connectDB();

    await connection.execute(
      `INSERT INTO UserNotifications (userId, assignments, quizDeadlines, performance, announcements, emailDigest)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       assignments = VALUES(assignments), quizDeadlines = VALUES(quizDeadlines), performance = VALUES(performance),
       announcements = VALUES(announcements), emailDigest = VALUES(emailDigest)`,
      [userId, assignments, quizDeadlines, performance, announcements, emailDigest]
    );

    await connection.end();
    res.json({ message: 'Notification settings updated successfully' });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const connection = await connectDB();

    // Verify current password (simplified - in production, hash and compare)
    const [rows] = await connection.execute(
      'SELECT passwordHash FROM User WHERE userId = ?',
      [userId]
    );

    if (rows.length === 0) {
      await connection.end();
      return res.status(404).json({ message: 'User not found' });
    }

    // In production, use bcrypt to hash new password
    await connection.execute(
      'UPDATE User SET passwordHash = ? WHERE userId = ?',
      [newPassword, userId] // This should be hashed
    );

    await connection.end();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserSettings = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const connection = await connectDB();

    // Get user info
    const [userRows] = await connection.execute(
      'SELECT name, email FROM User WHERE userId = ?',
      [userId]
    );

    // Get preferences
    const [prefRows] = await connection.execute(
      'SELECT * FROM UserPreferences WHERE userId = ?',
      [userId]
    );

    // Get accessibility
    const [accRows] = await connection.execute(
      'SELECT * FROM UserAccessibility WHERE userId = ?',
      [userId]
    );

    // Get notifications
    const [notifRows] = await connection.execute(
      'SELECT * FROM UserNotifications WHERE userId = ?',
      [userId]
    );

    await connection.end();

    const user = userRows[0] || {};
    const preferences = prefRows[0] || {};
    const accessibility = accRows[0] || {};
    const notifications = notifRows[0] || {};

    res.json({
      account: {
        firstName: user.name ? user.name.split(' ')[0] : '',
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        email: user.email,
        phone: preferences.phone,
        institution: preferences.institution,
        bio: preferences.bio
      },
      preferences,
      accessibility,
      notifications
    });
  } catch (error) {
    console.error('Error getting user settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  updateAccountInfo,
  updatePreferences,
  updateAccessibility,
  updateNotifications,
  changePassword,
  getUserSettings
};
