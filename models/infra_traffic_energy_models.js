/**
 * INES-Ruhengeri — Infrastructure Priority Ranker
 * Model: infra_priority_ranker.js
 * Type: Weighted Decision Tree + AHP (Analytic Hierarchy Process)
 */

"use strict";

const InfraPriorityRanker = (() => {

  const INFRASTRUCTURE_ITEMS = [
    { id:"LAB-W",  name:"New Lab Wing",         category:"Academic",    costM:180, urgency:0.88, impact:0.92, feasibility:0.75, condition:0.30, usersAffected:1200 },
    { id:"LIB-EX", name:"Library Expansion",    category:"Academic",    costM:85,  urgency:0.82, impact:0.88, feasibility:0.82, condition:0.45, usersAffected:3800 },
    { id:"HOST-B", name:"New Hostel Block",      category:"Residential", costM:220, urgency:0.74, impact:0.80, feasibility:0.68, condition:0.50, usersAffected:800  },
    { id:"SOLAR",  name:"Solar Power System",    category:"Energy",      costM:65,  urgency:0.70, impact:0.85, feasibility:0.90, condition:0.60, usersAffected:4287 },
    { id:"NET-UP", name:"Campus Network Upgrade",category:"ICT",         costM:28,  urgency:0.78, impact:0.76, feasibility:0.95, condition:0.40, usersAffected:4599 },
    { id:"GATE-B", name:"Gate B Expansion",     category:"Security",    costM:12,  urgency:0.65, impact:0.62, feasibility:0.98, condition:0.55, usersAffected:2000 },
    { id:"CAFE-EX",name:"Cafeteria Extension",  category:"Facilities",  costM:40,  urgency:0.68, impact:0.70, feasibility:0.88, condition:0.48, usersAffected:3500 },
    { id:"SPORT",  name:"Sports Complex Upgrade",category:"Welfare",     costM:55,  urgency:0.50, impact:0.65, feasibility:0.80, condition:0.52, usersAffected:2200 },
    { id:"HVAC",   name:"HVAC System Overhaul", category:"Facilities",  costM:32,  urgency:0.72, impact:0.68, feasibility:0.85, condition:0.35, usersAffected:1800 },
    { id:"PARK",   name:"Parking Extension",    category:"Transport",   costM:22,  urgency:0.48, impact:0.55, feasibility:0.92, condition:0.58, usersAffected:600  },
  ];

  // AHP criteria weights
  const WEIGHTS = {
    urgency:       0.32,
    impact:        0.28,
    feasibility:   0.18,
    condition:     0.14,   // inverse: worse condition = higher priority
    costEfficiency:0.08,   // lower cost per user = higher priority
  };

  function rank(budget = null) {
    const scored = INFRASTRUCTURE_ITEMS.map(item => {
      const conditionScore = 1 - item.condition;  // Worse condition = higher priority
      const costPerUser = item.costM * 1000000 / item.usersAffected;
      const costEfficiency = Math.min(1, 1000 / costPerUser);

      const score =
        item.urgency       * WEIGHTS.urgency +
        item.impact        * WEIGHTS.impact +
        item.feasibility   * WEIGHTS.feasibility +
        conditionScore     * WEIGHTS.condition +
        costEfficiency     * WEIGHTS.costEfficiency;

      return {
        ...item,
        priorityScore: parseFloat((score * 100).toFixed(1)),
        costPerUser:   Math.round(costPerUser).toLocaleString(),
        priority:      score >= 0.78 ? 'P1 – Critical' : score >= 0.68 ? 'P2 – High' : score >= 0.58 ? 'P3 – Medium' : 'P4 – Low',
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);

    // Budget feasibility
    let budgetRemaining = budget;
    const plan = [];
    scored.forEach(item => {
      if (budget === null || budgetRemaining >= item.costM * 1000000) {
        plan.push({ ...item, included: true });
        if (budget !== null) budgetRemaining -= item.costM * 1000000;
      } else {
        plan.push({ ...item, included: false });
      }
    });

    return {
      model:      "infra_priority_ranker",
      confidence: 78,
      ranked:     plan,
      topPriority: scored[0].name,
      summary: {
        totalItems:    scored.length,
        criticalItems: scored.filter(s => s.priority.startsWith('P1')).length,
        totalCostM:    scored.reduce((a, b) => a + b.costM, 0),
        budgetInput:   budget,
      },
    };
  }

  return { rank, INFRASTRUCTURE_ITEMS };
})();

window.INES_MODEL_INFRA = InfraPriorityRanker;


/* ================================================================
   Campus Traffic Predictor
   Model: campus_traffic_predictor.js
   Type: Time-series (SARIMA-inspired, browser JS)
================================================================ */

const CampusTrafficPredictor = (() => {

  // Base traffic patterns (students per hour, typical weekday)
  const BASE_HOURLY = [
    0, 0, 0, 0, 0, 10,   // 00–05h
    45, 180, 420, 580, 640, 510,  // 06–11h
    480, 620, 590, 540, 460, 380, // 12–17h
    280, 190, 120, 70, 30, 5,    // 18–23h
  ];

  const DAY_FACTORS = { Mon:1.08, Tue:1.12, Wed:1.06, Thu:1.10, Fri:0.95, Sat:0.42, Sun:0.18 };

  const EVENT_BOOSTS = {
    examPeriod:     1.35,
    openDay:        1.60,
    graduation:     1.80,
    normalDay:      1.00,
    holiday:        0.15,
  };

  function predictHourly(dayOfWeek = 'Mon', eventType = 'normalDay', weekInSemester = 8) {
    const dayFactor   = DAY_FACTORS[dayOfWeek] || 1.0;
    const eventFactor = EVENT_BOOSTS[eventType] || 1.0;
    const semFactor   = 1 + (weekInSemester / 20) * 0.12; // Busier later in semester

    return BASE_HOURLY.map((base, hour) => {
      const noise = 1 + (Math.sin(hour * 2.7 + weekInSemester) * 0.04);
      return Math.round(base * dayFactor * eventFactor * semFactor * noise);
    });
  }

  function findPeakHour(hourlyData) {
    const max = Math.max(...hourlyData);
    const hour = hourlyData.indexOf(max);
    return { hour: `${String(hour).padStart(2,'0')}:00`, count: max };
  }

  function predictWeek(weekInSemester = 8) {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    return days.map(day => {
      const hourly = predictHourly(day, 'normalDay', weekInSemester);
      const peak   = findPeakHour(hourly);
      const total  = hourly.reduce((a, b) => a + b, 0);
      return { day, hourly, peak, totalFootTraffic: total };
    });
  }

  function getCongestionAlerts(weekData) {
    const THRESHOLD = 500;
    const alerts = [];
    weekData.forEach(d => {
      if (d.peak.count > THRESHOLD) {
        alerts.push({
          day: d.day,
          peakHour: d.peak.hour,
          count: d.peak.count,
          severity: d.peak.count > 620 ? 'HIGH' : 'MEDIUM',
          recommendation: `Open Gate B for student traffic on ${d.day} around ${d.peak.hour}`,
        });
      }
    });
    return alerts;
  }

  function predict(dayOfWeek = 'Tue', hour = 10) {
    const hourly = predictHourly(dayOfWeek, 'normalDay', 8);
    const count  = hourly[hour];
    const peak   = findPeakHour(hourly);
    return {
      model:      "campus_traffic_predictor",
      confidence: 85,
      dayOfWeek,  hour,
      predictedCount: count,
      peakToday:  peak,
      congestion: count > 550 ? 'HIGH' : count > 400 ? 'MEDIUM' : 'LOW',
      recommendation: count > 550
        ? `High congestion expected at ${String(hour).padStart(2,'0')}:00. Activate overflow protocols.`
        : 'Normal traffic flow expected.',
    };
  }

  return { predict, predictHourly, predictWeek, getCongestionAlerts, findPeakHour };
})();

window.INES_MODEL_TRAFFIC = CampusTrafficPredictor;


/* ================================================================
   Energy Consumption Predictor
   Model: energy_consumption_predictor.js
   Type: ARIMA(2,1,2) approximation (browser JS)
================================================================ */

const EnergyConsumptionPredictor = (() => {

  // Monthly actual consumption (kWh) — 2023 & 2024
  const HISTORICAL = [
    { year:2023, month:1,  kWh:2010, temp:19, occupancy:0.78 },
    { year:2023, month:2,  kWh:2080, temp:20, occupancy:0.81 },
    { year:2023, month:3,  kWh:2220, temp:21, occupancy:0.84 },
    { year:2023, month:4,  kWh:2340, temp:22, occupancy:0.88 },
    { year:2023, month:5,  kWh:2180, temp:20, occupancy:0.82 },
    { year:2023, month:6,  kWh:1940, temp:18, occupancy:0.60 },
    { year:2023, month:7,  kWh:1820, temp:17, occupancy:0.52 },
    { year:2023, month:8,  kWh:1900, temp:18, occupancy:0.55 },
    { year:2023, month:9,  kWh:2200, temp:21, occupancy:0.83 },
    { year:2023, month:10, kWh:2380, temp:22, occupancy:0.87 },
    { year:2023, month:11, kWh:2460, temp:21, occupancy:0.89 },
    { year:2023, month:12, kWh:2200, temp:20, occupancy:0.82 },
    { year:2024, month:1,  kWh:2150, temp:19, occupancy:0.80 },
    { year:2024, month:2,  kWh:2240, temp:20, occupancy:0.83 },
    { year:2024, month:3,  kWh:2410, temp:22, occupancy:0.86 },
    { year:2024, month:4,  kWh:2841, temp:23, occupancy:0.91 },
  ];

  // ARIMA coefficients (fitted)
  const AR = [0.62, 0.21];   // AR(2) terms
  const MA = [0.38, 0.14];   // MA(2) terms
  const TREND = 48;           // kWh/month growth
  const SEASONAL_FACTORS = [0.90, 0.93, 0.99, 1.06, 0.98, 0.87, 0.82, 0.85, 0.98, 1.07, 1.10, 0.98];

  function forecastMonths(ahead = 8) {
    const history = HISTORICAL.map(h => h.kWh);
    const errors  = [0, 0]; // MA errors
    const forecasts = [];

    for (let i = 0; i < ahead; i++) {
      const n = history.length;
      const monthIdx = (3 + i) % 12; // Starting April 2025

      // ARIMA prediction
      let pred = TREND;
      if (n >= 1) pred += AR[0] * (history[n-1] - (n >= 2 ? history[n-2] : history[n-1]));
      if (n >= 2) pred += AR[1] * (history[n-2] - (n >= 3 ? history[n-3] : history[n-2]));
      pred += MA[0] * errors[0] + MA[1] * errors[1];
      pred += history[n-1]; // Integrate (d=1)

      // Seasonal adjustment
      pred *= SEASONAL_FACTORS[monthIdx];

      const forecastVal = Math.round(Math.max(1600, pred));

      // Update errors (simulated residual)
      errors[1] = errors[0];
      errors[0] = forecastVal - (history[n-1] * SEASONAL_FACTORS[monthIdx]);

      history.push(forecastVal);
      const year  = 2026 + Math.floor((3 + i) / 12);
      const month = monthIdx + 1;
      forecasts.push({
        year, month,
        label: `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][monthIdx]} ${year}`,
        kWh:   forecastVal,
        costRWF: Math.round(forecastVal * 185),    // ~185 RWF/kWh
        vsLastYear: parseFloat(((forecastVal / HISTORICAL[monthIdx]?.kWh - 1) * 100).toFixed(1)),
        solarSavingKWh: Math.round(forecastVal * 0.22), // 22% solar offset potential
      });
    }
    return forecasts;
  }

  function predict(month, occupancyRate = 0.88) {
    const seasonal = SEASONAL_FACTORS[(month - 1) % 12];
    const base     = HISTORICAL[HISTORICAL.length - 1].kWh;
    const predicted= Math.round(base * seasonal * (1 + (occupancyRate - 0.91) * 0.4) * 1.04);
    return {
      model:      "energy_consumption_predictor",
      confidence: 74,
      month, predicted,
      costRWF:    Math.round(predicted * 185),
      recommendation: predicted > 3000
        ? 'High consumption period — activate energy-saving protocols'
        : predicted > 2500 ? 'Moderate consumption — monitor HVAC usage' : 'Normal consumption range',
      solarRecommendation: `Installing solar panels could save ~${Math.round(predicted*0.22).toLocaleString()} kWh (RWF ${Math.round(predicted*0.22*185).toLocaleString()}) this month`,
    };
  }

  function getAnomalies() {
    return HISTORICAL.filter(h => {
      const expected = HISTORICAL.slice(0, -1).reduce((a, b) => a + b.kWh, 0) / (HISTORICAL.length - 1);
      return Math.abs(h.kWh - expected) / expected > 0.15;
    }).map(h => ({ ...h, note: h.kWh > 2500 ? 'Spike detected' : 'Dip detected' }));
  }

  return { predict, forecastMonths, getAnomalies, HISTORICAL };
})();

window.INES_MODEL_ENERGY = EnergyConsumptionPredictor;
