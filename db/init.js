const fs   = require('fs');
const path = require('path');
const pool = require('./pool');

async function initDB() {
  const client = await pool.connect();
  try {
    console.log('[DB] Running schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);

    console.log('[DB] Running seed data...');
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await client.query(seed);

    console.log('[DB] ✅ Database ready.');
  } catch (err) {
    console.error('[DB] ❌ Init error:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = initDB;
