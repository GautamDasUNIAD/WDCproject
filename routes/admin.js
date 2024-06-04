const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Admin') {
        return next();
    } else {
        res.status(403).send('You do not have permission to perform this action.');
    }
}

// Get all users with organization involvement for managers
router.get('/users', isAdmin, (req, res) => {
    const query = `
        SELECT Users.id, Users.first_name, Users.last_name, Users.email, Users.role,
        GROUP_CONCAT(VolunteerOrganizations.name SEPARATOR ', ') AS organizations
        FROM Users
        LEFT JOIN OrganisationManagers ON Users.id = OrganisationManagers.manager_id
        LEFT JOIN VolunteerOrganizations ON OrganisationManagers.organization_id = VolunteerOrganizations.id
        GROUP BY Users.id, Users.first_name, Users.last_name, Users.email, Users.role;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Add manager to organization
router.post('/organizations/:organizationId/managers', isAdmin, (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    db.query(
        'INSERT INTO OrganisationManagers (organization_id, manager_id) VALUES (?, ?)',
        [organizationId, userId],
        (err, results) => {
            if (err) {
                console.error('Error adding manager:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('Manager added successfully');
        }
    );
});

// Upgrade user role
router.post('/users/:userId/upgrade', isAdmin, (req, res) => {
    const { userId } = req.params;

    db.query(
        "UPDATE Users SET role = 'Manager' WHERE id = ?",
        [userId],
        (err, results) => {
            if (err) {
                console.error('Error upgrading user role:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(200).send('User role upgraded successfully');
        }
    );
});

module.exports = router;
