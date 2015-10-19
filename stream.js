var Twitter = require('twitter')
   , fs = require('fs')
	 , config = require('./config.js')
   , JSONStream = require("JSONStream")
	 , stringifier = JSONStream.stringify()

function handleTweet (tweet) {
  stringifier.write(tweet)
}

function handleError (error) {
  process.stderr.write(error)
}

var client = new Twitter(config.twitterKeys)

client.stream('statuses/filter'
		, {locations: config.bboxString}
		, function (stream) {
  		  stream.on('error', handleError)
        stream.on('data',  handleTweet)
		}
)

stringifier.pipe(process.stdout)
