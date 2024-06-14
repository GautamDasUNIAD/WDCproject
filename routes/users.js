const express = require('express');
const router = express.Router();
const passport = require('passport');
const { hashPassword } = require('../utils/password');
const { body, validationResult } = require('express-validator');

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).send('You need to be logged in to perform this action.');
    }
}

const VALID_ROLES = ['Regular', 'Manager', 'Admin'];

// Check if user is authenticated
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

// Register user
router.post('/register', [
    body('first_name').trim().isLength({ min: 1 }).withMessage('First name is required').escape(),
    body('last_name').trim().isLength({ min: 1 }).withMessage('Last name is required').escape(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters'),
    body('role').isIn(VALID_ROLES).withMessage(`Role must be one of: ${VALID_ROLES.join(', ')}`),
    body('social_media_linked').isBoolean().withMessage('Social media linked must be a boolean').toBoolean()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, password, role, social_media_linked } = req.body;

    try {
        const hashedPassword = hashPassword(password);
        req.pool.query('INSERT INTO Users (first_name, last_name, email, password, role, social_media_linked) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, role, social_media_linked], (err, results) => {
                if (err) {
                    console.error('Error creating user:', err);
                    return res.status(500).send('Error creating user');
                }
                res.status(201).json({ id: results.insertId, first_name, last_name, email, role, social_media_linked });
            });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).send('Internal server error');
    }
});

// Login user
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json(info.message);
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/users/return-cookies'); // Redirect to the homepage or handle it as needed
        });
    })(req, res, next);
});

// Return cookies
router.get('/return-cookies', isAuthenticated, (req, res) => {
    res.cookie('email', req.user.email);
    res.cookie('first_name', req.user.first_name);
    res.cookie('last_name', req.user.last_name);
    res.cookie('role', req.user.role);
    res.cookie('id', req.user.id);
    res.redirect('/');
});

// Logout user
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie('email');
        res.clearCookie('first_name');
        res.clearCookie('last_name');
        res.clearCookie('role');
        res.clearCookie('id');
        res.redirect('/');
    });
});

module.exports = router;
