var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// var url = 'mongodb://localhost:27017/donutclicker';
var url = 'mongodb://mkteagle:Password01@ds013221.mlab.com:13221/donutclicker';
app.use('/', express.static(__dirname + '/www'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session(
    {   secret: 'pickleJuice',
        resave: false,
        saveUninitialized: true
    }
));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', router);
var port = (process.env.PORT || 3000);
/////////// GOOGLE LOGIN
passport.use(new GoogleStrategy({
        clientID: "829492191243-v8ft9f21p29flncurno9h3hgnsealst4.apps.googleusercontent.com",
        clientSecret: "oxzGcR_ic7p3R49XRwPxM79f",
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        console.log("logged in");
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            checkforDuplicates(db, profile.id, function (foundUser, user) {
                if (!foundUser) {
                    user = {
                        _id: profile.id,
                        name: profile.displayName,
                        picture: profile.photos[0].value,
                        gameplay: {
                            counter: 0,
                            index: 0,
                            countdown: 1000,
                            level: '1x',
                            goal: 1000,
                            clicker: 0,
                            grandpa: 0,
                            cost: 100,
                            gcost: 1000
                        }
                    };
                    insertPlayer(db, user, function () {
                        db.close();
                    })
                }
            });
        });
        done(null, profile);
    }
));

app.get('/auth/google',
    passport.authenticate('google', {scope: ['profile']}));

app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/index.html#/app/login'}),
    function (req, res) {
        res.redirect('http://localhost:3000/#/app/game');
    });

/////////// FACEBOOK LOGIN
passport.use(new FacebookStrategy({
        clientID: 1517975181838329,
        clientSecret: "c7dcea90211ffb1becb1ae665cb2b33c",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email', 'picture.type(large)']
    },
    function (accessToken, refreshToken, profile, done) {
        console.log("logged in");
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            checkforDuplicates(db, profile.id, function (foundUser, user) {
                if (!foundUser) {
                    user = {
                        _id: profile.id,
                        name: profile.displayName,
                        picture: profile.photos[0].value,
                        gameplay: {
                            counter: 0,
                            index: 0,
                            countdown: 1000,
                            level: '1x',
                            goal: 1000,
                            clicker: 0,
                            grandpa: 0,
                            cost: 100,
                            gcost: 1000
                        }
                    };
                    insertPlayer(db, user, function () {
                        db.close();
                    })
                }
            });
        });
        return done(null, profile);
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, id);
    // console.log(id);
    // MongoClient.connect(url, function(err, db) {
    //     assert.equal(null, err);
    //     db.collection('users').findById(id, function(err, user) {
    //         done(err, user);
    //     })
    // });
});


app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {

        failureRedirect: '/index.html#/app/login'
    }),
    function (req, res) {
        res.redirect('http://localhost:3000/#/app/game');
    });


/////////// EMAIL & PASSWORD LOGIN
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwd'
    },
    function (username, password, done) {
        return done(null, user);
    }
));

app.post('/app.login',
    passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/login',
            successFlash: 'Welcome!',
            failureFlash: true, message: 'Invalid username or password.',
            session: false
        }),
    function (req, res) {
        res.redirect('/users/' + req.user.username);
        res.json({
            id: req.user.id,
            username: req.user.username
        });
    });
function insertPlayer(db, user, callback) {
    db.collection('users').insertOne(user, function (err, result) {
        assert.equal(err, null);
        console.log('Inserted a document into the users collection');
        callback();
    })
}
function checkforDuplicates(db, user, callback) {
    db.collection('users').findOne({'_id': user}, function (err, result) {
        assert.equal(err, null);
        var foundUser = false;
        if (result != undefined || result != null) {
            foundUser = true;
            console.log('User Found!!');

        }
        var user = result;
        callback(foundUser, user);
    })
}
function findPlayer(db, user, callback) {
    db.collection('users').findOne({'_id': user}, function (err, result) {
        assert.equal(err, null);
        user = result;
        callback(user);
    })
}
router.route('/initPlayer')
    .get(function (req, res) {
        console.log(req.user);
        var id = req.user;
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            findPlayer(db, id, function (user) {
                db.close();
                res.json(user);
            })
        })
    });

app.listen(port, function () {
    console.log(`App listening on port ${port}...`);
});
