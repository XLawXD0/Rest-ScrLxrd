const fs = require('fs');
const path = require('path');

module.exports = (app) => {

  app.get('/game/kuismerdeka', (req, res) => {
    try {
      const filePath = path.join(__dirname, '../../json/kuismerdeka.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      if (!Array.isArray(data) || data.length === 0) {
        return res.json({ status: false, error: 'Data soal kosong' });
      }

      const random = data[Math.floor(Math.random() * data.length)];

      res.json({
        status: true,
        result: {
          index: random.index,
          soal: random.soal,
          jawaban: random.jawaban
        }
      });

    } catch {
      res.json({ status: false, error: 'Gagal memuat data kuis merdeka' });
    }
  });

};