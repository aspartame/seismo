se.m = se.m || {};

se.m.Quake = function(quakeModel, marker) {
	var self = this;
	
	var _title = ko.observable(quakeModel.properties['place']);
	var _magnitude = ko.observable(quakeModel.properties['mag']);
	var _magnitudeType = ko.observable(quakeModel.properties['magnitudeType']);
	var _significance = ko.observable(quakeModel.properties['sig'] || '0');
	var _feltReports = ko.observable(quakeModel.properties['felt'] || 0);
	
	var _originalIcon = se.util.getMarkerIcon(_magnitude());
	var _animationId;
	
	function stopAnimation() {
		window.clearInterval(_animationId);
		marker.setIcon(_originalIcon);
	}
	
	function startAnimation() {
		var maxScale = _originalIcon.scale * 2;
		var animationIcon = se.util.getMarkerIcon(_magnitude());
		
		animationIcon.scale = 1;
		animationIcon.strokeOpacity = 1;
		
		_animationId = window.setInterval(function() {
			if (animationIcon.scale < 30) {
				animationIcon.scale += 1;
				
				animationIcon.strokeOpacity = animationIcon.strokeOpacity <= 0.03 ? 0 : animationIcon.strokeOpacity - 0.03;
				animationIcon.fillOpacity = animationIcon.fillOpacity <= 0.004 ? 0 : animationIcon.fillOpacity - 0.004;
			} else {
				animationIcon.scale = 1;
				animationIcon.strokeOpacity = _originalIcon.strokeOpacity;
				animationIcon.fillOpacity = _originalIcon.fillOpacity;
			}
			
			marker.setIcon(animationIcon);
		}, 30);
	}
	
	self.title = _title;
	self.magnitudeType = _magnitudeType;
	self.color = se.util.getColorForMagnitude(_magnitude());
	self.startAnimation = startAnimation;
	self.stopAnimation = stopAnimation;
	self.significance = _significance;
	self.feltReports = _feltReports;
	
	self.magnitude = function () { 
		return se.util.numberWithOneDecimalPoint(_magnitude()); 
	};
	
	self.magnitudeScale = function () {
		var scale = _magnitudeType();
		return se.util.capitalize(scale);
	};
	
	self.timeAgo = function () {
		var timestamp = quakeModel.properties['time'];
		return moment(parseInt(timestamp, 10)).fromNow();
	};
}

















