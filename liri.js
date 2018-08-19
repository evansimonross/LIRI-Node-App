require("dotenv").config();
var Spotify = require('node-spotify-api');
const Reddit = require('snoowrap');

var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);
var reddit = new Reddit(keys.reddit);

if (process.argv[2] === "spotify-this-song") {
    spotify
        .search({ type: 'track', query: process.argv[3] })
        .then(function (response) {
            let track = response.tracks.items[0];
            console.log('Track: ' + track.name);
            console.log('Artist: ' + track.artists[0].name);
            console.log('Album: ' + track.album.name);
            console.log(track.href);
        })
        .catch(function (err) {
            console.log(err);
        });
}

if (process.argv[2] === "my-comments") {
    reddit.getUser(reddit.username).getComments().then(function (res) {
        for(var i=0; i<res.length; i++){
            console.log(res[i].body);
            console.log(new Date(new Date(parseInt(res[i].created_utc)*1000) + ' UTC'));
        }
    });
}