var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://mkteagle:Password01@ds013221.mlab.com:13221/donutclicker';
app.use('/', express.static(__dirname + '/www'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/api', router);
var port = (process.env.PORT || 8080);

app.listen(port, function() {
  console.log(`App listening on port ${port}...`);
});
