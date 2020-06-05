const { Schema } = require('mongoose');
const connections = require('../../config/connection');

const UserSchema = new Schema(
    {
        id: {
            type: String,
            trim: true,
        },
        id_type: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        refresh: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'users',
        versionKey: false,
    },
);

module.exports = connections.model('UserModel', UserSchema);
