const bcrypt = require('bcrypt');
const axios = require('axios');
const service = require('../model/services');
const genTokens = require('./helpers/genTokens');
const validate = require('./helpers/validation');
const checkIdType = require('./helpers/checkIdType');
const { saltRounds, TIME } = require('../../config/config');

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @description Controller for gathering information about current user
 * @summary send user info
 * @returns {Promise < void >}
 */
async function info(req, res, next) {
	const user = await service.info(req.user);
	res.status(200).json({
		data: user,
	});

	return next();
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @description Controller that count latency from google.com to this server
 * @summary send latency to google.com from server
 * @returns {Promise < void >}
 */
async function latency(req, res, next) {
	const startTimer = Date.now();
	try {
		await axios.get('https://google.com/');
	} catch (e) {
		return next(e);
	}
	const lat = Date.now() - startTimer;
	res.status(200).json({
		data: {
			latency: lat,
		},
	});
	return next();
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @description Controller for creating new user with id and password.
 * It alse generate id type (id_type) to store it in database.
 * @summary sign up a new user
 * @returns {Promise < void >}
 */
async function signUp(req, res, next) {
	const { error } = validate.signup(req.body);

	if (error) {
		return next(error);
	}
	const user = req.body;

	user.id_type = checkIdType(user.id);
	user.password = bcrypt.hashSync(user.password, saltRounds);

	const data = await service.signup(user).catch((e) => next(e));
	const tokens = genTokens({ id: req.body.id });
	res.cookie('access', tokens.access, { maxAge: TIME.cookieAcc, httpOnly: true });
	res.cookie('refresh', tokens.refresh, { maxAge: TIME.cookieRef, httpOnly: true });
	res.status(200).json({
		token: tokens.access,
		user: data,
	});

	return next();
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @description Controller for signin in user with id and password, and send user access token
 * @summary sign in (log in) user
 * @returns {Promise < void >}
 */
async function signIn(req, res, next) {
	const { error } = validate.signin(req.body);

	if (error) {
		return next(error);
	}

	const response = {
		statusCode: 400,
		status: 'Failed, invalid input data',
	};
	const user = await service.hash(req.body.id);
	if (user != null) {
		const compared = bcrypt.compareSync(req.body.password, user.password);
		if (compared) {
			const tokens = genTokens({ id: req.body.id });
			res.cookie('access', tokens.access, { maxAge: TIME.cookieAcc, httpOnly: true });
			res.cookie('refresh', tokens.refresh, { maxAge: TIME.cookieRef, httpOnly: true });
			response.statusCode = 200;
			response.token = tokens.access;
			response.status = 'OK';
		}
	} else {
		response.status = "Failed, user doesn't exist";
	}

	res.status(response.statusCode).json(response);
	return next();
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
	const { error } = validate.logout(req.query);

	if (error) {
		return next(error);
	}

	res.cookie('access', 'none', { maxAge: 0, httpOnly: true });
	res.cookie('refresh', 'none', { maxAge: 0, httpOnly: true });
	if (req.query.all === 'true') {
		process.env.KEY = bcrypt.hashSync(`${new Date().getTime()}_private-Key`, 10);
	}

	res.status(200).json({
		data: { all: req.query.all },
	});

	return next();
}

module.exports = {
	info,
	latency,
	signUp,
	signIn,
	logout,
};
