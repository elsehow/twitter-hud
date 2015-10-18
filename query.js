var Twitter = require('twitter')
   //, fs = require('fs')
	 , config = require('./config.js')
	 , Kefir = require('kefir')
	 , locationFilter = require('./filterByBoundingBox.js')(config.boundingBox)

var JSONStream = require("JSONStream")
var outstream = JSONStream.stringify()
	 
function handleTweet (tweet) {
  outstream.write(tweet)
}

var client = new Twitter(config.twitterKeys)

//TODO make radius into longest dimension of bbox
//TODO filter these with the same tools as streaming
//
// TODO some system runs both processes
// + condenses into some coherent state.
//

var bbox = config.boundingBox
var myGeo = [bbox.centerLongitude(), bbox.centerLatitude(), '5mi'].join(',')

var tweets = Kefir.fromNodeCallback(function (callback) {
  client.get('search/tweets'
  		, {geocode: myGeo}
  		, callback)
})

tweets.onValue(handleTweet)
outstream.pipe(process.stdout)

