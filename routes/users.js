var express = require('express');
var router = express.Router();
const { hashPassword, checkPassword } = require('../utils/password');


const VALID_ROLES = ['Regular', 'Manager', 'Admin'];
/* GET users listing. */
//! remove
router.get('/', function(req, res, next) {
  req.pool.query('SELECT * FROM Users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Error fetching users');
    } else {
      res.json(results);
    }
  });
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
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  req.pool.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Error fetching user');
    } else {
      if (results.length > 0) {
        const user = results[0];
        const isMatch = checkPassword(password, user.password);
        if (isMatch) {
          res.status(200).send('Login successful');
        } else {
          res.status(401).send('Invalid email or password');
        }
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

module.exports = router;
