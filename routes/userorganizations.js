const express = require('express');
const router = express.Router();
const db = require('../db');
const { param, body, query, validationResult } = require('express-validator');

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

// Search organizations route
router.get('/search', isAuthenticated, [
    query('query').trim().isLength({ min: 1 }).withMessage('Query is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { query } = req.query;

    db.query(
        'SELECT * FROM VolunteerOrganizations WHERE name LIKE ?',
        [`%${query}%`],
        (err, results) => {
            if (err) {
                console.error('Error searching organizations:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

// Check if user has joined organization
router.get('/check', isAuthenticated, [
    query('organization_id').isInt().withMessage('Organization ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { organization_id } = req.query;

    db.query(
        'SELECT * FROM UserOrganizations WHERE user_id = ? AND organization_id = ?',
        [userId, organization_id],
        (err, results) => {
            if (err) {
                console.error('Error checking organization membership:', err);
                return res.status(500).send('Internal server error');
            }
            res.json({ joined: results.length > 0 });
        }
    );
});

// Check if the user is a member of an organization
router.get('/isMember/:organizationId', isAuthenticated, [
    param('organizationId').isInt().withMessage('Organization ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { organizationId } = req.params;

    db.query(
        'SELECT * FROM UserOrganizations WHERE user_id = ? AND organization_id = ?',
        [userId, organizationId],
        (err, results) => {
            if (err) {
                console.error('Error checking membership:', err);
                return res.status(500).send('Internal server error');
            }
            if (results.length > 0) {
                res.json({ isMember: true });
            } else {
                res.json({ isMember: false });
            }
        }
    );
});

// Join organization route
router.post('/join', isAuthenticated, [
    body('organization_id').isInt().withMessage('Organization ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { organization_id } = req.body;

    db.query(
        'INSERT INTO UserOrganizations (user_id, organization_id) VALUES (?, ?)',
        [userId, organization_id],
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send('User already a member of the organization');
                } else {
                    console.error('Error joining organization:', err);
                    return res.status(500).send('Internal server error');
                }
            }
            res.status(201).send('Successfully joined the organization');
        }
    );
});

// Leave organization route
router.post('/leave', isAuthenticated, [
    body('organization_id').isInt().withMessage('Organization ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { organization_id } = req.body;

    db.query(
        'DELETE FROM UserOrganizations WHERE user_id = ? AND organization_id = ?',
        [userId, organization_id],
        (err, results) => {
            if (err) {
                console.error('Error leaving organization:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(200).send('Successfully left the organization');
        }
    );
});

// Get all users in an organization
router.get('/organization/:organizationId/users', isAuthenticated, isManager, isManagerForOrg, [
    param('organizationId').isInt().withMessage('Organization ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { organizationId } = req.params;

    db.query(
        `SELECT Users.id, Users.first_name, Users.last_name, Users.email, Users.role, UserOrganizations.created_at
         FROM Users
         JOIN UserOrganizations ON Users.id = UserOrganizations.user_id
         WHERE UserOrganizations.organization_id = ?`,
        [organizationId],
        (err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

// Remove a user from an organization
router.delete('/organization/:organizationId/user/:userId', isAuthenticated, isManager, isManagerForOrg, [
    param('organizationId').isInt().withMessage('Organization ID must be an integer'),
    param('userId').isInt().withMessage('User ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { organizationId, userId } = req.params;

    db.query(
        'DELETE FROM UserOrganizations WHERE user_id = ? AND organization_id = ?',
        [userId, organizationId],
        (err, results) => {
            if (err) {
                console.error('Error removing user:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(200).send('User removed from the organization successfully');
        }
    );
});

module.exports = router;
