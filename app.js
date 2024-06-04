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
const branchRouter = require('./routes/branches');
const userBranchRouter = require('./routes/userbranches'); // interacting with the branches as a user
const userOrganizationRouter = require('./routes/userorganizations'); // interacting with the organizaitons as a user
const adminRouter = require('./routes/admin');
const userEventsRouter = require('./routes/userevents');
const updatesRouter = require('./routes/updates');

var dbConnectionPool = require('./db');

var app = express();

app.use(function(req, res, next){
    req.pool = dbConnectionPool;
    next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
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
app.use('/branches', branchRouter);
app.use('/userbranches', userBranchRouter);
app.use('/admin', adminRouter);
app.use('/userorganizations', userOrganizationRouter);
app.use('/userevents', userEventsRouter);
app.use('/updates', updatesRouter);

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
