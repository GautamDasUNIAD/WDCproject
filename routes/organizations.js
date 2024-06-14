const express = require('express');
const router = express.Router();
const db = require('../db');
const { body, validationResult } = require('express-validator');

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Admin') {
        return next();
    }
    res.status(403).send('Permission denied');
}

// Get all organizations
router.get('/', (req, res) => {
    db.query('SELECT * FROM VolunteerOrganizations', (err, results) => {
        if (err) {
            console.error('Error fetching organizations:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Create a new organization
router.post('/', isAdmin, [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('description').trim().notEmpty().withMessage('Description is required').escape(),
    body('social_media_link').optional({ checkFalsy: true }).isURL().withMessage('Social media link must be a valid URL')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, social_media_link } = req.body;

    db.query('INSERT INTO VolunteerOrganizations (name, description, social_media_link) VALUES (?, ?, ?)',
    [name, description, social_media_link], (err) => {
        if (err) {
            console.error('Error creating organization:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(201).send('Organization created successfully');
    });
});

module.exports = router;
