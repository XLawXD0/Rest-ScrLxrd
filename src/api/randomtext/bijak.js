const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  app.get('/randomtext/bijak', (req, res) => {
    try {
      const filePath = path.join(__dirname, '../../json/bijak.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      if (!Array.isArray(data) || !data.length) {
        return res.json({ status: false, error: 'Data kosong' });
      }

      const random = data[Math.floor(Math.random() * data.length)];

      res.json({
        status: true,
        result: random
      });
    } catch {
      res.json({ status: false, error: 'Gagal memuat bijak' });
    }
  });
};