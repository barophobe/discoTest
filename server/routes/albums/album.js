var express = require('express');
var dotEnv = require('dotenv').config()
var router = express.Router();
var artisto = require('./artistF.js');
var {Artist} = require('../../models/artist');
var {Album} = require('../../models/album');
var {User} = require('../../models/user');
var Discogs = require('disconnect').Client;
var {MongoClient, ObjectId} = require('mongodb');

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
		res.send(errorMessage);
	} else {
		res.send(JSON.stringify(results.albums,undefined,2));
	}
	});
});

router.get('/detail/:master', (req,res) => {
var master = req.params.master;
db.getMaster(master).then((masterAlbum) => {
	var artistId = masterAlbum.artists[0].id;
		var masterAlbum = new Album({
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
			
			Album.count({albumId: master}, (err, count) => { 
			    if(count>0){
			        return console.log('Album is in collection already!');
			    }
				
				masterAlbum.save().then(() => {

					Artist.count({id: artistId}, (err, count) => { 
						if (err) {
							console.log(err);
						}
					    if(count === 0){
					        db.getArtist(artistId, function(err, artistDetails){
							var artistDetails =new Artist({
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

							    artistDetails.save().then(() => {
								return console.log(JSON.stringify(artistDetails, undefined, 4));
								});
							 });
							res.send(JSON.stringify(masterAlbum, undefined, 4));
					    }			
				}, (e) => {
					res.status(400).send(e);
				});
			});
		}); 
	});
});

module.exports = router;