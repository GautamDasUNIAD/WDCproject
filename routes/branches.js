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

// Middleware to check if the user is a manager for the specific organization
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

// Create branch route (restricted to managers of the organization)
router.post('/:organizationId/branches/create', isAuthenticated, isManagerForOrg, (req, res) => {
    const { organizationId } = req.params;
    const { location } = req.body;

    if (!location) {
        return res.status(400).send('Location is required');
    }

    db.query(
        'INSERT INTO Branches (location, organization_id) VALUES (?, ?)',
        [location, organizationId],
        (err, results) => {
            if (err) {
                console.error('Error creating branch:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('Branch created successfully');
        }
    );
});

// Fetch branches for a specific organization (restricted to managers of the organization)
router.get('/:organizationId/branches', isAuthenticated, isManagerForOrg, (req, res) => {
    const { organizationId } = req.params;

    db.query('SELECT * FROM Branches WHERE organization_id = ?', [organizationId], (err, results) => {
        if (err) {
            console.error('Error fetching branches:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

module.exports = router;