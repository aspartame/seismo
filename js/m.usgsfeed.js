se.m = se.m || {};

se.m.USGSFeed = function () {
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
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojsonp', callback);
	}
	
	this.getPastMonthSignificant = function (callback) {
		getFeed('http://earthquake.usgs.gov/earthquakes/feed/geojsonp/significant/month', callback);
	}
};
