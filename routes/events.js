// routes/events.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to check if the user is a manager
function isManager(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Manager') {
        return next();
    } else {
        res.status(403).send('You do not have permission to perform this action.');
    }
}


// Create event route
router.post('/create', isManager, (req, res) => {
    const { name, location, description, organization_id, branch_id, date,upvote, downvote} = req.body;

    if (!name || !location || !description || !organization_id || !branch_id || !date) {
        return res.status(400).send('All fields are required');
    }

    db.query(
        'INSERT INTO Events (name, location, description, organization_id, branch_id, date, upvote, downvote) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, location, description, organization_id, branch_id, date, upvote, downvote],
        (err, results) => {
            if (err) {
                console.error('Error creating event:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('Event created successfully');
        }
    );
});

// Fetch all events route
router.get('/all', (req, res) => {
    db.query('SELECT * FROM Events', (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

module.exports = router;
