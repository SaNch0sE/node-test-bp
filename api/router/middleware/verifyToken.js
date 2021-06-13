const jwt = require('jsonwebtoken');
const { TIME, KEY } = require('../../../config/config');

const authenticateJWT = (req, res, next) => {
	const accVer = jwt.verify(req.cookies.access, process.env.KEY);
	if (accVer && refVer) {
		res.cookie('access', jwt.sign({ id: accVer.id }, KEY, { expiresIn: TIME.access }), { maxAge: TIME.cookieAcc, httpOnly: true });
		req.user = accVer.id;
	}
	return next();
};

module.exports = authenticateJWT;
