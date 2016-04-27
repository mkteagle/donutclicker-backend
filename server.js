var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/donutclicker';
// var url = 'mongodb://mkteagle:Password01@ds013221.mlab.com:13221/donutclicker';
app.use('/', express.static(__dirname + '/www'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/api', router);
var port = (process.env.PORT || 3000);
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
var user = {};

/////////// GOOGLE LOGIN


/////////// FACEBOOK LOGIN
passport.use(new FacebookStrategy({
        clientID: 1517975181838329,
        clientSecret: "c7dcea90211ffb1becb1ae665cb2b33c",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email', 'picture.type(large)']
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("logged in");
        console.log(profile);
        user = {
            id: profile._json.id,
            name: profile._json.name,
            picture: JSON.stringify(profile.photos[0].value)
        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            insertPlayer(db,  user, function () {
                db.close();
            })
        });
        console.log(user);
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
        res.redirect('http://localhost:3000/#/app/game');
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
function insertPlayer(db, user, callback ) {
    db.collection('users').insertOne(user, function(err, result) {
        assert.equal(err, null);
        console.log('Inserted a document into the users collection');
        callback();
    })
}
router.route('/addPlayer')
    .post(function(req, res) {
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            insertPlayer(db,  req.body, function () {
                db.close();
                res.end();
            })
        })
    });

app.listen(port, function() {
  console.log(`App listening on port ${port}...`);
});
