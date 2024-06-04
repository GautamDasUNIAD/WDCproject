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
router.get('/organization/:organizationId/events', isAuthenticated, (req, res) => {
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
router.get('/organization/:organizationId/branches', isAuthenticated, (req, res) => {
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
router.get('/branch/:branchId/events', isAuthenticated, (req, res) => {
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

module.exports = router;
