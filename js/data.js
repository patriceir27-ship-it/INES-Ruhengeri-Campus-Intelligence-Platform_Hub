/* ===================================================
   INES-RUHENGERI CAMPUS INTELLIGENCE PLATFORM
   js/data.js — Mock datasets & AI model stubs
   All model names match what will be trained & uploaded
   =================================================== */

"use strict";

/* ─── ROLE CONFIG ─── */
const ROLES = {
  management: { label: "Top Management", modules: "*", avatar: "TM", color: "#00C2FF" },
  dvcar:      { label: "DVCAR", modules: ["dashboard","students","staff","academics","research","predictions","reports"], avatar: "DV", color: "#7C3AED" },
  dvcaf:      { label: "DVCAF", modules: ["dashboard","finance","facilities","hrm","reports","admin"], avatar: "DA", color: "#10B981" },
  director:   { label: "Director / HOD", modules: ["dashboard","students","staff","academics","facilities","reports"], avatar: "DI", color: "#3B82F6" },
  lecturer:   { label: "Lecturer", modules: ["dashboard","students","academics","research"], avatar: "LC", color: "#F59E0B" },
  student:    { label: "Student", modules: ["dashboard","academics"], avatar: "ST", color: "#10B981" },
  admin:      { label: "System Admin", modules: "*", avatar: "SA", color: "#EF4444" },
  security:   { label: "Security (ISO)", modules: ["dashboard","visitors","security"], avatar: "IS", color: "#EF4444" },
  hrm:        { label: "HRM", modules: ["dashboard","staff","hrm","reports"], avatar: "HR", color: "#7C3AED" },
  finance:    { label: "Finance", modules: ["dashboard","finance","reports"], avatar: "FN", color: "#10B981" },
};

/* ─── ORG STRUCTURE (from chart image) ─── */
const ORG = {
  Chanc: { label: "Chancellor", children: ["BoD"] },
  BoD:   { label: "Board of Directors", children: ["ExecOrgan"] },
  ExecOrgan: { label: "Executive Organ", children: ["VC"] },
  VC:    { label: "Vice-Chancellor", children: ["IRD","AcSenate","DVCAR","DVCAF","SMT"] },
  IRD:   { label: "International Relations Dir.", children: ["DP"] },
  DP:    { label: "Directorate of Planning", children: ["StatO","CSec"] },
  StatO: { label: "Statistics Officer", children: [] },
  CSec:  { label: "Central Secretariat", children: [] },
  AcSenate: { label: "Academic Senate", children: [] },
  DVCAR: { label: "Deputy VC – Academic & Research", children: ["DC","DL","DQAR","DAR","DRDI","FAC","DICT","DLABE"] },
  DVCAF: { label: "Deputy VC – Admin & Finance", children: ["DSCACS","HRM","DF"] },
  SMT:   { label: "Senior Management Team", children: ["DCAB"] },
  DCAB:  { label: "Director of Cabinet", children: ["PRO","Chap","IA"] },
  PRO:   { label: "Public Relations Officer", children: [] },
  Chap:  { label: "Chaplain", children: [] },
  IA:    { label: "Internal Auditor", children: [] },
  DC:    { label: "Director of Centre", children: [] },
  DL:    { label: "Directorate of Library", children: [] },
  DQAR:  { label: "Directorate of Quality Assurance", children: ["ExamO"] },
  DAR:   { label: "Dir. of Academics & Registration", children: ["REG"] },
  ExamO: { label: "Examinations Officer", children: [] },
  REG:   { label: "Registration", children: [] },
  DRDI:  { label: "Dir. Research, Dev & Innovation", children: [] },
  FAC:   { label: "Faculty", children: ["DPTs","CPGP"] },
  DPTs:  { label: "Departments", children: [] },
  CPGP:  { label: "Coordinator – Postgraduate Programs", children: [] },
  DICT:  { label: "Dir. ICT", children: [] },
  DLABE: { label: "Dir. Laboratories Exploitation", children: ["CLab","SC"] },
  CLab:  { label: "Coordinator of Laboratories", children: ["LabTec"] },
  SC:    { label: "Sport & Culture", children: [] },
  LabTec:{ label: "Laboratory Technicians", children: [] },
  DSCACS:{ label: "Dir. Student Welfare & Career", children: ["ISO","SU","CS","LPM"] },
  ISO:   { label: "Internal Security Officer", children: [] },
  SU:    { label: "Students Union", children: [] },
  CS:    { label: "Community Service", children: [] },
  LPM:   { label: "Logistics, Procurement & Maint.", children: ["MAINT"] },
  MAINT: { label: "Maintenance", children: [] },
  HRM:   { label: "Human Resource Manager", children: [] },
  DF:    { label: "Directorate of Finance", children: ["AccO"] },
  AccO:  { label: "Accounts Office", children: ["UP","CASHIERE","HOSTEL"] },
  UP:    { label: "Units of Production", children: [] },
  CASHIERE: { label: "Cashiere", children: [] },
  HOSTEL:{ label: "Hostel", children: [] },
};

/* ─── LIVE KPI DATA ─── */
const KPI = {
  students:       { value: 4287, trend: "+8.3%", dir: "up", label: "Total Students", unit: "" },
  attendance:     { value: 87.4, trend: "+2.1%", dir: "up", label: "Attendance Rate", unit: "%" },
  activeStaff:    { value: 312,  trend: "97% present", dir: "neutral", label: "Active Staff", unit: "" },
  secAlerts:      { value: 3,    trend: "+2 new", dir: "down", label: "Security Alerts", unit: "" },
  visitors:       { value: 148,  trend: "Peak 10:30", dir: "up", label: "Today's Visitors", unit: "" },
  labUtil:        { value: 73,   trend: "-5% vs last wk", dir: "down", label: "Lab Utilization", unit: "%" },
  research:       { value: 47,   trend: "This semester", dir: "neutral", label: "Research Papers", unit: "" },
  energy:         { value: 2841, trend: "+12% vs avg", dir: "down", label: "Energy (kWh)", unit: "" },
};

/* ─── ATTENDANCE TREND DATA (7 days) ─── */
const ATTENDANCE_WEEK = {
  labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  data:   [82, 85, 88, 91, 87, 79, 87],
};

/* ─── VISITOR HOURLY FLOW ─── */
const VISITOR_HOURLY = {
  labels: ["06h","07h","08h","09h","10h","11h","12h","13h","14h","15h","16h","17h","18h"],
  data:   [2, 5, 18, 28, 32, 24, 20, 22, 19, 15, 12, 8, 4],
};

/* ─── DEPARTMENT PERFORMANCE ─── */
const DEPT_PERF = [
  { dept: "Medicine",    score: 92, color: "#10B981" },
  { dept: "Engineering", score: 88, color: "#00C2FF" },
  { dept: "ICT",         score: 85, color: "#7C3AED" },
  { dept: "Agriculture", score: 83, color: "#F59E0B" },
  { dept: "Business",    score: 79, color: "#3B82F6" },
  { dept: "Education",   score: 71, color: "#EF4444" },
];

/* ─── GRADE DISTRIBUTION ─── */
const GRADE_DIST = {
  labels: ["A – Excellent","B – Good","C – Average","D – Pass","F – Fail"],
  data:   [18, 34, 27, 14, 7],
  colors: ["#10B981","#00C2FF","#3B82F6","#F59E0B","#EF4444"],
};

/* ─── AT-RISK STUDENTS ─── */
const AT_RISK = [
  { id:"S-2241", name:"Uwimana A.",    dept:"Engineering",  att:48, gpa:1.8, risk:91, action:"Counseling + mentorship" },
  { id:"S-1876", name:"Nkurunziza B.", dept:"Medicine",     att:58, gpa:2.1, risk:84, action:"Academic support" },
  { id:"S-3012", name:"Mukamana C.",   dept:"Business",     att:62, gpa:2.3, risk:72, action:"Peer tutoring" },
  { id:"S-2567", name:"Habimana D.",   dept:"ICT",          att:51, gpa:1.9, risk:88, action:"Financial review" },
  { id:"S-1234", name:"Ingabire E.",   dept:"Agriculture",  att:65, gpa:2.5, risk:65, action:"Workload check" },
  { id:"S-4102", name:"Gasana F.",     dept:"Education",    att:44, gpa:1.6, risk:94, action:"Emergency counseling" },
  { id:"S-3344", name:"Mutesi G.",     dept:"Engineering",  att:59, gpa:2.0, risk:80, action:"Mentorship program" },
];

/* ─── STAFF DATA ─── */
const STAFF_LIST = [
  { initials:"MK", name:"Dr. Mukamana K.",    dept:"Engineering", hrs:22, score:94, wl:0.94, color:"#00C2FF" },
  { initials:"RN", name:"Prof. Rwagatare N.", dept:"Medicine",    hrs:19, score:88, wl:0.72, color:"#10B981" },
  { initials:"BI", name:"Dr. Bizimungu I.",   dept:"ICT",         hrs:28, score:71, wl:0.98, color:"#EF4444", burnout:true },
  { initials:"NC", name:"Ms. Nyiranshuti C.", dept:"Business",    hrs:17, score:82, wl:0.60, color:"#7C3AED" },
  { initials:"KR", name:"Dr. Karekezi R.",    dept:"Agriculture", hrs:20, score:85, wl:0.75, color:"#F59E0B" },
  { initials:"UM", name:"Prof. Uwineza M.",   dept:"Education",   hrs:21, score:79, wl:0.80, color:"#3B82F6" },
];

/* ─── VISITOR LOG ─── */
const VISITOR_LOG = [
  { time:"09:42", name:"Unknown ⚠️",   purpose:"—",                    host:"—",             gate:"Gate B", status:"anomaly" },
  { time:"09:38", name:"Kamanzi J.",   purpose:"Academic visit",        host:"Dr. Mukamana",  gate:"Main",   status:"oncampus" },
  { time:"09:21", name:"Gasana R.",    purpose:"Ministry inspection",   host:"Registrar",     gate:"Main",   status:"oncampus" },
  { time:"09:05", name:"Uwase M.",     purpose:"Parent meeting",        host:"Student S-1876",gate:"Main",   status:"departed" },
  { time:"08:47", name:"Tech Vendor",  purpose:"Equipment delivery",    host:"ICT Dept",      gate:"Gate C", status:"departed" },
  { time:"08:30", name:"Ndayisaba P.", purpose:"Research collaboration",host:"DRDI Office",   gate:"Main",   status:"oncampus" },
];

/* ─── COURSE PERFORMANCE ─── */
const COURSES = [
  { name:"Calculus III",        dept:"Engineering",  students:312, pass:61, avg:54.2, diff:"hard" },
  { name:"Clinical Medicine",   dept:"Medicine",     students:180, pass:74, avg:67.8, diff:"medium" },
  { name:"Business Analytics",  dept:"Business",     students:224, pass:88, avg:76.3, diff:"easy" },
  { name:"Network Security",    dept:"ICT",          students:98,  pass:72, avg:65.1, diff:"medium" },
  { name:"Soil Science",        dept:"Agriculture",  students:145, pass:91, avg:79.4, diff:"easy" },
  { name:"Organic Chemistry",   dept:"Medicine",     students:210, pass:63, avg:55.8, diff:"hard" },
  { name:"Data Structures",     dept:"ICT",          students:134, pass:78, avg:70.2, diff:"medium" },
];

/* ─── SECURITY INCIDENTS ─── */
const INCIDENTS = [
  { id:"SEC-0342", type:"Unauthorized entry",  location:"Gate B",      time:"09:42", sev:"high",   status:"open" },
  { id:"SEC-0341", type:"Perimeter breach",    location:"East fence",  time:"08:15", sev:"medium", status:"investigating" },
  { id:"SEC-0340", type:"Camera offline",      location:"Lab Block",   time:"07:30", sev:"low",    status:"inprogress" },
  { id:"SEC-0339", type:"Noise complaint",     location:"Hostel D",    time:"Yesterday",sev:"low", status:"resolved" },
  { id:"SEC-0338", type:"Lost property",       location:"Library",     time:"Yesterday",sev:"low", status:"resolved" },
];

/* ─── AI PREDICTION MODELS ─── */
/* NOTE: These are stubs. Real models will be trained and uploaded to GitHub.
   Model names below match the filenames expected after training. */
const AI_MODELS = {
  enrollmentForecast: {
    name: "enrollment_forecast_model",   // → models/enrollment_forecast_model.json
    description: "LSTM-based enrollment growth forecasting",
    prediction: { value: 4820, label: "Expected enrollment Sem 3 2026", change: "+12.4%", confidence: 89 },
  },
  dropoutRisk: {
    name: "dropout_risk_classifier",     // → models/dropout_risk_classifier.json
    description: "Random Forest dropout probability classifier",
    prediction: { value: 23, label: "Students with >70% dropout risk", confidence: 82 },
  },
  courseDifficulty: {
    name: "course_difficulty_predictor", // → models/course_difficulty_predictor.json
    description: "Gradient Boosting course difficulty predictor",
    prediction: { value: "+3", label: "Courses increasing in difficulty next semester", confidence: 76 },
  },
  staffingOptimize: {
    name: "staffing_optimizer",          // → models/staffing_optimizer.json
    description: "Linear optimization model for staff allocation",
    prediction: { value: 8, label: "New lecturers needed (Engineering + ICT)", confidence: 91 },
  },
  infrastructurePriority: {
    name: "infra_priority_ranker",       // → models/infra_priority_ranker.json
    description: "Decision tree infrastructure expansion prioritizer",
    prediction: { value: "Lab Wing", label: "Highest priority expansion", confidence: 78 },
  },
  trafficFlow: {
    name: "campus_traffic_predictor",    // → models/campus_traffic_predictor.json
    description: "Time-series campus foot traffic predictor",
    prediction: { value: "Tue 10AM", label: "Peak congestion predicted", confidence: 85 },
  },
  burnoutDetector: {
    name: "staff_burnout_detector",      // → models/staff_burnout_detector.json
    description: "SVM-based staff burnout risk detector",
    prediction: { value: 7, label: "Staff members at high burnout risk", confidence: 80 },
  },
  energyOptimizer: {
    name: "energy_consumption_predictor",// → models/energy_consumption_predictor.json
    description: "ARIMA energy consumption forecasting model",
    prediction: { value: "+8%", label: "Energy cost increase (solar recommended)", confidence: 74 },
  },
};

/* ─── FINANCE DATA ─── */
const FINANCE = {
  tuitionYTD:    { value: "RWF 2.1B",  trend: "+14.2% YoY" },
  opCosts:       { value: "RWF 1.4B",  trend: "Within budget" },
  surplus:       { value: "RWF 682M",  trend: "32.5% margin" },
  scholarships:  { value: "RWF 124M",  trend: "312 students" },
  budgetAlloc: [
    { label:"Staff Salaries",  pct:45, color:"#00C2FF" },
    { label:"Infrastructure",  pct:20, color:"#3B82F6" },
    { label:"Research",        pct:15, color:"#7C3AED" },
    { label:"Scholarships",    pct:12, color:"#10B981" },
    { label:"Operations",      pct:8,  color:"#F59E0B" },
  ],
};

/* ─── RESEARCH DATA ─── */
const RESEARCH = {
  papersThisSem: 47,
  activeProjects: 28,
  externalGrants: "RWF 84M",
  internationalCollab: 12,
  byDept: [
    { dept:"Medicine",    papers:16, color:"#EF4444" },
    { dept:"Agriculture", papers:11, color:"#10B981" },
    { dept:"Engineering", papers:9,  color:"#00C2FF" },
    { dept:"ICT",         papers:7,  color:"#7C3AED" },
    { dept:"Business",    papers:4,  color:"#F59E0B" },
  ],
};

/* ─── FACILITIES DATA ─── */
const FACILITIES = {
  classrooms:  { active: 38, total: 52 },
  maintenance: 7,
  hostelOcc:   { filled: 712, total: 800 },
  cafeteriaPeak: "12:00–13:30",
  blocks: [
    { name:"Block A (12 rooms)", occ:92, color:"#EF4444" },
    { name:"Block B (10 rooms)", occ:78, color:"#F59E0B" },
    { name:"Block C (8 rooms)",  occ:55, color:"#10B981" },
    { name:"Lecture Hall",       occ:100,color:"#EF4444" },
    { name:"Computer Labs",      occ:73, color:"#00C2FF" },
    { name:"Library",            occ:98, color:"#EF4444" },
  ],
  maintenanceQueue: [
    { item:"Lab C Centrifuge",       priority:"immediate", note:"Est. repair 3–4 hrs" },
    { item:"Generator B",            priority:"7 days",    note:"AI wear-pattern detected" },
    { item:"Hostel Block D Plumbing",priority:"14 days",   note:"Preventive maintenance" },
    { item:"HVAC – Admin Block",     priority:"30 days",   note:"Scheduled service" },
  ],
};

/* ─── HRM DATA ─── */
const HRM = {
  totalStaff: 312,
  onLeave: 8,
  newHires: 4,
  avgTeachingHrs: 18.4,
  burnoutCount: 7,
  workloadDist: [
    { label:"Teaching",   pct:55, color:"#00C2FF" },
    { label:"Research",   pct:22, color:"#7C3AED" },
    { label:"Admin",      pct:15, color:"#F59E0B" },
    { label:"Committees", pct:8,  color:"#64748B" },
  ],
};

/* expose globally */
window.INES = {
  ROLES, ORG, KPI, ATTENDANCE_WEEK, VISITOR_HOURLY, DEPT_PERF,
  GRADE_DIST, AT_RISK, STAFF_LIST, VISITOR_LOG, COURSES,
  INCIDENTS, AI_MODELS, FINANCE, RESEARCH, FACILITIES, HRM,
};
