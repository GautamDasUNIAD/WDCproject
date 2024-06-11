var express = require('express');
var router = express.Router();
var path = require('path');


// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.get('/', function(req, res, next) {
//   res.sendFile(path.join(__dirname, '../public', 'home.html'));
// });

// router.get('/home', function(req, res, next) {
//   res.sendFile(path.join(__dirname, '../public', 'home.html'));
// });

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

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'Admin') {
      return next();
  } else {
      res.status(403).send('You do not have permission to perform this action.');
  }
}

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

router.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'calendar.html'));
});

router.get('/branches', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'branches.html'));
});

router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'contact.html'));
});

router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'about.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'signup.html'));
});

router.get('/events', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'events.html'));
});

// Admin dashboard
router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

// Manager dashboard
router.get('/management', isAuthenticated, isManager, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'management.html'));
});

router.get('/create-branch', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'create-branch.html'));
});

router.get('/create-event', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'create-event.html'));
});

router.get('/join-organization', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'join-organization.html'));
});
router.get('/managers', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'managers.html'));
});

router.get('/post-update', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'post-update.html'));
});

router.get('/preferences', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'preferences.html'));
});

router.get('/view-branch-users', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'view-branch-users.html'));
});

router.get('/view-branches', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'view-branches.html'));
});

router.get('/view-events', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'view-events.html'));
});

router.get('/view-join-branches', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'view-join-branches.html'));
});

router.get('/view-organization-users', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'view-organization-users.html'));
});

router.get('/view-rsvps', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'view-rsvps.html'));
});

router.get('/view-updates', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'view-updates.html'));
});





module.exports = router;
