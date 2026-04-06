const express  = require('express');
const path     = require('path');
const initDB   = require('./db/init');
const pool     = require('./db/pool');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── Health check (diagnose DB issues) ──────────────
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM students)   AS students,
        (SELECT COUNT(*) FROM staff)      AS staff,
        (SELECT COUNT(*) FROM courses)    AS courses,
        (SELECT COUNT(*) FROM incidents)  AS incidents,
        (SELECT COUNT(*) FROM finance)    AS finance,
        (SELECT COUNT(*) FROM research)   AS research,
        NOW()                             AS db_time
    `);
    res.json({ status: 'ok', db: 'connected', counts: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── API Routes ──────────────────────────────────────
app.use('/api/dashboard',  require('./routes/dashboard'));
app.use('/api/students',   require('./routes/students'));
app.use('/api/staff',      require('./routes/staff'));

const data = require('./routes/data');
app.use('/api/visitors',   (req, res) => data(req, res, 'visitors'));
app.use('/api/security',   (req, res) => data(req, res, 'security'));
app.use('/api/finance',    (req, res) => data(req, res, 'finance'));
app.use('/api/research',   (req, res) => data(req, res, 'research'));
app.use('/api/facilities', (req, res) => data(req, res, 'facilities'));
app.use('/api/academics',  (req, res) => data(req, res, 'academics'));
app.use('/api/hrm',        (req, res) => data(req, res, 'hrm'));
app.use('/api/energy',     (req, res) => data(req, res, 'energy'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Boot
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ INES Campus Intelligence live on port ${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ DB init failed, starting anyway:', err.message);
    // Start server even if seed fails so health check is accessible
    app.listen(PORT, () => console.log(`⚠️  Server up (DB issue) on port ${PORT}`));
  });
