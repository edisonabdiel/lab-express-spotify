require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists);
            res.render('view-results', data.body.artists)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

// Iteration 4
app.get('/albums/:id', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id).then(data => {
        res.render('albums', data.body);
    })

});

// Iteration 5
app.get('/tracks/:trackID', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.trackID).then(data => {
        console.log('-------------------------------')
        console.log(data.body.items[0])
        res.render('tracks', data.body)
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
