const axios = require('axios');

module.exports = (app) => {
  app.get('/downloader/tiktok', async (req, res) => {
    try {
      const { url } = req.query;

      if (!url) {
        return res.json({
          status: false,
          error: 'Parameter url wajib diisi'
        });
      }

      const apiUrl = `https://api.yupra.my.id/api/downloader/tiktok?url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl, { timeout: 15000 });

      const data = response.data;

      if (!data || !data.result || !data.result.status) {
        return res.json({
          status: false,
          error: 'Gagal mengambil data dari TikTok'
        });
      }

      const result = data.result;

      // ambil video terbaik
      const nowm = result.data.find(v => v.type === 'nowatermark');
      const hd = result.data.find(v => v.type === 'nowatermark_hd');
      const wm = result.data.find(v => v.type === 'watermark');

      res.json({
        status: true,
        result: {
          id: result.id,
          title: result.title,
          author: result.author?.nickname || null,
          duration: result.duration,
          region: result.region,
          taken_at: result.taken_at,
          cover: result.cover,
          music: {
            title: result.music_info?.title,
            author: result.music_info?.author,
            url: result.music_info?.url
          },
          video: {
            watermark: wm?.url || null,
            no_watermark: nowm?.url || null,
            no_watermark_hd: hd?.url || null
          }
        }
      });

    } catch (err) {
      console.error(err.message);
      res.json({
        status: false,
        error: 'Terjadi kesalahan saat memproses TikTok downloader'
      });
    }
  });
};
