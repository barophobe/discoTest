var express = require('express');
var dotEnv = require('dotenv').config()
var router = express.Router();
var jwt = require('jsonwebtoken');
var Discogs = require('disconnect').Client;
var Artist = require('../models/artist');
var db = new Discogs('soundtrackr/1.0',{
consumerKey: process.env.Key, 
consumerSecret: process.env.Secret
})
.database();

/*  

router.use('/', function(req, res, next) {
        jwt.verify(req.query.token, 'freagra', function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    title: 'Not Authenticated',
                    error: err
                });
            }
            next();I
        })
    });*/

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
db.search(artist, function(err, data) {
     if (err) {
                return res.status(500).json({
                    title: 'an error has occurred',
                    error: err
                });
            }
    	var outPut = data.results.filter(function(result) {
        return result.type === 'artist'; 
    	})
    	res.send(JSON.stringify(outPut, undefined, 4));
    	});
    });


   router.use('/', function(req, res, next) {
        jwt.verify(req.query.token, 'freagra', function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    title: 'Not Authenticated',
                    error: err
                });
            }
            next();
        })
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