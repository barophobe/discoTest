var express = require('express');
var dotEnv = require('dotenv').config()
var bodyParser = require('body-parser');
var {MongoClient, ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var Artist = require('./models/artist');
var Album = require('./models/album');
var User = require('./models/user');
var Discogs = require('disconnect').Client;
var artistRoutes = require('./routes/artist');
var albumRoutes = require('./routes/albums/album');
var userRoutes = require('./routes/user');
const getAlbum = require('./query_helpers/getAlbum');

mongoose.Promise = Promise;

var app = express();

var db = new Discogs('soundtrackr/1.0',{
consumerKey: process.env.Key, 
consumerSecret: process.env.Secret
})
.database();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

/*app.use(bodyParser.json());
app.use('/artist', artistRoutes);
app.use('/user', userRoutes);
app.use('/albums', albumRoutes);*/

app.listen(3000, () => {
	console.log('Started on port 3000');
});








