const connectDB = require('./src/config/db');

async function createStudent() {
  const connection = await connectDB();
  try {
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM user WHERE email = ?',
      ['stnew@vrmts.edu']
    );

    if (existingUsers.length > 0) {
      console.log('User already exists');
      return;
    }

    // Insert into user table
    const [userResult] = await connection.execute(
      'INSERT INTO user (email, passwordHash, name, userType, isActive) VALUES (?, ?, ?, ?, ?)',
      ['stnew@vrmts.edu', '1234', 'New Student', 'student', 1]
    );

    const userId = userResult.insertId;

    // Insert into student table
    await connection.execute(
      'INSERT INTO student (userId, enrollmentNumber, enrollmentDate, currentGrade) VALUES (?, ?, ?, ?)',
      [userId, 'ST-NEW-001', new Date().toISOString().split('T')[0], 'N/A']
    );

    console.log('Successfully created student user: stnew@vrmts.edu with ID:', userId);

  } catch (error) {
    console.error('Error creating student:', error);
  } finally {
    await connection.end();
  }
}

createStudent();
