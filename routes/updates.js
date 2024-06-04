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

// Post an update
router.post('/organization/:organizationId/updates', isAuthenticated, isManager, isManagerForOrg, (req, res) => {
    const { organizationId } = req.params;
    const { title, content, isPublic } = req.body;

    db.query(
        'INSERT INTO Updates (organization_id, title, content, is_public) VALUES (?, ?, ?, ?)',
        [organizationId, title, content, isPublic],
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
        'SELECT * FROM Updates WHERE organization_id = ? AND is_public = TRUE',
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
        'SELECT * FROM Updates WHERE organization_id = ? AND is_public = FALSE AND EXISTS (SELECT 1 FROM UserOrganizations WHERE user_id = ? AND organization_id = ?)',
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
