const { Router } = require('express');
const UserComponent = require('../User');

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
router.get('/info', UserComponent.info);

/**
 * Route serving latency from server to google.com
 * @name /latency
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/latency', UserComponent.latency);

/**
 * Route serving a new user
 * @name /signup
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/signup', UserComponent.signup);

/**
 * Route for login
 * @name /signin
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/signin', UserComponent.signin);

/**
 * Route for logout
 * @name /logout
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/logout', UserComponent.logout);

module.exports = router;
