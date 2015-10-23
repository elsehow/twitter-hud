var _ = require('lodash')
 , samples = require('./srv/samples.js')
 , scale = require('simple-linear-scale')
 , h = require('virtual-dom/h')
 , main = require('main-loop')
 , tweets = _.last(samples)
 , loop = main(tweets, render, require('virtual-dom'))

function listView (tweets) {

	function userView (tweet) {
		return h('div', '@'+tweet.user.screen_name)
	}

	function textView (tweet) {
		return h('div', tweet.text)
	}

	function instagramPreview (tweet) {
		var urls       = tweet.entities.urls
    var contentURL = _.first(urls).expanded_url
		if (_.contains(contentURL, 'instagram.com'))
      return h('img', {src: contentURL + 'media/'})
	}

	function tweetView (tweet) {
		return h('div.tweet', [
      userView(tweet)
			, textView(tweet)
			, instagramPreview(tweet)
		])
	}

  return h('div#list'
		, { style: {
			  width: '30%'
			  , cssFloat: 'left'
			  , height: '100vh'
		    , overflowY: 'scroll'
		  }
		}
    , _.map(tweets, tweetView))

}


function percentOf (val, min, max) {
  var fn = scale([min, max], [0, 100])
  return fn(val)
}

function scaleLong (longitude, bbox) {
	return percentOf(
		longitude
  	, bbox.longitude.min
  	, bbox.longitude.max)
}

function scaleLat (latitude, bbox) {
	return percentOf(
		latitude
  	, bbox.latitude.min
  	, bbox.latitude.max)
}

function mapView (tweets) {

	function tweetPoint (tweet, i) {

// where would the bounding box be? in state?
// if in state, how did it get there?
// what data structure (or data structures) gave rise to it?
    var bbox = require('./srv/config.js').boundingBox

		var coors = tweet.coordinates.coordinates
		// scale coors[0] (lat) to left-right % pos in the div
		var percentLeft = scaleLat(coors[0], bbox)
		// scale coors[1] (long) to top-bottom % pos in the div
		var percentTop = scaleLong(coors[1], bbox)
		// render a div w absolute position and above x/y %s
		console.log(percentLeft, percentTop ,tweet.text)

		return h('div'
				, { style: 
					  { position: 'relative'
						, top: percentTop + '%'
						, left: percentLeft+ '%' 
				} }
				, JSON.stringify(i))

	}

	// draw a map of my hood.
	// how do we align the map with the points?
	//    -- easily ---- 1, static size 
	//    -- difficult - fn of window size + map image size
	//         * find window size / keep it in state
	//				   - not a bad idea generally 
	//				 * keep track of bg image size (?)
	//				 * fn that scales to my liking
	//
	// seems clear i will take the difficult path. discovery!
	// GOALS:
	//   - make CSS more like processing (width/height)
	//   - think about (re)factoring the client side..
  return h('div#map'
		, { style: {
			  width: '70%'
			  , cssFloat: 'left'  
			  , height: '900px'  // height of map img
			  , width: '1025px'  // width of map img
		    , backgroundImage: 'url(google-map.png)'
				, madeUpThing: 'nice'
			}
		}
		, _.map(tweets, tweetPoint))

}

function render (state) {

  return h( 'div#app'
		, { style: {
			  overflow: 'hidden'
		  }
		}
    , [ 
			mapView(tweets)
    , listView(tweets)
	])

}

// setup page
document.querySelector('#content').appendChild(loop.target)
