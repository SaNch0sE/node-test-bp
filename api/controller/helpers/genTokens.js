const jwt = require('jsonwebtoken');
const { TIME, KEY } = require('../../../config/config');
/**
 * @exports
 * @method newToken
 * @param {object} data
 * @summary creates a new token
 * @returns {object}
 */
function genTokens(data) {
    const access = jwt.sign(data, KEY, { expiresIn: TIME.access });
    const refresh = jwt.sign(data, KEY, { expiresIn: TIME.refresh });
    return {
        access,
        refresh,
    };
}

module.exports = genTokens;
