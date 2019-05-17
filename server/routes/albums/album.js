const express = require('express');
const dotEnv = require('dotenv').config()
const router = express.Router();
const artisto = require('./artistF.js');
const Artist = require('../../models/artist');
const Album = require('../../models/album');
const User = require('../../models/user');
const getAlbum = require('../../query_helpers/getAlbum');
const getArtist = require('../../query_helpers/getArtist');

const Discogs = require('disconnect').Client;
const {MongoClient, ObjectId} = require('mongodb');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const {mongoose} = require('../../db/mongoose');
const db = new Discogs('Musictrackr/1.0',{
consumerKey: process.env.Key,
consumerSecret: process.env.Secret
})
.database();

router.get('/:artist', (req,res) => {
const artist = req.params.artist;
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

const decoded = jwt.decode(req.query.token);

User.findById(decoded.user._id)
            .populate('albums')
            .exec((err, user) => {

            	var albums = user.albums;

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

    const decoded = jwt.decode(req.query.token);

    let master = parseInt(req.params.master);
    let artistId;
    let albumOwned;

    User.findById(decoded.user._id)
        .populate({
            path: 'albums',
            select: 'albumId'
        })
        .populate({path:'artists',
            select: 'id'})
        .exec((err, user) => {

            if (err) {
                return res.status(500).json({
                    title: 'an error occurred',
                    error: err
                });
            }

            albumOwned = user.albums.map(masters => masters.albumId).includes(master);

        }).then( async (user) => {

            if (albumOwned) {
                return res.status(200).json({
                    title: 'Album is already in your collection!',
                    message: 'Album is already in your collection!'
                });
            }

            const masterAlbum = await getAlbum(master).then((masterAlbum) => {
                artistId = masterAlbum.artists[0].id;
                masterAlbum.save();
                user.albums.push(masterAlbum);
                return user.save();
            });

             let artistOwned = await user.artists.map(artists => artists.id).includes(artistId);

                if (!artistOwned) {
                await getArtist(artistId).then((artistDetails) => {
                    artistDetails.save();
                    user.artists.push(artistDetails);
                    user.save();
                });
            }

        }).then(() => res.status(201).json({
                    title: 'Album has been added to your collection!',
                    message: 'Album has been added to your collection!'
                })
        ).catch((err) => {
            console.log('Handle rejected promise (' + err + ') here.');
            });
    });

    router.delete('/repo/:_id', function (req, res, next) {
        const id = req.params._id;

        if (!ObjectId.isValid(id)) {
            return res.status(404).send();
        }

        const decoded = jwt.decode(req.query.token);

      User.findById(decoded.user._id)
          .populate({
              path: 'albums',
              select: 'artists'
          })
          .populate({path:'artists',
              select: 'id'})
          .exec((err, user) => {
             /* const shoNuff = user.artists[0].id.toString();
            console.log(user);
              console.log(shoNuff);
              console.log(id.toString());
              console.log(typeof(shoNuff));
              console.log(typeof(id));*/
          if (err) {
              return res.status(500).json({
                  title: 'an error occurred',
                  error: err
              });
          };

              /* user.album.findOne({_id: id}, function (err, albums) {
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
                  /* Album.remove({_id: id}, function (err, result) {
                       if (err) {
                           return res.status(500).json({
                               title: 'an error occurred',
                               error: err
                           });
                       }*/
                  /*  user.update(
                        {$pull : {albums:{_id: id}}}, (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                title: 'an error occurred',
                                error: err
                            });
                        }*/
              let userAlbums = user.albums;

              function isUnique(userAlbums) {
                  var tmpArr = [];
                  for(let artists in userAlbums) {
                      if(tmpArr.indexOf(userAlbums[artists].id) < 0){
                          tmpArr.push(userAlbums[artists].id);
                      } else {
                          return user.albums.pull({ _id: id }); // Duplicate value for property1 found
                      }
                  }
                  Album.findById(id).exec((err, response) => {
                      tmpArtist = response.artists[0].id;
                      console.log("edo", typeof(tmpArtist));
                      return user.artists.pull({ id: tmpArtist });
                  }).then(id)
                 return user.albums.pull({ _id: id }); // No duplicate values found for property1
              }

                isUnique(userAlbums);
                        user.save();
                        return res.status(200).json({
                            album: 'deleted album'
                            /*obj: result*/
                        });
                    });
                });
         /* });*/





module.exports = router;
