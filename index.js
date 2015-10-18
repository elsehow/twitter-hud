var Twitter = require('twitter')
   , fs = require('fs')
	 , config = require('./config.js')
	 , server= require('http').createServer()
	 , Kefir = require('kefir')
	 , locationFilter = require('./filterByBoundingBox.js')(config.boundingBox)

var JSONStream = require("JSONStream")
var outstream = JSONStream.stringify()
var samples = outstream.pipe(fs.createWriteStream('samples.json'))

function tick () { 
	process.stdout.write('x')
}
	 
function handleTweet (tweet) {
  console.log('@'+tweet.user.screen_name, tweet.text)
  outstream.write(tweet)
}

function handleError (error) {
  console.log(error)
}

var client = new Twitter(config.twitterKeys)

client.stream('statuses/filter'
		, {locations: config.bboxString}
		, function (stream) {
  			// handle errors
  		  stream.on('error', handleError)
  	    // handle tweets
        var tweetStream = Kefir.fromEvents(stream,'data')
  	    var localTweets = locationFilter(tweetStream)
	      tweetStream.onValue(tick)
        localTweets.onValue(handleTweet)
		}
)

server.listen()
