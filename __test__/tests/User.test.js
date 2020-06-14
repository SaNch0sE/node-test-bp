const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');

const server = require('../../src/server/server');

const { expect } = chai;

chai.use(chaiHttp);

const pass = crypto.randomBytes(Math.ceil(8 / 2)).toString('hex').slice(0, 8);
const userCreditionals = {
    id: `${crypto
        .randomBytes(Math.ceil(8 / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, 8)}@test.com`,
    password: pass,
};
// const BadUserCreditionals = {
//     id: `${crypto
//         .randomBytes(Math.ceil(8 / 2))
//         .toString('hex') // convert to hexadecimal format
//         .slice(0, 8)}test.com`,
//     password: pass,
// };

// Create test agent
const agent = request.agent(server);

describe('UserComponent -> controller', () => {
    // Sign up (Create) new user
    it('UserComponent -> controller -> /signup', (done) => {
        agent
            .post('/signup')
            .set('Accept', 'application/json')
            .send({
                id: userCreditionals.id,
                password: userCreditionals.password,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                // Check response
                expect(res.body).to.have.property('data').and.to.be.a('object');
                expect(res.body.data).to.have.property('user').and.to.be.a('object');
                done();
            })
            .catch((err) => done(err));
    });
    // Signin
    it('UserComponent -> controller -> /signin', (done) => {
        agent
            .post('/signin')
            .set('Accept', 'application/json')
            .send({
                id: userCreditionals.id,
                password: userCreditionals.password,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                // Check response
                expect(res.body).to.have.property('status').and.to.be.a('string').and.to.be.equal('OK');
                expect(res.body).to.have.property('token').and.to.be.a('string');
                done();
            })
            .catch((err) => done(err));
    });
    // Get current user info
    it('UserComponent -> controller -> /info', (done) => {
        agent
            .get('/info')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                // Check response
                expect(res.body).to.have.property('data').and.to.be.a('object');
                expect(res.body.data).to.have.property('id_type').and.to.be.equal('email');
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
            .expect(200)
            .then((res) => {
                // Check response
                expect(res.body).to.have.property('data').and.to.be.a('object');
                expect(res.body.data).to.have.property('latency').and.to.be.a('number');
                done();
            })
            .catch((err) => done(err));
    });
});

/* describe('UserComponent -> controller -> Validation error', () => {
    // Signin Up
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
    // Signin In
    it('UserComponent -> controller -> /signin', (done) => {
        agent.post('/signIn')
            .set('Accept', 'application/json')
            .send({
                email: `${userCreditionals.email}XXX`,
                password: userCreditionals.password,
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
    // Get current user info
    it('UserComponent -> controller -> /info', (done) => {
        agent
            .get('/xxxx')
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
// Logout
describe('UserComponent -> controller -> Logout', () => {
    it('UserComponent -> controller -> /logout', (done) => {
        agent
            .post('/logout')
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
            .post('/logout')
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
*/
