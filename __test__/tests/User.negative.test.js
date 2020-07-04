const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');

const { expect } = chai;

chai.use(chaiHttp);

const { agent, password } = require('./User.positive.test');

const BadUserCreditionals = {
	id: `${bcrypt.hashSync(`${new Date().getTime()}_Password`, 3).slice(7, 20)}test.com`,
	password,
};

// Validation test
describe('UserComponent -> controller -> Validation error', () => {
	// Signing Up
	it('UserComponent -> controller -> /signup', (done) => {
		agent.post('/signUp')
			.set('Accept', 'application/json')
			.send(BadUserCreditionals)
			.expect('Content-Type', /json/)
			.expect(400)
			.then((res) => {
				const expectBody = expect(res.body);
				// Check response
				expectBody.to.have.property('status').to.be.equal(400);
				expectBody.to.have.property('error').to.be.equal('Bad Request');
				expectBody.to.have.property('details').to.be.a('object');
				done();
			})
			.catch((err) => done(err));
	});
	// Signing In
	it('UserComponent -> controller -> /signin', (done) => {
		agent.post('/signIn')
			.set('Accept', 'application/json')
			.send({
				BadUserCreditionals,
			})
			.expect('Content-Type', /json/)
			.expect(400)
			.then((res) => {
				const expectBody = expect(res.body);
				// Check response
				expectBody.to.have.property('status').to.be.equal(400);
				expectBody.to.have.property('error').to.be.equal('Bad Request');
				expectBody.to.have.property('details').to.be.a('object');
				done();
			})
			.catch((err) => done(err));
	});
	it('UserComponent -> controller -> /logout', (done) => {
		agent
			.get('/logout?all=notBool')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(400)
			.then((res) => {
				const expectBody = expect(res.body);
				// Check response
				expectBody.to.have.property('status').to.be.equal(400);
				expectBody.to.have.property('error').to.be.equal('Bad Request');
				expectBody.to.have.property('details').to.be.a('object');
				done();
			})
			.catch((err) => done(err));
	});
});

// Normal Logout
describe('UserComponent -> controller -> Logout', () => {
	it('UserComponent -> controller -> /logout', (done) => {
		agent
			.get('/logout?all=false')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.then((res) => {
				const expectBody = expect(res.body);
				// Check response
				expectBody.to.have.property('data').and.to.be.a('object');
				done();
			})
			.catch((err) => done(err));
	});
});

// Auth error test
describe('UserComponent -> controller -> Auth error test', () => {
	// Get current user info
	it('UserComponent -> controller -> /info', (done) => {
		agent
			.get('/info')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(401)
			.then((res) => {
				const expectBody = expect(res.body);
				// Check response
				expectBody.to.have.property('status').to.be.equal(401);
				expectBody.to.have.property('error').to.be.equal('Unauthorized');
				done();
			})
			.catch((err) => done(err));
	});
	// Get latency
	it('UserComponent -> controller -> /latency', (done) => {
		agent
			.get('/latency')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(401)
			.then((res) => {
				const expectBody = expect(res.body);
				// Check response
				expectBody.to.have.property('status').to.be.equal(401);
				expectBody.to.have.property('error').to.be.equal('Unauthorized');
				done();
			})
			.catch((err) => done(err));
	});
	// logout without tokens
	it('UserComponent -> controller -> /logout', (done) => {
		agent
			.get('/logout?all=false')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(401)
			.then((res) => {
				const expectBody = expect(res.body);
				// Check response
				expectBody.to.have.property('status').to.be.equal(401);
				expectBody.to.have.property('error').to.be.equal('Unauthorized');
				done();
			})
			.catch((err) => done(err));
	});
});
