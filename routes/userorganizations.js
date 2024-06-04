const express = require('express');
const router = express.Router();
const db = require('../db');

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
router.get('/search', isAuthenticated, (req, res) => {
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
router.get('/check', isAuthenticated, (req, res) => {
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

// Join organization route
router.post('/join', isAuthenticated, (req, res) => {
    const userId = req.user.id;
    const { organization_id } = req.body;

    if (!organization_id) {
        return res.status(400).send('Organization ID is required');
    }

    db.query(
        'INSERT INTO UserOrganizations (user_id, organization_id) VALUES (?, ?)',
        [userId, organization_id],
        (err, results) => {
            if (err) {
                console.error('Error joining organization:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('Successfully joined the organization');
        }
    );
});

// Leave organization route
router.post('/leave', isAuthenticated, (req, res) => {
    const userId = req.user.id;
    const { organization_id } = req.body;

    if (!organization_id) {
        return res.status(400).send('Organization ID is required');
    }

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

// Get users in an organization
router.get('/organization/:organizationId/users', isAuthenticated, isManager, isManagerForOrg, (req, res) => {
    const { organizationId } = req.params;

    db.query(
        `SELECT Users.id, Users.first_name, Users.last_name, Users.email
         FROM Users
         JOIN UserOrganizations ON Users.id = UserOrganizations.user_id
         WHERE UserOrganizations.organization_id = ?`,
        [organizationId],
        (err, results) => {
            if (err) {
                console.error('Error fetching users in organization:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

module.exports = router;
