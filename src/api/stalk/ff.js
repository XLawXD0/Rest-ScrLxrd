const axios = require('axios');

module.exports = function (app) {

  const serverMap = {
    id: 'id',
    ind: 'ind',
    sg: 'sg',
    br: 'br',
    us: 'us',
    ru: 'ru',
    th: 'th',
    tw: 'tw',
    vn: 'vn',
    pk: 'pk',
    me: 'me',
    cis: 'cis'
  };

  app.get('/stalk/ff', async (req, res) => {
    try {
      const { uid, server } = req.query;

      if (!uid || !server) {
        return res.status(400).json({
          status: false,
          message: 'Parameter uid dan server wajib diisi',
          example: '/stalk/ff?uid=7729408043&server=id'
        });
      }

      const inputServer = server.toLowerCase();
      const realServer = serverMap[inputServer];

      if (!realServer) {
        return res.status(400).json({
          status: false,
          message: 'Server tidak dikenali',
          available: Object.keys(serverMap)
        });
      }

      const apiUrl =
        `https://freefire-api-six.vercel.app/get_player_personal_show?server=${realServer}&uid=${uid}`;

      const { data } = await axios.get(apiUrl, { timeout: 15000 });

      if (!data || !data.basicinfo) {
        return res.status(404).json({
          status: false,
          message: 'Data pemain tidak ditemukan'
        });
      }

      res.json({
        status: true,
        server: realServer.toUpperCase(),
        uid,
        result: data
      });

    } catch (err) {
      console.error('[FF STALK ERROR]', err.message);

      res.status(500).json({
        status: false,
        message: 'Gagal mengambil data Free Fire',
        error: err.message
      });
    }
  });
};
