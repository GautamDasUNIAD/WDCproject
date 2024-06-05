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

// Get organizations for a manager
router.get('/manager/organizations', isAuthenticated, isManager, (req, res) => {
    const userId = req.user.id;

    db.query(
        `SELECT o.id, o.name FROM VolunteerOrganizations o
         JOIN OrganisationManagers om ON o.id = om.organization_id
         WHERE om.manager_id = ?`,
        [userId],
        (err, results) => {
            if (err) {
                console.error('Error fetching manager organizations:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

// Post an update
router.post('/organization/:organizationId/updates', isAuthenticated, isManager, isManagerForOrg, (req, res) => {
    const { organizationId } = req.params;
    const { title, description, is_private } = req.body;
    const date = new Date();

    db.query(
        'INSERT INTO Updates (organization_id, title, description, is_private, date) VALUES (?, ?, ?, ?, ?)',
        [organizationId, title, description, is_private ? 1 : 0, date],
        (err, results) => {
            if (err) {
                console.error('Error posting update:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('Update posted successfully');
        }
    );
});

// Get public updates
router.get('/organization/:organizationId/updates/public', (req, res) => {
    const { organizationId } = req.params;

    db.query(
        'SELECT * FROM Updates WHERE organization_id = ? AND is_private = FALSE',
        [organizationId],
        (err, results) => {
            if (err) {
                console.error('Error fetching public updates:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

// Get member-only updates
router.get('/organization/:organizationId/updates/member', isAuthenticated, (req, res) => {
    const userId = req.user.id;
    const { organizationId } = req.params;

    db.query(
        `SELECT * FROM Updates
         WHERE organization_id = ?
         AND is_private = TRUE
         AND EXISTS (SELECT 1 FROM UserOrganizations WHERE user_id = ? AND organization_id = ?)`,
        [organizationId, userId, organizationId],
        (err, results) => {
            if (err) {
                console.error('Error fetching member-only updates:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

module.exports = router;
