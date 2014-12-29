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
	self.color = se.util.getColorForMagnitude(_magnitude());
	self.startAnimation = startAnimation;
	self.stopAnimation = stopAnimation;
	self.significance = _significance;
	self.feltReports = _feltReports;
	self.formattedMagnitude = function () { return se.util.numberWithOneDecimalPoint(_magnitude()); };
}