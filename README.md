# INES-Ruhengeri — Campus Intelligence Platform

A full AI-powered statistical intelligence web app for INES-Ruhengeri, built as a static site that deploys instantly on **GitHub Pages** (free).

---

## 📁 Project Structure

```
ines-intelligence/
├── index.html              # App entry point (login + shell)
├── README.md               # This file
├── .nojekyll               # Required for GitHub Pages (prevents Jekyll processing)
├── CNAME                   # Optional: custom domain (analytics.ines.ac.rw)
│
├── css/
│   ├── main.css            # Layout, sidebar, topbar, login
│   ├── components.css      # Cards, tables, badges, sparklines, heatmaps
│   └── charts.css          # Canvas sizing helpers
│
├── js/
│   ├── data.js             # All datasets, AI model stubs, org structure
│   ├── charts.js           # Chart.js rendering functions
│   ├── pages.js            # Page HTML generators (one per module)
│   └── app.js              # Auth, routing, live refresh, sidebar
│
├── models/                 # 📂 Place your trained AI model files here
│   ├── enrollment_forecast_model.json
│   ├── dropout_risk_classifier.json
│   ├── course_difficulty_predictor.json
│   ├── staffing_optimizer.json
│   ├── infra_priority_ranker.json
│   ├── campus_traffic_predictor.json
│   ├── staff_burnout_detector.json
│   └── energy_consumption_predictor.json
│
└── assets/
    └── favicon.svg
```

---

## 🚀 Deploy to GitHub Pages (Free — One Minute)

### Step 1 — Create GitHub Repository
1. Go to [github.com](https://github.com) → **New repository**
2. Name it: `campus-intelligence` (or any name)
3. Set to **Public**
4. Click **Create repository**

### Step 2 — Upload Files
```bash
# Option A: Git CLI
git clone https://github.com/YOUR-USERNAME/campus-intelligence.git
# Copy all files into the cloned folder, then:
git add .
git commit -m "Initial deploy: INES Campus Intelligence Platform"
git push origin main
```

Or use **GitHub Desktop** or drag-and-drop on github.com.

### Step 3 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** | Folder: **/ (root)**
4. Click **Save**

✅ Your site will be live at:
`https://YOUR-USERNAME.github.io/campus-intelligence`

---

## 🌐 Embed in INES Website (ines.ac.rw)

Add this snippet anywhere in the INES website HTML:

```html
<!-- INES Campus Intelligence Platform -->
<iframe
  src="https://YOUR-USERNAME.github.io/campus-intelligence"
  width="100%"
  height="700"
  frameborder="0"
  style="border-radius:12px; border:1px solid #e5e7eb;"
  allow="fullscreen"
  title="INES Campus Intelligence">
</iframe>
```

Or open it as a **standalone link** on the INES website navigation:
```
Analytics Portal → https://YOUR-USERNAME.github.io/campus-intelligence
```

### Custom Domain (Optional)
1. Edit `CNAME` file: write `analytics.ines.ac.rw`
2. In your domain DNS, add a CNAME record: `analytics` → `YOUR-USERNAME.github.io`
3. GitHub Pages will auto-provision HTTPS

---

## 🤖 AI Model Integration

Each AI model is named to match its function. After training:

| Model File | Purpose | Algorithm |
|---|---|---|
| `enrollment_forecast_model.json` | Predict enrollment growth | LSTM |
| `dropout_risk_classifier.json` | Flag at-risk students | Random Forest |
| `course_difficulty_predictor.json` | Predict course difficulty | Gradient Boosting |
| `staffing_optimizer.json` | Recommend staff allocation | Linear Optimization |
| `infra_priority_ranker.json` | Rank infrastructure needs | Decision Tree |
| `campus_traffic_predictor.json` | Predict peak foot traffic | Time-Series |
| `staff_burnout_detector.json` | Detect burnout risk | SVM |
| `energy_consumption_predictor.json` | Forecast energy costs | ARIMA |

### Loading Models in the Browser
After uploading model `.json` files to `/models/`, update `js/data.js` to load them:

```javascript
// Example: loading a TensorFlow.js model
import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';

const model = await tf.loadLayersModel('./models/dropout_risk_classifier.json');
const prediction = model.predict(inputTensor);
```

---

## 🔐 Role-Based Access

| Role | Modules Accessible |
|---|---|
| Top Management (VC/BoD/Chanc) | All modules |
| DVCAR | Dashboard, Students, Staff, Academics, Research, Predictions, Reports |
| DVCAF | Dashboard, Finance, Facilities, HRM, Reports, Admin |
| Director / HOD | Dashboard, Students, Staff, Academics, Facilities, Reports |
| Lecturer | Dashboard, Students, Academics, Research |
| Student | Dashboard, Academics |
| System Admin | All modules |
| Security (ISO) | Dashboard, Visitors, Security |
| HRM | Dashboard, Staff, HRM, Reports |
| Finance (DF/Acc O) | Dashboard, Finance, Reports |

---

## 📊 Modules Overview

1. **Dashboard** — Live KPIs, facility heatmap, AI intelligence brief
2. **AI Predictions** — 8 active model predictions with confidence scores
3. **Students** — At-risk detection, grade distribution, career pathways
4. **Staff** — Performance index, burnout detection, workload balance
5. **Visitors** — Entry logs, anomaly detection, hourly flow chart
6. **Academics** — Course performance, enrollment trends, exam schedule
7. **Research (DRDI)** — Output tracking, grants, international collaboration
8. **Facilities (DLABE)** — Classroom occupancy, maintenance queue
9. **Finance (DF)** — Budget allocation, revenue tracking, scholarships
10. **HRM** — Staff roster, leave tracking, AI staffing recommendation
11. **Security (ISO)** — Incident log, camera status, guard assignment
12. **Reports** — Custom report generator, exportable formats
13. **Admin Controls** — RBAC management, system config, deploy guide
14. **Org Chart** — Interactive INES-Ruhengeri org chart (all acronyms mapped)

---

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML5 + CSS3 + JavaScript (ES6+) — zero dependencies to install
- **Charts**: Chart.js 4.x (loaded from CDN)
- **Hosting**: GitHub Pages (free)
- **AI Models**: TensorFlow.js (browser-based inference after model upload)
- **No backend required** for static deployment (connect to INES API later)

---

## 📞 Support

Built for INES-Ruhengeri. For integration support:
- IT Department (DICT): dict@ines.ac.rw
- GitHub Issues: Open a ticket in the repository

---

*INES-Ruhengeri Campus Intelligence Platform — All modules aligned with official org chart (Chanc → BoD → VC → DVCAR/DVCAF → Directorates)*
