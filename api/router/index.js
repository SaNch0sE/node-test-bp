const { Router } = require('express');
const controller = require('../controller');
const verifyToken = require('./middleware/verifyToken');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route serving a user info
 * @name /info
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/info', verifyToken, controller.info);

/**
 * Route serving latency from server to google.com
 * @name /latency
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/latency', verifyToken, controller.latency);

/**
 * Route serving a new user
 * @name /signup
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/signup', controller.signUp);

/**
 * Route for login
 * @name /signin
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/signin', controller.signIn);

/**
 * Route for logout
 * @name /logout
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/logout', verifyToken, controller.logout);

module.exports = {
    router,
};
