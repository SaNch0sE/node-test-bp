module.exports = (err, req, res, next) => {
	if (err) {
		if (err.name === 'ValidationError') {
			res.status(400).json({
				status: 400,
				error: 'Bad Request',
				details: {
					name: err.name,
					details: err.message,
				},
			});
		} else if (err.code === 11000) {
			res.status(400).json({
				status: 400,
				error: 'User already exist',
			});
		} else if (err.name === 'JsonWebTokenError') {
			res.status(401).json({
				status: 401,
				error: 'Unauthorized',
			});
		} else {
			console.log(err.stack);
			res.status(500).json({
				status: 500,
				error: 'Internal server error',
				details: {
					name: err.name,
					message: err.message,
					code: err.code,
				},
			});
		}
	}
	return next();
};
