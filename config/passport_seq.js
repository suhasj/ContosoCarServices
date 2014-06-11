var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('../models/user.js');
var Sequelize = require('sequelize');

module.exports = function(passport) {
    console.log('passport configured');
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('passport Serialize');
        done(null, {
            id: user.id,
            username: user.username,
            hometown: user.hometown
        });
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        console.log('passport Serialize');

        var users = UserModel.Setup();

        users.find({
            where: {
                id: user.id
            }
        }).success(function(user) {
            done(null, user);
        });

    });

    // Passport strategy to login users
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) { // callback with email and password from our form

            process.nextTick(function() {

                console.log('Logging user' + email);

                var users = UserModel.Setup();

                users.find({
                    where: {
                        email: email
                    }
                }).success(function(user) {
                    if (!user) {
                        return done(null, false);
                    } else {
                        if (UserModel.ComparePassword(password, user.password)) {
                            return done(null, user);
                        }
                        return done(null, false);
                    }
                    return user;
                }).error(function(err) {
                    return done(err);
                });

            });

        }));

}