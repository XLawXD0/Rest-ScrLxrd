const crypto = require('crypto');

module.exports = function generateApiKey() {
  return crypto.randomBytes(8).toString('hex');
};
