se.m = se.m || {};

se.m.Quake = function(quakeModel, marker) {
	var self = this;
	
	var _magnitude = se.util.numberWithOneDecimalPoint(quakeModel.properties['mag']);
	var _originalIcon = se.util.getMarkerIcon(_magnitude);
	var _animationId;
	
	function stopAnimation() {
		window.clearInterval(_animationId);
		marker.setIcon(_originalIcon);
	}
	
	function startAnimation() {
		var maxScale = _originalIcon.scale * 2;
		var animationIcon = se.util.getMarkerIcon(_magnitude);
		
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
	
	self.title = quakeModel.properties['place'] || '';
	self.magnitudeType = quakeModel.properties['magnitudeType'] || '';
	self.significance = quakeModel.properties['sig'] || '0';
	self.feltReports = quakeModel.properties['felt'] || 0;
	self.magnitude = _magnitude;
	self.tsunami = !! quakeModel.properties['tsunami'];
	self.externalUrl = quakeModel.properties['url'];
	self.color = se.util.getColorForMagnitude(_magnitude);
	self.startAnimation = startAnimation;
	self.stopAnimation = stopAnimation;
	
	self.getMagnitudeScale = function () {
		return se.util.capitalize(self.magnitudeType);
	};
	
	self.getTimeAgo = function () {
		var timestamp = quakeModel.properties['time'];
		return moment(parseInt(timestamp, 10)).fromNow();
	};
	
	// if (self.tsunami) {
// 		console.log(quakeModel);
// 	}
}

















