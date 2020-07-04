process.env.NODE_ENV = 'test';
// ***************************
// * CHECK ALL FILES IS EXISTS
// ***************************
require('./tests/ExistsFiles.test');

// **********
// * SERVICES
// **********
require('./tests/UserService.test.js');

// **************************
// * CONTROLLERS (ROUTES)
// **************************
require('./tests/User.positive.test');
require('./tests/User.negative.test');
