const express = require('express');
const router = express.Router();
const db = require('../db');
const { param, body, validationResult } = require('express-validator');

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).send('You need to be logged in to perform this action.');
    }
}

// Middleware to check if the user is a manager
function isManager(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Manager') {
        return next();
    } else {
        res.status(403).send('You do not have permission to perform this action.');
    }
}

// Middleware to check if the manager belongs to the organization
function isManagerForOrg(req, res, next) {
    const userId = req.user.id;
    const { organizationId } = req.params;

    db.query(
        'SELECT * FROM OrganisationManagers WHERE manager_id = ? AND organization_id = ?',
        [userId, organizationId],
        (err, results) => {
            if (err) {
                console.error('Error checking manager association:', err);
                return res.status(500).send('Internal server error');
            }
            if (results.length === 0) {
                return res.status(403).send('You do not have permission to perform this action for this organization.');
            }
            next();
        }
    );
}

// Get user's organizations
router.get('/myorganizations', isAuthenticated, (req, res) => {
    const userId = req.user.id;

    db.query(
        `SELECT o.id, o.name FROM VolunteerOrganizations o
         JOIN UserOrganizations uo ON o.id = uo.organization_id
         WHERE uo.user_id = ?`,
        [userId],
        (err, results) => {
            if (err) {
                console.error('Error fetching user organizations:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

// Get events for an organization
router.get('/organization/:organizationId/events', isAuthenticated, [
    param('organizationId').isInt().withMessage('Organization ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { organizationId } = req.params;

    db.query(
        'SELECT * FROM Events WHERE branch_id IN (SELECT id FROM Branches WHERE organization_id = ?)',
        [organizationId],
        (err, results) => {
            if (err) {
                console.error('Error fetching events:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

// Get branches for an organization
router.get('/organization/:organizationId/branches', isAuthenticated, [
    param('organizationId').isInt().withMessage('Organization ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { organizationId } = req.params;

    db.query(
        'SELECT * FROM Branches WHERE organization_id = ?',
        [organizationId],
        (err, results) => {
            if (err) {
                console.error('Error fetching branches:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

// Get events for a branch
router.get('/branch/:branchId/events', isAuthenticated, [
    param('branchId').isInt().withMessage('Branch ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { branchId } = req.params;

    db.query(
        'SELECT * FROM Events WHERE branch_id = ?',
        [branchId],
        (err, results) => {
            if (err) {
                console.error('Error fetching branch events:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

// RSVP for an event
router.post('/rsvp', isAuthenticated, [
    body('eventId').isInt().withMessage('Event ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { eventId } = req.body;

    db.query(
        'INSERT INTO RSVP (user_id, event_id) VALUES (?, ?)',
        [userId, eventId],
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('You have already RSVP\'d for this event.');
                }
                console.error('Error RSVPing for event:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('Successfully RSVP\'d for the event');
        }
    );
});

// Get RSVPs for an event
router.get('/organization/:organizationId/branch/:branchId/event/:eventId/rsvps', isAuthenticated, isManager, isManagerForOrg, [
    param('organizationId').isInt().withMessage('Organization ID must be an integer'),
    param('branchId').isInt().withMessage('Branch ID must be an integer'),
    param('eventId').isInt().withMessage('Event ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { eventId } = req.params;

    db.query(
        `SELECT Users.id, Users.first_name, Users.last_name, Users.email
         FROM RSVP
         JOIN Users ON RSVP.user_id = Users.id
         WHERE RSVP.event_id = ?`,
        [eventId],
        (err, results) => {
            if (err) {
                console.error('Error fetching RSVPs:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

module.exports = router;
