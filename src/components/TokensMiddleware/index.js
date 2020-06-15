const jwt = require('../auth');

const time = {
    access: '10m',
    refresh: '24h',
    cookieAcc: 10 * 60 * 1000,
    cookieRef: 24 * 60 * 60 * 1000,
};

module.exports = {
    /**
    * @function
    * @param {express.Request} req
    * @param {express.Response} res
    * @param {express.NextFunction} next
    * @returns {Promise<void>}
    */
    tokensMiddleware: async (req, res, next) => {
        if (req.path !== '/signup' && req.path !== '/signin') {
            const payload = await jwt.verify(req.cookies);
            const data = { id: payload.data };
            // needs new access
            if (payload.status === 1) {
                const access = jwt.getToken(data, time.access);
                res.cookie('access', access, { maxAge: time.cookieAcc, httpOnly: true });
                return res.redirect(307, req.path);
            }
            // all tokens expired
            if (payload.status === 2) {
                return res.status(401).json({
                    message: 'Please login first',
                    details: 'Refresh token expired',
                });
            }
            // all is OK, and route is NOT '/logout'
            if (req.path !== '/logout') {
                const access = jwt.getToken(data, time.access);
                const refresh = jwt.getToken(data, time.refresh);
                res.cookie('access', access, { maxAge: time.cookieAcc, httpOnly: true });
                res.cookie('refresh', refresh, { maxAge: time.cookieRef, httpOnly: true });
            }
            req.payloadData = payload.data;
        }
        return next();
    },
};
