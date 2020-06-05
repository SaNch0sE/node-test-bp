const Validation = require('../validation');

/**
 * @exports
 * @class
 * @extends Validation
 */
class UserValidation extends Validation {
    /**
     * @param {String} data.id - objectId
     * @returns
     * @memberof UserValidation
     */
    logout(data) {
        return this.Joi
            .object({
                all: this.Joi.bool(),
            })
            .validate(data);
    }

    /**
     * @param {String} profile.email
     * @param {String} profile.fullName
     * @returns
     * @memberof UserValidation
     */
    signup(profile) {
        return this.Joi
            .object({
                id: this.Joi.alternatives([
                    // Email
                    this.Joi.string().email(),
                    // Or phone number
                    // Maximum leanth of 15 because: https://en.wikipedia.org/wiki/Telephone_numbering_plan#International_numbering_plan
                    this.Joi.string().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/).min(5).max(15),
                ]).match('one'),
                password: this.Joi
                    .string()
                    .min(1)
                    .max(30)
                    .required(),
            })
            .validate(profile);
    }

    /**
     * @param {String} profile.email
     * @param {String} profile.fullName
     * @returns
     * @memberof UserValidation
     */
    signin(profile) {
        return this.Joi
            .object({
                id: this.Joi.string()
                    .min(1)
                    .max(30)
                    .required(),
                password: this.Joi
                    .string()
                    .min(1)
                    .max(30)
                    .required(),
            })
            .validate(profile);
    }
}

module.exports = new UserValidation();
