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

// Get user preferences
router.get('/preferences', isAuthenticated, (req, res) => {
    const userId = req.user.id;

    db.query(
        'SELECT * FROM EmailNotifications WHERE user_id = ?',
        [userId],
        (err, results) => {
            if (err) {
                console.error('Error fetching user preferences:', err);
                return res.status(500).send('Internal server error');
            }
            res.json(results);
        }
    );
});

// Update user preferences
router.post('/preferences', isAuthenticated, (req, res) => {
    const userId = req.user.id;
    const { organizationId, notificationType, enabled } = req.body;
    console.log("notification type" , notificationType);
    if (enabled) {
        db.query(
            'INSERT INTO EmailNotifications (user_id, organization_id, notification_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE notification_type = ?',
            [userId, organizationId, notificationType, notificationType],
            (err, results) => {
                if (err) {
                    console.error('Error updating preferences:', err);
                    return res.status(500).send('Internal server error');
                }
                res.status(200).send('Preferences updated successfully');
            }
        );
    } else {
        db.query(
            'DELETE FROM EmailNotifications WHERE user_id = ? AND organization_id = ? AND notification_type = ?',
            [userId, organizationId, notificationType],
            (err, results) => {
                if (err) {
                    console.error('Error updating preferences:', err);
                    return res.status(500).send('Internal server error');
                }
                res.status(200).send('Preferences updated successfully');
            }
        );
    }
});

// Get organizations for a user
router.get('/organizations', isAuthenticated, (req, res) => {
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

module.exports = router;
