const fs   = require('fs');
const path = require('path');
const pool = require('./pool');

async function initDB() {
  const client = await pool.connect();
  try {
    console.log('[DB] Testing connection...');
    await client.query('SELECT NOW()');
    console.log('[DB] Connected ✅');

    console.log('[DB] Running schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);
    console.log('[DB] Schema ready ✅');

    console.log('[DB] Running seed data...');
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    // Split on semicolons and run each statement individually
    // so one conflict doesn't abort the whole seed
    const statements = seed
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let ok = 0, skipped = 0;
    for (const stmt of statements) {
      try {
        await client.query(stmt);
        ok++;
      } catch (e) {
        // ON CONFLICT DO NOTHING should handle most, but catch anything else
        if (e.code === '23505') { skipped++; } // unique_violation
        else { console.warn('[DB] Seed warning:', e.message.slice(0, 80)); }
      }
    }
    console.log(`[DB] Seed done ✅  (${ok} ok, ${skipped} skipped)`);

  } catch (err) {
    console.error('[DB] ❌ Init error:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = initDB;
