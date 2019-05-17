const Artist = require('../models/artist');
const Discogs = require('disconnect').Client;
const db = new Discogs('Musictrackr/1.0',{
    consumerKey: process.env.Key,
    consumerSecret: process.env.Secret
})
    .database();

const getArtistCol = (artistId) => {
    return Artist.findOne({id: artistId});
};

const getArtistApi = async (artistId) => {
    let artistApi;
    const resp = await db.getArtist(artistId)
        .then((newArtist) => {
            saveArtist = new Artist({
                artistsName: artistsName,
                namevariations: newArtist.namevariations,
                profile: newArtist.profile,
                releases_url: newArtist.releases_url,
                resource_url: newArtist.resource_url,
                uri: newArtist.uri,
                urls: newArtist.urls,
                data_quality: newArtist.data_quality,
                id: newArtist.id,
                images: newArtist.images,
                members: newArtist.members
            });
            artistApi = saveArtist;
        });
    return artistApi;
};

const getArtist = async (artistId) => {
    let artistDetails;
    const mainArtCol = await getArtistCol(artistId);
    if (mainArtCol) {
        artistDetails = mainArtCol;
    } else {
        artistDetails = getArtistApi(artistId);
    }
    return artistDetails;
};

module.exports = getArtist;