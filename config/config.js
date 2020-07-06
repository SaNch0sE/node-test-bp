const config = {
    /**
    * Name of database
    * @type {String}
    * @const
    */
    DB_NAME: process.env.DB_NAME,
    /**
    * Username for database
    * @type {String}
    * @const
    */
    DB_USER: process.env.DB_USER,
    /**
    * Password for database
    * @type {String}
    * @const
    */
    DB_PASSWORD: process.env.DB_PASSWORD,
    /**
    * Private key for tokens
    * @type {String}
    * @const
    */
    KEY: process.env.KEY,
    /**
    * Exparation time for jwt tokens
    * @type {Object}
    * @const
    */
    TIME: {
        access: '10m',
        refresh: '24h',
        cookieAcc: 10 * 60 * 1000,
        cookieRef: 24 * 60 * 60 * 1000,
    },
    /**
    * Port number
    * @type {Number}
    * @const
    */
    PORT: process.env.PORT || 3000,
    /**
    * Salt rounds for bcrypt generator
    * @type {Number}
    * @const
    */
    saltRounds: 10,
};

module.exports = config;
