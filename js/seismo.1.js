var se = se || {};
se.m = se.m || {};
se.vm = se.vm || {};
se.util = se.util || {};

$(document).ready(function() {
	function onResult(results) {
		se.quakeMap.updateQuakes(results.features);
		se.quakeMap.isBusy(false);
	};
	
	se.quakeMap = new se.vm.QuakeMap();
	se.quakeMap.isBusy(true);
	
	se.quakeMap.load(function () {
		var feed = new se.m.USGSFeed();
		feed.getPastMonthOver45(onResult);
	});
		
	ko.applyBindings(se.quakeMap);
});














