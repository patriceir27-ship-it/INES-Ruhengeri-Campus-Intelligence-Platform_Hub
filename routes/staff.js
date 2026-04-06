const router = require('express').Router();
const pool   = require('../db/pool');

// GET /api/staff
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, d.name AS dept_name, d.code AS dept_code,
             UPPER(LEFT(s.full_name,1)) ||
             UPPER(SPLIT_PART(s.full_name,' ',2)::text[1:1]) AS initials
      FROM staff s
      LEFT JOIN departments d ON s.dept_id = d.id
      ORDER BY s.performance DESC`);

    const stats = await pool.query(`
      SELECT
        COUNT(*) AS total_staff,
        ROUND(AVG(teaching_hrs),1) AS avg_teaching_hrs,
        COUNT(*) FILTER (WHERE burnout_risk=true) AS burnout_count,
        COUNT(*) FILTER (WHERE on_leave=true) AS on_leave,
        COUNT(*) FILTER (WHERE role LIKE '%lecturer%') AS lecturers,
        COUNT(*) FILTER (WHERE role='admin') AS admin_staff
      FROM staff`);

    const workload = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE workload >= 0.9) AS overloaded,
        COUNT(*) FILTER (WHERE workload >= 0.75 AND workload < 0.9) AS high,
        COUNT(*) FILTER (WHERE workload >= 0.5 AND workload < 0.75) AS balanced,
        COUNT(*) FILTER (WHERE workload < 0.5) AS light
      FROM staff`);

    res.json({ staff: result.rows || [], stats: stats.rows[0] || {}, workload: workload.rows[0] || {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
