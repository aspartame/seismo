se.vm = se.vm || {};

se.vm.QuakeMap = function () {
	var _map;
	var _quakes = ko.observableArray();
	var _selectedQuake = ko.observable();
	var _totalNbrOfQuakes = ko.observable(0);
	var _isBusy = ko.observable(false);
	var _applyAnimation = ko.observable(false);
	
	function load(onLoaded) {
		// Adam Krogh
		// http://atmist.com
		var mapStyles = [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},
		{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},
		{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},
		{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},
		{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},
		{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},
		{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},
		{},{"featureType":"road","stylers":[{"lightness":20}]}];
		
		google.maps.event.addDomListener(window, 'load', function () {
			var mapOptions = {
				mapTypeId: google.maps.MapTypeId.TERRAIN,
				center: { lat: 0, lng: 0},
				zoom: 2,
				styles: mapStyles
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
	
	/* Kind of messy algo, done this way so animation when adding markers looks OK */
	function updateQuakes(quakes) {
		_applyAnimation(true);
		
		var i = 0;
		var step = 27;
		var interval = window.setInterval(function() {
			if (i < (quakes.length - step)) {
				var j = 0;
				
				while (j++ < step) {
					addQuake(quakes[i++]);
				}
			} else if (i < quakes.length) {
				while (i < quakes.length) {
					addQuake(quakes[i++]);
				}
			} else {
				window.clearInterval(interval);
				_applyAnimation(false);
			}
			
			_totalNbrOfQuakes(i);
		}, 1);
		
		_quakes(quakes);
	}
	
	function addQuake(quake) {
		var magnitude = quake.properties.mag;
		var coords = quake.geometry.coordinates;
		
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(coords[1],coords[0]),
			map: _map,
			icon: se.util.getMarkerIcon(magnitude)
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			if (_selectedQuake()) {
				_selectedQuake().stopAnimation();
			}
			
			var quakeVm = new se.m.Quake(quake, marker);
			quakeVm.startAnimation();
			
			_selectedQuake(quakeVm);
		});
	}
	
	this.load = load;
	this.updateQuakes = updateQuakes;
	this.selectedQuake = _selectedQuake;
	this.totalNbrOfQuakes = _totalNbrOfQuakes;
	this.isBusy = _isBusy;
	this.applyAnimation = _applyAnimation;
};





















