const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-ufa7f.mongodb.net/`;
const MONGODB_DB_MAIN = process.env.DB_NAME;
const MONGO_URI = `${MONGODB_URI}${MONGODB_DB_MAIN}?retryWrites=true&w=majority`;

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

module.exports = mongoose.createConnection(MONGO_URI, connectOptions);
