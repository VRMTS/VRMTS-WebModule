const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function insertSampleQuestions() {
  try {
    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('Connected to database');

    // Read the JSON file
    const jsonPath = path.join(__dirname, '../data/quiz-questions/lab1.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonData);

    // First, insert or update the module
    const [moduleResult] = await connection.execute(
      'INSERT INTO Module (title, difficultyLevel, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), difficultyLevel = VALUES(difficultyLevel), description = VALUES(description)',
      [data.module.title, data.module.difficultyLevel, data.module.description]
    );

    const moduleId = moduleResult.insertId || (await connection.execute('SELECT moduleId FROM Module WHERE title = ?', [data.module.title]))[0][0].moduleId;

    console.log(`Module inserted/updated with ID: ${moduleId}`);

    // Insert questions
    for (const question of data.questions) {
      const [questionResult] = await connection.execute(
        'INSERT INTO QuestionBank (questionType, difficulty, topic, moduleId, correctAnswer, options, explanation, questionText) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          question.questionType,
          question.difficulty,
          question.topic,
          moduleId,
          question.correctAnswer,
          question.options ? JSON.stringify(question.options) : null,
          question.explanation,
          question.questionText
        ]
      );

      console.log(`Question inserted with ID: ${questionResult.insertId}`);
    }

    console.log('All sample questions inserted successfully');

    await connection.end();

  } catch (error) {
    console.error('Error inserting sample questions:', error);
    console.error(error.message);
  }
}

insertSampleQuestions();
