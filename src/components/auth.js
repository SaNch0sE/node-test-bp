require('dotenv').config();
const jwt = require('jsonwebtoken');
const { verifyToken, updUserToken } = require('./User/service');

/**
 * @function
 * @param {Object} data payload
 * @param {String} time time to expire
 * @param {Boolean} refresh is refresh?
 * @returns {Promise<void>}
 */
function getToken(data, time) {
    return jwt.sign(data, process.env.KEY, { expiresIn: time });
}

/**
 * @function
 * @param {express.Response.cookies} tokens Object like { access, refresh }
 * @returns {Promise<void>} status "0" - OK (and returns encrypted data), "1" - Access-token expired, "2" - All tokens expired
 */
async function verify(tokens) {
    try {
        const refresh = jwt.verify(tokens.refresh, process.env.KEY);
        const checked = await verifyToken(refresh.id);
        if (tokens.refresh !== checked.refresh) {
            throw Error('invalid refresh token');
        }
        try {
            const access = jwt.verify(tokens.access, process.env.KEY);
            if (access && refresh) {
                return { status: 0, data: access.id };
            }
        // if user has no access token but has refresh
        } catch (err) {
            // console.log(`Error: ${err}`);
            return { status: 1, data: refresh.id };
        }
    // else
    } catch (err) {
        console.log(err);
        return { status: 2 };
    }
    return true;
}

module.exports = {
    getToken,
    verify,
};
