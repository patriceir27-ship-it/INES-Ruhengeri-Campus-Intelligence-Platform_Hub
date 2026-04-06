const express  = require('express');
const path     = require('path');
const initDB   = require('./db/init');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── API Routes ──────────────────────────────────────
app.use('/api/dashboard',  require('./routes/dashboard'));
app.use('/api/students',   require('./routes/students'));
app.use('/api/staff',      require('./routes/staff'));

// Data routes (all in one router)
const data = require('./routes/data');
app.use('/api/visitors',   (req,res) => data(req,res,'visitors'));
app.use('/api/security',   (req,res) => data(req,res,'security'));
app.use('/api/finance',    (req,res) => data(req,res,'finance'));
app.use('/api/research',   (req,res) => data(req,res,'research'));
app.use('/api/facilities', (req,res) => data(req,res,'facilities'));
app.use('/api/academics',  (req,res) => data(req,res,'academics'));
app.use('/api/hrm',        (req,res) => data(req,res,'hrm'));
app.use('/api/energy',     (req,res) => data(req,res,'energy'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Boot
initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ INES Campus Intelligence live on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Failed to initialise DB:', err.message);
    process.exit(1);
  });
