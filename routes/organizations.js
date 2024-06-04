const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Admin') {
        return next();
    }
    res.status(403).send('Permission denied');
}

// Get all organizations
router.get('/', isAdmin, (req, res) => {
    db.query('SELECT * FROM VolunteerOrganizations', (err, results) => {
        if (err) {
            console.error('Error fetching organizations:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Create a new organization
router.post('/', isAdmin, (req, res) => {
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