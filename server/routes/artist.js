var express = require('express');
var dotEnv = require('dotenv').config()
var router = express.Router();
var Discogs = require('disconnect').Client;

var db = new Discogs('Musictrackr/1.0',{
consumerKey: process.env.Key, 
consumerSecret: process.env.Secret
})
.database();

router.get('/:artist', (req,res) => {
var artist = req.params.artist;
db.search(artist, function(err, data){
	var outPut = data.results.filter(function(result) {
    return result.type === 'artist'; 
	})
	res.send(JSON.stringify(outPut, undefined, 4));
	});
});

router.get('/detail/:artistId', (req,res) => {
var artistId = req.params.artistId;
db.getArtist(artistId, function(err, data){
	var artistDetails = data;
	res.send(JSON.stringify(artistDetails, undefined, 4));
	});
});

module.exports = router;