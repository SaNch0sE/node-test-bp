const chai = require('chai');
const crypto = require('crypto');
const UserService = require('../../src/components/User/service');

const { expect } = chai;

const pass = crypto.randomBytes(Math.ceil(8 / 2)).toString('hex').slice(0, 8);
const userCreditionals = {
    id: `${crypto
        .randomBytes(Math.ceil(8 / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, 8)}@test.com`,
    password: pass,
};

describe('UserComponent -> service ->', () => {
    it('signup', async () => {
        const testcred = userCreditionals;
        testcred.id_type = 'email';
        const res = await UserService.signup(userCreditionals);
        expect(res).to.be.an('object').and.to.have.property('_id');
    });
    it('info', async () => {
        const res = await UserService.info(userCreditionals.id);
        expect(res).to.be.an('object').and.to.have.property('id_type').and.to.be.equal('email');
    });
    it('hash', async () => {
        const res = await UserService.hash(userCreditionals.id);
        expect(res).to.be.an('object').and.to.have.property('password');
    });
});
