# LIRI-Node-App
Command line tool to practice fetching API data via node.

## How to Use
In order to use this app, you must first supply API authentication in a .env file in the following format:

```
# Spotify API keys

SPOTIFY_ID=your-id
SPOTIFY_SECRET=your-secret

# Reddit API keys

REDDIT_USER_AGENT=your-user-agent
REDDIT_CLIENT_ID=your-client
REDDIT_CLIENT_SECRET=your-client-secret
REDDIT_USERNAME=your-username
REDDIT_PASSWORD=your-password

# OMDB API keys

OMDB_KEY=your-key 
```

The app takes the third command line argument to determine its action. Any subsequent arguments may be action parameters.

Type the follwing in your command line for a list of all available actions: 
`node liri.js help`

## Project History

This project was a homework assignment for the Columbia Full Stack Web Development Coding Bootcamp, testing our preliminary ability to use nodejs. The project originally specified a gathering tweets instead of Reddit comments, but Twitter changed its API system two weeks before the project was due, so most students were unable to get an API key. 