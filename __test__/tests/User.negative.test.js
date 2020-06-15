const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');

const { expect } = chai;

chai.use(chaiHttp);

const { agent, pass } = require('./User.positive.test');

const BadUserCreditionals = {
    id: `${crypto
        .randomBytes(Math.ceil(8 / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, 8)}test.com`,
    password: pass,
};

// Validation test
describe('UserComponent -> controller -> Validation error', () => {
    // Signing Up
    it('UserComponent -> controller -> /signup', (done) => {
        agent.post('/signUp')
            .set('Accept', 'application/json')
            .send(BadUserCreditionals)
            .expect('Content-Type', /json/)
            .expect(422)
            .then((res) => {
                const expectBody = expect(res.body);
                // Check response
                expectBody.to.have.property('message');
                expectBody.to.have.property('details');
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
            .expect(422)
            .then((res) => {
                const expectBody = expect(res.body);
                // Check response
                expectBody.to.have.property('message');
                expectBody.to.have.property('details');
                done();
            })
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /logout', (done) => {
        agent
            .get('/logout?all=notBool')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(422)
            .then((res) => {
                const expectBody = expect(res.body);
                // Check response
                expectBody.to.have.property('message');
                expectBody.to.have.property('details');
                done();
            })
            .catch((err) => done(err));
    });
});
// Normal Logout
describe('UserComponent -> controller -> Logout', () => {
    it('UserComponent -> controller -> /logout', (done) => {
        agent
            .get('/logout?=false')
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
describe('UserComponent -> controller -> Auth error test\n', () => {
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
                expectBody.to.have.property('message');
                expectBody.to.have.property('details');
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
                expectBody.to.have.property('message');
                expectBody.to.have.property('details');
                done();
            })
            .catch((err) => done(err));
    });
    // logout without tokens
    it('UserComponent -> controller -> /logout', (done) => {
        agent
            .post('/logout?all=false')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .then((res) => {
                const expectBody = expect(res.body);
                // Check response
                expectBody.to.have.property('message');
                expectBody.to.have.property('details');
                done();
            })
            .catch((err) => done(err));
    });
});
