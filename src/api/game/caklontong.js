const fs = require('fs');
const path = require('path');

module.exports = (app) => {

  app.get('/game/caklontong', (req, res) => {
    try {
      const filePath = path.join(__dirname, '../../json/caklontong.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      if (!Array.isArray(data) || data.length === 0) {
        return res.json({
          status: false,
          error: 'Data caklontong kosong'
        });
      }

      const random = data[Math.floor(Math.random() * data.length)];

      res.json({
        status: true,
        result: {
          index: random.index,
          soal: random.soal,
          jawaban: random.jawaban,
          deskripsi: random.deskripsi
        }
      });

    } catch (err) {
      res.json({
        status: false,
        error: 'Gagal memuat data caklontong'
      });
    }
  });

};
