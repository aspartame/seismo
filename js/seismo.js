var USGSFeed = function () {
	function getFeed(url, callback) {
		$.ajax({
			url: url,
			jsonp: 'eqfeed_callback',
			dataType: 'jsonp'
		});
	}
	
	this.getPastDayOver10 = function (callback) {
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/geojsonp/1.0/day', callback);
	}
	
	this.getPastDayOver25 = function (callback) {
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/geojsonp/2.5/day', callback);
	}
	
	this.getPastWeekOver10 = function (callback) {
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/geojsonp/1.0/week', callback);
	}
	
	this.getPastWeekOver25 = function (callback) {
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/geojsonp/2.5/week', callback);
	}
	
	this.getPastMonthOver45 = function (callback) {
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/geojsonp/4.5/month', callback);
	}
	
	this.getPastMonthSignificant = function (callback) {
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/geojsonp/significant/month', callback);
	}
};

var SeismoViewModel = function () {
	var _map;
	var _quakes = ko.observableArray();
	var _selectedQuake = ko.observable();
	
	function load(onLoaded) {
		google.maps.event.addDomListener(window, 'load', function () {
			var mapOptions = {
				mapTypeId: google.maps.MapTypeId.TERRAIN,
				center: { lat: 30, lng: 0},
				zoom: 3
			};
  	  	
			_map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			
			google.maps.event.addListener(_map, 'click', function () {
				if(_selectedQuake()) {
					_selectedQuake().stopAnimation();
					_selectedQuake(null);
				}
			});
			
			onLoaded();
		});
	}
	
	function updateQuakes(quakes) {
		for (var i = 0; i < quakes.length; i++) {
			// quakes[i].properties.mag = (2.5 + i*0.1) % 9; // For testing colors and sizes
			addQuake(quakes[i]);
		}
		
		_quakes(quakes);
	}
	
	function addQuake(quake) {
		var magnitude = quake.properties.mag;
		var coords = quake.geometry.coordinates;
		
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(coords[1],coords[0]),
			map: _map,
			icon: SEISMO.util.getMarkerIcon(magnitude)
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			console.log(quake);
			
			if (_selectedQuake()) {
				_selectedQuake().stopAnimation();
			}
			
			var quakeVm = new QuakeViewModel(quake, marker);
			quakeVm.startAnimation();
			
			_selectedQuake(quakeVm);
		});
	}
	
	this.load = load;
	this.updateQuakes = updateQuakes;
	this.selectedQuake = _selectedQuake;
};

function QuakeViewModel(quakeModel, marker) {
	var self = this;
	
	var _title = ko.observable(quakeModel.properties.place);
	var _magnitude = ko.observable(quakeModel.properties.mag);
	var _magnitudeType = ko.observable(quakeModel.properties.magnitudeType);
	
	var _originalIcon = SEISMO.util.getMarkerIcon(_magnitude());
	var _animationId;
	
	function stopAnimation() {
		window.clearInterval(_animationId);
		marker.setIcon(_originalIcon);
	}
	
	function startAnimation() {
		var maxScale = _originalIcon.scale * 2;
		var animationIcon = SEISMO.util.getMarkerIcon(_magnitude());
		var direction = 1;
		
		_animationId = window.setInterval(function() {
			if (animationIcon.scale > maxScale) {
				direction = -1
			} else if (animationIcon.scale < (0.5 * _originalIcon.scale)) {
				direction = 1;
			}
			
			animationIcon.scale = animationIcon.scale + direction;
			marker.setIcon(animationIcon);
		}, 30);
	}
	
	self.title = _title;
	self.magnitudeType = _magnitudeType;
	self.color = SEISMO.util.getColorForMagnitude(_magnitude());
	self.startAnimation = startAnimation;
	self.stopAnimation = stopAnimation;
	self.formattedMagnitude = function () { return SEISMO.util.numberWithOneDecimalPoint(_magnitude()); };
}

$(document).ready(function() {
	window.eqfeed_callback = function (results) {
		SEISMO.vm.updateQuakes(results.features);
	};
	
	SEISMO.init();
	ko.applyBindings(SEISMO.vm);
});

var SEISMO = (function () {
	var self = {};
	var _vm = new SeismoViewModel();

	function loadFeed() {
		var feed = new USGSFeed();
		feed.getPastMonthOver45();
	}
	
	function init() {
		var feed = new USGSFeed();

		_vm.load(function onLoaded() {
			loadFeed();
		});
	}

	self.init = init;
	self.vm = _vm;
	
	return self;
}());

SEISMO.util = SEISMO.util || {
	_adjustColorLuminance: function(hex, lum) {
		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
	},
	
	numberWithOneDecimalPoint: function(nbr) {
		return (Math.round(nbr * 10) / 10).toFixed(1);
	},
	
	getStrokeWeightForMagnitude: function(magnitude) {
		if (magnitude < 5.5) { return 1.0; }
		if (magnitude < 6.5) { return 2.0; }
		if (magnitude < 7.5) { return 3.0; }
		if (magnitude < 8.5) { return 4.0; }
		
		return 5.0;
	},
	
	getMarkerIcon: function(magnitude) {
		var color = SEISMO.util.getColorForMagnitude(magnitude);
		var scale = Math.pow(magnitude, 2) - 3 * magnitude; // Some random algo to scale circles
		scale = Math.max(scale, 4);
		
		return {
			path: google.maps.SymbolPath.CIRCLE,
			fillOpacity: 0.2,
			fillColor: color,
			strokeOpacity: 1.0,
			strokeColor: color,
			strokeWeight: SEISMO.util.getStrokeWeightForMagnitude(magnitude), 
			scale: scale
		}; 
	},
	
	getColorForMagnitude: function(magnitude) {
		var color;
		
		if (magnitude <= 3.0) { color = '#00ffff'; }
		else if (magnitude <= 3.4) { color = '#00fdd8'; }
		else if (magnitude <= 3.8) { color = '#00fbac'; }
		else if (magnitude <= 4.2) { color = '#00fa82'; }
		else if (magnitude <= 4.6) { color = '#00f954'; }
		else if (magnitude <= 5.0) { color = '#00f92f'; }
		else if (magnitude <= 5.3) { color = '#00f92b'; }
		else if (magnitude <= 5.6) { color = '#15f928'; }
		else if (magnitude <= 5.9) { color = '#ffec00'; }
		else if (magnitude <= 6.2) { color = '#ffbf00'; }
		else if (magnitude <= 6.5) { color = '#ff9300'; }
		else if (magnitude <= 6.8) { color = '#ff6700'; }
		else if (magnitude <= 7.1) { color = '#ff3200'; }
		else if (magnitude <= 7.5) { color = '#ff0000'; }
		else if (magnitude <= 8.0) { color = '#db0000'; }
		else if (magnitude <= 8.5) { color = '#a40000'; }
		else { color = '#480000'; }
		
		return SEISMO.util._adjustColorLuminance(color, -0.1)
	}
}













