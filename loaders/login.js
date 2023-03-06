const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const CustomStrategy = require('passport-custom').Strategy;
const User = require('../models/User');

const doAsync = require('../modules/function/doAsync');

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
            usernameField: 'userid',
            passwordField: 'password',
            session: true,
            passReqToCallback: true,
        },
        async function(request, username, password, done) {
            User.findOne({ userid: username }, async function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, {message:'아이디 또는 비밀번호가 일치하지 않습니다.'}); }
                user.verifyPassword(password, function(err2, isMatch) {
                    if (err2) return console.log('verifyPassword Error');
                    if (!isMatch) return done(null, false, {message:'아이디 또는 비밀번호가 일치하지 않습니다.'});
                    done(null, user);
                });
            });
        }
    ));

    // passport.use(new CustomStrategy(
    //     function(request, done) {
    //         const registerSession = request.session.register;
    //         if (!registerSession) return done(null, false, {message:'googleAuthFail'});
    //         User.findOne({ gmail:registerSession.gmail, isGmailRegister:true }, function (err, user) {
    //             if (err) { return done(err); }
    //             if (!user) { return done(null, false, {message:'googleAuthFail'}); }
    //             done(null, user);
    //         });
    //     }
    // ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
        // done(null, user);
    });
}