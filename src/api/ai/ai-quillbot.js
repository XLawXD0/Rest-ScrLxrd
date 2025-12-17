import axios from "axios";
import crypto from "crypto";

export default async function handler(req, res) {
  const { text, websearch } = req.query;

  if (!text) {
    return res.status(400).json({
      status: false,
      error: "Parameter text wajib diisi"
    });
  }

  try {
    const payload = {
      stream: false, // ❗ MATIKAN STREAM
      chatId: null,
      message: {
        role: "user",
        content: text,
        messageId: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        files: []
      },
      product: "ai-chat",
      originUrl: "/ai-chat",
      prompt: { id: "ai_chat" },
      tools: websearch === "true" ? ["web_search"] : []
    };

    const response = await axios.post(
      "https://quillbot.com/api/raven/quill-chat/responses",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "useridtoken": "empty-token",
          "webapp-version": "38.36.1",
          "platform-type": "webapp",
          "qb-product": "ai-chat",
          "Origin": "https://quillbot.com",
          "Referer": "https://quillbot.com/ai-chat"
        },
        timeout: 20000
      }
    );

    const textResult =
      response.data?.text ||
      response.data?.response ||
      "Tidak ada response";

    res.json({
      status: true,
      creator: "XLawXD",
      result: {
        response: textResult
      }
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      error: "AI request gagal",
      message: err.message
    });
  }
}
