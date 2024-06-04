const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to check if the user is a manager
function isManager(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Manager') {
        return next();
    } else {
        res.status(403).send('You do not have permission to perform this action.');
    }
}

// Create branch route
router.post('/create', isManager, (req, res) => {
    const { location, organization_id } = req.body;

    if (!location || !organization_id) {
        return res.status(400).send('Location and Organization ID are required');
    }

    db.query(
        'INSERT INTO Branches (location, organization_id) VALUES (?, ?)',
        [location, organization_id],
        (err, results) => {
            if (err) {
                console.error('Error creating branch:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('Branch created successfully');
        }
    );
});

// Fetch all branches route
router.get('/all', (req, res) => {
    db.query('SELECT * FROM Branches', (err, results) => {
        if (err) {
            console.error('Error fetching branches:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Join branch route
router.post('/join', (req, res) => {
    const userId = req.user.id; // Assuming the user is authenticated and user info is stored in req.user
    const { branch_id } = req.body;

    if (!branch_id) {
        return res.status(400).send('Branch ID is required');
    }

    db.query(
        'INSERT INTO UserBranches (user_id, branch_id) VALUES (?, ?)',
        [userId, branch_id],
        (err, results) => {
            if (err) {
                console.error('Error joining branch:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('Successfully joined the branch');
        }
    );
});

module.exports = router;
