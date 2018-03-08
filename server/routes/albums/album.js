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


router.get('/', function(req, res, next){

var decoded = jwt.decode(req.query.token);

User.findById(decoded.user._id)
            .populate('albums')
            .exec((err, user) => {

            	var albums= user.albums;
            	
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
  });
           

router.get('/detail/:master', (req,res, next) => {

var decoded = jwt.decode(req.query.token);

var master = req.params.master;

   User.findById(decoded.user._id)
            .populate({path:'albums',
            	select: 'albumId'})
            .populate({path:'artists',
            	select: 'artistId'})
            .exec((err, user) => {

			 	  if (err) {
		                return res.status(500).json({
		                    title: 'an error occurred',
		                    error: err
		                });

			            }
             
            var albumCollection = JSON.stringify(user.albums,undefined,4);

            var albumOwned = albumCollection.includes(master);

            if (albumOwned) {

            	  return res.status(200).json({
		                    title: 'Already in collection!',
		                    message: 'Already in collection!'
		                });

		            }

			Album.findOne({albumId: master}, (err, result) => { 

						     if (result){
						    	user.albums.push(result);
								user.save();
						        return res.status(200).json({
			                    title: 'Album has been added to your collection!',
			                    message: 'Album has been added to your collection!'
			                });
				    }
				}).then(() => {    
					db.getMaster(master).then((masterAlbum) => {
						var artistId = masterAlbum.artists[0].id;
						var artistsName = masterAlbum.artists[0].name;
						var masterAlbum = new Album({
							artistsName: artistsName,
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
								
								masterAlbum.save().then(() => {
									
									var artistCollection = JSON.stringify(user.artists,undefined,4);

									var artistOwned = artistCollection.includes(artistId);

									Artist.count({id: artistId}, (err, count) => { 

										if (err) {

											 return res.status(500).json({
								                    title: 'An error occured, Please try again later.',
								                    error: err
									                });

												}

									    if (count === 0){

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
												user.artists.push(artistDetails);   
											 });

									    } else {

										    Artist.findOne({id: artistId}, (err, results) => { 
												if (err) {
													 return res.status(500).json({
										                    title: 'An error occured, Please try again later.',
										                    error: err
											                });
														}
													user.artists.push(results);
													});

												}

								    user.albums.push(masterAlbum);
									user.save();
									res.status(201).send(JSON.stringify(masterAlbum, undefined, 4));

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
