var express = require('express');
var dotEnv = require('dotenv').config()
var router = express.Router();
var Discogs = require('disconnect').Client;
var {Artist} = require('../models/artist');
var db = new Discogs('Musictrackr/1.0',{
consumerKey: process.env.Key, 
consumerSecret: process.env.Secret
})
.database();

router.get('/repo/:artistId', (req,res,next) => {
var artistId = req.params.artistId;
Artist.find({id:artistId})
        .exec(function(err, artist) {
            if (err) {
                return res.status(500).json({
                    title: 'an error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'success',
                obj: artist
            });
        });
});

router.get('/:artist', (req,res) => {
var artist = req.params.artist;
db.search(artist, function(err, data){
     if (err) {
                return res.status(500).json({
                    title: 'an error occurred',
                    error: err
                });
            }
    	var outPut = data.results.filter(function(result) {
        return result.type === 'artist'; 
    	})
    	res.send(JSON.stringify(outPut, undefined, 4));
    	});
    });

router.get('/detail/:artistId', (req,res) => {
var artistId = req.params.artistId;
db.getArtist(artistId, function(err, data){
     if (err) {
                return res.status(500).json({
                    title: 'an error occurred',
                    error: err
                });
            }
    	var artistDetails = data;
    	res.send(JSON.stringify(artistDetails, undefined, 4));
    	});
    });


module.exports = router;

