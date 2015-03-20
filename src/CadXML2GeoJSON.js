/**
 * New node file
 */


module.exports = cadXML2GeoJSON;
	
var cadXML2GeoJSON = (function() {
	
	this.getGeoJSON = function (xmlData) {
		
	};
	
	return this;
})();

if (typeof module != "undefined" && module !== null && module.exports) 
	module.exports = cadXML2GeoJSON;
else if (typeof define === "function" && define.amd) 
	define(function() {return cadXML2GeoJSON;});