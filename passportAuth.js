var express = require('express');
var app = express();
const fs = require('fs');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


app.use('/', express.static(__dirname + '/www'));
app.use(passport.initialize());



/////////// GOOGLE LOGIN
passport.use(new GoogleStrategy({
    clientID: "1008112784060-l5nqpjmb1d177tkjugl00upv0gk0rdth.apps.googleusercontent.com",
    clientSecret: "nRsoollVg_N0k3EiCQu1cWjw",
    callbackURL: "http://localhost:5000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("logged in");
            return done(null, profile);
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/index.html#/app/login'}),
    function(req, res) {
        res.redirect('http://localhost:5000/#/app/game');
    });



/////////// FACEBOOK LOGIN
passport.use(new FacebookStrategy({
        clientID: 1517975181838329,
        clientSecret: "c7dcea90211ffb1becb1ae665cb2b33c",
        callbackURL: "http://localhost:5000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("logged in");
        return done(null, profile);
    }
));
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {

        failureRedirect: '/index.html#/app/login'
    }),
    function(req, res) {
     res.redirect('http://localhost:5000/#/app/game');
    });



/////////// EMAIL & PASSWORD LOGIN
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd'
},
   function(username, password, done) {
    return done(null, user);
   }
));

app.post('/app.login',
passport.authenticate('local',
    {
        successRedirect:'/',
        failureRedirect: '/login',
        successFlash: 'Welcome!',
        failureFlash: true, message: 'Invalid username or password.',
        session: false
    }),
function(req, res){
    res.redirect('/users/' + req.user.username);
    res.json({
        id: req.user.id,
        username: req.user.username
    });
});

app.listen(5000, function(){
    console.log('App listening on port 5000...');
});