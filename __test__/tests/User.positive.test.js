const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');

const server = require('../../api/server');

const { expect } = chai;

chai.use(chaiHttp);

const password = bcrypt.hashSync(`${new Date().getTime()}_Password`, 3).slice(7, 20);
const id = `${bcrypt.hashSync(`${new Date().getTime()}_User_Id`, 3).slice(7, 20)}@test.com`;
const userCreditionals = {
    id,
    password,
};

// Create test agent
const agent = request.agent(server);

module.exports.agent = agent;
module.exports.password = password;

describe('API -> controller', () => {
    // Sign up (Create) new user
    it('API -> controller -> /signup', (done) => {
        agent
            .post('/signup')
            .send({
                id: userCreditionals.id,
                password: userCreditionals.password,
            })
            .expect(307)
            .then(() => done())
            .catch((err) => done(err));
    });
    // Signin
    it('API -> controller -> /signin', (done) => {
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
    it('API -> controller -> /info', (done) => {
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
    it('API -> controller -> /latency', (done) => {
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
