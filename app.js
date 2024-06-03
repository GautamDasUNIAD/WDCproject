var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
const bcrypt = require('bcrypt');
require('dotenv').config();



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'volunteer_db'
});

var app = express();

app.use(function(req, res, next){
    req.pool = dbConnectionPool;
    next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
