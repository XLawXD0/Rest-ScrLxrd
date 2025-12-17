const axios = require('axios');

module.exports = (app) => {

  app.get('/stalk/ff', async (req, res) => {
    try {
      const { uid, server } = req.query;

      // Validasi parameter
      if (!uid || !server) {
        return res.status(400).json({
          status: false,
          message: 'Parameter uid dan server wajib diisi'
        });
      }

      const allowedServers = [
        'ind', 'sg', 'br', 'ru', 'tw',
        'vn', 'th', 'pk', 'me', 'cis', 'us'
      ];

      if (!allowedServers.includes(server.toLowerCase())) {
        return res.status(400).json({
          status: false,
          message: 'Server tidak valid',
          available_server: allowedServers
        });
      }

      // Request ke API sumber
      const apiUrl = `https://freefire-api-six.vercel.app/get_player_personal_show?server=${server.toLowerCase()}&uid=${uid}`;

      const { data } = await axios.get(apiUrl, {
        timeout: 15000
      });

      if (!data || !data.basicinfo) {
        return res.status(404).json({
          status: false,
          message: 'Data pemain tidak ditemukan'
        });
      }

      // Response bersih & rapi
      res.json({
        status: true,
        result: {
          basicinfo: data.basicinfo,
          profileinfo: data.profileinfo || {},
          clanbasicinfo: data.clanbasicinfo || {},
          petinfo: data.petinfo || {},
          socialinfo: data.socialinfo || {},
          creditscoreinfo: data.creditscoreinfo || {}
        }
      });

    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Gagal mengambil data Free Fire',
        error: error.message
      });
    }
  });

};
