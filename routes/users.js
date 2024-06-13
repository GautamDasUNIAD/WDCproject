var express = require('express');
var router = express.Router();
const passport = require('passport');
const { hashPassword, checkPassword } = require('../utils/password');

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.status(401).send('You need to be logged in to perform this action.');
  }
}

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
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log('from route', info);
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('Login failed:', info.message);
      return res.status(401).json(info.message);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log('Hurray, login successful!');
      return res.redirect('/'); // Redirect to the homepage or handle it as needed
    });
  })(req, res, next);
});


router.get('/return-cookies', isAuthenticated, function(req, res, next) {
  res.cookie('email', req.user.email);
  res.cookie('first_name', req.user.first_name);
  res.cookie('last_name', req.user.last_name);
  res.cookie('role', req.user.role);
  res.redirect('/');
});

// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) { return res.status(500).json({ message: 'Internal server error' }); }
//     if (!user) { return res.status(401).json({ message: 'Invalid email or password' }); }

//     req.logIn(user, (err) => {
//       if (err) { return res.status(500).json({ message: 'Login failed' }); }

//       // Set cookies here or in a separate endpoint
//       res.cookie('email', user.email, { httpOnly: true, secure: true, sameSite: 'Strict' });
//       res.cookie('first_name', user.first_name, { httpOnly: true, secure: true, sameSite: 'Strict' });
//       res.cookie('last_name', user.last_name, { httpOnly: true, secure: true, sameSite: 'Strict' });
//       res.cookie('role', user.role, { httpOnly: true, secure: true, sameSite: 'Strict' });

//       return res.status(200).json({ message: 'Login successful' });
//     });
//   })(req, res, next);
// });

// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//       if (err) {
//           return res.status(500).json({ message: 'Internal server error' });
//       }
//       if (!user) {
//           return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       // Manually validate the password
//       user.comparePassword(req.body.password, (err, isMatch) => {
//           if (err) {
//               return res.status(500).json({ message: 'Error comparing passwords' });
//           }
//           if (!isMatch) {
//               return res.status(401).json({ message: 'Invalid email or password' });
//           }

//           // Password is correct, log in the user
//           req.logIn(user, (err) => {
//               if (err) {
//                   return res.status(500).json({ message: 'Login failed' });
//               }

//               // Set cookies here or in a separate endpoint
//               res.cookie('email', req.user.email, { httpOnly: true, secure: true, sameSite: 'Strict' });
//               res.cookie('first_name', req.user.first_name, { httpOnly: true, secure: true, sameSite: 'Strict' });
//               res.cookie('last_name', req.user.last_name, { httpOnly: true, secure: true, sameSite: 'Strict' });
//               res.cookie('role', req.user.role, { httpOnly: true, secure: true, sameSite: 'Strict' });

//               return res.status(200).json({ message: 'Login successful' });
//           });
//       });
//   })(req, res, next);
// });



router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.clearCookie('email');
      res.clearCookie('first_name');
      res.clearCookie('last_name');
      res.clearCookie('role');
      res.redirect("/");
  });
});

module.exports = router;
