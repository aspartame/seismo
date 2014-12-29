var se = se || {};
se.m = se.m || {};
se.vm = se.vm || {};
se.util = se.util || {};

$(document).ready(function() {
	window.eqfeed_callback = function (results) {
		se.quakeMap.updateQuakes(results.features);
	};
	
	se.quakeMap = new se.vm.QuakeMap();
		
	se.quakeMap.load(function () {
		var feed = new se.m.USGSFeed();
		feed.getPastMonthOver45();
	});
		
	ko.applyBindings(se.quakeMap);
});














