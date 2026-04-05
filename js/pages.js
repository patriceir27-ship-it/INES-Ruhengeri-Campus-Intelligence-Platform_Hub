/* ===================================================
   INES-RUHENGERI CAMPUS INTELLIGENCE PLATFORM
   js/pages.js — Page HTML generators
   =================================================== */

"use strict";

/* ─── LAZY DATA ACCESSOR ───────────────────────────────────────────────────
   CRITICAL FIX: Never destructure window.INES at the top level of this file.
   window.INES is defined in data.js; if pages.js somehow executes before
   data.js is fully parsed (e.g. on Render's CDN with aggressive caching or
   a network race), the destructuring throws a TypeError that silently kills
   all subsequent JS and leaves the dashboard blank.
   Solution: use the D() getter — called lazily, only when a page function
   runs, by which time window.INES is always available.
─────────────────────────────────────────────────────────────────────────── */
function D() {
  if (!window.INES) throw new Error('[INES] window.INES not loaded. Check script order in index.html.');
  return window.INES;
}

/* Convenience shorthands — evaluated lazily inside each page function */
function KPI()        { return D().KPI; }
function AT_RISK()    { return D().AT_RISK; }
function STAFF_LIST() { return D().STAFF_LIST; }
function VISITOR_LOG(){ return D().VISITOR_LOG; }
function COURSES()    { return D().COURSES; }
function INCIDENTS()  { return D().INCIDENTS; }
function AI_MODELS()  { return D().AI_MODELS; }
function FINANCE()    { return D().FINANCE; }
function RESEARCH()   { return D().RESEARCH; }
function FACILITIES() { return D().FACILITIES; }
function HRM()        { return D().HRM; }

const PAGES = {};

/* ──────────────────────────────────────────────── */
/* DASHBOARD                                        */
/* ──────────────────────────────────────────────── */
PAGES.dashboard = () => `
<div class="ai-card">
  <div class="ai-header">
    <div class="ai-pulse"></div>
    <div class="ai-label">AI INTELLIGENCE BRIEF</div>
    <span class="badge badge-purple">Updated 2 min ago</span>
  </div>
  <div class="ai-text" id="ai-brief-text">
    🎯 <strong style="color:#F0F6FF">Enrollment surge:</strong> Semester 2 tracking 18% above forecast.
    Library occupancy peaks at 14:00 daily — consider extending hours.
    <strong style="color:#F59E0B">Dropout risk:</strong> 23 students flagged (attendance &lt;60% + declining GPA).
    Lab C utilization dropped 31% — maintenance check recommended.
    <span style="color:#10B981">Energy:</span> Solar panel ROI projected at 4.2 years.
  </div>
  <div class="ai-chips">
    <div class="ai-chip" onclick="navigateTo('predictions',document.querySelector('[data-page=predictions]'))">View AI Predictions →</div>
    <div class="ai-chip" onclick="navigateTo('students',document.querySelector('[data-page=students]'))">Dropout Risk Report</div>
    <div class="ai-chip">Energy Optimization</div>
    <div class="ai-chip">Staffing Scenarios</div>
  </div>
</div>

<div class="section-title">📊 Key Performance Indicators</div>
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-accent:#00C2FF" onclick="navigateTo('students',document.querySelector('[data-page=students]'))">
    <div class="kpi-label">Total Students</div>
    <div class="kpi-value">${KPI().students.value.toLocaleString()}</div>
    <div class="kpi-meta up">↑ ${KPI().students.trend}</div>
  </div>
  <div class="kpi-card" style="--kpi-accent:#10B981">
    <div class="kpi-label">Attendance Rate</div>
    <div class="kpi-value" id="live-att">${KPI().attendance.value}%</div>
    <div class="kpi-meta up">↑ ${KPI().attendance.trend}</div>
  </div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B" onclick="navigateTo('staff',document.querySelector('[data-page=staff]'))">
    <div class="kpi-label">Active Staff</div>
    <div class="kpi-value">${KPI().activeStaff.value}</div>
    <div class="kpi-meta">97% present today</div>
  </div>
  <div class="kpi-card" style="--kpi-accent:#EF4444" onclick="navigateTo('security',document.querySelector('[data-page=security]'))">
    <div class="kpi-label">Security Alerts</div>
    <div class="kpi-value">${KPI().secAlerts.value}</div>
    <div class="kpi-meta down">↑ ${KPI().secAlerts.trend}</div>
  </div>
  <div class="kpi-card" style="--kpi-accent:#7C3AED" onclick="navigateTo('visitors',document.querySelector('[data-page=visitors]'))">
    <div class="kpi-label">Today's Visitors</div>
    <div class="kpi-value">${KPI().visitors.value}</div>
    <div class="kpi-meta up">↑ ${KPI().visitors.trend}</div>
  </div>
  <div class="kpi-card" style="--kpi-accent:#06B6D4" onclick="navigateTo('facilities',document.querySelector('[data-page=facilities]'))">
    <div class="kpi-label">Lab Utilization</div>
    <div class="kpi-value">${KPI().labUtil.value}%</div>
    <div class="kpi-meta down">↓ ${KPI().labUtil.trend}</div>
  </div>
  <div class="kpi-card" style="--kpi-accent:#10B981" onclick="navigateTo('research',document.querySelector('[data-page=research]'))">
    <div class="kpi-label">Research Papers</div>
    <div class="kpi-value">${KPI().research.value}</div>
    <div class="kpi-meta">${KPI().research.trend}</div>
  </div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B">
    <div class="kpi-label">Energy (kWh)</div>
    <div class="kpi-value">${KPI().energy.value.toLocaleString()}</div>
    <div class="kpi-meta down">↑ ${KPI().energy.trend}</div>
  </div>
</div>

<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title">
      <div class="chart-title-left">📈 Attendance Trend (7 days)</div>
      <span class="badge badge-green">Live</span>
    </div>
    <div class="canvas-wrap chart-md"><canvas id="chart-attendance"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-title">
      <div class="chart-title-left">🏛️ Department Performance</div>
    </div>
    <div class="canvas-wrap chart-md"><canvas id="chart-dept-radar"></canvas></div>
  </div>
</div>

<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🗺️ Facility Utilization (Live)</div><span class="badge badge-amber">Now</span></div>
    <div class="campus-map" id="campus-map">
      ${campusMapHTML()}
      <div class="map-tooltip" id="map-tooltip" style="display:none"></div>
    </div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🚨 Active Alerts</div><span class="badge badge-red">3 Open</span></div>
    ${INCIDENTS().filter(i=>i.status!=='resolved').map(inc=>`
    <div class="alert-block" style="--alert-color:${sevColor(inc.sev)}">
      <div class="alert-block-icon">${sevIcon(inc.sev)}</div>
      <div>
        <div class="alert-block-title">${inc.type}</div>
        <div class="alert-block-desc">${inc.location}</div>
        <div class="alert-block-time">${inc.time}</div>
      </div>
    </div>`).join('')}
  </div>
</div>

<div class="chart-card" style="margin-bottom:16px">
  <div class="chart-title"><div class="chart-title-left">⚡ Energy Consumption Trend & Forecast</div></div>
  <div class="canvas-wrap chart-md"><canvas id="chart-energy"></canvas></div>
</div>
`;

function campusMapHTML() {
  const zones = [
    { label:"Main Library", occ:78, top:"5%", left:"5%",  w:"28%",h:"38%", bg:"rgba(16,185,129,0.35)" },
    { label:"Lecture A",    occ:95, top:"5%", left:"36%", w:"26%",h:"38%", bg:"rgba(239,68,68,0.4)" },
    { label:"Lab Complex",  occ:73, top:"5%", left:"65%", w:"30%",h:"38%", bg:"rgba(245,158,11,0.35)" },
    { label:"Admin Block",  occ:55, top:"46%",left:"5%",  w:"32%",h:"48%", bg:"rgba(59,130,246,0.3)" },
    { label:"Sports",       occ:42, top:"46%",left:"40%", w:"25%",h:"48%", bg:"rgba(16,185,129,0.25)" },
    { label:"Hostel",       occ:89, top:"46%",left:"68%", w:"27%",h:"48%", bg:"rgba(124,58,237,0.35)" },
  ];
  return zones.map(z => `
    <div class="map-zone" style="top:${z.top};left:${z.left};width:${z.w};height:${z.h};background:${z.bg}"
         onclick="showMapTooltip('${z.label}','${z.occ}%')">
      <div class="map-zone-occ">${z.occ}%</div>
      <div class="map-zone-label">${z.label}</div>
    </div>`).join('');
}

function sevColor(s) { return s==='high'?'#EF4444':s==='medium'?'#F59E0B':s==='low'?'#3B82F6':'#64748B'; }
function sevIcon(s)  { return s==='high'?'🔴':s==='medium'?'🟡':'🔵'; }
function sevBadge(s) {
  const map = { high:'badge-red', medium:'badge-amber', low:'badge-blue', inprogress:'badge-blue', resolved:'badge-green', open:'badge-red', investigating:'badge-amber' };
  return map[s] || 'badge-gray';
}

/* ──────────────────────────────────────────────── */
/* STUDENTS                                         */
/* ──────────────────────────────────────────────── */
PAGES.students = () => `
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Enrolled</div><div class="kpi-value">4,287</div><div class="kpi-meta up">↑ +8.3% YoY</div></div>
  <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Avg GPA</div><div class="kpi-value">3.24</div><div class="kpi-meta up">↑ +0.12 this sem</div></div>
  <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">At-Risk</div><div class="kpi-value">${AT_RISK().length}</div><div class="kpi-meta down">↑ +5 flagged</div></div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Scholarship Eligible</div><div class="kpi-value">312</div><div class="kpi-meta">7.3% of students</div></div>
</div>

<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📊 Grade Distribution</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-grade-dist"></canvas></div>
    <div style="margin-top:10px">
      ${GRADE_DIST.labels.map((l,i)=>`
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#94A3B8;margin-bottom:4px">
        <div style="width:10px;height:10px;border-radius:50%;background:${GRADE_DIST.colors[i]};flex-shrink:0"></div>
        <span>${l}</span><span style="margin-left:auto;font-weight:700;color:#F0F6FF">${GRADE_DIST.data[i]}%</span>
      </div>`).join('')}
    </div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🎯 Attendance vs Performance</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-att-perf"></canvas></div>
    <div style="margin-top:6px;font-size:11px;color:#94A3B8">Correlation: <strong style="color:#10B981">r = 0.78</strong> (strong positive)</div>
  </div>
</div>

<div class="chart-card" style="margin-bottom:14px">
  <div class="chart-title"><div class="chart-title-left">⚠️ At-Risk Students — AI Flagged (${AI_MODELS().dropoutRisk.name})</div><span class="badge badge-red">${AT_RISK().length} students</span></div>
  <div class="scroll-inner">
    <div class="table-wrap">
      <table class="data-table">
        <tr><th>ID</th><th>Name</th><th>Dept</th><th>Attendance</th><th>GPA</th><th>Dropout Risk</th><th>Action</th></tr>
        ${AT_RISK().map(s=>`<tr>
          <td class="mono">${s.id}</td>
          <td><strong style="color:#F0F6FF">${s.name}</strong></td>
          <td>${s.dept}</td>
          <td style="color:${s.att<60?'#EF4444':'#F59E0B'};font-weight:700">${s.att}%</td>
          <td style="color:${s.gpa<2?'#EF4444':'#F59E0B'};font-weight:700">${s.gpa}</td>
          <td><span class="badge ${s.risk>=80?'badge-red':s.risk>=65?'badge-amber':'badge-blue'}">${s.risk>=80?'High':'Med'} ${s.risk}%</span></td>
          <td style="color:#F59E0B;font-size:11px">${s.action}</td>
        </tr>`).join('')}
      </table>
    </div>
  </div>
</div>

<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">📈 Career Pathway Recommendations (AI)</div></div>
  <div class="mini-bar-wrap">
    <div class="mini-bar-row"><span class="mini-bar-label">Engineering → Tech Industry</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:82%;background:#00C2FF"></div></div><span class="mini-bar-val">82% fit</span></div>
    <div class="mini-bar-row"><span class="mini-bar-label">Medicine → Healthcare</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:91%;background:#10B981"></div></div><span class="mini-bar-val">91% fit</span></div>
    <div class="mini-bar-row"><span class="mini-bar-label">Business → Entrepreneurship</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:74%;background:#F59E0B"></div></div><span class="mini-bar-val">74% fit</span></div>
    <div class="mini-bar-row"><span class="mini-bar-label">ICT → Software Dev</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:88%;background:#7C3AED"></div></div><span class="mini-bar-val">88% fit</span></div>
    <div class="mini-bar-row"><span class="mini-bar-label">Agriculture → Agribusiness</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:76%;background:#10B981"></div></div><span class="mini-bar-val">76% fit</span></div>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* STAFF                                            */
/* ──────────────────────────────────────────────── */
PAGES.staff = () => `
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Total Staff</div><div class="kpi-value">${HRM().totalStaff}</div><div class="kpi-meta">Faculty + Admin</div></div>
  <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Avg Teaching Hrs</div><div class="kpi-value">${HRM().avgTeachingHrs}</div><div class="kpi-meta">hrs / week</div></div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Burnout Risk</div><div class="kpi-value">${HRM().burnoutCount}</div><div class="kpi-meta down">↑ 2 added this week</div></div>
  <div class="kpi-card" style="--kpi-accent:#7C3AED"><div class="kpi-label">Research Active</div><div class="kpi-value">68%</div><div class="kpi-meta up">↑ +5% this sem</div></div>
</div>

<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">👩‍🏫 Staff Performance Index</div></div>
    ${STAFF_LIST().map(s=>`
    <div class="staff-row">
      <div class="staff-avatar" style="background:${s.color}">${s.initials}</div>
      <div style="flex:1;min-width:0">
        <div class="staff-name">${s.name} ${s.burnout?'<span class="badge badge-red">Burnout Risk</span>':''}</div>
        <div class="staff-meta">${s.dept} · ${s.hrs} hrs/wk</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div class="staff-score" style="color:${s.score>=85?'#10B981':s.score>=75?'#F59E0B':'#EF4444'}">${s.score}</div>
        <div class="workload-bar"><div class="workload-fill" style="width:${Math.round(s.wl*100)}%;background:${s.wl>=0.9?'#EF4444':s.wl>=0.75?'#F59E0B':'#10B981'}"></div></div>
      </div>
    </div>`).join('')}
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">⚖️ Workload Distribution (${AI_MODELS().burnoutDetector.name})</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-workload"></canvas></div>
    <div style="margin-top:10px">
      ${HRM().workloadDist.map(d=>`
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#94A3B8;margin-bottom:4px">
        <div style="width:10px;height:10px;border-radius:2px;background:${d.color};flex-shrink:0"></div>
        <span>${d.label}</span><span style="margin-left:auto;font-weight:700;color:#F0F6FF">${d.pct}%</span>
      </div>`).join('')}
    </div>
    <div class="ai-card" style="margin-top:10px;padding:10px">
      <div class="ai-header" style="margin-bottom:4px"><div class="ai-pulse"></div><div class="ai-label">Burnout Prediction</div></div>
      <div class="ai-text" style="font-size:11px">Dr. Bizimungu I. shows <strong style="color:#EF4444">high burnout risk</strong> (98% workload, 6 committees). Recommend redistributing 2 courses next semester.</div>
    </div>
  </div>
</div>

<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">📋 Staff Directory</div></div>
  <div class="table-wrap">
    <table class="data-table">
      <tr><th>Name</th><th>Department</th><th>Teaching Hrs</th><th>Score</th><th>Status</th></tr>
      ${STAFF_LIST().map(s=>`<tr>
        <td><strong style="color:#F0F6FF">${s.name}</strong></td>
        <td>${s.dept}</td>
        <td>${s.hrs} hrs/wk</td>
        <td style="color:${s.score>=85?'#10B981':s.score>=75?'#F59E0B':'#EF4444'};font-weight:700">${s.score}/100</td>
        <td>${s.burnout?'<span class="badge badge-red">High Risk</span>':'<span class="badge badge-green">Healthy</span>'}</td>
      </tr>`).join('')}
    </table>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* VISITORS                                         */
/* ──────────────────────────────────────────────── */
PAGES.visitors = () => `
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Today's Visitors</div><div class="kpi-value">148</div><div class="kpi-meta up">↑ vs 127 yesterday</div></div>
  <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Currently On Campus</div><div class="kpi-value">43</div><div class="kpi-meta">Verified identities</div></div>
  <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">Anomalies</div><div class="kpi-value">2</div><div class="kpi-meta down">Requires review</div></div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Peak Hour</div><div class="kpi-value">10:30</div><div class="kpi-meta">32 visitors/hr</div></div>
</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">⏰ Visitor Flow by Hour</div><span class="badge badge-green">Live</span></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-visitors"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🚪 Gate Distribution</div></div>
    <div class="mini-bar-wrap" style="margin-top:8px">
      <div class="mini-bar-row"><span class="mini-bar-label">Main Gate</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:62%;background:#00C2FF"></div></div><span class="mini-bar-val">62%</span></div>
      <div class="mini-bar-row"><span class="mini-bar-label">Gate B (North)</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:22%;background:#10B981"></div></div><span class="mini-bar-val">22%</span></div>
      <div class="mini-bar-row"><span class="mini-bar-label">Gate C (Lab)</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:11%;background:#F59E0B"></div></div><span class="mini-bar-val">11%</span></div>
      <div class="mini-bar-row"><span class="mini-bar-label">Gate D (Staff)</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:5%;background:#7C3AED"></div></div><span class="mini-bar-val">5%</span></div>
    </div>
    <div class="ai-card" style="margin-top:12px;padding:10px">
      <div class="ai-header" style="margin-bottom:4px"><div class="ai-pulse"></div><div class="ai-label">AI Forecast (${AI_MODELS().trafficFlow.name})</div></div>
      <div class="ai-text" style="font-size:11px">Peak congestion predicted <strong style="color:#F59E0B">Tuesday 10–11AM</strong> at Main Gate (~340 concurrent). Recommend opening Gate B for student traffic.</div>
    </div>
  </div>
</div>
<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">📋 Visitor Log</div><span class="badge badge-green">Identity Verified</span></div>
  <div class="table-wrap">
    <table class="data-table">
      <tr><th>Time</th><th>Name</th><th>Purpose</th><th>Host</th><th>Gate</th><th>Status</th></tr>
      ${VISITOR_LOG().map(v=>`<tr>
        <td class="mono">${v.time}</td>
        <td style="color:${v.status==='anomaly'?'#EF4444':'#F0F6FF'};font-weight:600">${v.name}</td>
        <td>${v.purpose}</td>
        <td>${v.host}</td>
        <td>${v.gate}</td>
        <td><span class="badge ${v.status==='anomaly'?'badge-red':v.status==='oncampus'?'badge-green':v.status==='departed'?'badge-blue':'badge-gray'}">${v.status}</span></td>
      </tr>`).join('')}
    </table>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* ACADEMICS                                        */
/* ──────────────────────────────────────────────── */
PAGES.academics = () => `
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Active Courses</div><div class="kpi-value">184</div><div class="kpi-meta">This semester</div></div>
  <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Overall Pass Rate</div><div class="kpi-value">91.3%</div><div class="kpi-meta up">↑ +2.1%</div></div>
  <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">Hard Courses</div><div class="kpi-value">12</div><div class="kpi-meta">Below 70% pass rate</div></div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Exams This Week</div><div class="kpi-value">8</div><div class="kpi-meta">Scheduled</div></div>
</div>
<div class="chart-card" style="margin-bottom:14px">
  <div class="chart-title"><div class="chart-title-left">📚 Course Performance (course_difficulty_predictor — live scoring)</div><div id="ai-course-summary" style="font-size:11px;color:#94A3B8;margin-top:2px"></div></div>
  <div class="table-wrap">
    <table class="data-table">
      <tr><th>Course</th><th>Dept</th><th>Students</th><th>Pass Rate</th><th>Avg Score</th><th>Difficulty</th><th>AI Score</th></tr>
      <tbody id="course-table-body">
        ${COURSES().map(c=>`<tr>
          <td><strong style="color:#F0F6FF">${c.name}</strong></td>
          <td>${c.dept}</td><td>${c.students}</td>
          <td style="color:${c.pass<70?'#EF4444':c.pass<80?'#F59E0B':'#10B981'};font-weight:700">${c.pass}%</td>
          <td>${c.avg.toFixed(1)}</td>
          <td><span class="badge ${c.diff==='hard'?'badge-red':c.diff==='medium'?'badge-amber':'badge-green'}">${c.diff}</span></td>
          <td style="color:#00C2FF;font-weight:700">—</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📈 Enrollment Forecast (${AI_MODELS().enrollmentForecast.name})</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-enrollment"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🏛️ Department Radar</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-dept-radar-acad"></canvas></div>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* RESEARCH                                         */
/* ──────────────────────────────────────────────── */
PAGES.research = () => `
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-accent:#7C3AED"><div class="kpi-label">Papers (Semester)</div><div class="kpi-value">${RESEARCH().papersThisSem}</div><div class="kpi-meta up">↑ +11 vs last</div></div>
  <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Active Projects</div><div class="kpi-value">${RESEARCH().activeProjects}</div><div class="kpi-meta">Ongoing research</div></div>
  <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">External Grants</div><div class="kpi-value">${RESEARCH().externalGrants}</div><div class="kpi-meta up">↑ 3 new grants</div></div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Collaborations</div><div class="kpi-value">${RESEARCH().internationalCollab}</div><div class="kpi-meta">International partners</div></div>
</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🔬 Output by Department (DRDI)</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-research"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📋 Active Research Projects</div></div>
    <div class="mini-bar-wrap">
      <div class="mini-bar-row"><span class="mini-bar-label">Medicine</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:80%;background:#EF4444"></div></div><span class="mini-bar-val">16 papers</span></div>
      <div class="mini-bar-row"><span class="mini-bar-label">Agriculture</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:55%;background:#10B981"></div></div><span class="mini-bar-val">11 papers</span></div>
      <div class="mini-bar-row"><span class="mini-bar-label">Engineering</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:45%;background:#00C2FF"></div></div><span class="mini-bar-val">9 papers</span></div>
      <div class="mini-bar-row"><span class="mini-bar-label">ICT (DICT)</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:35%;background:#7C3AED"></div></div><span class="mini-bar-val">7 papers</span></div>
      <div class="mini-bar-row"><span class="mini-bar-label">Business</span><div class="mini-bar-track"><div class="mini-bar-fill" style="width:20%;background:#F59E0B"></div></div><span class="mini-bar-val">4 papers</span></div>
    </div>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* FACILITIES                                       */
/* ──────────────────────────────────────────────── */
PAGES.facilities = () => `
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Classrooms Active</div><div class="kpi-value">${FACILITIES().classrooms.active}/${FACILITIES().classrooms.total}</div><div class="kpi-meta">73% utilization</div></div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Maintenance Due</div><div class="kpi-value">${FACILITIES().maintenance}</div><div class="kpi-meta down">AI-scheduled</div></div>
  <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Hostel Occupancy</div><div class="kpi-value">${Math.round(FACILITIES().hostelOcc.filled/FACILITIES().hostelOcc.total*100)}%</div><div class="kpi-meta">${FACILITIES().hostelOcc.filled}/${FACILITIES().hostelOcc.total} beds</div></div>
  <div class="kpi-card" style="--kpi-accent:#7C3AED"><div class="kpi-label">Cafeteria Peak</div><div class="kpi-value">High</div><div class="kpi-meta">Peak ${FACILITIES().cafeteriaPeak}</div></div>
</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🏫 Classroom Occupancy Now (DLABE)</div></div>
    <div class="mini-bar-wrap">
      ${FACILITIES().blocks.map(b=>`
      <div class="mini-bar-row">
        <span class="mini-bar-label">${b.name}</span>
        <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${b.occ}%;background:${b.color}"></div></div>
        <span class="mini-bar-val">${b.occ}%</span>
      </div>`).join('')}
    </div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🔧 Maintenance Queue (AI: ${AI_MODELS().infrastructurePriority.name})</div></div>
    ${FACILITIES().maintenanceQueue.map((m,i)=>`
    <div class="alert-block" style="--alert-color:${i===0?'#EF4444':i===1?'#F59E0B':'#3B82F6'}">
      <div class="alert-block-icon">${i===0?'🔴':i===1?'🟡':'🔵'}</div>
      <div>
        <div class="alert-block-title">${m.item}</div>
        <div class="alert-block-desc">${m.note}</div>
        <div class="alert-block-time">Priority: ${m.priority}</div>
      </div>
    </div>`).join('')}
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* FINANCE                                          */
/* ──────────────────────────────────────────────── */
PAGES.finance = () => `
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Tuition Revenue (YTD)</div><div class="kpi-value">${FINANCE().tuitionYTD.value}</div><div class="kpi-meta up">${FINANCE().tuitionYTD.trend}</div></div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Operational Costs</div><div class="kpi-value">${FINANCE().opCosts.value}</div><div class="kpi-meta">${FINANCE().opCosts.trend}</div></div>
  <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Surplus</div><div class="kpi-value">${FINANCE().surplus.value}</div><div class="kpi-meta up">${FINANCE().surplus.trend}</div></div>
  <div class="kpi-card" style="--kpi-accent:#7C3AED"><div class="kpi-label">Scholarships Disbursed</div><div class="kpi-value">${FINANCE().scholarships.value}</div><div class="kpi-meta">${FINANCE().scholarships.trend}</div></div>
</div>
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">💰 Budget Allocation (DF)</div></div>
    <div class="canvas-wrap chart-md"><canvas id="chart-budget"></canvas></div>
    <div style="margin-top:10px">
      ${FINANCE().budgetAlloc.map(a=>`
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#94A3B8;margin-bottom:4px">
        <div style="width:10px;height:10px;border-radius:2px;background:${a.color};flex-shrink:0"></div>
        <span>${a.label}</span><span style="margin-left:auto;font-weight:700;color:#F0F6FF">${a.pct}%</span>
      </div>`).join('')}
    </div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📊 Financial Summary (Acc O)</div></div>
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:6px">
      ${[
        {label:"Total Revenue", val:"RWF 2.4B", color:"#10B981"},
        {label:"Staff Salaries", val:"RWF 630M", color:"#00C2FF"},
        {label:"Infrastructure", val:"RWF 280M", color:"#3B82F6"},
        {label:"Research Grants", val:"RWF 210M", color:"#7C3AED"},
        {label:"Net Surplus", val:"RWF 682M", color:"#10B981"},
      ].map(r=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#1E3A57;border-radius:6px">
        <span style="font-size:12px;color:#94A3B8">${r.label}</span>
        <span style="font-size:14px;font-weight:800;color:${r.color}">${r.val}</span>
      </div>`).join('')}
    </div>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* HRM                                              */
/* ──────────────────────────────────────────────── */
PAGES.hrm = () => `
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Total Staff</div><div class="kpi-value">${HRM().totalStaff}</div><div class="kpi-meta">All categories</div></div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">On Leave Today</div><div class="kpi-value">${HRM().onLeave}</div><div class="kpi-meta">Approved absences</div></div>
  <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">New Hires (Sem)</div><div class="kpi-value">${HRM().newHires}</div><div class="kpi-meta">Onboarding</div></div>
  <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">Burnout Risk</div><div class="kpi-value">${HRM().burnoutCount}</div><div class="kpi-meta down">Flagged by AI</div></div>
</div>
<div class="ai-card">
  <div class="ai-header"><div class="ai-pulse"></div><div class="ai-label">HRM AI RECOMMENDATION (${AI_MODELS().staffingOptimize.name})</div></div>
  <div class="ai-text">Hire <strong style="color:#00C2FF">8 new lecturers</strong> in Engineering (4) and ICT (4) before Semester 3 to handle projected +12.4% enrollment. Redistribute 3 overloaded staff in ICT. Projected savings: <strong style="color:#10B981">RWF 12M</strong> through optimized allocation vs. outsourcing.</div>
</div>
<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">📋 Staff Roster by Category</div></div>
  <div class="table-wrap">
    <table class="data-table">
      <tr><th>Category</th><th>Count</th><th>Fulltime</th><th>Parttime</th><th>Avg Salary</th></tr>
      <tr><td>Senior Lecturers</td><td>48</td><td>48</td><td>0</td><td>RWF 850K/mo</td></tr>
      <tr><td>Lecturers</td><td>126</td><td>110</td><td>16</td><td>RWF 620K/mo</td></tr>
      <tr><td>Admin Staff</td><td>84</td><td>80</td><td>4</td><td>RWF 420K/mo</td></tr>
      <tr><td>Technical Staff</td><td>32</td><td>28</td><td>4</td><td>RWF 380K/mo</td></tr>
      <tr><td>Security (ISO)</td><td>22</td><td>22</td><td>0</td><td>RWF 300K/mo</td></tr>
    </table>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* SECURITY                                         */
/* ──────────────────────────────────────────────── */
PAGES.security = () => `
<div class="kpi-grid">
  <div class="kpi-card" style="--kpi-accent:#EF4444"><div class="kpi-label">Active Alerts</div><div class="kpi-value">3</div><div class="kpi-meta down">↑ 2 new today</div></div>
  <div class="kpi-card" style="--kpi-accent:#10B981"><div class="kpi-label">Cameras Online</div><div class="kpi-value">47/50</div><div class="kpi-meta">94% uptime</div></div>
  <div class="kpi-card" style="--kpi-accent:#F59E0B"><div class="kpi-label">Incidents (Month)</div><div class="kpi-value">8</div><div class="kpi-meta down">↓ vs 12 last month</div></div>
  <div class="kpi-card" style="--kpi-accent:#00C2FF"><div class="kpi-label">Guards On Duty</div><div class="kpi-value">14</div><div class="kpi-meta">ISO + 3 shifts</div></div>
</div>
<div class="chart-card" style="margin-bottom:14px">
  <div class="chart-title"><div class="chart-title-left">🔒 Incident Log (ISO)</div><span class="badge badge-red">3 Open</span></div>
  <div class="table-wrap">
    <table class="data-table">
      <tr><th>ID</th><th>Type</th><th>Location</th><th>Time</th><th>Severity</th><th>Status</th></tr>
      ${INCIDENTS().map(i=>`<tr>
        <td class="mono">${i.id}</td>
        <td>${i.type}</td>
        <td>${i.location}</td>
        <td>${i.time}</td>
        <td><span class="badge ${sevBadge(i.sev)}">${i.sev}</span></td>
        <td><span class="badge ${sevBadge(i.status)}">${i.status}</span></td>
      </tr>`).join('')}
    </table>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* PREDICTIONS                                      */
/* ──────────────────────────────────────────────── */
PAGES.predictions = () => `
<div class="ai-card">
  <div class="ai-header"><div class="ai-pulse"></div><div class="ai-label">AI PREDICTION ENGINE — 8 Models Running</div><span class="badge badge-purple">Live Inference</span></div>
  <div class="ai-text">All models are running live in the browser using real statistical algorithms. Models are stored in <code style="color:#00C2FF;font-size:11px">models/</code>. Swap in your trained TensorFlow.js models to upgrade predictions.</div>
</div>

<div class="section-title">🎓 Enrollment & Academic Intelligence</div>
<div class="chart-grid-3">
  <div class="pred-card">
    <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Enrollment Forecast <span style="font-size:9px;color:#64748B">(LSTM)</span></div><span class="badge badge-purple">AI</span></div>
    <div id="pred-enrollment-val"><span style="color:#00C2FF;font-size:28px;font-weight:800">4,820</span></div>
    <div class="pred-desc" id="pred-enrollment-desc">Expected enrollment Sem 1 2026 — +12.4% from current</div>
    <div style="font-size:10px;color:#64748B;margin-top:4px">Model: <code style="color:#7C3AED">enrollment_forecast_model.js</code></div>
    <div id="pred-enrollment-conf"></div>
  </div>
  <div class="pred-card">
    <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Dropout Risk <span style="font-size:9px;color:#64748B">(Random Forest)</span></div><span class="badge badge-red">Alert</span></div>
    <div id="pred-dropout-val"><span style="color:#EF4444;font-size:28px;font-weight:800">23</span></div>
    <div class="pred-desc">Students with &gt;70% dropout probability right now</div>
    <div style="font-size:10px;color:#64748B;margin-top:4px">Model: <code style="color:#7C3AED">dropout_risk_classifier.js</code></div>
    <div id="pred-dropout-conf"></div>
  </div>
  <div class="pred-card">
    <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Course Difficulty <span style="font-size:9px;color:#64748B">(Gradient Boost)</span></div><span class="badge badge-amber">Forecast</span></div>
    <div id="pred-course-val"><span style="color:#EF4444;font-size:28px;font-weight:800">+3</span></div>
    <div class="pred-desc">Courses predicted to increase difficulty next semester</div>
    <div style="font-size:10px;color:#64748B;margin-top:4px">Model: <code style="color:#7C3AED">course_difficulty_predictor.js</code></div>
    <div id="pred-course-conf"></div>
  </div>
</div>

<div class="section-title">👥 Staff & HR Intelligence</div>
<div class="chart-grid-3">
  <div class="pred-card">
    <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Staffing Optimizer <span style="font-size:9px;color:#64748B">(Linear Programming)</span></div><span class="badge badge-blue">Plan</span></div>
    <div id="pred-staffing-val"><span style="color:#F59E0B;font-size:28px;font-weight:800">8 hires</span></div>
    <div class="pred-desc" id="pred-staffing-desc">New lecturers needed for Engineering + ICT to handle enrollment surge</div>
    <div style="font-size:10px;color:#64748B;margin-top:4px">Model: <code style="color:#7C3AED">staffing_optimizer.js</code></div>
    <div id="pred-staffing-conf"></div>
  </div>
  <div class="pred-card">
    <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Burnout Detector <span style="font-size:9px;color:#64748B">(SVM RBF Kernel)</span></div><span class="badge badge-purple">Monitor</span></div>
    <div id="pred-burnout-val"><span style="color:#7C3AED;font-size:28px;font-weight:800">7</span></div>
    <div class="pred-desc">Staff members at high burnout risk — workload redistribution needed</div>
    <div style="font-size:10px;color:#64748B;margin-top:4px">Model: <code style="color:#7C3AED">staff_burnout_detector.js</code></div>
    <div id="pred-burnout-conf"></div>
  </div>
  <div class="pred-card">
    <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Traffic Predictor <span style="font-size:9px;color:#64748B">(SARIMA)</span></div><span class="badge badge-blue">Flow</span></div>
    <div id="pred-traffic-val"><span style="color:#3B82F6;font-size:20px;font-weight:800">Tue 10:00</span></div>
    <div class="pred-desc">Peak campus congestion — open Gate B, activate overflow</div>
    <div style="font-size:10px;color:#64748B;margin-top:4px">Model: <code style="color:#7C3AED">campus_traffic_predictor.js</code></div>
    <div id="pred-traffic-conf"></div>
  </div>
</div>

<div class="section-title">🏗️ Infrastructure & Energy Intelligence</div>
<div class="chart-grid-3" style="margin-bottom:16px">
  <div class="pred-card">
    <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Infra Priority <span style="font-size:9px;color:#64748B">(AHP Decision Tree)</span></div><span class="badge badge-green">P1</span></div>
    <div id="pred-infra-val"><span style="color:#10B981;font-size:16px;font-weight:800">New Lab Wing</span></div>
    <div class="pred-desc">Highest priority infrastructure investment (score: 79.4/100)</div>
    <div style="font-size:10px;color:#64748B;margin-top:4px">Model: <code style="color:#7C3AED">infra_priority_ranker.js</code></div>
    <div id="pred-infra-conf"></div>
  </div>
  <div class="pred-card" style="grid-column:span 2">
    <div class="pred-header"><div style="font-size:12px;font-weight:700;color:#F0F6FF">Energy Forecast <span style="font-size:9px;color:#64748B">(ARIMA 2,1,2)</span></div><span class="badge badge-amber">8-month</span></div>
    <div id="pred-energy-val"><span style="color:#F59E0B;font-size:20px;font-weight:800">Loading…</span></div>
    <div class="pred-desc">Next month forecast — solar installation saves ~22% of consumption</div>
    <div style="font-size:10px;color:#64748B;margin-top:4px">Model: <code style="color:#7C3AED">energy_consumption_predictor.js</code></div>
    <div id="pred-energy-conf"></div>
  </div>
</div>

<div class="chart-card" style="margin-bottom:14px">
  <div class="chart-title"><div class="chart-title-left">📈 Enrollment Trend + AI Forecast (enrollment_forecast_model)</div></div>
  <div class="canvas-wrap chart-lg"><canvas id="chart-enroll-pred"></canvas></div>
</div>

<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">👩‍🏫 Staffing Recommendations by Department</div><span class="badge badge-blue">staffing_optimizer</span></div>
    <div class="table-wrap">
      <table class="data-table">
        <tr><th>Dept</th><th>Staff Now</th><th>Projected Students</th><th>Ratio</th><th>Urgency</th><th>Action</th></tr>
        <tbody id="pred-staffing-table"><tr><td colspan="6" style="color:#64748B;text-align:center">Loading model…</td></tr></tbody>
      </table>
    </div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📅 Weekly Traffic Forecast</div><span class="badge badge-blue">campus_traffic_predictor</span></div>
    <div class="table-wrap">
      <table class="data-table">
        <tr><th>Day</th><th>Peak Hour</th><th>Peak Count</th><th>Daily Total</th><th>Congestion</th></tr>
        <tbody id="pred-traffic-table"><tr><td colspan="5" style="color:#64748B;text-align:center">Loading model…</td></tr></tbody>
      </table>
    </div>
  </div>
</div>

<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">🏗️ Infrastructure Priority Rankings</div><span class="badge badge-green">infra_priority_ranker</span></div>
  <div class="table-wrap">
    <table class="data-table">
      <tr><th>Project</th><th>Category</th><th>Cost</th><th>Priority Score</th><th>Status</th></tr>
      <tbody id="pred-infra-table"><tr><td colspan="5" style="color:#64748B;text-align:center">Loading model…</td></tr></tbody>
    </table>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* REPORTS                                          */
/* ──────────────────────────────────────────────── */
PAGES.reports = () => `
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">📄 Available Reports</div></div>
    <div class="table-wrap">
      <table class="data-table">
        <tr><th>Report</th><th>Period</th><th>Status</th><th>Export</th></tr>
        ${[
          ["Semester Performance Summary","Sem 2 2026","ready","PDF"],
          ["Enrollment & Retention","Q1 2026","ready","Excel"],
          ["Staff Productivity Analysis","Sem 2 2026","ready","PDF"],
          ["AI Prediction Report","April 2026","ready","PDF"],
          ["Energy Consumption","Q1 2026","generating","—"],
          ["Security Incident Report","March 2026","ready","PDF"],
          ["Research Output Summary","Sem 2 2026","ready","PDF"],
          ["Financial Overview","YTD 2026","ready","Excel"],
        ].map(([name,period,status,fmt])=>`<tr>
          <td>${name}</td><td>${period}</td>
          <td><span class="badge ${status==='ready'?'badge-green':'badge-amber'}">${status}</span></td>
          <td style="color:${status==='ready'?'#00C2FF':'#64748B'};cursor:pointer;font-size:11px">${status==='ready'?'📥 '+fmt:'—'}</td>
        </tr>`).join('')}
      </table>
    </div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">⚙️ Generate Custom Report</div></div>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${[
        ["Module","select",["Students","Staff","Facilities","Finance","Security","Research","Visitors"]],
        ["Department","select",["All Departments","Engineering","Medicine","ICT","Business","Agriculture","Education"]],
        ["Time Period","select",["This Semester","This Month","This Year","Custom Range"]],
        ["Format","select",["PDF","Excel (XLSX)","CSV","JSON"]],
      ].map(([label,type,opts])=>`
      <div>
        <div style="font-size:10px;color:#64748B;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;margin-bottom:4px">${label}</div>
        <select class="ctrl-select" style="width:100%">${opts.map(o=>`<option>${o}</option>`).join('')}</select>
      </div>`).join('')}
      <button class="ctrl-btn primary" onclick="alert('Report queued — ready in 2–3 minutes. Check email: admin@ines.ac.rw')">Generate Report →</button>
    </div>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* ADMIN                                            */
/* ──────────────────────────────────────────────── */
PAGES.admin = () => `
<div class="chart-grid">
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">👥 Role-Based Access Control</div></div>
    <div class="table-wrap">
      <table class="data-table">
        <tr><th>Role</th><th>Users</th><th>Access Level</th><th>Status</th></tr>
        ${Object.entries(window.INES.ROLES).map(([k,r])=>`<tr>
          <td><strong style="color:#F0F6FF">${r.label}</strong></td>
          <td>${k==='management'?5:k==='dvcar'?3:k==='dvcaf'?3:k==='director'?22:k==='lecturer'?174:k==='student'?4287:k==='admin'?4:k==='security'?18:k==='hrm'?6:8}</td>
          <td style="font-size:11px;color:#94A3B8">${r.modules==='*'?'Full access':Array.isArray(r.modules)?r.modules.join(', '):'Restricted'}</td>
          <td><span class="badge badge-green">Active</span></td>
        </tr>`).join('')}
      </table>
    </div>
  </div>
  <div class="chart-card">
    <div class="chart-title"><div class="chart-title-left">🔧 System Configuration</div></div>
    ${[
      ["AI Prediction Engine", "Active", "#10B981"],
      ["Real-time Data Sync", "Active", "#10B981"],
      ["Automated Reports", "Active", "#10B981"],
      ["Email Alerts (SMTP)", "Config needed", "#F59E0B"],
      ["RFID Entry Integration", "Beta", "#00C2FF"],
      ["INES Website Embed", "Ready", "#10B981"],
      ["GitHub CI/CD Pipeline", "Active", "#10B981"],
      ["Backup & Recovery", "Active", "#10B981"],
    ].map(([label,status,color])=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:#1E3A57;border-radius:6px;margin-bottom:6px;font-size:12px">
      <span style="color:#94A3B8">${label}</span>
      <span style="color:${color};font-weight:700">● ${status}</span>
    </div>`).join('')}
    <button class="ctrl-btn" style="width:100%;margin-top:6px" onclick="alert('Opening system settings...')">System Settings →</button>
  </div>
</div>

<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">📁 GitHub Deployment</div></div>
  <div class="ai-card" style="margin-bottom:0">
    <div class="ai-header"><div class="ai-pulse"></div><div class="ai-label">DEPLOYMENT GUIDE</div></div>
    <div class="ai-text">
      <strong style="color:#F0F6FF">1. Upload to GitHub:</strong> Push this folder to a public repo (e.g. <code style="color:#00C2FF">github.com/ines-ruhengeri/campus-intelligence</code>)<br>
      <strong style="color:#F0F6FF">2. Enable GitHub Pages:</strong> Settings → Pages → Deploy from main branch → /root<br>
      <strong style="color:#F0F6FF">3. Train & upload models:</strong> Place trained model files in <code style="color:#00C2FF">models/</code> directory<br>
      <strong style="color:#F0F6FF">4. Embed in INES website:</strong> Add <code style="color:#00C2FF">&lt;iframe src="https://ines-ruhengeri.github.io/campus-intelligence"&gt;</code> to ines.ac.rw<br>
      <strong style="color:#F0F6FF">5. Custom domain:</strong> Add CNAME file with <code style="color:#00C2FF">analytics.ines.ac.rw</code>
    </div>
  </div>
</div>
`;

/* ──────────────────────────────────────────────── */
/* ORG CHART                                        */
/* ──────────────────────────────────────────────── */
PAGES.orgchart = () => `
<div class="ai-card">
  <div class="ai-header"><div class="ai-pulse"></div><div class="ai-label">INES-RUHENGERI ORGANIZATIONAL STRUCTURE</div></div>
  <div class="ai-text">Interactive org chart reflecting the official INES-Ruhengeri structure. Click any node to see the unit's analytics. All departments are mapped to their corresponding analytics modules.</div>
</div>
<div class="chart-card">
  <div class="chart-title"><div class="chart-title-left">🗂️ Official Org Chart</div><span class="badge badge-blue">Interactive</span></div>
  <div class="org-svg-wrap">
    ${buildOrgSVG()}
  </div>
</div>
`;

function buildOrgSVG() {
  // Render the org chart as a structured SVG matching the uploaded image
  const W = 1200, H = 700;
  const BOX_W = 90, BOX_H = 30, R = 4;
  const STROKE = "#00C2FF44", FILL = "#162D45", TEXT = "#94A3B8", ACTIVE = "#00C2FF";

  function box(x,y,label,accent) {
    return `<g class="org-node" onclick="orgClick('${label}')">
      <rect x="${x}" y="${y}" width="${BOX_W}" height="${BOX_H}" rx="${R}" fill="${FILL}" stroke="${accent||STROKE}" stroke-width="1"/>
      <text x="${x+BOX_W/2}" y="${y+BOX_H/2+1}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="${accent?ACTIVE:TEXT}" font-family="Segoe UI,system-ui,sans-serif" font-weight="${accent?700:400}">${label}</text>
    </g>`;
  }
  function line(x1,y1,x2,y2) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${STROKE}" stroke-width="1"/>`;
  }

  let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <style>.org-node{cursor:pointer}.org-node:hover rect{stroke:#00C2FF;fill:#1E3A57}.org-node:hover text{fill:#00C2FF}</style>
  <rect width="${W}" height="${H}" fill="#0B1929"/>`;

  // Row 0: Chancellor
  svg += box(555, 10, 'Chanc', ACTIVE);
  svg += line(600, 40, 600, 55);
  // Row 1: BoD
  svg += box(555, 55, 'BoD');
  svg += line(600, 85, 600, 100);
  // Row 2: Executive Organ
  svg += box(545, 100, 'Exec. Organ');
  svg += line(600, 130, 600, 145);
  // Row 3: VC
  svg += box(555, 145, 'VC', ACTIVE);

  // VC branches
  // IRD left
  svg += line(555, 160, 230, 160); svg += line(230, 160, 230, 190);
  svg += box(185, 190, 'IRD');
  svg += line(230, 220, 230, 235); svg += box(185, 235, 'DP');
  svg += line(230, 265, 230, 280); svg += box(185, 280, 'Stat O');
  svg += line(230, 310, 230, 325); svg += box(185, 325, 'CSec');

  // Ac Senate
  svg += line(555, 160, 410, 160); svg += line(410, 160, 410, 190);
  svg += box(365, 190, 'Ac Senate');

  // DVCAR
  svg += line(600, 175, 600, 190);
  svg += line(490, 190, 710, 190);
  svg += line(490, 190, 490, 205); svg += box(445, 205, 'DVCAR', '#7C3AED');
  // DVCAF
  svg += line(710, 190, 710, 205); svg += box(665, 205, 'DVCAF', '#10B981');

  // SMT right
  svg += line(645, 160, 850, 160); svg += line(850, 160, 850, 190);
  svg += box(805, 190, 'SMT');
  // D CAB
  svg += line(940, 160, 940, 190); svg += box(895, 190, 'D CAB');
  svg += line(645, 160, 940, 160);
  svg += line(940, 220, 940, 235); svg += box(895, 235, 'PRO');
  svg += line(940, 265, 940, 280); svg += box(895, 280, 'Chap');
  svg += line(940, 310, 940, 325); svg += box(895, 325, 'IA');

  // DVCAR children (row 4)
  const dvcarKids = [['DC',60],['DL',165],['DQAR',270],['DAR',375],['DRDI',480]];
  dvcarKids.forEach(([label,x])=>{
    svg += line(490, 235, x+45, 235); svg += line(x+45, 235, x+45, 360);
    svg += box(x, 360, label);
  });

  // FAC, DICT, DLABE under DVCAR
  svg += box(590, 360, 'FAC');
  svg += box(695, 360, 'DICT');
  svg += box(800, 360, 'DLABE');
  [635,740,845].forEach(x=>{ svg += line(490,280,x,280); svg += line(x,280,x,360); });

  // Sub-children row 5
  svg += line(315, 390, 315, 415); svg += box(270, 415, 'Exam O'); // DQAR
  svg += line(420, 390, 420, 415); svg += box(375, 415, 'REG');    // DAR
  svg += line(635, 390, 635, 415); svg += box(580, 415, 'DPTs');
  svg += line(635, 415, 635, 450); svg += box(600, 450, 'CPGP');
  svg += line(845, 390, 845, 415); svg += box(800, 415, 'C Lab');
  svg += line(845, 445, 845, 460); svg += box(800, 460, 'Lab Tec');
  svg += line(900, 390, 900, 415); svg += box(870, 415, 'S&C');

  // DVCAF children
  const dvcafKids = [['DSCACS',60],['HRM',165],['DF',270]];
  dvcafKids.forEach(([label,xOff])=>{
    const cx = 1060 + xOff - 200;
    svg += line(710, 235, cx+45, 235); svg += line(cx+45, 235, cx+45, 360);
    svg += box(cx, 360, label);
  });
  // DF sub
  svg += line(1175, 390, 1175, 415); svg += box(1130, 415, 'Acc O');
  svg += line(1175, 445, 1100, 445); svg += line(1100, 445, 1100, 460); svg += box(1060, 460, 'UP');
  svg += line(1175, 445, 1175, 460); svg += box(1135, 460, 'Cashiere');
  svg += line(1175, 445, 1250, 445); svg += line(1250, 445, 1250, 460); svg += box(1210, 460, 'Hostel');
  // DSCACS sub
  const dscKids = ['ISO','SU','CS','LPM'];
  dscKids.forEach((label,i)=>{
    const cx = 870 + i*30;
    svg += line(960, 390, cx+45, 390); svg += line(cx+45, 390, cx+45, 415);
    svg += box(cx, 415, label, i===3?'#F59E0B':null);
  });
  svg += line(1020, 445, 1020, 460); svg += box(975, 460, 'MAINT');

  svg += `</svg>`;
  return svg;
}

window.INES_PAGES = PAGES;
window.showMapTooltip = function(name, occ) {
  const tt = document.getElementById('map-tooltip');
  if (!tt) return;
  tt.style.display = 'block';
  tt.textContent = `${name}: ${occ} occupancy`;
  setTimeout(() => { tt.style.display = 'none'; }, 2500);
};
window.orgClick = function(label) {
  const orgMap = {
    'VC':'dashboard', 'DVCAR':'academics', 'DVCAF':'finance',
    'DQAR':'academics', 'DAR':'academics', 'HRM':'hrm',
    'DF':'finance', 'DICT':'facilities', 'DLABE':'facilities',
    'DRDI':'research', 'ISO':'security', 'DSCACS':'students',
  };
  const page = orgMap[label];
  if (page) {
    const navEl = document.querySelector(`[data-page="${page}"]`);
    if (navEl) navigateTo(page, navEl);
  }
};
