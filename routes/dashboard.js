const router = require('express').Router();
const pool   = require('../db/pool');

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const [students, staff, visitors, incidents, attendance, energy, research, courses] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS total,
                  COUNT(*) FILTER (WHERE status='at_risk') AS at_risk,
                  ROUND(AVG(gpa),2) AS avg_gpa,
                  ROUND(AVG(attendance),1) AS avg_attendance
                  FROM students`),
      pool.query(`SELECT COUNT(*) AS total,
                  COUNT(*) FILTER (WHERE burnout_risk=true) AS burnout,
                  COUNT(*) FILTER (WHERE on_leave=true) AS on_leave,
                  ROUND(AVG(performance),0) AS avg_performance
                  FROM staff`),
      pool.query(`SELECT COUNT(*) FILTER (WHERE status='oncampus') AS on_campus,
                  COUNT(*) FILTER (WHERE DATE(entry_time)=CURRENT_DATE) AS today
                  FROM visitors`),
      pool.query(`SELECT COUNT(*) FILTER (WHERE status!='resolved') AS active,
                  COUNT(*) AS total FROM incidents`),
      pool.query(`SELECT ROUND(AVG(attendance),1) AS rate FROM students`),
      pool.query(`SELECT reading_kwh, source FROM energy ORDER BY recorded_at DESC LIMIT 1`),
      pool.query(`SELECT COUNT(*) AS total FROM research`),
      pool.query(`SELECT COUNT(*) FILTER (WHERE difficulty='hard' AND pass_rate < 70) AS hard FROM courses`),
    ]);

    res.json({
      kpi: {
        students:   { value: parseInt(students.rows[0].total), trend: '+8.3% YoY' },
        atRisk:     { value: parseInt(students.rows[0].at_risk) },
        avgGpa:     { value: parseFloat(students.rows[0].avg_gpa) },
        attendance: { value: parseFloat(attendance.rows[0].rate), trend: '+1.2%' },
        activeStaff:{ value: parseInt(staff.rows[0].total), burnout: parseInt(staff.rows[0].burnout) },
        visitors:   { today: parseInt(visitors.rows[0].today), onCampus: parseInt(visitors.rows[0].on_campus) },
        secAlerts:  { value: parseInt(incidents.rows[0].active), trend: '+2 today' },
        research:   { value: parseInt(research.rows[0].total), trend: 'This semester' },
        energy:     { value: parseInt(energy.rows[0]?.reading_kwh || 0), source: energy.rows[0]?.source },
        hardCourses:{ value: parseInt(courses.rows[0].hard) },
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
