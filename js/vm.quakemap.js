se.vm = se.vm || {};

se.vm.QuakeMap = function () {
	var _map;
	var _quakes = ko.observableArray();
	var _selectedQuake = ko.observable();
	var _totalNbrOfQuakes = ko.observable();
	var _isBusy = ko.observable(false);
	
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
		_totalNbrOfQuakes(quakes.length);
		
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
			icon: se.util.getMarkerIcon(magnitude)
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			console.log(quake);
			
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
};





















