const Joi = require('@hapi/joi');

const validate = {
    /**
     * @param {String} data.id - objectId
     * @returns
     * @memberof UserValidation
     */
    logout(data) {
        return Joi.object({
            all: Joi.bool(),
        })
            .validate(data);
    },

    /**
     * @param {String} profile.email
     * @param {String} profile.fullName
     * @returns
     * @memberof UserValidation
     */
    signUp(profile) {
        return Joi.object({
            id: Joi.alternatives([
                // Email
                Joi.string().email(),
                // Or phone number
                // Maximum leanth of 15 because: https://en.wikipedia.org/wiki/Telephone_numbering_plan#International_numbering_plan
                Joi.string().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/).min(5).max(15),
            ]).match('one'),
            password: Joi
                .string()
                .min(1)
                .max(30)
                .required(),
        })
            .validate(profile);
    },

    /**
     * @param {String} profile.email
     * @param {String} profile.fullName
     * @returns
     * @memberof UserValidation
     */
    signIn(profile) {
        return Joi.object({
            id: Joi.string()
                .min(1)
                .max(30)
                .required(),
            password: Joi
                .string()
                .min(1)
                .max(30)
                .required(),
        })
            .validate(profile);
    },
};

module.exports = validate;
