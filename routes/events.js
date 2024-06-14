const express = require('express');
const router = express.Router();
const db = require('../db');
const { param, body, validationResult } = require('express-validator');

// Middleware to check if the user is a manager
function isManager(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Manager') {
        return next();
    } else {
        res.status(403).send('You do not have permission to perform this action.');
    }
}

function isUser(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(403).send('You do not have permission to perform this action.');
    }
}

// Create event route
router.post('/create', isManager, [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('location').trim().notEmpty().withMessage('Location is required').escape(),
    body('description').trim().notEmpty().withMessage('Description is required').escape(),
    body('organization_id').isInt().withMessage('Organization ID must be an integer'),
    body('branch_id').isInt().withMessage('Branch ID must be an integer'),
    body('date').isISO8601().toDate().withMessage('Date must be a valid ISO 8601 date'),
    body('upvote').optional().isInt().withMessage('Upvote must be an integer'),
    body('downvote').optional().isInt().withMessage('Downvote must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, location, description, organization_id, branch_id, date, upvote = 0, downvote = 0 } = req.body;

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

// Fetch events for a specific organization route
router.get('/organization/:id', [
    param('id').isInt().withMessage('Organization ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const organizationId = req.params.id;

    db.query('SELECT * FROM Events WHERE organization_id = ? ORDER BY date ASC', [organizationId], (err, results) => {
        if (err) {
            console.error('Error fetching events for organization:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Update upvote/downvote route
router.post('/:eventId/vote', isUser, [
    param('eventId').isInt().withMessage('Event ID must be an integer'),
    body('type').isIn(['upvote', 'downvote']).withMessage('Invalid vote type'),
    body('value').isInt().withMessage('Vote value must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const eventId = req.params.eventId;
    const { type, value } = req.body;

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
