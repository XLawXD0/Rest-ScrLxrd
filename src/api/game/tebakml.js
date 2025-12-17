const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  app.get('/game/tebakml', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname,'../../json/tebakml.json'),'utf-8'));
      const random = data[Math.floor(Math.random() * data.length)];

      res.json({
        status: true,
        result: random
      });
    } catch {
      res.json({ status:false, error:'Gagal memuat data tebakml' });
    }
  });
};