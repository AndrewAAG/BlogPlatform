const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const schemaPath = path.join(__dirname, '../database/schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

// Split queries by semicolon to execute them one by one
const queries = schemaSql.split(';').filter(query => query.trim().length > 0);

async function initDb() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Connected to database...');

    for (const query of queries) {
      if (query.trim()) {
        await connection.query(query);
        console.log('Executed query successfully.');
      }
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

initDb();
