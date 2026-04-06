/* ===================================================
   INES-RUHENGERI CAMPUS INTELLIGENCE PLATFORM
   js/app.js — App logic: auth, routing, chart init,
               live refresh, sidebar toggle
   =================================================== */

"use strict";

/* ─── PAGE META ─── */
const PAGE_META = {
  dashboard:   { title: "Campus Intelligence Dashboard", sub: "Real-time overview — INES-Ruhengeri" },
  students:    { title: "Student Analytics Module",      sub: "Performance trajectories & predictions" },
  staff:       { title: "Staff Productivity Panel",      sub: "Workload, punctuality & burnout intelligence" },
  visitors:    { title: "Visitor & Access Intelligence", sub: "Smart entry tracking & anomaly detection" },
  academics:   { title: "Academic Performance Hub",      sub: "Courses, exams & enrollment forecasting" },
  research:    { title: "Research Intelligence (DRDI)",  sub: "Output tracking & grant management" },
  facilities:  { title: "Facilities & Operations (DLABE)","sub": "Classroom occupancy & maintenance AI" },
  finance:     { title: "Finance Overview (DF)",         sub: "Budget allocation & financial KPIs" },
  hrm:         { title: "Human Resource Management",     sub: "Staff roster, leaves & AI staffing advice" },
  security:    { title: "Security & Safety (ISO)",       sub: "Incident log & camera surveillance" },
  predictions: { title: "AI Prediction Engine",          sub: "8 active models — trained on INES data" },
  reports:     { title: "Report Center",                 sub: "Generate, schedule & export reports" },
  admin:       { title: "Admin Controls",                sub: "Role-based access, system config & deployment" },
  orgchart:    { title: "Organizational Chart",          sub: "Official INES-Ruhengeri structure — interactive" },
};

/* ─── CHART INIT MAP ─── */
const CHART_INITS = {
  dashboard: () => {
    const C = window.INES_CHARTS;
    const D = window.INES;
    C.renderAttendanceChart('chart-attendance', D.ATTENDANCE_WEEK);
    C.renderDeptRadar('chart-dept-radar', D.DEPT_PERF);
    // Energy chart rendered by API loader with real DB data
  },
  students: () => {
    const C = window.INES_CHARTS;
    const D = window.INES;
    C.renderGradeDoughnut('chart-grade-dist', D.GRADE_DIST);
    C.renderAttPerfScatter('chart-att-perf');
  },
  staff: () => {
    window.INES_CHARTS.renderWorkloadChart('chart-workload', window.INES.HRM.workloadDist);
  },
  visitors: () => {
    window.INES_CHARTS.renderVisitorChart('chart-visitors', window.INES.VISITOR_HOURLY);
  },
  academics: () => {
    const C = window.INES_CHARTS;
    const D = window.INES;
    C.renderEnrollmentTrend('chart-enrollment');
    C.renderDeptRadar('chart-dept-radar-acad', D.DEPT_PERF);
  },
  research: () => {
    window.INES_CHARTS.renderResearchBar('chart-research', window.INES.RESEARCH.byDept);
  },
  finance: () => {
    window.INES_CHARTS.renderBudgetPie('chart-budget', window.INES.FINANCE.budgetAlloc);
  },
  predictions: () => {
    window.INES_CHARTS.renderEnrollmentTrend('chart-enroll-pred');
  },
};

/* ─── AUTH ─── */
let currentUser = null;

window.doLogin = function() {
  const email = document.getElementById('login-email').value.trim();
  const role  = document.getElementById('login-role').value;
  if (!email) { alert('Please enter your email address.'); return; }

  const roleConfig = window.INES.ROLES[role];
  currentUser = { email, role, ...roleConfig };

  // Update UI
  document.getElementById('user-avatar').textContent = roleConfig.avatar;
  document.getElementById('user-avatar').style.background = `linear-gradient(135deg,${roleConfig.color},#0B1929)`;
  document.getElementById('user-name-display').textContent = email.split('@')[0];
  document.getElementById('user-role-display').textContent = roleConfig.label;

  document.getElementById('login-overlay').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  // Apply role-based nav visibility
  applyRoleAccess(roleConfig.modules);
  navigateTo('dashboard', document.querySelector('[data-page="dashboard"]'));
  startLiveRefresh();
};

window.doLogout = function() {
  currentUser = null;
  stopLiveRefresh();
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-overlay').style.display = 'flex';
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
};

function applyRoleAccess(modules) {
  if (modules === '*') return;
  document.querySelectorAll('.nav-item').forEach(item => {
    const page = item.dataset.page;
    if (!modules.includes(page)) {
      item.style.opacity = '0.35';
      item.style.pointerEvents = 'none';
      item.title = 'Access restricted for your role';
    } else {
      item.style.opacity = '';
      item.style.pointerEvents = '';
      item.title = '';
    }
  });
}

/* ─── NAVIGATION ─── */
window.navigateTo = function(pageId, navEl) {
  // Role check
  if (currentUser && currentUser.modules !== '*') {
    if (!currentUser.modules.includes(pageId)) {
      alert(`Access restricted: your role (${currentUser.label}) does not have access to this module.`);
      return;
    }
  }

  // Update nav highlight
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');

  // Update topbar
  const meta = PAGE_META[pageId] || { title: pageId, sub: '' };
  document.getElementById('page-title').textContent = meta.title;
  document.getElementById('page-sub').textContent   = meta.sub;

  // Destroy all Chart.js instances before rendering new page (Chart.js v4 compatible)
  if (window.Chart) {
    // Chart.js v4 stores instances in Chart.instances as an object keyed by id
    const instances = window.Chart.instances;
    if (instances) {
      Object.keys(instances).forEach(key => {
        try { instances[key].destroy(); } catch(e) {}
      });
    }
    // Also destroy any canvas elements directly as a fallback
    document.querySelectorAll('canvas').forEach(canvas => {
      const chart = window.Chart.getChart(canvas);
      if (chart) { try { chart.destroy(); } catch(e) {} }
    });
  }

  // Render page content
  const generator = window.INES_PAGES[pageId];
  if (!generator) {
    document.getElementById('page-content').innerHTML = `<div style="padding:40px;text-align:center;color:#64748B">Page "${pageId}" not found.</div>`;
    return;
  }
  document.getElementById('page-content').innerHTML = generator();

  // Initialize charts + load live API data
  setTimeout(async () => {
    const initFn = CHART_INITS[pageId];
    if (initFn) initFn();

    const loader = window.INES_DATA_LOADERS && window.INES_DATA_LOADERS[pageId];
    if (loader) {
      try {
        await loader();
      } catch(e) {
        console.error('[INES API] Failed to load data for', pageId, e);
        const pc = document.getElementById('page-content');
        if (pc) {
          const errDiv = document.createElement('div');
          errDiv.style = 'background:#EF444422;border:1px solid #EF4444;padding:12px;border-radius:8px;margin:12px;color:#EF4444;font-size:12px';
          errDiv.textContent = '⚠️ Live data failed to load: ' + e.message + '. Check DATABASE_URL env variable on Render.';
          pc.prepend(errDiv);
        }
      }
    }
  }, 50);

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('mobile-open');
};

/* ─── SIDEBAR TOGGLE ─── */
window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 900) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebar.classList.toggle('collapsed');
  }
};

/* ─── ALERTS PANEL ─── */
window.toggleAlerts = function() {
  document.getElementById('alerts-panel').classList.toggle('hidden');
};
document.addEventListener('click', e => {
  const panel = document.getElementById('alerts-panel');
  if (!panel) return;
  if (!panel.contains(e.target) && !e.target.closest('.alert-bell')) {
    panel.classList.add('hidden');
  }
});

/* ─── TIME FILTER ─── */
window.setTimeFilter = function(btn, filter) {
  document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Re-render current page with new filter (stub - extend with real filter logic)
  const active = document.querySelector('.nav-item.active');
  if (active) navigateTo(active.dataset.page, active);
};

/* ─── LIVE REFRESH ─── */
let refreshInterval = null;

function startLiveRefresh() {
  refreshInterval = setInterval(() => {
    // Simulate live attendance fluctuation
    const el = document.getElementById('live-att');
    if (el) {
      const base = 87.4;
      const jitter = (Math.random() - 0.5) * 0.6;
      el.textContent = (base + jitter).toFixed(1) + '%';
    }
    // Simulate visitor badge
    const vb = document.getElementById('visitor-alert-badge');
    if (vb) {
      const n = parseInt(vb.textContent) + (Math.random() > 0.8 ? 1 : 0);
      vb.textContent = n;
    }
  }, 5000);
}

function stopLiveRefresh() {
  if (refreshInterval) { clearInterval(refreshInterval); refreshInterval = null; }
}

/* ─── KEYBOARD SHORTCUTS ─── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('alerts-panel')?.classList.add('hidden');
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    toggleSidebar();
  }
});

/* ─── STARTUP SAFETY GUARD ─────────────────────────────────────────────────
   Verifies that window.INES and window.INES_PAGES loaded correctly before
   the user can interact. Shows a visible error banner instead of a blank
   white/dark screen if something went wrong with script loading on Render.
─────────────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  if (!window.INES) {
    document.body.insertAdjacentHTML('afterbegin',
      '<div style="position:fixed;top:0;left:0;right:0;z-index:9999;background:#EF4444;color:#fff;' +
      'padding:14px 20px;font-family:system-ui;font-size:14px;font-weight:600;text-align:center">' +
      '⚠️ INES data failed to load (data.js). Check browser console for errors. ' +
      'Try a hard-refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).' +
      '</div>'
    );
    console.error('[INES] window.INES is undefined — data.js did not execute correctly.');
    return;
  }
  if (!window.INES_PAGES) {
    document.body.insertAdjacentHTML('afterbegin',
      '<div style="position:fixed;top:0;left:0;right:0;z-index:9999;background:#F59E0B;color:#fff;' +
      'padding:14px 20px;font-family:system-ui;font-size:14px;font-weight:600;text-align:center">' +
      '⚠️ Page templates failed to load (pages.js). Check browser console for errors.' +
      '</div>'
    );
    console.error('[INES] window.INES_PAGES is undefined — pages.js did not execute correctly.');
    return;
  }
  console.log('[INES] ✅ All modules loaded successfully. window.INES and window.INES_PAGES are ready.');
});
