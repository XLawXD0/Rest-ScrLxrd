const axios = require('axios');

module.exports = function(app) {

    async function cliptoAudio(youtubeUrl) {
        const res = await axios.post(
            'https://www.clipto.com/api/youtube',
            { url: youtubeUrl },
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!res.data || res.data.success !== true) {
            throw new Error('Tanggapan tidak valid dari Clipto');
        }

        const medias = res.data.medias || [];

        const audio = medias
            .filter(m =>
                m.type === 'audio' &&
                ['m4a', 'mp3', 'opus'].includes(m.ext)
            )
            .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];

        if (!audio) {
            throw new Error('Tidak ditemukan audio yang valid');
        }

        return {
            title: res.data.title,
            format: audio.ext,
            bitrate: audio.bitrate,
            url: audio.url
        };
    }

    app.get('/downloader/yta-clipto', async (req, res) => {
        try {
            const { url } = req.query;

            if (!url) {
                return res.status(400).json({
                    status: false,
                    error: 'URL YouTube wajib diisi'
                });
            }

            const result = await cliptoAudio(url);

            res.status(200).json({
                status: true,
                result
            });

        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    });
};
