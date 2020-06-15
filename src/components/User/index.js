const bcrypt = require('bcrypt');
const request = require('request');
const UserService = require('./service');
const UserValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');
const jwt = require('../auth');
require('dotenv').config();

/**
 * Time for access and refresh tokens or cookies
 * @type {Object}
 * @const
 */
const time = {
    access: '10m',
    refresh: '24h',
    cookieAcc: 10 * 60 * 1000,
    cookieRef: 24 * 60 * 60 * 1000,
};

/**
 * Salt rounds for bcrypt generator
 * @type {Number}
 * @const
 */
const saltRounds = 10;

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @summary send user info
 * @returns {Promise < void >}
 */
async function info(req, res, next) {
    try {
        const user = await UserService.info(req.payloadData);

        return res.status(200).json({
            data: user,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @summary send latency to google.com from server
 * @returns {Promise < void >}
 */
async function latency(req, res, next) {
    try {
        request({
            uri: 'https://google.com',
            method: 'GET',
            time: true,
        }, (err, resp) => {
            const latTime = err || resp.timings.end;
            res.json({
                data: {
                    latency: latTime,
                },
            });
        });

        return res.status(200);
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @summary sign up a new user
 * @returns {Promise < void >}
 */
async function signup(req, res, next) {
    try {
        const { error } = UserValidation.signup(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        const regx = RegExp(/([+]+[0-9]+)/);

        if (regx.test(req.body.id)) {
            req.body.id_type = 'number';
        } else {
            req.body.id_type = 'email';
        }

        const hash = bcrypt.hashSync(req.body.password, saltRounds);
        const user = req.body;
        user.password = hash;
        user.refresh = hash;
        const data = { user: await UserService.signup(user) };
        if (data.user === 0) {
            data.user = 'User already exist';
        }
        return res.status(200).json({
            data,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @summary sign in (log in) user
 * @returns {Promise < void >}
 */
async function signin(req, res, next) {
    try {
        const { error } = UserValidation.signin(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        let token = null;
        let status = 'Failed, invalid input data';
        const hash = await UserService.hash(req.body.id);

        if (hash && bcrypt.compareSync(req.body.password, hash.password) === true) {
            const data = { id: req.body.id };
            const access = jwt.getToken(data, time.access);
            const refresh = jwt.getToken(data, time.refresh);
            res.cookie('access', access, { maxAge: time.cookieAcc, httpOnly: true });
            res.cookie('refresh', refresh, { maxAge: time.cookieRef, httpOnly: true });
            token = access;
            status = 'OK';
        }

        return res.status(200).json({
            status,
            token,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @summary logout current or all users
 * @returns {Promise < void >}
 */
async function logout(req, res, next) {
    try {
        const { error } = UserValidation.logout(req.query);

        if (error) {
            throw new ValidationError(error.details);
        }

        res.cookie('access', 0, { maxAge: 0, httpOnly: true });
        res.cookie('refresh', 0, { maxAge: 0, httpOnly: true });
        if (req.query.all === 'true') {
            process.env.KEY = bcrypt.hashSync(`${new Date().getTime()}_public-Key`, 5);
        }

        return res.status(200).json({
            data: { all: req.query.all },
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

module.exports = {
    info,
    latency,
    signup,
    signin,
    logout,
};
