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
	return {
		access,
	};
}

module.exports = genTokens;
