/* ===================================================
   INES-RUHENGERI CAMPUS INTELLIGENCE PLATFORM
   js/charts.js — Chart rendering utilities
   Uses Chart.js 4.x (loaded from CDN in index.html)
   =================================================== */

"use strict";

const CHARTS = {};

/* ─── COLOR PALETTE ─── */
const C = {
  accent: "#00C2FF", green: "#10B981", red: "#EF4444",
  amber: "#F59E0B",  purple: "#7C3AED", blue: "#3B82F6",
  text2: "#94A3B8",  text3: "#64748B",  border: "rgba(0,194,255,0.15)",
  gridLine: "rgba(255,255,255,0.05)",
};

/* ─── DEFAULTS ─── */
Chart.defaults.color = C.text2;
Chart.defaults.borderColor = C.gridLine;
Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
Chart.defaults.font.size = 11;

function destroyChart(id) {
  if (CHARTS[id]) { CHARTS[id].destroy(); delete CHARTS[id]; }
}

/* ─── ATTENDANCE LINE CHART ─── */
function renderAttendanceChart(canvasId, data) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  CHARTS[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Attendance %',
        data: data.data,
        borderColor: C.accent,
        backgroundColor: 'rgba(0,194,255,0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: C.accent,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 60, max: 100,
          grid: { color: C.gridLine },
          ticks: { callback: v => v + '%' },
        },
        x: { grid: { display: false } },
      },
    }
  });
}

/* ─── VISITOR HOURLY BAR ─── */
function renderVisitorChart(canvasId, data) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  CHARTS[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Visitors',
        data: data.data,
        backgroundColor: data.data.map(v => v === Math.max(...data.data) ? C.amber : 'rgba(0,194,255,0.45)'),
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: C.gridLine }, beginAtZero: true },
        x: { grid: { display: false } },
      },
    }
  });
}

/* ─── GRADE DISTRIBUTION DOUGHNUT ─── */
function renderGradeDoughnut(canvasId, data) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  CHARTS[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{ data: data.data, backgroundColor: data.colors, borderWidth: 2, borderColor: '#162D45' }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } },
      },
    }
  });
}

/* ─── DEPARTMENT RADAR ─── */
function renderDeptRadar(canvasId, depts) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  CHARTS[canvasId] = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: depts.map(d => d.dept),
      datasets: [{
        label: 'Performance Score',
        data: depts.map(d => d.score),
        backgroundColor: 'rgba(0,194,255,0.12)',
        borderColor: C.accent,
        pointBackgroundColor: C.accent,
        pointRadius: 4,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 50, max: 100,
          grid: { color: C.gridLine },
          ticks: { display: false },
          pointLabels: { color: C.text2, font: { size: 11 } },
          angleLines: { color: C.gridLine },
        }
      }
    }
  });
}

/* ─── BUDGET PIE ─── */
function renderBudgetPie(canvasId, items) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  CHARTS[canvasId] = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: items.map(i => i.label),
      datasets: [{
        data: items.map(i => i.pct),
        backgroundColor: items.map(i => i.color),
        borderWidth: 2, borderColor: '#162D45'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
    }
  });
}

/* ─── RESEARCH OUTPUT BAR ─── */
function renderResearchBar(canvasId, data) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  CHARTS[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.dept),
      datasets: [{
        label: 'Papers',
        data: data.map(d => d.papers),
        backgroundColor: data.map(d => d.color),
        borderRadius: 4, borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: C.gridLine }, beginAtZero: true },
        y: { grid: { display: false } },
      },
    }
  });
}

/* ─── ATTENDANCE vs PERFORMANCE SCATTER ─── */
function renderAttPerfScatter(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  // Generate simulated scatter data
  const pts = [];
  for (let i = 0; i < 80; i++) {
    const att = 35 + Math.random() * 65;
    const gpa = Math.min(4, Math.max(0.5, att / 25 + (Math.random() - 0.5) * 0.8));
    pts.push({ x: Math.round(att), y: parseFloat(gpa.toFixed(2)) });
  }
  CHARTS[canvasId] = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Students',
        data: pts,
        backgroundColor: 'rgba(0,194,255,0.45)',
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: 'Attendance (%)', color: C.text3 }, min: 30, max: 100, grid: { color: C.gridLine } },
        y: { title: { display: true, text: 'GPA', color: C.text3 }, min: 0, max: 4, grid: { color: C.gridLine } },
      },
    }
  });
}

/* ─── ENROLLMENT TREND (multi-year) ─── */
function renderEnrollmentTrend(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  CHARTS[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["2022","2023","2024","2025","2026*","2027*"],
      datasets: [
        {
          label: 'Actual',
          data: [3100, 3420, 3780, 3980, 4287, null],
          borderColor: C.accent, backgroundColor: 'rgba(0,194,255,0.08)',
          fill: true, tension: 0.4, pointRadius: 5, borderWidth: 2,
        },
        {
          label: 'AI Forecast',
          data: [null, null, null, null, 4287, 4820],
          borderColor: C.purple, borderDash: [6,4],
          backgroundColor: 'rgba(124,58,237,0.05)',
          fill: true, tension: 0.4, pointRadius: 5, borderWidth: 2,
          pointBackgroundColor: C.purple,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: C.text2, usePointStyle: true, pointStyleWidth: 10, boxHeight: 6 },
        }
      },
      scales: {
        y: { grid: { color: C.gridLine }, beginAtZero: false },
        x: { grid: { display: false } },
      },
    }
  });
}

/* ─── WORKLOAD DISTRIBUTION POLAR ─── */
function renderWorkloadChart(canvasId, data) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  CHARTS[canvasId] = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.pct),
        backgroundColor: data.map(d => d.color + 'CC'),
        borderColor: data.map(d => d.color),
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { r: { grid: { color: C.gridLine }, ticks: { display: false } } },
    }
  });
}

/* ─── ENERGY CONSUMPTION LINE ─── */
function renderEnergyChart(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const actual = [2100,2250,2380,2841,null,null,null,null,null,null,null,null];
  const forecast= [null,null,null,2841,2950,3050,2800,2700,2850,3000,3100,3200];
  CHARTS[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label:'Actual (kWh)', data:actual, borderColor:C.amber, backgroundColor:'rgba(245,158,11,0.08)', fill:true, tension:0.4, pointRadius:4, borderWidth:2 },
        { label:'AI Forecast', data:forecast, borderColor:C.purple, borderDash:[6,4], fill:false, tension:0.4, pointRadius:4, borderWidth:2, pointBackgroundColor:C.purple },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { color:C.text2, usePointStyle:true, boxHeight:6 } } },
      scales: {
        y: { grid:{ color:C.gridLine }, ticks:{ callback: v => v.toLocaleString() } },
        x: { grid:{ display:false } },
      },
    }
  });
}

window.INES_CHARTS = {
  renderAttendanceChart, renderVisitorChart, renderGradeDoughnut,
  renderDeptRadar, renderBudgetPie, renderResearchBar,
  renderAttPerfScatter, renderEnrollmentTrend, renderWorkloadChart,
  renderEnergyChart, destroyChart,
};
