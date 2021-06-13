const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.DB_URL;

const connectOptions = {
	// automatically try to reconnect when it loses connection
	autoReconnect: true,
	// reconnect every reconnectInterval milliseconds
	// for reconnectTries times
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 1000,
	// flag to allow users to fall back to the old
	// parser if they find a bug in the new parse
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
};

module.exports = mongoose.createConnection(MONGODB_URI, connectOptions);
