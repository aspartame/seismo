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
				}
			});
			
			onLoaded();
		});
	}
	
	function updateQuakes(quakes) {
		for (var i = 0; i < quakes.length; i++) {
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
			} else if (animationIcon.scale < _originalIcon.scale) {
				direction = 1;
			}
			
			animationIcon.scale = animationIcon.scale + direction;
	      	marker.setIcon(animationIcon);
	  	}, 40);
	}
	
	self.title = _title;
	self.magnitude = _magnitude;
	self.color = SEISMO.util.getColorForMagnitude(_magnitude());
	self.startAnimation = startAnimation;
	self.stopAnimation = stopAnimation;
}

$(document).ready(function() {
	window.eqfeed_callback = function (results) {
		console.log(results);
		
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
	getMarkerIcon: function(magnitude) {
		return {
			path: google.maps.SymbolPath.CIRCLE,
			fillOpacity: 0.2,
			fillColor: SEISMO.util.getColorForMagnitude(magnitude),
			strokeOpacity: 1.0,
			strokeColor: SEISMO.util.getColorForMagnitude(magnitude),
			strokeWeight: 1.0, 
			scale: Math.pow(magnitude, 1.8) - 0.8 * magnitude // Some random algo to scale circles
		}; 
	},
	getColorForMagnitude: function(magnitude) {
		// @colorMag40: #00CCCC;
		// @colorMag50: #00CC66;
		// @colorMag55: #00CC00;
		// @colorMag60: #66CC00;
		// @colorMag65: #4C9900;
		// @colorMag70: #CCCC00;
		// @colorMag75: #CC6600;
		// @colorMag80: #CC0000;
		// @colorMag85: #990000;
		// @colorMag90: #660000;
		// @colorMag10: #330000;
		
		if (magnitude < 4.0) { return '#00CCCC'; }
		if (magnitude < 5.0) { return '#00CC66'; }
		if (magnitude < 5.5) { return '#00CC00'; }
		if (magnitude < 6.0) { return '#66CC00'; }
		if (magnitude < 6.5) { return '#4C9900'; }
		if (magnitude < 7.0) { return '#BBBB00'; }
		if (magnitude < 7.5) { return '#CC6600'; }
		if (magnitude < 8.0) { return '#CC0000'; }
		if (magnitude < 8.5) { return '#990000'; }
		if (magnitude < 9.0) { return '#660000'; }
		
		return '#330000';
	}
}















