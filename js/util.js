se.util.numberWithOneDecimalPoint = function(nbr) {
	return (Math.round(nbr * 10) / 10).toFixed(1);
};

se.util.getStrokeWeightForMagnitude = function(magnitude) {
	if (magnitude < 5.5) { return 1.0; }
	if (magnitude < 6.5) { return 1.5; }
	if (magnitude < 7.5) { return 2.0; }
	if (magnitude < 8.5) { return 2.5; }
		
	return 3.0;
};
	
se.util.getMarkerIcon = function(magnitude) {
	var color = se.util.getColorForMagnitude(magnitude);
	var scale = Math.pow(magnitude, 1.8) - 2.3 * magnitude; // Some random algo to scale circles
	scale = Math.max(scale, 4);
		
	return {
		path: google.maps.SymbolPath.CIRCLE,
		fillOpacity: 0.2,
		fillColor: color,
		strokeOpacity: 1.0,
		strokeColor: color,
		strokeWeight: se.util.getStrokeWeightForMagnitude(magnitude), 
		scale: scale
	}; 
};
	
se.util.getColorForMagnitude = function(magnitude) {
	function adjustLuminance(hex, lum) {
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
	}
		
	var color;
	
	// #00A8AB
// 	#60A72C
// 	#C5E12A
// 	#F7F933
// 	#F0B303
// 	#F59105
// 	#F54806
// 	#F6220F
	// #9A223D
	
	if (magnitude < 4.5) { color = '#00A8AB'; }
	else if (magnitude < 5.3) { color = '#60A72C'; }
	// else if (magnitude < 5.9) { color = '#C5E12A'; }
	// else if (magnitude < 6.6) { color = '#F7F933'; }
	else if (magnitude < 6.1) { color = '#F0B303'; }
	else if (magnitude < 6.9) { color = '#F59105'; }
	else if (magnitude < 7.7) { color = '#F54806'; }
	else if (magnitude < 8.5) { color = '#F6220F'; }
	else { color = '#9A223D'; }
	
	// if (magnitude <= 3.0) { color = '#00ffff'; }
// 	else if (magnitude <= 3.4) { color = '#00fdd8'; }
// 	else if (magnitude <= 3.8) { color = '#00fbac'; }
// 	else if (magnitude <= 4.2) { color = '#00fa82'; }
// 	else if (magnitude <= 4.6) { color = '#00f954'; }
// 	else if (magnitude <= 5.0) { color = '#00f92f'; }
// 	else if (magnitude <= 5.3) { color = '#00f92b'; }
// 	else if (magnitude <= 5.6) { color = '#15f928'; }
// 	else if (magnitude <= 5.9) { color = '#ffec00'; }
// 	else if (magnitude <= 6.2) { color = '#ffbf00'; }
// 	else if (magnitude <= 6.5) { color = '#ff9300'; }
// 	else if (magnitude <= 6.8) { color = '#ff6700'; }
// 	else if (magnitude <= 7.1) { color = '#ff3200'; }
// 	else if (magnitude <= 7.5) { color = '#ff0000'; }
// 	else if (magnitude <= 8.0) { color = '#db0000'; }
// 	else if (magnitude <= 8.5) { color = '#a40000'; }
// 	else { color = '#480000'; }
		
	return adjustLuminance(color, 0)
};

se.util.capitalize = function (str) {
	return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};





















