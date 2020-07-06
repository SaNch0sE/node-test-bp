const jwt = require('jsonwebtoken');
const { TIME, KEY } = require('../../../config/config');

const authenticateJWT = (req, res, next) => {
    const { access, refresh } = req.cookies;
    try {
        const refVer = jwt.verify(refresh, process.env.KEY);
        try {
            const accVer = jwt.verify(access, process.env.KEY);
            if (accVer && refVer) {
                res.cookie('access', jwt.sign({ id: accVer.id }, KEY, { expiresIn: TIME.access }), { maxAge: TIME.cookieAcc, httpOnly: true });
                req.user = accVer.id;
            }
            // if user has no access token but has refresh
        } catch (err) {
            res.cookie('access', jwt.sign({ id: refVer.id }, KEY, { expiresIn: TIME.access }), { maxAge: TIME.cookieAcc, httpOnly: true });
            return res.redirect(307, req.path);
        }
        return next();
        // else
    } catch (err) {
        return next(err);
    }
};

module.exports = authenticateJWT;
