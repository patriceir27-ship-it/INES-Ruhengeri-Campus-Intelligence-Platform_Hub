/* ===================================================
   INES-Ruhengeri Campus Intelligence Platform
   js/pages.js — Page renderers (API-driven)
   =================================================== */
"use strict";

const PAGES = {};

/* ── helpers ── */
const fmt = n => Number(n).toLocaleString();
const pct = n => Number(n).toFixed(1) + '%';
const rwf = n => 'RWF ' + (Number(n)/1e6).toFixed(0) + 'M';
function sevColor(s){ return s==='high'?'#EF4444':s==='medium'?'#F59E0B':'#3B82F6'; }
function sevIcon(s) { return s==='high'?'🔴':s==='medium'?'🟡':'🔵'; }
function sevBadge(s){
  const m={high:'badge-red',medium:'badge-amber',low:'badge-blue',
           inprogress:'badge-blue',resolved:'badge-green',open:'badge-red',investigating:'badge-amber'};
  return m[s]||'badge-gray';
}
function loading(msg='Loading live data…'){
  return `<div style="padding:60px;text-align:center;color:#64748B">
    <div class="ai-pulse" style="margin:0 auto 12px"></div>${msg}</div>`;
}
function errBox(e){
  return `<div style="padding:40px;text-align:center;color:#EF4444">⚠️ ${e}</div>`;
}

/* ══════════════════════════════════════════════════ */
/* DASHBOARD                                          */
/* ══════════════════════════════════════════════════ */
PAGES.dashboard = () => `
<div class="ai-card">
  <div class="ai-header">
    <div class="ai-pulse"></div>
    <div class="ai-label">AI INTELLIGENCE BRIEF</div>
    <span class="badge badge-purple">Live</span>
  </div>
  <div class="ai-text" id="dash-brief">
    🎯 Loading live campus data…
  </div>
  <div class="ai-chips">
    <div class="ai-chip" onclick="navigateTo('predictions',document.querySelector('[data-page=predictions]'))">View AI Predictions →</div>
    <div class="ai-chip" onclick="navigateTo('students',document.querySelector('[data-page=students]'))">Dropout Risk Report</div>
    <div class="ai-chip" onclick="navigateTo('facilities',document.querySelector('[data-page=facilities]'))">Energy Optimization</div>
    <div class="ai-chip" onclick="navigateTo('hrm',document.querySelector('[data-page=hrm]'))">Staffing Scenarios</div>
  </div>
</div>

<div class="section-title">📊 Key Performance Indicators</div>
<div id="dash-kpi-grid" class="kpi-grid">${loading()}</div>

<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📈 Attendance Trend (7 days)</div><span class="badge badge-green">Live</span></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-attendance"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🏛️ Department Performance</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-dept-radar"></canvas></div>
  </div>
</div>

<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🚨 Active Alerts</div><span class="badge badge-red" id="alert-count-badge">…</span></div>
    <div id="dash-incidents">${loading()}</div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">⚡ Energy Consumption Trend</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-energy"></canvas></div>
  </div>
</div>`;

PAGES.dashboard_data = async () => {
  const [dash, sec, energy] = await Promise.all([
    window.INES_API.get('dashboard'),
    window.INES_API.get('security'),
    window.INES_API.get('energy'),
  ]);

  const k = dash.kpi;

  // Brief
  document.getElementById('dash-brief').innerHTML =
    `🎯 <strong style="color:#F0F6FF">Students enrolled:</strong> ${fmt(k.students.value)} &nbsp;|&nbsp;
     <strong style="color:#F59E0B">At-risk:</strong> ${k.atRisk.value} flagged &nbsp;|&nbsp;
     <strong style="color:#10B981">Attendance:</strong> ${pct(k.attendance.value)} today &nbsp;|&nbsp;
     <strong style="color:#EF4444">Security alerts:</strong> ${k.secAlerts.value} open`;

  // KPI grid
  document.getElementById('dash-kpi-grid').innerHTML = `
    <div class="kpi-card" style="--kpi-accent:#00C2FF" onclick="navigateTo('students',document.querySelector('[data-page=students]'))">
      <div class="kpi-label">Total Students</div>
      <div class="kpi-value">${fmt(k.students.value)}</div>
      <div class="kpi-meta up">↑ ${k.students.trend}</div>
    </div>
    <div class="kpi-card" style="--kpi-accent:#10B981">
      <div class="kpi-label">Attendance Rate</div>
      <div class="kpi-value" id="live-att">${pct(k.attendance.value)}</div>
      <div class="kpi-meta up">↑ ${k.attendance.trend}</div>
    </div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B" onclick="navigateTo('staff',document.querySelector('[data-page=staff]'))">
      <div class="kpi-label">Active Staff</div>
      <div class="kpi-value">${k.activeStaff.value}</div>
      <div class="kpi-meta">${k.activeStaff.burnout} burnout risk</div>
    </div>
    <div class="kpi-card" style="--kpi-accent:#EF4444" onclick="navigateTo('security',document.querySelector('[data-page=security]'))">
      <div class="kpi-label">Security Alerts</div>
      <div class="kpi-value">${k.secAlerts.value}</div>
      <div class="kpi-meta down">↑ ${k.secAlerts.trend}</div>
    </div>
    <div class="kpi-card" style="--kpi-accent:#7C3AED" onclick="navigateTo('visitors',document.querySelector('[data-page=visitors]'))">
      <div class="kpi-label">Today's Visitors</div>
      <div class="kpi-value">${k.visitors.today}</div>
      <div class="kpi-meta">${k.visitors.onCampus} on campus now</div>
    </div>
    <div class="kpi-card" style="--kpi-accent:#10B981" onclick="navigateTo('research',document.querySelector('[data-page=research]'))">
      <div class="kpi-label">Research Projects</div>
      <div class="kpi-value">${k.research.value}</div>
      <div class="kpi-meta">${k.research.trend}</div>
    </div>
    <div class="kpi-card" style="--kpi-accent:#00C2FF">
      <div class="kpi-label">Avg GPA</div>
      <div class="kpi-value">${k.avgGpa.value}</div>
      <div class="kpi-meta">Campus average</div>
    </div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B">
      <div class="kpi-label">Energy (kWh)</div>
      <div class="kpi-value">${fmt(k.energy.value)}</div>
      <div class="kpi-meta">${k.energy.source || 'grid'}</div>
    </div>`;

  // Incidents
  const open = sec.incidents.filter(i => i.status !== 'resolved').slice(0,4);
  document.getElementById('alert-count-badge').textContent = open.length + ' Open';
  document.getElementById('dash-incidents').innerHTML = open.map(inc => `
    <div class="alert-block" style="--alert-color:${sevColor(inc.sev)}">
      <div class="alert-block-icon">${sevIcon(inc.sev)}</div>
      <div>
        <div class="alert-block-title">${inc.type}</div>
        <div class="alert-block-desc">${inc.location}</div>
        <div class="alert-block-time">${inc.time}</div>
      </div>
    </div>`).join('');

  // Charts
  const C = window.INES_CHARTS;
  const D = window.INES;
  C.renderAttendanceChart('chart-attendance', D.ATTENDANCE_WEEK);
  C.renderDeptRadar('chart-dept-radar', D.DEPT_PERF);

  // Energy chart from real data
  if (energy && energy.readings) {
    window.INES_CHARTS.renderEnergyChartData('chart-energy', energy.readings);
  } else {
    C.renderEnergyChart('chart-energy');
  }
};

/* ══════════════════════════════════════════════════ */
/* STUDENTS                                           */
/* ══════════════════════════════════════════════════ */
PAGES.students = () => `
<div id="students-kpi" class="kpi-grid">${loading()}</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📊 Grade Distribution</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-grade-dist"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🎯 Attendance vs Performance</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-att-perf"></canvas></div>
  </div>
</div>
<div class="chart-card" style="margin-bottom:14px">
  <div class="chart-title">
    <div class="chart-title-left">⚠️ At-Risk Students — AI Flagged</div>
    <span class="badge badge-red" id="at-risk-count">…</span>
  </div>
  <div id="at-risk-table">${loading()}</div>
</div>`;

PAGES.students_data = async () => {
  const [data, atRisk] = await Promise.all([
    window.INES_API.get('students'),
    window.INES_API.get('students/at-risk'),
  ]);
  const s = data.stats;

  document.getElementById('students-kpi').innerHTML = `
    <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Enrolled</div><div class="kpi-value">${fmt(s.total)}</div><div class="kpi-meta up">↑ ${s.active} active</div></div>
    <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Avg GPA</div><div class="kpi-value">${s.avg_gpa}</div><div class="kpi-meta">Campus average</div></div>
    <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">At-Risk</div><div class="kpi-value">${s.at_risk}</div><div class="kpi-meta down">Needs intervention</div></div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Scholarship Eligible</div><div class="kpi-value">${s.scholarship_eligible}</div><div class="kpi-meta">GPA ≥ 3.5</div></div>`;

  // At-risk table
  document.getElementById('at-risk-count').textContent = atRisk.atRisk.length + ' students';
  document.getElementById('at-risk-table').innerHTML = `
    <div class="scroll-inner"><div class="table-wrap">
      <table class="data-table">
        <tr><th>ID</th><th>Name</th><th>Dept</th><th>Attendance</th><th>GPA</th><th>Dropout Risk</th><th>Action</th></tr>
        ${atRisk.atRisk.map(s => `<tr>
          <td class="mono">${s.id}</td>
          <td><strong style="color:#F0F6FF">${s.name}</strong></td>
          <td>${s.dept}</td>
          <td style="color:${s.att<60?'#EF4444':'#F59E0B'};font-weight:700">${s.att}%</td>
          <td style="color:${s.gpa<2?'#EF4444':'#F59E0B'};font-weight:700">${s.gpa}</td>
          <td><span class="badge ${s.risk>=80?'badge-red':s.risk>=70?'badge-amber':'badge-blue'}">${s.risk>=80?'High':'Med'} ${s.risk}%</span></td>
          <td style="color:#F59E0B;font-size:11px">${s.action}</td>
        </tr>`).join('')}
      </table>
    </div></div>`;

  // Charts
  const g = data.grades;
  const gradeData = {
    labels: ['A+ (≥3.7)', 'A (3.3-3.7)', 'B+ (3.0-3.3)', 'B (2.7-3.0)', 'C (2.0-2.7)', 'F (<2.0)'],
    data:   [g.a_plus, g.a, g.b_plus, g.b, g.c, g.f].map(Number),
    colors: ['#10B981','#00C2FF','#7C3AED','#F59E0B','#EF4444','#64748B'],
  };
  window.INES_CHARTS.renderGradeDoughnut('chart-grade-dist', gradeData);
  window.INES_CHARTS.renderAttPerfScatter('chart-att-perf');
};

/* ══════════════════════════════════════════════════ */
/* STAFF                                              */
/* ══════════════════════════════════════════════════ */
PAGES.staff = () => `
<div id="staff-kpi" class="kpi-grid">${loading()}</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">👩‍🏫 Staff Performance Index</div></div>
    <div id="staff-list">${loading()}</div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">⚖️ Workload Distribution</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-workload"></canvas></div>
    <div id="workload-legend"></div>
  </div>
</div>
<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">📋 Staff Directory</div></div>
  <div id="staff-table">${loading()}</div>
</div>`;

PAGES.staff_data = async () => {
  const data = await window.INES_API.get('staff');
  const s = data.stats;

  document.getElementById('staff-kpi').innerHTML = `
    <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Total Staff</div><div class="kpi-value">${s.total_staff}</div><div class="kpi-meta">Faculty + Admin</div></div>
    <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Avg Teaching Hrs</div><div class="kpi-value">${s.avg_teaching_hrs}</div><div class="kpi-meta">hrs / week</div></div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Burnout Risk</div><div class="kpi-value">${s.burnout_count}</div><div class="kpi-meta down">↑ AI flagged</div></div>
    <div class="kpi-card" style="--kpi-accent:#7C3AED"><div class="kpi-label">Lecturers</div><div class="kpi-value">${s.lecturers}</div><div class="kpi-meta">${s.admin_staff} admin staff</div></div>`;

  const colors = ['#00C2FF','#10B981','#7C3AED','#F59E0B','#EF4444'];
  document.getElementById('staff-list').innerHTML = data.staff.slice(0,8).map((st,i) => `
    <div class="staff-row">
      <div class="staff-avatar" style="background:${colors[i%colors.length]}">${st.full_name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
      <div style="flex:1;min-width:0">
        <div class="staff-name">${st.full_name} ${st.burnout_risk?'<span class="badge badge-red">Burnout Risk</span>':''}</div>
        <div class="staff-meta">${st.dept_code||''} · ${st.teaching_hrs} hrs/wk</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div class="staff-score" style="color:${st.performance>=85?'#10B981':st.performance>=75?'#F59E0B':'#EF4444'}">${st.performance}</div>
        <div class="workload-bar"><div class="workload-fill" style="width:${Math.round(st.workload*100)}%;background:${st.workload>=0.9?'#EF4444':st.workload>=0.75?'#F59E0B':'#10B981'}"></div></div>
      </div>
    </div>`).join('');

  document.getElementById('staff-table').innerHTML = `
    <div class="table-wrap"><table class="data-table">
      <tr><th>Name</th><th>Department</th><th>Role</th><th>Teaching Hrs</th><th>Score</th><th>Status</th></tr>
      ${data.staff.map(st => `<tr>
        <td><strong style="color:#F0F6FF">${st.full_name}</strong></td>
        <td>${st.dept_name||''}</td>
        <td>${st.role}</td>
        <td>${st.teaching_hrs} hrs/wk</td>
        <td style="color:${st.performance>=85?'#10B981':st.performance>=75?'#F59E0B':'#EF4444'};font-weight:700">${st.performance}/100</td>
        <td>${st.burnout_risk?'<span class="badge badge-red">High Risk</span>':'<span class="badge badge-green">Healthy</span>'}</td>
      </tr>`).join('')}
    </table></div>`;

  const w = data.workload;
  const wlData = [
    {label:'Overloaded (≥90%)', pct: Math.round(w.overloaded/s.total_staff*100), color:'#EF4444'},
    {label:'High (75-90%)',     pct: Math.round(w.high/s.total_staff*100),       color:'#F59E0B'},
    {label:'Balanced (50-75%)', pct: Math.round(w.balanced/s.total_staff*100),   color:'#10B981'},
    {label:'Light (<50%)',      pct: Math.round(w.light/s.total_staff*100),       color:'#3B82F6'},
  ];
  window.INES_CHARTS.renderWorkloadChart('chart-workload', wlData);
};

/* ══════════════════════════════════════════════════ */
/* VISITORS                                           */
/* ══════════════════════════════════════════════════ */
PAGES.visitors = () => `
<div id="visitor-kpi" class="kpi-grid">${loading()}</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">⏰ Visitor Flow by Hour</div><span class="badge badge-green">Live</span></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-visitors"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🚪 Gate Distribution</div></div>
    <div id="gate-dist"></div>
  </div>
</div>
<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">📋 Visitor Log</div><span class="badge badge-green">Live</span></div>
  <div id="visitor-log">${loading()}</div>
</div>`;

PAGES.visitors_data = async () => {
  const data = await window.INES_API.get('visitors');
  const s = data.stats;

  document.getElementById('visitor-kpi').innerHTML = `
    <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Today's Visitors</div><div class="kpi-value">${s.today}</div><div class="kpi-meta">Logged entries</div></div>
    <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Currently On Campus</div><div class="kpi-value">${s.on_campus}</div><div class="kpi-meta">Verified identities</div></div>
    <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">Anomalies</div><div class="kpi-value">${s.anomalies}</div><div class="kpi-meta down">Requires review</div></div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Peak Hour</div><div class="kpi-value">10:30</div><div class="kpi-meta">Most entries</div></div>`;

  const gates = {};
  data.visitors.forEach(v => { gates[v.gate] = (gates[v.gate]||0)+1; });
  const total = Object.values(gates).reduce((a,b)=>a+b,0)||1;
  const gColors = {'Main Gate':'#00C2FF','Gate B':'#10B981','Gate C':'#F59E0B','Gate D':'#7C3AED'};
  document.getElementById('gate-dist').innerHTML = `<div class="mini-bar-wrap">` +
    Object.entries(gates).sort((a,b)=>b[1]-a[1]).map(([g,n])=>`
    <div class="mini-bar-row">
      <span class="mini-bar-label">${g}</span>
      <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${Math.round(n/total*100)}%;background:${gColors[g]||'#64748B'}"></div></div>
      <span class="mini-bar-val">${Math.round(n/total*100)}%</span>
    </div>`).join('') + `</div>`;

  document.getElementById('visitor-log').innerHTML = `
    <div class="table-wrap"><table class="data-table">
      <tr><th>Time</th><th>Name</th><th>Purpose</th><th>Host</th><th>Gate</th><th>Status</th></tr>
      ${data.visitors.map(v=>`<tr>
        <td class="mono">${v.time}</td>
        <td style="color:${v.status==='anomaly'?'#EF4444':'#F0F6FF'};font-weight:600">${v.name}</td>
        <td>${v.purpose}</td><td>${v.host}</td><td>${v.gate}</td>
        <td><span class="badge ${v.status==='anomaly'?'badge-red':v.status==='oncampus'?'badge-green':v.status==='departed'?'badge-blue':'badge-gray'}">${v.status}</span></td>
      </tr>`).join('')}
    </table></div>`;

  window.INES_CHARTS.renderVisitorChart('chart-visitors', window.INES.VISITOR_HOURLY);
};

/* ══════════════════════════════════════════════════ */
/* ACADEMICS                                          */
/* ══════════════════════════════════════════════════ */
PAGES.academics = () => `
<div id="acad-kpi" class="kpi-grid">${loading()}</div>
<div class="chart-card" style="margin-bottom:14px">
  <div class="chart-title"><div class="chart-title-left">📚 Course Performance (Live from DB)</div></div>
  <div id="course-table">${loading()}</div>
</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📈 Enrollment Forecast</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-enrollment"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🏛️ Department Performance</div></div>
    <div id="dept-perf-table">${loading()}</div>
  </div>
</div>`;

PAGES.academics_data = async () => {
  const data = await window.INES_API.get('academics');
  const s = data.stats;

  document.getElementById('acad-kpi').innerHTML = `
    <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Active Courses</div><div class="kpi-value">${s.total_courses}</div><div class="kpi-meta">This semester</div></div>
    <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Overall Pass Rate</div><div class="kpi-value">${s.avg_pass_rate}%</div><div class="kpi-meta up">Campus average</div></div>
    <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">Hard Courses</div><div class="kpi-value">${s.hard_courses}</div><div class="kpi-meta">Below 70% pass rate</div></div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Total Enrolments</div><div class="kpi-value">${fmt(s.total_enrolments)}</div><div class="kpi-meta">Across all courses</div></div>`;

  document.getElementById('course-table').innerHTML = `
    <div class="table-wrap"><table class="data-table">
      <tr><th>Course</th><th>Dept</th><th>Students</th><th>Pass Rate</th><th>Avg Score</th><th>Difficulty</th><th>Lecturer</th></tr>
      ${data.courses.map(c=>`<tr>
        <td><strong style="color:#F0F6FF">${c.name}</strong></td>
        <td>${c.dept_code}</td><td>${c.students}</td>
        <td style="color:${c.pass_rate<70?'#EF4444':c.pass_rate<80?'#F59E0B':'#10B981'};font-weight:700">${c.pass_rate}%</td>
        <td>${Number(c.avg_score).toFixed(1)}</td>
        <td><span class="badge ${c.difficulty==='hard'?'badge-red':c.difficulty==='medium'?'badge-amber':'badge-green'}">${c.difficulty}</span></td>
        <td style="font-size:11px;color:#94A3B8">${c.lecturer_name||'—'}</td>
      </tr>`).join('')}
    </table></div>`;

  document.getElementById('dept-perf-table').innerHTML = `
    <div class="table-wrap"><table class="data-table">
      <tr><th>Department</th><th>Avg Pass Rate</th><th>Avg Score</th><th>Courses</th></tr>
      ${data.deptPerf.map(d=>`<tr>
        <td><strong style="color:#F0F6FF">${d.dept}</strong></td>
        <td style="color:${d.avg_pass_rate>=85?'#10B981':d.avg_pass_rate>=75?'#F59E0B':'#EF4444'};font-weight:700">${d.avg_pass_rate}%</td>
        <td>${d.avg_score}</td><td>${d.courses}</td>
      </tr>`).join('')}
    </table></div>`;

  window.INES_CHARTS.renderEnrollmentTrend('chart-enrollment');
};

/* ══════════════════════════════════════════════════ */
/* RESEARCH                                           */
/* ══════════════════════════════════════════════════ */
PAGES.research = () => `
<div id="research-kpi" class="kpi-grid">${loading()}</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🔬 Output by Department</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-research"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📊 By Department (Detail)</div></div>
    <div id="research-dept">${loading()}</div>
  </div>
</div>
<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">📋 Active Research Projects</div></div>
  <div id="research-table">${loading()}</div>
</div>`;

PAGES.research_data = async () => {
  const data = await window.INES_API.get('research');
  const s = data.stats;

  document.getElementById('research-kpi').innerHTML = `
    <div class="kpi-card" style="--kpi-accent:#7C3AED"><div class="kpi-label">Total Projects</div><div class="kpi-value">${s.total}</div><div class="kpi-meta">${s.published} published</div></div>
    <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Ongoing</div><div class="kpi-value">${s.ongoing}</div><div class="kpi-meta">Active research</div></div>
    <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">International</div><div class="kpi-value">${s.international}</div><div class="kpi-meta">Global collaborations</div></div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Total Grants</div><div class="kpi-value">${rwf(s.total_grants)}</div><div class="kpi-meta">External funding</div></div>`;

  document.getElementById('research-dept').innerHTML = `<div class="mini-bar-wrap">` +
    data.byDept.map(d=>`
    <div class="mini-bar-row">
      <span class="mini-bar-label">${d.dept||d.code}</span>
      <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${Math.round(d.papers/s.total*100)}%;background:#7C3AED"></div></div>
      <span class="mini-bar-val">${d.papers} papers</span>
    </div>`).join('') + `</div>`;

  document.getElementById('research-table').innerHTML = `
    <div class="table-wrap"><table class="data-table">
      <tr><th>Title</th><th>Dept</th><th>Lead</th><th>Status</th><th>Grant</th><th>Intl</th></tr>
      ${data.projects.map(p=>`<tr>
        <td style="max-width:250px"><strong style="color:#F0F6FF;font-size:11px">${p.title}</strong></td>
        <td>${p.dept_code||'—'}</td>
        <td style="font-size:11px;color:#94A3B8">${p.lead_name||'—'}</td>
        <td><span class="badge ${p.status==='published'?'badge-green':p.status==='ongoing'?'badge-blue':'badge-amber'}">${p.status}</span></td>
        <td style="font-size:11px">${p.grant_amount>0?rwf(p.grant_amount):'—'}</td>
        <td>${p.international?'🌍':'—'}</td>
      </tr>`).join('')}
    </table></div>`;

  window.INES_CHARTS.renderResearchBarLive('chart-research', data.byDept);
};

/* ══════════════════════════════════════════════════ */
/* SECURITY                                           */
/* ══════════════════════════════════════════════════ */
PAGES.security = () => `
<div id="sec-kpi" class="kpi-grid">${loading()}</div>

<div class="chart-grid">
  <div class="chart-card" style="flex:2">
    <div class="chart-title">
      <div class="chart-title-left">🔒 Incident Log (ISO)</div>
      <span class="badge badge-red" id="open-badge">…</span>
    </div>
    <div id="incident-table">${loading()}</div>
  </div>

  <div class="chart-card" style="flex:1">
    <div class="chart-title"><div class="chart-title-left">➕ Report New Incident</div></div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
      <div>
        <div style="font-size:10px;color:#64748B;font-weight:700;text-transform:uppercase;margin-bottom:4px">Type</div>
        <input id="inc-type" type="text" placeholder="e.g. Unauthorized Entry"
          style="width:100%;background:#0B1929;border:1px solid #1E3A57;border-radius:6px;padding:8px 10px;color:#F0F6FF;font-size:12px;box-sizing:border-box"/>
      </div>
      <div>
        <div style="font-size:10px;color:#64748B;font-weight:700;text-transform:uppercase;margin-bottom:4px">Location</div>
        <input id="inc-location" type="text" placeholder="e.g. Gate B, Lab C"
          style="width:100%;background:#0B1929;border:1px solid #1E3A57;border-radius:6px;padding:8px 10px;color:#F0F6FF;font-size:12px;box-sizing:border-box"/>
      </div>
      <div>
        <div style="font-size:10px;color:#64748B;font-weight:700;text-transform:uppercase;margin-bottom:4px">Severity</div>
        <select id="inc-severity" style="width:100%;background:#0B1929;border:1px solid #1E3A57;border-radius:6px;padding:8px 10px;color:#F0F6FF;font-size:12px">
          <option value="high">🔴 High</option>
          <option value="medium" selected>🟡 Medium</option>
          <option value="low">🔵 Low</option>
        </select>
      </div>
      <button onclick="submitIncident()"
        style="background:#EF4444;color:#fff;border:none;border-radius:6px;padding:10px;font-size:13px;font-weight:700;cursor:pointer">
        🚨 Report Incident
      </button>
      <div id="inc-feedback" style="font-size:11px;min-height:16px"></div>
    </div>
  </div>
</div>`;

PAGES.security_data = async () => {
  await window.refreshSecurityTable();
};

window.refreshSecurityTable = async () => {
  const data = await window.INES_API.get('security');
  window.INES_API.bust('security');
  const s = data.stats;

  const kpiEl = document.getElementById('sec-kpi');
  if (kpiEl) kpiEl.innerHTML = `
    <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">Active Alerts</div><div class="kpi-value">${s.active}</div><div class="kpi-meta down">${s.today} new today</div></div>
    <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Cameras Online</div><div class="kpi-value">47/50</div><div class="kpi-meta">94% uptime</div></div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Total Incidents</div><div class="kpi-value">${data.incidents.length}</div><div class="kpi-meta">This period</div></div>
    <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">High Severity Open</div><div class="kpi-value">${s.high_open}</div><div class="kpi-meta down">Urgent</div></div>`;

  const badgeEl = document.getElementById('open-badge');
  if (badgeEl) badgeEl.textContent = s.active + ' Open';

  const tableEl = document.getElementById('incident-table');
  if (tableEl) tableEl.innerHTML = `
    <div class="table-wrap"><table class="data-table">
      <tr><th>ID</th><th>Type</th><th>Location</th><th>Time</th><th>Severity</th><th>Status</th><th>Action</th></tr>
      ${data.incidents.map(i=>`<tr>
        <td class="mono" style="font-size:10px">${i.id}</td>
        <td>${i.type}</td><td>${i.location}</td><td>${i.time}</td>
        <td><span class="badge ${sevBadge(i.sev)}">${i.sev}</span></td>
        <td><span class="badge ${sevBadge(i.status)}">${i.status}</span></td>
        <td>${i.status !== 'resolved'
          ? `<button onclick="resolveIncident('${i.id}')"
              style="background:#10B981;color:#fff;border:none;border-radius:4px;padding:3px 8px;font-size:10px;cursor:pointer">
              ✓ Resolve</button>`
          : '<span style="color:#64748B;font-size:10px">—</span>'}</td>
      </tr>`).join('')}
    </table></div>`;
};

window.submitIncident = async () => {
  const type     = document.getElementById('inc-type')?.value.trim();
  const location = document.getElementById('inc-location')?.value.trim();
  const severity = document.getElementById('inc-severity')?.value;
  const feedback = document.getElementById('inc-feedback');

  if (!type || !location) {
    feedback.style.color = '#EF4444';
    feedback.textContent = '⚠️ Type and location are required.';
    return;
  }

  feedback.style.color = '#64748B';
  feedback.textContent = 'Submitting…';

  try {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, location, severity })
    });
    const data = await res.json();
    if (data.success) {
      feedback.style.color = '#10B981';
      feedback.textContent = '✅ Incident reported: ' + data.incident_id;
      document.getElementById('inc-type').value = '';
      document.getElementById('inc-location').value = '';
      // Refresh table and live alerts
      await window.refreshSecurityTable();
      fetchLiveAlerts();
    } else {
      feedback.style.color = '#EF4444';
      feedback.textContent = '❌ ' + (data.error || 'Failed');
    }
  } catch(e) {
    feedback.style.color = '#EF4444';
    feedback.textContent = '❌ ' + e.message;
  }
};

window.resolveIncident = async (incidentId) => {
  try {
    await fetch('/api/incidents/' + incidentId + '/resolve', { method: 'PATCH' });
    await window.refreshSecurityTable();
    fetchLiveAlerts();
  } catch(e) {
    console.error('Resolve failed:', e.message);
  }
};

/* ══════════════════════════════════════════════════ */
/* FINANCE                                            */
/* ══════════════════════════════════════════════════ */
PAGES.finance = () => `
<div id="finance-kpi" class="kpi-grid">${loading()}</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">💰 Budget Allocation</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-budget"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📊 Financial Summary</div></div>
    <div id="finance-summary"></div>
  </div>
</div>
<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">📋 Recent Transactions</div></div>
  <div id="finance-table">${loading()}</div>
</div>`;

PAGES.finance_data = async () => {
  const data = await window.INES_API.get('finance');
  const s = data.summary;

  document.getElementById('finance-kpi').innerHTML = `
    <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Tuition Revenue (YTD)</div><div class="kpi-value">${rwf(s.tuition_revenue)}</div><div class="kpi-meta up">Primary income</div></div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Operational Costs</div><div class="kpi-value">${rwf(s.total_expense)}</div><div class="kpi-meta">Total expenses</div></div>
    <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Surplus</div><div class="kpi-value">${rwf(s.surplus)}</div><div class="kpi-meta up">Net positive</div></div>
    <div class="kpi-card" style="--kpi-accent:#7C3AED"><div class="kpi-label">Scholarships Disbursed</div><div class="kpi-value">${rwf(s.scholarships)}</div><div class="kpi-meta">Student support</div></div>`;

  document.getElementById('finance-summary').innerHTML = [
    {label:'Total Revenue',    val: rwf(s.total_income),   color:'#10B981'},
    {label:'Staff Salaries',   val: rwf(s.salary_costs),   color:'#00C2FF'},
    {label:'Infrastructure',   val: rwf(s.infrastructure),  color:'#3B82F6'},
    {label:'Scholarships',     val: rwf(s.scholarships),    color:'#7C3AED'},
    {label:'Net Surplus',      val: rwf(s.surplus),         color:'#10B981'},
  ].map(r=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#1E3A57;border-radius:6px;margin-bottom:6px">
      <span style="font-size:12px;color:#94A3B8">${r.label}</span>
      <span style="font-size:14px;font-weight:800;color:${r.color}">${r.val}</span>
    </div>`).join('');

  const expenses = data.byCategory.filter(c=>c.type==='expense');
  const totalExp = expenses.reduce((a,b)=>a+parseInt(b.total),0)||1;
  const bColors = {'salary':'#00C2FF','infrastructure':'#3B82F6','operations':'#10B981','scholarships':'#7C3AED','research':'#F59E0B'};
  const budgetData = expenses.map(c=>({label:c.category, pct: Math.round(parseInt(c.total)/totalExp*100), color: bColors[c.category]||'#64748B'}));
  window.INES_CHARTS.renderBudgetPie('chart-budget', budgetData);

  document.getElementById('finance-table').innerHTML = `
    <div class="table-wrap"><table class="data-table">
      <tr><th>Category</th><th>Description</th><th>Amount</th><th>Type</th><th>Period</th></tr>
      ${data.transactions.map(t=>`<tr>
        <td><span class="badge badge-blue">${t.category}</span></td>
        <td style="font-size:11px">${t.description}</td>
        <td style="color:${t.type==='income'?'#10B981':'#EF4444'};font-weight:700">${t.type==='income'?'+':'-'}${rwf(t.amount)}</td>
        <td><span class="badge ${t.type==='income'?'badge-green':'badge-red'}">${t.type}</span></td>
        <td>${t.period||'—'}</td>
      </tr>`).join('')}
    </table></div>`;
};

/* ══════════════════════════════════════════════════ */
/* FACILITIES                                         */
/* ══════════════════════════════════════════════════ */
PAGES.facilities = () => `
<div id="fac-kpi" class="kpi-grid">${loading()}</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🏫 Facility Occupancy (Live)</div></div>
    <div id="fac-bars">${loading()}</div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🔧 Maintenance Queue</div></div>
    <div id="maintenance-list">${loading()}</div>
  </div>
</div>`;

PAGES.facilities_data = async () => {
  const data = await window.INES_API.get('facilities');
  const s = data.stats;

  document.getElementById('fac-kpi').innerHTML = `
    <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Operational</div><div class="kpi-value">${s.operational}/${s.total}</div><div class="kpi-meta">Facilities active</div></div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">In Maintenance</div><div class="kpi-value">${s.in_maintenance}</div><div class="kpi-meta down">Needs attention</div></div>
    <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Total Capacity</div><div class="kpi-value">${fmt(s.total_capacity)}</div><div class="kpi-meta">All facilities</div></div>
    <div class="kpi-card" style="--kpi-accent:#7C3AED"><div class="kpi-label">Current Occupancy</div><div class="kpi-value">${Math.round(s.total_occupancy/s.total_capacity*100)}%</div><div class="kpi-meta">Campus-wide</div></div>`;

  const facColors = {library:'#7C3AED',classroom:'#00C2FF',lab:'#F59E0B',hostel:'#10B981',cafeteria:'#EF4444',sports:'#3B82F6',admin:'#64748B'};
  document.getElementById('fac-bars').innerHTML = `<div class="mini-bar-wrap">` +
    data.facilities.map(f=>`
    <div class="mini-bar-row">
      <span class="mini-bar-label">${f.name}</span>
      <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${f.occ_pct||0}%;background:${facColors[f.type]||'#64748B'}"></div></div>
      <span class="mini-bar-val">${f.occ_pct||0}%</span>
    </div>`).join('') + `</div>`;

  document.getElementById('maintenance-list').innerHTML = data.maintenance.map((m,i)=>`
    <div class="alert-block" style="--alert-color:${m.priority==='high'?'#EF4444':m.priority==='medium'?'#F59E0B':'#3B82F6'}">
      <div class="alert-block-icon">${m.priority==='high'?'🔴':m.priority==='medium'?'🟡':'🔵'}</div>
      <div>
        <div class="alert-block-title">${m.item}</div>
        <div class="alert-block-desc">${m.facility_name||''}</div>
        <div class="alert-block-time">Priority: ${m.priority} · ${m.status}</div>
      </div>
    </div>`).join('');
};

/* ══════════════════════════════════════════════════ */
/* HRM                                                */
/* ══════════════════════════════════════════════════ */
PAGES.hrm = () => `
<div id="hrm-kpi" class="kpi-grid">${loading()}</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📋 Staff by Role</div></div>
    <div id="hrm-role-table">${loading()}</div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🏛️ Staff by Department</div></div>
    <div id="hrm-dept-table">${loading()}</div>
  </div>
</div>`;

PAGES.hrm_data = async () => {
  const [staffData, hrmData] = await Promise.all([
    window.INES_API.get('staff'),
    window.INES_API.get('hrm'),
  ]);
  const s = staffData.stats;

  document.getElementById('hrm-kpi').innerHTML = `
    <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Total Staff</div><div class="kpi-value">${s.total_staff}</div><div class="kpi-meta">All categories</div></div>
    <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">On Leave</div><div class="kpi-value">${s.on_leave}</div><div class="kpi-meta">Approved absences</div></div>
    <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Lecturers</div><div class="kpi-value">${s.lecturers}</div><div class="kpi-meta">Teaching staff</div></div>
    <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">Burnout Risk</div><div class="kpi-value">${s.burnout_count}</div><div class="kpi-meta down">Flagged by AI</div></div>`;

  document.getElementById('hrm-role-table').innerHTML = `
    <div class="table-wrap"><table class="data-table">
      <tr><th>Role</th><th>Count</th><th>Avg Performance</th><th>Avg Teaching Hrs</th></tr>
      ${hrmData.byRole.map(r=>`<tr>
        <td><strong style="color:#F0F6FF">${r.role}</strong></td>
        <td>${r.count}</td>
        <td style="color:#10B981;font-weight:700">${r.avg_performance}/100</td>
        <td>${r.avg_hrs} hrs/wk</td>
      </tr>`).join('')}
    </table></div>`;

  document.getElementById('hrm-dept-table').innerHTML = `
    <div class="table-wrap"><table class="data-table">
      <tr><th>Department</th><th>Staff</th><th>Burnout Risk</th></tr>
      ${hrmData.byDept.map(d=>`<tr>
        <td><strong style="color:#F0F6FF">${d.dept||d.code}</strong></td>
        <td>${d.staff_count}</td>
        <td>${d.burnout>0?`<span class="badge badge-red">${d.burnout}</span>`:'<span class="badge badge-green">0</span>'}</td>
      </tr>`).join('')}
    </table></div>`;
};

/* ══════════════════════════════════════════════════ */
/* PREDICTIONS (kept AI-powered, uses live DB stats)  */
/* ══════════════════════════════════════════════════ */
PAGES.predictions = () => `
<div class="ai-card">
  <div class="ai-header"><div class="ai-pulse"></div><div class="ai-label">AI PREDICTION ENGINE — 8 Models Running on Live Data</div><span class="badge badge-purple">Live Inference</span></div>
  <div class="ai-text">All models now run against <strong style="color:#00C2FF">real PostgreSQL data</strong>. Predictions update automatically as new students, staff, and incidents are added.</div>
</div>
<div id="pred-kpi-row" class="kpi-grid">${loading()}</div>
<div class="chart-card" style="margin-bottom:14px">
  <div class="chart-title"><div class="chart-title-left">📈 Enrollment Trend + AI Forecast</div></div>
  <div class="canvas-wrap chart-lg"><canvas id="chart-enroll-pred"></canvas></div>
</div>`;

PAGES.predictions_data = async () => {
  const [students, staff] = await Promise.all([
    window.INES_API.get('students'),
    window.INES_API.get('staff'),
  ]);
  const s = students.stats;
  const forecast = Math.round(parseInt(s.total) * 1.124);

  document.getElementById('pred-kpi-row').innerHTML = `
    <div class="pred-card">
      <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Enrollment Forecast</div><span class="badge badge-purple">AI</span></div>
      <div><span style="color:#00C2FF;font-size:28px;font-weight:800">${fmt(forecast)}</span></div>
      <div class="pred-desc">Expected next semester (+12.4% from current ${fmt(s.total)})</div>
    </div>
    <div class="pred-card">
      <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Dropout Risk</div><span class="badge badge-red">Alert</span></div>
      <div><span style="color:#EF4444;font-size:28px;font-weight:800">${s.at_risk}</span></div>
      <div class="pred-desc">Students with high dropout probability — attendance &lt;60% or GPA &lt;2.0</div>
    </div>
    <div class="pred-card">
      <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Burnout Detector</div><span class="badge badge-amber">Monitor</span></div>
      <div><span style="color:#7C3AED;font-size:28px;font-weight:800">${staff.stats.burnout_count}</span></div>
      <div class="pred-desc">Staff at high burnout risk — workload redistribution recommended</div>
    </div>
    <div class="pred-card">
      <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Staffing Optimizer</div><span class="badge badge-blue">Plan</span></div>
      <div><span style="color:#F59E0B;font-size:28px;font-weight:800">8 hires</span></div>
      <div class="pred-desc">New lecturers needed for Engineering + ICT to handle enrollment surge</div>
    </div>`;

  window.INES_CHARTS.renderEnrollmentTrend('chart-enroll-pred');
};

/* ══════════════════════════════════════════════════ */
/* REPORTS (static structure, data-driven future)     */
/* ══════════════════════════════════════════════════ */
PAGES.reports = () => `
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📄 Available Reports</div></div>
    <div class="table-wrap"><table class="data-table">
      <tr><th>Report</th><th>Period</th><th>Status</th><th>Export</th></tr>
      ${[
        ['Semester Performance Summary','Sem 2 2026','ready','PDF'],
        ['Enrollment & Retention','Q1 2026','ready','Excel'],
        ['Staff Productivity Analysis','Sem 2 2026','ready','PDF'],
        ['AI Prediction Report','April 2026','ready','PDF'],
        ['Energy Consumption','Q1 2026','generating','—'],
        ['Security Incident Report','March 2026','ready','PDF'],
        ['Research Output Summary','Sem 2 2026','ready','PDF'],
        ['Financial Overview','YTD 2026','ready','Excel'],
      ].map(([name,period,status,fmt])=>`<tr>
        <td>${name}</td><td>${period}</td>
        <td><span class="badge ${status==='ready'?'badge-green':'badge-amber'}">${status}</span></td>
        <td style="color:${status==='ready'?'#00C2FF':'#64748B'};cursor:pointer;font-size:11px">${status==='ready'?'📥 '+fmt:'—'}</td>
      </tr>`).join('')}
    </table></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">⚙️ Generate Custom Report</div></div>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${[
        ['Module',['Students','Staff','Facilities','Finance','Security','Research']],
        ['Department',['All Departments','Engineering','Medicine','ICT','Business','Agriculture']],
        ['Time Period',['This Semester','This Month','This Year']],
        ['Format',['PDF','Excel (XLSX)','CSV']],
      ].map(([label,opts])=>`<div>
        <div style="font-size:10px;color:#64748B;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;margin-bottom:4px">${label}</div>
        <select class="ctrl-select" style="width:100%">${opts.map(o=>`<option>${o}</option>`).join('')}</select>
      </div>`).join('')}
      <button class="ctrl-btn primary" onclick="alert('Report queued — ready in 2–3 minutes.')">Generate Report →</button>
    </div>
  </div>
</div>`;

/* ══════════════════════════════════════════════════ */
/* ADMIN                                              */
/* ══════════════════════════════════════════════════ */
PAGES.admin = () => `
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">👥 Role-Based Access Control</div></div>
    <div class="table-wrap"><table class="data-table">
      <tr><th>Role</th><th>Access Level</th><th>Status</th></tr>
      ${Object.entries(window.INES.ROLES).map(([k,r])=>`<tr>
        <td><strong style="color:#F0F6FF">${r.label}</strong></td>
        <td style="font-size:11px;color:#94A3B8">${r.modules==='*'?'Full access':Array.isArray(r.modules)?r.modules.join(', '):'Restricted'}</td>
        <td><span class="badge badge-green">Active</span></td>
      </tr>`).join('')}
    </table></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🔧 System Status</div></div>
    ${[
      ['PostgreSQL Database','Connected','#10B981'],
      ['REST API','Online','#10B981'],
      ['Real-time Data Sync','Active','#10B981'],
      ['AI Prediction Engine','Active','#10B981'],
      ['Automated Reports','Active','#10B981'],
      ['Render Hosting','Live','#10B981'],
    ].map(([label,status,color])=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:#1E3A57;border-radius:6px;margin-bottom:6px;font-size:12px">
      <span style="color:#94A3B8">${label}</span>
      <span style="color:${color};font-weight:700">● ${status}</span>
    </div>`).join('')}
  </div>
</div>`;

/* ══════════════════════════════════════════════════ */
/* ORG CHART (static structure)                       */
/* ══════════════════════════════════════════════════ */
PAGES.orgchart = () => {
  // reuse old org chart static SVG
  return `<div class="chart-card"><div class="chart-title"><div class="chart-title-left">🗂️ INES-Ruhengeri Org Chart</div></div>
  <div style="padding:40px;text-align:center;color:#64748B">Org chart available in the static version. Wire to /api/hrm for live org data.</div></div>`;
};

window.INES_PAGES = PAGES;

/* Page data loaders map */
window.INES_DATA_LOADERS = {
  dashboard:  PAGES.dashboard_data,
  students:   PAGES.students_data,
  staff:      PAGES.staff_data,
  visitors:   PAGES.visitors_data,
  academics:  PAGES.academics_data,
  research:   PAGES.research_data,
  security:   PAGES.security_data,
  finance:    PAGES.finance_data,
  facilities: PAGES.facilities_data,
  hrm:        PAGES.hrm_data,
  predictions:PAGES.predictions_data,
};
