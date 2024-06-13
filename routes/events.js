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

function isUser(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.status(403).send('You do not have permission to perform this action.');
    }

}


// Create event route
router.post('/create', isManager, (req, res) => {
    const { name, location, description, organization_id, branch_id, date, upvote, downvote} = req.body;

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

// Fetch events by org id
router.get('/organization/:id', (req, res) => {
    const organizationId = req.params.id;

    db.query('SELECT * FROM Events WHERE organization_id = ?', [organizationId], (err, results) => {
        if (err) {
            console.error('Error fetching events for organization:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Update upvote/downvote route
router.post('/:eventId/vote', isUser, (req, res) => {
    const eventId = req.params.eventId;
    const { type, value } = req.body;

    if (!['upvote', 'downvote'].includes(type) || !Number.isInteger(value)) {
        return res.status(400).send('Invalid vote type or value');
    }

    const column = type === 'upvote' ? 'upvote' : 'downvote';
    const query = `UPDATE Events SET ${column} = ${column} + ? WHERE id = ?`;

    db.query(query, [value, eventId], (err, results) => {
        if (err) {
            console.error(`Error updating ${type}:`, err);
            return res.status(500).send('Internal server error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Event not found');
        }
        res.status(200).send(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
    });
});



module.exports = router;
