const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve all static files (HTML, CSS, JS, assets, models)
app.use(express.static(path.join(__dirname)));

// SPA fallback — any unknown route returns index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`INES Campus Intelligence running on port ${PORT}`);
});
