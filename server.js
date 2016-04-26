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
