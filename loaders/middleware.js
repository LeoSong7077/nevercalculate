const flash = require('connect-flash'); 

module.exports = function (app) {
    app.use(require('cookie-parser')());
    app.use(require('express-session')({ secret: 'Hillstone!!', resave: false, saveUninitialized: false }));
    app.use(flash());
}