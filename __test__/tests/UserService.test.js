const chai = require('chai');
const bcrypt = require('bcrypt');
const Service = require('../../api/model/services');

const { expect } = chai;

const password = bcrypt.hashSync(`${new Date().getTime()}_Password`, 1).slice(0, 8);
const id = `${bcrypt.hashSync('User_ID', 1).slice(0, 8)}@test.com`;
const userCreditionals = {
	id,
	password,
};

describe('UserComponent -> service ->', () => {
	it('signup', async () => {
		const testcred = userCreditionals;
		testcred.id_type = 'email';
		const res = await Service.signup(userCreditionals);
		expect(res).to.be.an('object').and.to.have.property('_id');
	});
	it('info', async () => {
		const res = await Service.info(userCreditionals.id);
		expect(res).to.be.an('object').and.to.have.property('id_type').and.to.be.equal('email');
	});
	it('hash', async () => {
		const res = await Service.hash(userCreditionals.id);
		expect(res).to.be.an('object').and.to.have.property('password');
	});
});
