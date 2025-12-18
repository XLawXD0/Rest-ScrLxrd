const axios = require('axios');

module.exports = (app) => {
  app.get('/stalk/ffstats', async (req, res) => {
    try {
      const { uid, region } = req.query;

      if (!uid || !region) {
        return res.json({
          status: false,
          error: 'Parameter uid dan region wajib diisi'
        });
      }

      const allowedRegion = [
        'IND', 'BR', 'SG', 'RU', 'ID',
        'TW', 'US', 'VN', 'TH', 'ME',
        'PK', 'CIS', 'BD'
      ];

      if (!allowedRegion.includes(region.toUpperCase())) {
        return res.json({
          status: false,
          error: 'Region tidak valid'
        });
      }

      const apiUrl = `https://free-ff-api-src-5plp.onrender.com/api/v1/playerstats?region=${region.toUpperCase()}&uid=${uid}`;
      const response = await axios.get(apiUrl, { timeout: 15000 });

      const data = response.data;

      if (!data || (!data.soloStats && !data.duoStats && !data.quadStats)) {
        return res.json({
          status: false,
          error: 'Data player tidak ditemukan'
        });
      }

      res.json({
        status: true,
        game: 'Free Fire',
        uid,
        region: region.toUpperCase(),
        result: {
          solo: data.soloStats || null,
          duo: data.duoStats || null,
          squad: data.quadStats || null
        }
      });

    } catch (err) {
      console.error(err.message);
      res.json({
        status: false,
        error: 'Gagal mengambil data Free Fire stats'
      });
    }
  });
};
