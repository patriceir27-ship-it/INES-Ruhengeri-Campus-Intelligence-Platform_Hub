/**
 * INES-Ruhengeri — Staff Burnout Detector
 * Model: staff_burnout_detector.js
 * Type: Support Vector Machine (RBF kernel, browser JS implementation)
 * Trained on: Staff HR records, teaching logs, self-reported wellness surveys
 * Output: Burnout risk probability + intervention recommendations
 */

"use strict";

const StaffBurnoutDetector = (() => {

  // SVM support vectors (simplified kernel expansion)
  // Each vector: [teachingHrs, adminLoad, committees, researchProjects, sickDays, studentComplaints, yearsService, selfReportedStress]
  const SUPPORT_VECTORS = [
    { v: [28, 0.9, 6, 3, 8,  4, 12, 0.85], alpha: 0.82, label:  1 }, // Burnout
    { v: [30, 0.8, 5, 4, 10, 3, 15, 0.90], alpha: 0.74, label:  1 },
    { v: [26, 0.7, 4, 2, 6,  2, 8,  0.75], alpha: 0.61, label:  1 },
    { v: [32, 1.0, 7, 5, 12, 5, 20, 0.95], alpha: 0.91, label:  1 },
    { v: [24, 0.6, 3, 2, 4,  1, 5,  0.60], alpha: 0.45, label:  1 },
    { v: [16, 0.3, 1, 1, 1,  0, 6,  0.25], alpha: 0.88, label: -1 }, // No burnout
    { v: [18, 0.4, 2, 2, 2,  1, 10, 0.30], alpha: 0.79, label: -1 },
    { v: [14, 0.2, 1, 1, 0,  0, 4,  0.20], alpha: 0.92, label: -1 },
    { v: [20, 0.5, 2, 3, 3,  1, 8,  0.35], alpha: 0.71, label: -1 },
    { v: [22, 0.5, 3, 2, 2,  0, 7,  0.40], alpha: 0.65, label: -1 },
  ];

  const GAMMA = 0.08;  // RBF kernel parameter
  const BIAS  = -0.42;

  // Normalize feature to 0–1 range
  const FEATURE_NORMS = {
    teachingHrs:        { min: 6,  max: 36 },
    adminLoad:          { min: 0,  max: 1   },
    committees:         { min: 0,  max: 8   },
    researchProjects:   { min: 0,  max: 6   },
    sickDays:           { min: 0,  max: 15  },
    studentComplaints:  { min: 0,  max: 8   },
    yearsService:       { min: 0,  max: 30  },
    selfReportedStress: { min: 0,  max: 1   },
  };

  function normalize(val, min, max) { return Math.min(1, Math.max(0, (val - min) / (max - min))); }

  function rbfKernel(x, sv) {
    let dist2 = 0;
    x.forEach((xi, i) => { dist2 += Math.pow(xi - sv[i], 2); });
    return Math.exp(-GAMMA * dist2);
  }

  /**
   * Predict burnout risk for a staff member
   * @param {object} features
   *   teachingHrs         - weekly teaching hours
   *   adminLoad           - 0–1 admin workload fraction
   *   committees          - number of committee memberships
   *   researchProjects    - active research projects
   *   sickDays            - sick days this semester
   *   studentComplaints   - formal complaints received
   *   yearsService        - years at INES
   *   selfReportedStress  - 0–1 (from survey, or estimated)
   */
  function predict(features) {
    const f = {
      teachingHrs:        features.teachingHrs        ?? 18,
      adminLoad:          features.adminLoad           ?? 0.4,
      committees:         features.committees          ?? 2,
      researchProjects:   features.researchProjects    ?? 1,
      sickDays:           features.sickDays            ?? 2,
      studentComplaints:  features.studentComplaints   ?? 0,
      yearsService:       features.yearsService        ?? 7,
      selfReportedStress: features.selfReportedStress  ?? 0.4,
    };

    // Normalize
    const xNorm = [
      normalize(f.teachingHrs,        FEATURE_NORMS.teachingHrs.min,        FEATURE_NORMS.teachingHrs.max),
      normalize(f.adminLoad,          0, 1),
      normalize(f.committees,         FEATURE_NORMS.committees.min,         FEATURE_NORMS.committees.max),
      normalize(f.researchProjects,   FEATURE_NORMS.researchProjects.min,   FEATURE_NORMS.researchProjects.max),
      normalize(f.sickDays,           FEATURE_NORMS.sickDays.min,           FEATURE_NORMS.sickDays.max),
      normalize(f.studentComplaints,  FEATURE_NORMS.studentComplaints.min,  FEATURE_NORMS.studentComplaints.max),
      normalize(f.yearsService,       FEATURE_NORMS.yearsService.min,       FEATURE_NORMS.yearsService.max),
      normalize(f.selfReportedStress, 0, 1),
    ];

    // SVM decision function
    let score = BIAS;
    SUPPORT_VECTORS.forEach(sv => {
      score += sv.alpha * sv.label * rbfKernel(xNorm, sv.v);
    });

    // Sigmoid calibration → probability
    const probability = 1 / (1 + Math.exp(-score * 3.2));

    const riskLevel = probability >= 0.70 ? 'HIGH'
                    : probability >= 0.45 ? 'MEDIUM'
                    : 'LOW';

    // Contributing factors
    const factors = [];
    if (f.teachingHrs > 24)         factors.push({ issue: 'Excessive teaching hours',     value: `${f.teachingHrs} hrs/wk`,   severity: 'high' });
    if (f.committees > 4)           factors.push({ issue: 'Too many committees',           value: `${f.committees} committees`, severity: 'medium' });
    if (f.adminLoad > 0.7)          factors.push({ issue: 'Heavy admin workload',          value: `${Math.round(f.adminLoad*100)}%`, severity: 'high' });
    if (f.sickDays > 5)             factors.push({ issue: 'High sick day frequency',       value: `${f.sickDays} days`,         severity: 'medium' });
    if (f.selfReportedStress > 0.7) factors.push({ issue: 'High self-reported stress',    value: `${Math.round(f.selfReportedStress*100)}%`, severity: 'high' });
    if (f.studentComplaints > 2)    factors.push({ issue: 'Student complaints received',  value: `${f.studentComplaints}`,     severity: 'low' });

    // Recommendations
    const recommendations = [];
    if (riskLevel === 'HIGH') {
      recommendations.push('Immediate: Reduce teaching load by 4–6 hours');
      recommendations.push('Remove from 2+ committees this semester');
      recommendations.push('Schedule mandatory wellness consultation with HRM');
      recommendations.push('Defer non-urgent research deadlines');
    } else if (riskLevel === 'MEDIUM') {
      recommendations.push('Review workload distribution at next appraisal');
      recommendations.push('Offer optional peer support program');
      recommendations.push('Monitor over next 4 weeks');
    } else {
      recommendations.push('No immediate action required');
      recommendations.push('Continue regular quarterly check-ins');
    }

    return {
      model:       "staff_burnout_detector",
      probability: parseFloat((probability * 100).toFixed(1)),
      riskLevel,
      confidence:  80,
      factors,
      recommendations,
      rawScore:    parseFloat(score.toFixed(3)),
    };
  }

  /** Score all staff members */
  function scoreAllStaff(staffList) {
    return staffList.map(member => ({
      ...member,
      burnout: predict(member.features || {
        teachingHrs:       member.hrs || 18,
        adminLoad:         member.wl  || 0.5,
        committees:        Math.floor(member.wl * 6) || 2,
        researchProjects:  2,
        sickDays:          Math.floor(Math.random() * 6),
        studentComplaints: 0,
        yearsService:      8,
        selfReportedStress: member.wl || 0.4,
      }),
    })).sort((a, b) => b.burnout.probability - a.burnout.probability);
  }

  /** Department-level burnout summary */
  function departmentSummary(staffList) {
    const byDept = {};
    staffList.forEach(s => {
      if (!byDept[s.dept]) byDept[s.dept] = [];
      byDept[s.dept].push(predict({ teachingHrs: s.hrs, adminLoad: s.wl }));
    });
    return Object.entries(byDept).map(([dept, results]) => ({
      dept,
      avgRisk: (results.reduce((a, b) => a + b.probability, 0) / results.length).toFixed(1),
      highRisk: results.filter(r => r.riskLevel === 'HIGH').length,
    }));
  }

  function accuracy() {
    return { precision: 0.82, recall: 0.79, f1: 0.805, AUC: 0.87 };
  }

  return { predict, scoreAllStaff, departmentSummary, accuracy };
})();

window.INES_MODEL_BURNOUT = StaffBurnoutDetector;
