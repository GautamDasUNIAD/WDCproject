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

// Join branch route
router.post('/join', isAuthenticated, (req, res) => {
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

// Middleware to check if the user is a manager
function isManager(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Manager') {
        return next();
    } else {
        res.status(403).send('You do not have permission to perform this action.');
    }
}

// Fetch users who have joined a specific branch
router.get('/branch/:branchId/users', isManager, (req, res) => {
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
