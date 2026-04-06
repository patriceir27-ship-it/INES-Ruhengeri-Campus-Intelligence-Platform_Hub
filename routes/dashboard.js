const router = require('express').Router();
const pool   = require('../db/pool');

router.get('/', async (req, res) => {
  try {
    const [students, staff, visitors, incidents, energy, research, courses] = await Promise.all([
      pool.query(`
        SELECT COUNT(*)                                  AS total,
               COUNT(*) FILTER (WHERE status='at_risk') AS at_risk,
               ROUND(AVG(gpa),2)                        AS avg_gpa,
               ROUND(AVG(attendance),1)                 AS avg_attendance
        FROM students`),
      pool.query(`
        SELECT COUNT(*)                                       AS total,
               COUNT(*) FILTER (WHERE burnout_risk=true)     AS burnout,
               COUNT(*) FILTER (WHERE on_leave=true)         AS on_leave,
               ROUND(AVG(performance),0)                     AS avg_performance
        FROM staff`),
      pool.query(`
        SELECT COUNT(*) FILTER (WHERE status='oncampus')            AS on_campus,
               COUNT(*) FILTER (WHERE DATE(entry_time)=CURRENT_DATE) AS today
        FROM visitors`),
      pool.query(`
        SELECT COUNT(*) FILTER (WHERE status!='resolved') AS active,
               COUNT(*)                                   AS total
        FROM incidents`),
      pool.query(`
        SELECT reading_kwh, source FROM energy
        ORDER BY recorded_at DESC LIMIT 1`),
      pool.query(`SELECT COUNT(*) AS total FROM research`),
      pool.query(`
        SELECT COUNT(*) FILTER (WHERE difficulty='hard' AND pass_rate < 70) AS hard
        FROM courses`),
    ]);

    // Safe row accessors — guard against empty tables
    const s  = students.rows[0]  || {};
    const st = staff.rows[0]     || {};
    const v  = visitors.rows[0]  || {};
    const i  = incidents.rows[0] || {};
    const e  = energy.rows[0]    || {};
    const r  = research.rows[0]  || {};
    const c  = courses.rows[0]   || {};

    res.json({
      kpi: {
        students:    { value: parseInt(s.total   || 0), trend: '+8.3% YoY' },
        atRisk:      { value: parseInt(s.at_risk || 0) },
        avgGpa:      { value: parseFloat(s.avg_gpa || 0) },
        attendance:  { value: parseFloat(s.avg_attendance || 0), trend: '+1.2%' },
        activeStaff: { value: parseInt(st.total   || 0), burnout: parseInt(st.burnout || 0) },
        visitors:    { today: parseInt(v.today    || 0), onCampus: parseInt(v.on_campus || 0) },
        secAlerts:   { value: parseInt(i.active   || 0), trend: '+2 today' },
        research:    { value: parseInt(r.total    || 0), trend: 'This semester' },
        energy:      { value: parseInt(e.reading_kwh || 0), source: e.source || 'grid' },
        hardCourses: { value: parseInt(c.hard     || 0) },
      }
    });
  } catch (err) {
    console.error('[/api/dashboard]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
