const mysql = require('mysql2/promise');
require('dotenv').config();

async function assign() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    const [students] = await connection.execute(
      'SELECT studentId FROM student WHERE userId = (SELECT userId FROM user WHERE email = ?)',
      ['stnew@vrmts.edu']
    );

    if (students.length > 0) {
      const studentId = students[0].studentId;
      const modules = [1, 2];
      for (const moduleId of modules) {
        await connection.execute(
          'INSERT INTO studentmoduleassignment (studentId, moduleId, status, progress, assignedAt) VALUES (?, ?, "not_started", 0, NOW()) ON DUPLICATE KEY UPDATE status="not_started", progress=0',
          [studentId, moduleId]
        );
      }
      console.log('Successfully assigned modules 1 and 2 to studentId:', studentId);
    } else {
      console.log('Student not found');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

assign();
