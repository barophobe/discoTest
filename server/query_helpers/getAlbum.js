const Album = require('../models/album');
const Discogs = require('disconnect').Client;
const db = new Discogs('Musictrackr/1.0',{
    consumerKey: process.env.Key,
    consumerSecret: process.env.Secret
})
    .database();

const getAlbumCol = (master) => {
    return Album.findOne({albumId: master});
};

const getAlbumApi = async (master) => {
    let albumApi;
    const resp = await db.getMaster(master)
        .then((newAlbum) => {
                artistId = newAlbum.artists[0].id;
                artistsName = newAlbum.artists[0].name;
                saveAlbum = new Album({
                artistsName: artistsName,
                myRating: null,
                albumId: master,
                styles: newAlbum.styles,
                genres: newAlbum.genres,
                main_release_url: newAlbum.main_release_url,
                num_for_sale: newAlbum.num_for_sale,
                videos: newAlbum.videos,
                title: newAlbum.title,
                main_release: newAlbum.main_release,
                notes: newAlbum.notes,
                artists: newAlbum.artists,
                uri: newAlbum.uri,
                versions_url: newAlbum.versions_url,
                lowest_price: newAlbum.lowest_price,
                year: newAlbum.year,
                images: newAlbum.images,
                resource_url: newAlbum.resource_url,
                tracklist: newAlbum.tracklist,
                ArtistId: newAlbum.id,
                data_quality: newAlbum.data_quality
            });
            albumApi = saveAlbum;
        });
    return albumApi;
};

const getAlbum = async (master) => {
    let masterAlbum;
    const mainCol = await getAlbumCol(master);
    if (mainCol) {
        masterAlbum = mainCol;
    } else {
        masterAlbum = getAlbumApi(master);
    }
    return masterAlbum;
};

module.exports = getAlbum;