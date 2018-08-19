require("dotenv").config();

var Spotify = function(keys){
    this.id = keys.id;
    this.secret = keys.secret;
}

var Reddit = function(keys){
    this.userAgent = keys.userAgent;
    this.clientId = keys.clientId;
    this.clientSecret = keys.clientSecret;
    this.username = keys.username;
    this.password = keys.password;
}

var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);
var reddit = new Reddit(keys.reddit);
console.log(spotify);
console.log(reddit);