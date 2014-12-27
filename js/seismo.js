var SEISMO = (function () {
	var self = {};
	
	var _seismoMap;

	function loadFeed() {
		var feed = new USGSFeed();
		feed.getPastDayOver25();
	}
	
	function init() {
		var feed = new USGSFeed();
		_seismoMap = new SeismoMap();
		
		_seismoMap.load(function onLoaded() {
			loadFeed();
		});
	}

	self.init = init;
	self.getSeismoMap = function () { return _seismoMap; };
	
	return self;
}());

var USGSFeed = function () {
	function getFeed(url, callback) {
		$.ajax({
			url: url,
			jsonp: 'eqfeed_callback',
			dataType: 'jsonp'
		});
	}
	
	this.getPastDayOver25 = function (callback) {
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/geojsonp/2.5/day', callback);
	}
	
	this.getPastWeekOver25 = function (callback) {
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/geojsonp/2.5/week', callback);
	}
	
	this.getPastMonthOver45 = function (callback) {
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/geojsonp/4.5/month', callback);
	}
};

var SeismoMap = function () {
	var _map;
	
	function load(onLoaded) {
		google.maps.event.addDomListener(window, 'load', function () {
			var mapOptions = {
				mapTypeId: google.maps.MapTypeId.TERRAIN,
				center: { lat: 30, lng: 0},
				zoom: 3
			};
  	  	
			_map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			
			onLoaded();
		});
	}
	
	function updateQuakes(quakes) {
		for (var i = 0; i < quakes.length; i++) {
			addQuake(quakes[i]);
		}
	}
	
	function addQuake(quake) {
		var magnitude = quake.properties.mag;
		var coords = quake.geometry.coordinates;
		
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(coords[1],coords[0]),
			map: _map,
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				fillOpacity: 0.6,
				fillColor: getMarkerColor(magnitude, 1.0),
				strokeOpacity: 1.0,
				strokeColor: getMarkerColor(magnitude, 0.6),
				strokeWeight: 1.0, 
				scale: Math.pow(magnitude, 1.8) - 0.8 * magnitude // Some random algo to scale circles
			}
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			// Handle click
			console.log(magnitude);
		});
	}
	
	function getMarkerColor(magnitude, brightness) {
		var val;
		
		if (false && magnitude < 5.0) {
			val = 0;
		} else {
			val = Math.min(Math.floor(magnitude) / 9, 1) * 100;
		}
		
		var h = Math.floor((100 - val) * 120 / 100);
		
		return hsv2rgb(h, 1, brightness);
	}
	
	function hsv2rgb(h, s, v) {
		// adapted from http://schinckel.net/2012/01/10/hsv-to-rgb-in-javascript/
		var rgb, i, data = [];
		if (s === 0) {
			rgb = [v,v,v];
		} else {
			h = h / 60;
			i = Math.floor(h);
			data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
			switch(i) {
			case 0:
				rgb = [v, data[2], data[0]];
				break;
			case 1:
				rgb = [data[1], v, data[0]];
				break;
			case 2:
				rgb = [data[0], v, data[2]];
				break;
			case 3:
				rgb = [data[0], data[1], v];
				break;
			case 4:
				rgb = [data[2], data[0], v];
				break;
			default:
				rgb = [v, data[0], data[1]];
				break;
			}
		}
		return '#' + rgb.map(function(x){
			return ("0" + Math.round(x*255).toString(16)).slice(-2);
		}).join('');
	}
	
	this.load = load;
	this.updateQuakes = updateQuakes;
};

$(document).ready(function() {
	window.eqfeed_callback = function (results) {
		console.log(results);
		
		SEISMO.getSeismoMap().updateQuakes(results.features);
	}
	
	SEISMO.init();
});

















