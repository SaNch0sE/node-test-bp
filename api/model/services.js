const UserModel = require('./model');
require('dotenv').config();

/**
 * @exports
 * @method info
 * @param {string} id
 * @summary get a user info
 * @returns {Promise<UserModel>}
 */
function info(id) {
	return UserModel.findOne({ id }).select({
		_id: 0,
		password: 0,
		refresh: 0,
	}).exec();
}

/**
 * @exports
 * @method hash
 * @param {string} id
 * @summary get a user password hash
 * @returns {Promise<UserModel>}
 */
function hash(id) {
	return UserModel.findOne({ id }).select({
		_id: 0,
		id: 0,
		id_type: 0,
	}).exec();
}

/**
 * @exports
 * @method signup
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<UserModel>}
 */
async function signup(profile) {
	return UserModel.create(profile);
}

module.exports = {
	info,
	hash,
	signup,
};
