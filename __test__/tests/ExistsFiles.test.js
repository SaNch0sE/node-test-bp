const chai = require('chai');
const path = require('path');

// expect path
chai.use(require('chai-fs'));

const { expect } = chai;

describe('EXIST FILES', () => {
	it('CodeStyle', (done) => {
		expect(path.join(__dirname, '../../.eslintrc.json')).to.be.a.path();

		done();
	});
	it('Config variables', (done) => {
		expect(path.join(__dirname, '../../.env')).to.be.a.path();

		done();
	});
	it('GitIgnore', (done) => {
		expect(path.join(__dirname, '../../.gitignore')).to.be.a.path();

		done();
	});
	it('Node project setup', (done) => {
		expect(path.join(__dirname, '../../package.json')).to.be.a.path();

		done();
	});
});
