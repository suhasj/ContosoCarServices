var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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
            hometown: user.hometown,
            claims: user.userClaims
        });
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        console.log('passport Deserialize');

        if (!user.id) {
            done(null, user);
            return;
        }
        var userModels = UserModel.Setup();
        var users = userModels[0];

        users.find({
            where: {
                id: user.id
            },
            include: [{
                model: userModels[2]
            }, {
                model: userModels[1]
            }]
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

                var users = UserModel.Setup()[0];

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

    passport.use(new FacebookStrategy({

        clientID: '354209461309583',
        clientSecret: '1856b2f01b3f361c9b235e686923bb6b',
        callbackURL: 'http://localhost:3000/Account/Login/Facebook/callback',
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {

        process.nextTick(function() {

            console.log('Logging with Facebook');
            var userModels = UserModel.Setup();
            var userLogins = userModels[1];
            var users = userModels[0];

            var email = profile.emails[0].value;

            userLogins.find({
                where: {
                    providerkey: profile.id
                },
                include: [{
                    model: users
                }]
            }).success(function(userlogin) {
                if (!userlogin) {
                    UserModel.CreateWithLogin(email, profile._json.hometown.name, 'facebook', profile.id, function(newUser, err) {
                        return done(null, newUser);
                    });
                } else {
                    return done(null, userlogin.user);
                }
            }).error(function(err) {
                return done(err);
            })

        });
    }));

}