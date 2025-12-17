const axios = require('axios');

module.exports = (app) => {

  app.get('/downloader/ytmp4', async (req, res) => {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        creator: 'XLawXD',
        error: 'Parameter url wajib diisi'
      });
    }

    try {
      const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl, { timeout: 20000 });

      const data = response.data;

      if (!data.success || !data.data) {
        return res.json({
          status: false,
          creator: 'XLawXD',
          error: 'Gagal mengambil data video'
        });
      }

      res.json({
        status: true,
        creator: 'XLawXD',
        result: {
          title: data.data.title,
          duration: data.data.duration,
          thumbnail: data.data.thumbnail,
          type: data.data.type,
          quality: data.data.format,
          download: data.data.download_url
        }
      });

    } catch (err) {
      res.status(500).json({
        status: false,
        creator: 'XLawXD',
        error: 'Downloader error',
        message: err.message
      });
    }
  });

};
