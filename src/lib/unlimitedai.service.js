const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class UnlimitedAI {
  constructor() {
    this.baseUrl = 'https://unlimitedai.org';
    this.chatUrl = 'https://unlimitedai.org/chat/';
    this.ajaxUrl = 'https://unlimitedai.org/wp-admin/admin-ajax.php';

    this.botId = 'defaultBotId';
    this.chatbotIdentity = 'defaultChatbotIdentity';
    this.clientId = 'defaultClientId';
    this.postId = 'defaultPostId';

    this.sessionId = uuidv4();
    this.nonce = null;
    this.nonceTimestamp = 0;
    this.cookieJar = new Map();

    this.axios = axios.create({
      timeout: 120000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    this.setupInterceptor();
  }

  setupInterceptor() {
    this.axios.interceptors.request.use(config => {
      const host = new URL(config.url).host;
      const cookies = this.cookieJar.get(host);
      if (cookies) config.headers.Cookie = cookies.join('; ');
      return config;
    });

    this.axios.interceptors.response.use(res => {
      const setCookie = res.headers['set-cookie'];
      if (setCookie) {
        const host = new URL(res.config.url).host;
        this.cookieJar.set(host, setCookie);
      }
      return res;
    });
  }

  async init() {
    await this.axios.get(this.baseUrl);
  }

  async getNonce() {
    if (this.nonce && Date.now() - this.nonceTimestamp < 300000) {
      return this.nonce;
    }

    const res = await this.axios.get(this.chatUrl);
    const html = res.data;

    const match =
      html.match(/"search_nonce":"([^"]+)"/) ||
      html.match(/_ajax_nonce["']?\s*:\s*["']([^"']+)/);

    this.nonce = match ? match[1] : '3c4b7dd456';
    this.nonceTimestamp = Date.now();

    return this.nonce;
  }

  async ask(text) {
    const nonce = await this.getNonce();

    const body = new URLSearchParams({
      action: 'wpaicg_chat_shortcode_message',
      message: text,
      _wpnonce: nonce,
      post_id: this.postId,
      bot_id: this.botId,
      chatbot_identity: this.chatbotIdentity,
      wpaicg_chat_client_id: this.clientId
    });

    const res = await this.axios.post(this.ajaxUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return res.data.toString().trim();
  }
}

module.exports = UnlimitedAI;
