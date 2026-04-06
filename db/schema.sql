-- ============================================================
-- INES-Ruhengeri Campus Intelligence Platform
-- PostgreSQL Schema
-- ============================================================

-- DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(20) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  faculty     VARCHAR(100),
  head_name   VARCHAR(100),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- STUDENTS
CREATE TABLE IF NOT EXISTS students (
  id            SERIAL PRIMARY KEY,
  student_id    VARCHAR(20) UNIQUE NOT NULL,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(100),
  dept_id       INTEGER REFERENCES departments(id),
  year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 5),
  gpa           NUMERIC(3,2) CHECK (gpa BETWEEN 0 AND 4),
  attendance    NUMERIC(5,2) CHECK (attendance BETWEEN 0 AND 100),
  status        VARCHAR(20) DEFAULT 'active', -- active, at_risk, graduated, withdrawn
  enrolled_at   DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- STAFF
CREATE TABLE IF NOT EXISTS staff (
  id              SERIAL PRIMARY KEY,
  staff_id        VARCHAR(20) UNIQUE NOT NULL,
  full_name       VARCHAR(100) NOT NULL,
  email           VARCHAR(100),
  dept_id         INTEGER REFERENCES departments(id),
  role            VARCHAR(50), -- lecturer, senior_lecturer, admin, technical, security
  teaching_hrs    INTEGER DEFAULT 0,
  performance     INTEGER CHECK (performance BETWEEN 0 AND 100),
  workload        NUMERIC(3,2) CHECK (workload BETWEEN 0 AND 1),
  burnout_risk    BOOLEAN DEFAULT FALSE,
  on_leave        BOOLEAN DEFAULT FALSE,
  hire_date       DATE DEFAULT CURRENT_DATE,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ATTENDANCE RECORDS (daily)
CREATE TABLE IF NOT EXISTS attendance (
  id          SERIAL PRIMARY KEY,
  student_id  INTEGER REFERENCES students(id),
  date        DATE NOT NULL,
  present     BOOLEAN NOT NULL,
  course      VARCHAR(100),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- COURSES
CREATE TABLE IF NOT EXISTS courses (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(20) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  dept_id     INTEGER REFERENCES departments(id),
  lecturer_id INTEGER REFERENCES staff(id),
  students    INTEGER DEFAULT 0,
  pass_rate   NUMERIC(5,2),
  avg_score   NUMERIC(5,2),
  difficulty  VARCHAR(10) DEFAULT 'medium', -- easy, medium, hard
  semester    INTEGER DEFAULT 1,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- VISITORS
CREATE TABLE IF NOT EXISTS visitors (
  id          SERIAL PRIMARY KEY,
  full_name   VARCHAR(100) NOT NULL,
  purpose     VARCHAR(100),
  host        VARCHAR(100),
  gate        VARCHAR(30),
  status      VARCHAR(20) DEFAULT 'oncampus', -- oncampus, departed, anomaly
  entry_time  TIMESTAMP DEFAULT NOW(),
  exit_time   TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- SECURITY INCIDENTS
CREATE TABLE IF NOT EXISTS incidents (
  id          SERIAL PRIMARY KEY,
  incident_id VARCHAR(20) UNIQUE NOT NULL,
  type        VARCHAR(100) NOT NULL,
  location    VARCHAR(100),
  severity    VARCHAR(10) DEFAULT 'low', -- low, medium, high
  status      VARCHAR(20) DEFAULT 'open', -- open, investigating, resolved
  reported_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- FINANCE
CREATE TABLE IF NOT EXISTS finance (
  id          SERIAL PRIMARY KEY,
  category    VARCHAR(50) NOT NULL, -- tuition, salary, infrastructure, research, operations
  description VARCHAR(200),
  amount      BIGINT NOT NULL, -- in RWF
  type        VARCHAR(10) NOT NULL, -- income, expense
  period      VARCHAR(20), -- e.g. '2026-S1', '2026-Q1'
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- RESEARCH
CREATE TABLE IF NOT EXISTS research (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(200) NOT NULL,
  dept_id         INTEGER REFERENCES departments(id),
  lead_staff_id   INTEGER REFERENCES staff(id),
  status          VARCHAR(20) DEFAULT 'ongoing', -- ongoing, published, submitted
  grant_amount    BIGINT DEFAULT 0,
  international   BOOLEAN DEFAULT FALSE,
  published_at    DATE,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- FACILITIES
CREATE TABLE IF NOT EXISTS facilities (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  type        VARCHAR(50), -- classroom, lab, hostel, library, cafeteria, sports
  capacity    INTEGER,
  occupancy   INTEGER DEFAULT 0,
  status      VARCHAR(20) DEFAULT 'operational', -- operational, maintenance, closed
  block       VARCHAR(50),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- MAINTENANCE QUEUE
CREATE TABLE IF NOT EXISTS maintenance (
  id          SERIAL PRIMARY KEY,
  facility_id INTEGER REFERENCES facilities(id),
  item        VARCHAR(200) NOT NULL,
  priority    VARCHAR(10) DEFAULT 'medium', -- high, medium, low
  note        VARCHAR(300),
  status      VARCHAR(20) DEFAULT 'pending', -- pending, inprogress, done
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ENERGY READINGS
CREATE TABLE IF NOT EXISTS energy (
  id          SERIAL PRIMARY KEY,
  reading_kwh NUMERIC(10,2) NOT NULL,
  source      VARCHAR(30) DEFAULT 'grid', -- grid, solar
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- KPI CACHE (updated by a cron or on-demand)
CREATE TABLE IF NOT EXISTS kpi_cache (
  key         VARCHAR(50) PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMP DEFAULT NOW()
);
