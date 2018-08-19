require("dotenv").config();
var Spotify = require('node-spotify-api');
const Reddit = require('snoowrap');

var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);
var reddit = new Reddit(keys.reddit);

if (process.argv[2] === "help") {
    console.log('Here are the currently available commands:')
    console.log();
    console.log('node liri.js spotify-this-song "Song Name Here"');
    console.log('--> Searches Spotify for a song with that title.');
    console.log();
    console.log('node liri.js my-comments #');
    console.log('--> Searches Reddit for user comments.');
    console.log('----> An integer argument is optional. If one is supplied, it sets the maximum number of results. It is 20 by default.')
    console.log();
    
    console.log('node liri.js help');
    console.log('--> Provides a list of available options. But you already knew that ;)');
}
else if (process.argv[2] === "spotify-this-song") {
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

else if (process.argv[2] === "my-comments") {
    reddit.getUser(reddit.username).getComments().then(function (res) {
        var numberToDisplay = parseInt(process.argv[3]) || 20;
        if (numberToDisplay > res.length || numberToDisplay < 0 ) { numberToDisplay = res.length; }
        for(var i=0; i<numberToDisplay; i++){
            console.log(res[i].body);
            console.log(new Date(new Date(parseInt(res[i].created_utc)*1000) + ' UTC'));
        }
    });
}