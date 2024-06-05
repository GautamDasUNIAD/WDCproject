var express = require('express');
var router = express.Router();
const passport = require('passport');
const { hashPassword, checkPassword } = require('../utils/password');


const VALID_ROLES = ['Regular', 'Manager', 'Admin'];
/* GET users listing. */
//! remove
router.get('/', function(req, res, next) {

  if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }

});

router.post('/register', (req, res) => {
  const { first_name, last_name, email, password, role, social_media_linked } = req.body;

  // Validate password length
  if (password.length < 8 || password.length > 64) {
    return res.status(400).send('Password must be between 8 and 64 characters');
  }

  // Validate role
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).send(`Role must be one of: ${VALID_ROLES.join(', ')}`);
  }

  try {
    const hashedPassword = hashPassword(password);
    req.pool.query('INSERT INTO Users (first_name, last_name, email, password, role, social_media_linked) VALUES (?, ?, ?, ?, ?, ?)',
    [first_name, last_name, email, hashedPassword, role, social_media_linked], (err, results) => {
      if (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Error creating user');
      } else {
        res.status(201).json({ id: results.insertId, first_name, last_name, email, role, social_media_linked });
      }
    });
  } catch (err) {
    console.error('Error hashing password:', err);
    res.status(500).send('Internal server error');
  }
});

// Login user
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true // Enable flash messages
}));

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
  });
});

module.exports = router;
