const UserModel = require('./model');

/**
 * @exports
 * @method hash
 * @param {string} id
 * @summary get a user
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
 * @summary get a user
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
 * @method create
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<UserModel>}
 */
function signup(profile) {
    return UserModel.create(profile);
}

/**
 * @exports
 * @method create
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<UserModel>}
 */
function signin(profile) {
    return UserModel.count(profile, (err, count) => {
        if (count > 0) {
            return 'exist';
        }
        return 0;
    });
}

/**
 * @exports
 * @method create
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<UserModel>}
 */
function updUserToken(id, refresh) {
    return UserModel.updateOne({ id }, { refresh }).exec();
}

/**
 * @exports
 * @method create
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<UserModel>}
 */
function cleanTokens() {
    return UserModel.updateMany({}, { refresh: 0 }).exec();
}

/**
 * @exports
 * @method hash
 * @param {string} id
 * @summary get a user
 * @returns {Promise<UserModel>}
 */
function verifyToken(id) {
    return UserModel.findOne({ id }).select({
        _id: 0,
        password: 0,
        id: 0,
        id_type: 0,
    }).exec();
}

module.exports = {
    info,
    hash,
    signup,
    signin,
    cleanTokens,
    updUserToken,
    verifyToken,
};
