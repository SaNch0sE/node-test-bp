const bcrypt = require('bcrypt');
const request = require('request');
const UserService = require('./service');
const UserValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');
const jwt = require('../auth');

const saltRounds = 10;
const time = {
    access: '10m',
    refresh: '24h',
    cookieAcc: 10 * 60 * 1000,
    cookieRef: 24 * 60 * 60 * 1000,
};

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function info(req, res, next) {
    try {
        const payload = await jwt.verify(req.cookies);
        const data = { id: payload.data };
        if (payload.status === 1) {
            const access = jwt.getToken(data, time.access);
            res.cookie('access', access, { maxAge: time.cookieAcc, httpOnly: true });
            return res.redirect(307, '/info');
        }
        if (payload.status === 2) {
            return res.status(200).json({
                error: 'Please login first',
                details: 'Refresh token expired',
            });
        }

        const access = jwt.getToken(data, time.access);
        const refresh = jwt.getToken(data, time.refresh);
        res.cookie('access', access, { maxAge: time.cookieAcc, httpOnly: true });
        res.cookie('refresh', refresh, { maxAge: time.cookieRef, httpOnly: true });
        await UserService.updUserToken(payload.data, refresh);
        const user = await UserService.info(payload.data, refresh);

        return res.status(200).json({
            data: user,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                error: error.name,
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
 * @returns {Promise < void >}
 */
async function latency(req, res, next) {
    try {
        const payload = await jwt.verify(req.cookies);
        const data = { id: payload.data };
        if (payload.status === 1) {
            const access = jwt.getToken(data, time.access);
            res.cookie('access', access, { maxAge: time.cookieAcc, httpOnly: true });
            return res.redirect(307, '/info');
        }
        if (payload.status === 2) {
            return res.status(200).json({
                error: 'Please login first',
                details: 'Refresh token expired',
            });
        }

        const access = jwt.getToken(data, time.access);
        const refresh = jwt.getToken(data, time.refresh);
        res.cookie('access', access, { maxAge: time.cookieAcc, httpOnly: true });
        res.cookie('refresh', refresh, { maxAge: time.cookieRef, httpOnly: true });
        await UserService.updUserToken(data.id, refresh);

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
                error: error.name,
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
        const data = { user: await UserService.signup(user) };

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
 * @returns {Promise < void >}
 */
async function signin(req, res, next) {
    try {
        const { error } = UserValidation.signin(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        let signIn = 'Failed, invalid input data';
        const data = { id: req.body.id };

        const hash = await UserService.hash(req.body.id);

        if (bcrypt.compareSync(req.body.password, hash.password) === true) {
            const access = jwt.getToken(data, time.access);
            const refresh = jwt.getToken(data, time.refresh);
            res.cookie('access', access, { maxAge: time.cookieAcc, httpOnly: true });
            res.cookie('refresh', refresh, { maxAge: time.cookieRef, httpOnly: true });
            await UserService.updUserToken(data.id, refresh);
            signIn = 'Success';
        }

        return res.status(200).json({
            signIn,
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
 * @returns {Promise < void >}
 */
async function logout(req, res, next) {
    try {
        const { error } = UserValidation.logout(req.query);

        if (error) {
            throw new ValidationError(error.details);
        }

        const payload = await jwt.verify(req.cookies);
        const data = { id: payload.data };
        if (payload.status === 1) {
            const access = jwt.getToken(data, time.access);
            res.cookie('access', access, { maxAge: time.cookieAcc, httpOnly: true });
            return res.redirect(307, '/info');
        }
        if (payload.status === 2) {
            return res.status(200).json({
                error: 'Please login first',
                details: 'Refresh token expired',
            });
        }

        let all = false;
        if (req.query.all === 'false') {
            await UserService.updUserToken(data.id, 0);
            res.cookie('access', 0, { maxAge: 0, httpOnly: true });
            res.cookie('refresh', 0, { maxAge: 0, httpOnly: true });
        } else {
            await UserService.cleanTokens();
            res.cookie('access', 0, { maxAge: 0, httpOnly: true });
            res.cookie('refresh', 0, { maxAge: 0, httpOnly: true });
            all = true;
        }

        return res.status(200).json({
            data: { all },
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
