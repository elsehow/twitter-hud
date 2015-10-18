var config = require('./config.js')
  , _ = require('lodash')
	, samples = require('./samples.js')

function coordinates (tweet) {
  return tweet.coordinates
}

function latLong (tweet) {
  return coordinates(coordinates(tweet))
}

function hasCoordinates (tweet) {
  if (coordinates(tweet)) return tweet
}

function inside (boundingBox, tweet) {
	if(boundingBox.contains(latLong(tweet))) return tweet
}

module.exports = function (boundingBox) {

  function inAnOkPlace (tweet) {
  	if (inside(boundingBox, tweet)) return tweet
  }

	return function (tweetStream) {
    return tweetStream.filter(hasCoordinates).filter(inAnOkPlace)
	}

}


