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
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log('passport Serialize');

        var users = UserModel.Setup();

        users.find({
            where: {
                id: id
            }
        }).success(function(user) {
            done(null, user);
        });

    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.FindByEmail(email, password, function(err, user) {
                    if (user) {
                        return done(null, false);
                    } else if (err) {
                        return done(null, err);
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));

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