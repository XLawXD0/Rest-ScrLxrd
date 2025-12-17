const fs = require("fs");
const axios = require("axios");
const crypto = require("crypto");
const FormData = require("form-data");
const path = require("path");

const baseApi = "https://api.unblurimage.ai";

module.exports = (app) => {

  app.get("/ai/hdvideo", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url) {
        return res.json({
          status: false,
          error: "Parameter url diperlukan"
        });
      }

      const tempPath = path.join("/tmp", `video-${Date.now()}.mp4`);

      /** 1️⃣ Download video */
      const videoResp = await axios.get(url, {
        responseType: "stream",
        timeout: 20000
      });

      const writer = fs.createWriteStream(tempPath);
      videoResp.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      /** 2️⃣ Request upload URL */
      const productSerial = crypto.randomUUID().replace(/-/g, "");
      const uploadForm = new FormData();
      uploadForm.append("video_file_name", `api-${Date.now()}.mp4`);

      const uploadResp = await axios.post(
        `${baseApi}/api/upscaler/v1/ai-video-enhancer/upload-video`,
        uploadForm,
        { headers: uploadForm.getHeaders() }
      ).then(r => r.data);

      if (uploadResp.code !== 100000) {
        throw new Error("Gagal mendapatkan upload URL");
      }

      const { url: uploadUrl, object_name } = uploadResp.result;

      /** 3️⃣ Upload ke CDN */
      await axios.put(uploadUrl, fs.createReadStream(tempPath), {
        headers: { "content-type": "video/mp4" }
      });

      const cdnUrl = `https://cdn.unblurimage.ai/${object_name}`;

      /** 4️⃣ Create job */
      const jobForm = new FormData();
      jobForm.append("original_video_file", cdnUrl);
      jobForm.append("resolution", "2k");
      jobForm.append("is_preview", "false");

      const jobResp = await axios.post(
        `${baseApi}/api/upscaler/v2/ai-video-enhancer/create-job`,
        jobForm,
        {
          headers: {
            ...jobForm.getHeaders(),
            "product-serial": productSerial
          }
        }
      ).then(r => r.data);

      res.json({
        status: true,
        creator: "XLawXD",
        result: {
          job_id: jobResp.result.job_id,
          source: url,
          cdn_url: cdnUrl,
          note: "Gunakan /ai/hdvideo/status/:job_id"
        }
      });

    } catch (err) {
      res.json({
        status: false,
        error: err.message
      });
    }
  });

};
