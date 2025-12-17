const UnlimitedAI = require('../../lib/unlimitedai.service');

module.exports = (app) => {

  app.get('/ai/unlimitedai', async (req, res) => {
    const text = req.query.text;

    if (!text) {
      return res.json({
        status: false,
        error: 'Parameter text wajib diisi'
      });
    }

    try {
      const ai = new UnlimitedAI();
      await ai.init();

      const reply = await ai.ask(text);

      res.json({
        status: true,
        result: {
          question: text,
          answer: reply
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
