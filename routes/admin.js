const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAdmin } = require('./auth-middleware'); // Correct path to where isAdmin is defined
const { param, body, validationResult } = require('express-validator');

// Example usage of isAdmin
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
router.post('/organizations/:organizationId/managers', isAdmin, [
    param('organizationId').isInt().withMessage('Organization ID must be an integer'), // Validates that organizationId is an integer
    body('userId').isInt().withMessage('User ID must be an integer') // Validates that userId is an integer
], (req, res) => {
    const errors = validationResult(req); // Checks for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Returns errors if validation fails
    }

    const { userId } = req.body;
    const { organizationId } = req.params;
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
router.post('/users/:userId/upgrade', isAdmin, [
    param('userId').isInt().withMessage('User ID must be an integer') // Validates that userId is an integer
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Returns errors if validation fails
    }

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
