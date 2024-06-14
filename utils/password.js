// utils/password.js
require('dotenv').config();
const bcrypt = require('bcrypt');

function hashPassword(password) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
}

function checkPassword(password, hashedPassword) {
    try {
        const isMatch = bcrypt.compareSync(password, hashedPassword);
        return isMatch;
    } catch (err) {
        console.error('Error checking password:', err);
        throw err;
    }
}

module.exports = { hashPassword, checkPassword };
