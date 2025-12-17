const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = function (app) {

  async function randomCosplay() {
    try {
      const filePath = path.join(__dirname, '../../json/cosplay.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Data cosplay kosong');
      }

      const randomUrl = data[Math.floor(Math.random() * data.length)];

      const response = await axios.get(randomUrl, {
        responseType: 'arraybuffer'
      });

      return Buffer.from(response.data);

    } catch (err) {
      throw err;
    }
  }

  app.get('/random/cosplay', async (req, res) => {
    try {
      const img = await randomCosplay();

      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': img.length
      });

      res.end(img);

    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  });

};
