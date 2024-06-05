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


module.exports = router;
