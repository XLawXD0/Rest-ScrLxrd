const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  app.get('/game/tebakepep', (req, res) => {
    try {
      const filePath = path.join(__dirname, '../../json/tebakepep.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const random = data[Math.floor(Math.random() * data.length)];

      res.json({
        status: true,
        result: {
          img: random.img,
          fullimg: random.fullimg,
          jawaban: random.jawaban,
          deskripsi: random.deskripsi
        }
      });
    } catch {
      res.json({ status: false, error: 'Gagal memuat data tebakepep' });
    }
  });
};