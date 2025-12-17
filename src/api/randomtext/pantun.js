const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  app.get('/randomtext/pantun', (req, res) => {
    try {
      const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../json/pantun.json'), 'utf-8')
      );

      res.json({
        status: true,
        result: data[Math.floor(Math.random() * data.length)]
      });
    } catch {
      res.json({ status: false, error: 'Gagal memuat pantun' });
    }
  });
};