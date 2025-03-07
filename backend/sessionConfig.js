const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('../db');

const sessionStore = new pgSession({
    pool: pool,
    tableName: 'session',
});

const sessionConfig = {
    store: sessionStore,
    secret: 'djfjdsjsk',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 180 * 60 * 1000,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    },
};

module.exports = sessionConfig;
