var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('./utils/passport-config');
require('dotenv').config();



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const organizationRouter= require('./routes/organizations');
const eventRouter = require('./routes/events');

var dbConnectionPool = require('./db');

var app = express();

app.use(function(req, res, next){
    req.pool = dbConnectionPool;
    next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/organizations', organizationRouter);
app.use('/events', eventRouter);


// OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
});

module.exports = app;
