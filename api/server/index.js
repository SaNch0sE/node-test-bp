const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { router } = require('../router');
const { PORT } = require('../../config/config');
const errHandler = require('./middleware/errors');

const app = express();

// enable CORS
app.use(cors());
// helps you secure your Express apps by setting various HTTP headers
app.use(helmet());
// parse request json bodies
app.use(bodyParser.json());
// parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());
// use my router
app.use(router);
// custom error handler
app.use(errHandler);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));

module.exports = app;
