// passport-config.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../db'); // Import the pool from db.js
const axios = require('axios');
const bcrypt = require('bcrypt');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM Users WHERE id = ?', [id], (err, results) => {
        if (err) {
            return done(err);
        }
        done(null, results[0]);
    });
});

// Local Strategy for regular login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    db.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
        if (err) return done(err);
        if (results.length === 0) return done(null, false, { message: 'Incorrect email or password.' });

        const user = results[0];
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Incorrect email or password.' });

        return done(null, user);
    });
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (token, tokenSecret, profile, done) => {
    // Find or create user in your database
    const email = profile.emails[0].value;
    db.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return done(err);
        }
        if (results.length > 0) {
            return done(null, results[0]);
        } else {
            const newUser = {
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: email,
                password: null,
                role: 'Regular',
                social_media_linked: true
            };
            db.query('INSERT INTO Users SET ?', newUser, (err, results) => {
                if (err) {
                    return done(err);
                }
                newUser.id = results.insertId;
                return done(null, newUser);
            });
        }
    });
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    let email = null;

    const getEmail = () => {
        if (profile.emails && profile.emails.length > 0) {
            return Promise.resolve(profile.emails[0].value);
        } else {
            return axios.get('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `token ${accessToken}`
                }
            }).then(response => {
                const emails = response.data;
                return emails.find(e => e.primary).email;
            }).catch(error => {
                throw error;
            });
        }
    };

    getEmail().then(email => {
        db.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
            console.log(profile);
            if (err) {
                return done(err);
            }
            if (results.length > 0) {
                return done(null, results[0]);
            } else {
                var fn = profile.displayName;
                if (fn === null){
                    fn = profile.username;
                }

                const newUser = {
                    first_name: fn,
                    last_name: '',
                    email: email,
                    password: null, // Set password to NULL for OAuth users
                    role: 'Regular',
                    social_media_linked: true
                };
                db.query('INSERT INTO Users SET ?', newUser, (err, results) => {
                    if (err) {
                        return done(err);
                    }
                    newUser.id = results.insertId;
                    return done(null, newUser);
                });
            }
        });
    }).catch(err => done(err));
}));

module.exports = passport;
