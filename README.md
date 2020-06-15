# REST API server with bearer token auth.
Database type - mongodb (mongodb Atlas).<br>
DotEnv (`.env` file) config:
- <b>KEY</b> - Public key for jwt signing;
- <b>DB_USER</b> - Database password.
- <b>DB_PASSWORD</b> - Database password.
- <b>PORT</b> - Custom port, default is 3000.

API (JSON):
- /signup [POST] - request for bearer token by id and password;
- /signup [POST] - creation of new user;
	- Fields id and password. Id - phone number or email. After signup add field `id_type` - phone or email;
	- In case of successful signup - return token;
- /info [GET] - returns user id and id type;
- /latency [GET] - returns service server latency for google.com;
	- true - removes all users bearer tokens;
	- false - removes only current token.