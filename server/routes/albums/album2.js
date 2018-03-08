var express = require('express');
var dotEnv = require('dotenv').config()
var router = express.Router();
var artisto = require('./artistF.js');
var Artist = require('../../models/artist');
var Album = require('../../models/album');
var User = require('../../models/user');
var Discogs = require('disconnect').Client;
var {MongoClient, ObjectId} = require('mongodb');
var _ = require('underscore');
var jwt = require('jsonwebtoken');

var {mongoose} = require('../../db/mongoose');
var db = new Discogs('Musictrackr/1.0',{
consumerKey: process.env.Key, 
consumerSecret: process.env.Secret
})
.database();


router.get('/', function(req, res, next){
    Album.find()
        .exec(function(err, albums) {
            if (err) {
                return res.status(500).json({
                    title: 'an error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'success',
                obj: albums
            });
        });

}),


router.get('/:artist', (req,res) => {
var artist = req.params.artist;
artisto.artistRecords(artist, (errorMessage, results) => {
	if (errorMessage) {
		 return res.status(404).json({
                    title: 'Cannot find Albums!',
                    error: errorMessage
                });
	} else {
		res.send(JSON.stringify(results.albums,undefined,2));
	}
	});
});





  /* router.use('/', function(req, res, next) {
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
*/





router.get('/detail/:master', (req,res, next) => {


var decoded = jwt.decode(req.query.token);
User.findById(decoded.user._id, function(err, user) {
    if (err) {
        return res.status(500).json({
            title: 'an error occurred',
            error: err
        });
    }
	var master = req.params.master;

	Album.count({albumId: master}, (count) => { 
				    if(count=0){
				    
				    
	db.getMaster(master).then((masterAlbum) => {
		var artistId = masterAlbum.artists[0].id;
			var masterAlbum = new Album({
				artistsName: masterAlbum.artists[0].name,
				myRating: null,
				albumId: master,
				styles: masterAlbum.styles,
			    genres: masterAlbum.genres,
			    main_release_url: masterAlbum.main_release_url,
			    num_for_sale: masterAlbum.num_for_sale,
			    videos: masterAlbum.videos,
		        title: masterAlbum.title,
			    main_release: masterAlbum.main_release,
			    notes: masterAlbum.notes,
			    artists: masterAlbum.artists,
			    uri: masterAlbum.uri,
			    versions_url: masterAlbum.versions_url,
			    lowest_price: masterAlbum.lowest_price,
			    year: masterAlbum.year,
			    images: masterAlbum.images,
			    resource_url: masterAlbum.resource_url,
			    tracklist: masterAlbum.tracklist,
			    ArtistId: masterAlbum.id,
			    data_quality: masterAlbum.data_quality
				});
}

				
				
					
					masterAlbum.save().then(() => {

						user.albums.count({albumId: master}, (count) {
					if (count==0) {
						user.albums.push(masterAlbum);
						user.save();
						/*res.status(201).json({
		                message: 'Saved album',
		                obj: masterAlbum
		            });*/
					}
				}).then(() => {

						Artist.count({id: artistId}, (err, count) => { 
							if (err) {
								 return res.status(500).json({
					                    title: 'An error occured, Please try again later.',
					                    error: err
						                });
									}

						    if(count === 0){
						        db.getArtist(artistId, function(err, artistDetails){
							        	if (err) {
											 return res.status(500).json({
							                    title: 'An error occured, Please try again later.',
							                    error: err    
							                   });
											}

								var artistDetails = new Artist({
									artistsName: artistsName,
									namevariations: artistDetails.namevariations,
									profile: artistDetails.profile,
								    releases_url: artistDetails.releases_url,
								    resource_url: artistDetails.resource_url,
								    uri: artistDetails.uri,
								    urls: artistDetails.urls,
								    data_quality: artistDetails.data_quality,
								    id: artistDetails.id,
								    images: artistDetails.images,
								    members: artistDetails.members
								    });

								    artistDetails.save();
								 });
								res.status(201).send(JSON.stringify(masterAlbum, undefined, 4));
						    }			
					}, (e) => {
						res.status(500).json({
	                    title: 'An error occurred, Please try again later.',
	                    error: e
	                });
					});
				});
			}); 
		});
	});
});


router.delete('/repo/:_id', function(req, res, next){
	var id = req.params._id;
    Album.findOne({_id:id}, function(err, albums) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: error
            });
        }
        if (!Album) {
            return res.status(500).json({
                title: 'No album found',
                error: {message: 'Album not found'}
            });

        }
        Album.remove({_id:id},function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'an error occurred',
                    error: err
                });
            }
            res.status(200).json({
                album: 'deleted album',
                obj: result
            });
        });
    });
});

module.exports = router;
