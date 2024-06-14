const express = require('express');
const nodemailer = require('nodemailer');
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

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: "mbtu uuro awya fvul"
    }
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

            // Fetch members who want to receive email notifications
            db.query(
                `SELECT Users.email FROM Users
                 JOIN UserOrganizations ON Users.id = UserOrganizations.user_id
                 JOIN EmailNotifications ON Users.id = EmailNotifications.user_id
                 WHERE UserOrganizations.organization_id = ? AND EmailNotifications.notification_type = 'updates'`,
                [organizationId],
                (err, members) => {
                    if (err) {
                        console.error('Error fetching members:', err);
                        return res.status(500).send('Internal server error');
                    }

                    // Send emails to members
                    const emailPromises = members.map(member => {
                        const mailOptions = {
                            from: process.env.EMAIL_USER,
                            to: member.email,
                            subject: `New Update: ${title}`,
                            text: description
                        };

                        return transporter.sendMail(mailOptions);
                    });

                    Promise.all(emailPromises)
                        .then(() => {
                            res.status(201).send('Update posted and emails sent successfully');
                        })
                        .catch(emailErr => {
                            console.error('Error sending emails:', emailErr);
                            res.status(500).send('Update posted but failed to send emails');
                        });
                }
            );
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
