const express = require('express');
const router = express.Router();
const db = require('../db');
const { body, param, validationResult } = require('express-validator');

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

// Join branch route
router.post('/join', isAuthenticated, [
    body('branch_id').isInt().withMessage('Branch ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { branch_id } = req.body;

    db.query(
        'INSERT INTO UserBranches (user_id, branch_id) VALUES (?, ?)',
        [userId, branch_id],
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send('User already joined this branch');
                }
                console.error('Error joining branch:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('Successfully joined the branch');
        }
    );
});

// Fetch all branches route for authenticated users
router.get('/branches', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM Branches', (err, results) => {
        if (err) {
            console.error('Error fetching branches:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Create branch route (restricted to managers of the organization)
router.post('/:organizationId/branches/create', isAuthenticated, isManagerForOrg, [
    param('organizationId').isInt().withMessage('Organization ID must be an integer'),
    body('location').trim().notEmpty().withMessage('Location is required').escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { organizationId } = req.params;
    const { location } = req.body;

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
router.get('/:organizationId/branches', isAuthenticated, isManagerForOrg, [
    param('organizationId').isInt().withMessage('Organization ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { organizationId } = req.params;

    db.query('SELECT * FROM Branches WHERE organization_id = ?', [organizationId], (err, results) => {
        if (err) {
            console.error('Error fetching branches:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Fetch users who have joined a specific branch (restricted to managers of the organization)
router.get('/:organizationId/branch/:branchId/users', isAuthenticated, isManagerForOrg, [
    param('organizationId').isInt().withMessage('Organization ID must be an integer'),
    param('branchId').isInt().withMessage('Branch ID must be an integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { branchId } = req.params;

    db.query(
        `SELECT Users.id, Users.first_name, Users.last_name, Users.email
         FROM UserBranches
         JOIN Users ON UserBranches.user_id = Users.id
         WHERE UserBranches.branch_id = ?`,
        [branchId],
        (err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

module.exports = router;
