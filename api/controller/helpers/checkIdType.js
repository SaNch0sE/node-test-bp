module.exports = (id) => {
	const regx = RegExp(/([+]+[0-9]+)/);
	let idType;
	if (regx.test(id)) {
		idType = 'number';
	} else {
		idType = 'email';
	}
	return idType;
};
