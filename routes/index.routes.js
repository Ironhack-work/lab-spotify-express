const router = require("express").Router();

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));



router.get("/", (req, res) => {

  res.render("index");
});

router.get("/artist-search", (req, res) => {
  const { artist } = req.query
  console.log(artist)
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      res.render('Data/artist-search-results', { Data: data.body.artists.items })
    })
    .catch(err => console.log(err))

})

router.get("/album-view/:artist_id", (req, res) => {
  const { artist_id } = req.params
  spotifyApi
    .getArtistAlbums(artist_id)
    .then(albums => {

      res.render('Data/album-view', { albumData: albums.body.items })
    })
    .catch(err => console.log(err))

})

router.get("/tracks/:album_id", (req, res) => {
  const { album_id } = req.params

  spotifyApi
    .getAlbumTracks(album_id)
    .then(albumTracks => {
      console.log(albumTracks)
      //res.send(albumTracks.body.items)
      res.render('Data/tracks', { trackData: albumTracks.body.items })
      // res.render('Data/album-view', { albumData: albums.body.items })
    })
    .catch(err => console.log(err))

})

module.exports = router;
