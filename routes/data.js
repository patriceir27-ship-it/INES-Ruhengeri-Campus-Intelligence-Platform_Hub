const pool = require('../db/pool');

const fmt = n => 'RWF ' + (Number(n)/1e6).toFixed(0) + 'M';

const handlers = {

  // ─── VISITORS ─────────────────────────────────────
  async visitors(req, res) {
    const log = await pool.query(`
      SELECT id, full_name AS name, purpose, host, gate, status,
             TO_CHAR(entry_time,'HH24:MI') AS time
      FROM visitors ORDER BY entry_time DESC LIMIT 50`);
    const stats = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE DATE(entry_time)=CURRENT_DATE) AS today,
        COUNT(*) FILTER (WHERE status='oncampus')             AS on_campus,
        COUNT(*) FILTER (WHERE status='anomaly')              AS anomalies
      FROM visitors`);
    res.json({ visitors: log.rows, stats: stats.rows[0] });
  },

  // ─── SECURITY ────────────────────────────────────
  async security(req, res) {
    const incidents = await pool.query(`
      SELECT incident_id AS id, type, location,
             severity AS sev, status,
             TO_CHAR(reported_at,'HH24:MI') || ' today' AS time
      FROM incidents ORDER BY reported_at DESC`);
    const stats = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status != 'resolved')                       AS active,
        COUNT(*) FILTER (WHERE severity='high' AND status!='resolved')     AS high_open,
        COUNT(*) FILTER (WHERE DATE(reported_at)=CURRENT_DATE)             AS today
      FROM incidents`);
    res.json({ incidents: incidents.rows, stats: stats.rows[0] });
  },

  // ─── FINANCE ─────────────────────────────────────
  async finance(req, res) {
    const summary = await pool.query(`
      SELECT
        SUM(amount) FILTER (WHERE type='income')               AS total_income,
        SUM(amount) FILTER (WHERE type='expense')              AS total_expense,
        SUM(amount) FILTER (WHERE type='income')
          - SUM(amount) FILTER (WHERE type='expense')          AS surplus,
        SUM(amount) FILTER (WHERE category='tuition')          AS tuition_revenue,
        SUM(amount) FILTER (WHERE category='salary')           AS salary_costs,
        SUM(amount) FILTER (WHERE category='scholarships')     AS scholarships,
        SUM(amount) FILTER (WHERE category='infrastructure')   AS infrastructure
      FROM finance`);
    const byCategory = await pool.query(`
      SELECT category, SUM(amount) AS total, type
      FROM finance GROUP BY category, type ORDER BY total DESC`);
    const transactions = await pool.query(`
      SELECT * FROM finance ORDER BY recorded_at DESC LIMIT 20`);
    res.json({ summary: summary.rows[0], byCategory: byCategory.rows, transactions: transactions.rows });
  },

  // ─── RESEARCH ────────────────────────────────────
  async research(req, res) {
    const projects = await pool.query(`
      SELECT r.*, d.name AS dept_name, d.code AS dept_code, s.full_name AS lead_name
      FROM research r
      LEFT JOIN departments d ON r.dept_id  = d.id
      LEFT JOIN staff       s ON r.lead_staff_id = s.id
      ORDER BY r.created_at DESC`);
    const stats = await pool.query(`
      SELECT
        COUNT(*)                                          AS total,
        COUNT(*) FILTER (WHERE status='published')       AS published,
        COUNT(*) FILTER (WHERE status='ongoing')         AS ongoing,
        COUNT(*) FILTER (WHERE status='submitted')       AS submitted,
        COUNT(*) FILTER (WHERE international=true)       AS international,
        COALESCE(SUM(grant_amount),0)                    AS total_grants
      FROM research`);
    const byDept = await pool.query(`
      SELECT d.name AS dept, d.code, COUNT(r.id) AS papers,
             COALESCE(SUM(r.grant_amount),0) AS grants
      FROM research r
      LEFT JOIN departments d ON r.dept_id = d.id
      GROUP BY d.name, d.code ORDER BY papers DESC`);
    res.json({ projects: projects.rows, stats: stats.rows[0], byDept: byDept.rows });
  },

  // ─── FACILITIES ──────────────────────────────────
  async facilities(req, res) {
    const facilities = await pool.query(`
      SELECT *, ROUND(occupancy::numeric / NULLIF(capacity,0) * 100, 1) AS occ_pct
      FROM facilities ORDER BY type, name`);
    const maintenance = await pool.query(`
      SELECT m.*, f.name AS facility_name
      FROM maintenance m
      LEFT JOIN facilities f ON m.facility_id = f.id
      WHERE m.status != 'done'
      ORDER BY CASE m.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END`);
    const stats = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status='operational')  AS operational,
        COUNT(*) FILTER (WHERE status='maintenance')  AS in_maintenance,
        COUNT(*)                                       AS total,
        COALESCE(SUM(capacity),0)                     AS total_capacity,
        COALESCE(SUM(occupancy),0)                    AS total_occupancy
      FROM facilities`);
    res.json({ facilities: facilities.rows, maintenance: maintenance.rows, stats: stats.rows[0] });
  },

  // ─── ACADEMICS ───────────────────────────────────
  async academics(req, res) {
    const courses = await pool.query(`
      SELECT c.*, d.name AS dept_name, d.code AS dept_code, s.full_name AS lecturer_name
      FROM courses c
      LEFT JOIN departments d ON c.dept_id     = d.id
      LEFT JOIN staff       s ON c.lecturer_id = s.id
      ORDER BY c.pass_rate ASC`);
    const stats = await pool.query(`
      SELECT
        COUNT(*)                                                      AS total_courses,
        ROUND(AVG(pass_rate),1)                                       AS avg_pass_rate,
        COUNT(*) FILTER (WHERE difficulty='hard' AND pass_rate < 70)  AS hard_courses,
        COALESCE(SUM(students),0)                                     AS total_enrolments
      FROM courses`);
    const deptPerf = await pool.query(`
      SELECT d.name AS dept, d.code,
             ROUND(AVG(c.pass_rate),1) AS avg_pass_rate,
             ROUND(AVG(c.avg_score),1) AS avg_score,
             COUNT(c.id)               AS courses
      FROM courses c
      LEFT JOIN departments d ON c.dept_id = d.id
      GROUP BY d.name, d.code ORDER BY avg_pass_rate DESC`);
    res.json({ courses: courses.rows, stats: stats.rows[0], deptPerf: deptPerf.rows });
  },

  // ─── HRM ─────────────────────────────────────────
  async hrm(req, res) {
    const byRole = await pool.query(`
      SELECT role, COUNT(*) AS count,
             ROUND(AVG(performance),0) AS avg_performance,
             ROUND(AVG(teaching_hrs),1) AS avg_hrs
      FROM staff GROUP BY role ORDER BY count DESC`);
    const byDept = await pool.query(`
      SELECT d.name AS dept, d.code, COUNT(s.id) AS staff_count,
             COUNT(s.id) FILTER (WHERE s.burnout_risk=true) AS burnout
      FROM staff s
      LEFT JOIN departments d ON s.dept_id = d.id
      GROUP BY d.name, d.code ORDER BY staff_count DESC`);
    res.json({ byRole: byRole.rows, byDept: byDept.rows });
  },

  // ─── ENERGY ──────────────────────────────────────
  async energy(req, res) {
    const readings = await pool.query(`
      SELECT reading_kwh, source, TO_CHAR(recorded_at,'Mon YYYY') AS month
      FROM energy ORDER BY recorded_at ASC`);
    res.json({ readings: readings.rows });
  },
};

// Main dispatcher function
module.exports = async function(req, res, route) {
  try {
    const handler = handlers[route];
    if (!handler) return res.status(404).json({ error: `No handler for route: ${route}` });
    await handler(req, res);
  } catch (err) {
    console.error(`[API /${route}]`, err.message);
    res.status(500).json({ error: err.message });
  }
};
