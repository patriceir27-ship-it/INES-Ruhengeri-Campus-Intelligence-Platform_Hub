const router = require('express').Router();
const pool   = require('../db/pool');

// GET /api/students
router.get('/', async (req, res) => {
  try {
    const { status, dept, limit = 100 } = req.query;
    let where = [];
    let params = [];

    if (status) { params.push(status); where.push(`s.status = $${params.length}`); }
    if (dept)   { params.push(dept);   where.push(`d.code = $${params.length}`); }

    const q = `
      SELECT s.*, d.name AS dept_name, d.code AS dept_code
      FROM students s
      LEFT JOIN departments d ON s.dept_id = d.id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY s.student_id
      LIMIT $${params.length + 1}`;

    params.push(limit);
    const result = await pool.query(q, params);

    // Stats
    const stats = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status='at_risk') AS at_risk,
        COUNT(*) FILTER (WHERE status='active') AS active,
        ROUND(AVG(gpa),2) AS avg_gpa,
        ROUND(AVG(attendance),1) AS avg_attendance,
        COUNT(*) FILTER (WHERE gpa >= 3.5) AS scholarship_eligible
      FROM students`);

    // Grade distribution
    const grades = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE gpa >= 3.7) AS a_plus,
        COUNT(*) FILTER (WHERE gpa >= 3.3 AND gpa < 3.7) AS a,
        COUNT(*) FILTER (WHERE gpa >= 3.0 AND gpa < 3.3) AS b_plus,
        COUNT(*) FILTER (WHERE gpa >= 2.7 AND gpa < 3.0) AS b,
        COUNT(*) FILTER (WHERE gpa >= 2.0 AND gpa < 2.7) AS c,
        COUNT(*) FILTER (WHERE gpa < 2.0) AS f
      FROM students`);

    res.json({ students: result.rows, stats: stats.rows[0] || {}, grades: grades.rows[0] || {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/at-risk
router.get('/at-risk', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.student_id AS id, s.full_name AS name,
             d.code AS dept, s.attendance AS att, s.gpa,
             CASE
               WHEN s.attendance < 50 AND s.gpa < 2.0 THEN 92
               WHEN s.attendance < 55 AND s.gpa < 2.5 THEN 85
               WHEN s.attendance < 60 AND s.gpa < 2.5 THEN 78
               WHEN s.attendance < 65 OR s.gpa < 2.0   THEN 71
               ELSE 65
             END AS risk,
             'Academic counseling recommended' AS action
      FROM students s
      LEFT JOIN departments d ON s.dept_id = d.id
      WHERE s.status = 'at_risk'
      ORDER BY risk DESC, s.attendance ASC`);

    res.json({ atRisk: result.rows || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
