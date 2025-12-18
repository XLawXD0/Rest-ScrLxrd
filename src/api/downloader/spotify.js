const axios = require('axios');

module.exports = (app) => {
  app.get('/downloader/spotify', async (req, res) => {
    try {
      const { url } = req.query;

      if (!url) {
        return res.json({
          status: false,
          error: 'Parameter url wajib diisi'
        });
      }

      const apiUrl = `https://api.yupra.my.id/api/downloader/spotify?url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl, { timeout: 15000 });

      const data = response.data;

      if (!data || !data.status || !data.result) {
        return res.json({
          status: false,
          error: 'Gagal mengambil data Spotify'
        });
      }

      const result = data.result;

      res.json({
        status: true,
        result: {
          title: result.title,
          artist: result.artist,
          album: result.album,
          released: result.released,
          duration: result.duration,
          thumbnail: result.image,
          source: data.source || 'spotify',
          url: result.url,
          download: {
            quality: result.download?.quality || 'mp3',
            url: result.download?.url
          }
        }
      });

    } catch (err) {
      console.error(err.message);
      res.json({
        status: false,
        error: 'Terjadi kesalahan saat memproses Spotify downloader'
      });
    }
  });
};
