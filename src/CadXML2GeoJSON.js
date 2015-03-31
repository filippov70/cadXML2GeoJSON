/* global module */

/**
 * New node file
 */


module.exports = cadXML2GeoJSON;
	
var cadXML2GeoJSON = (function() {
	var Parcels;
	var Quartal;
	var Zones;
	var Bounds;
	this.getGeoJSON = function (xmlData) {
		var json = $.xml2json(xml).CadastralBlocks;
		//if 
	};
	
	return this;
})();

if (typeof module != "undefined" && module !== null && module.exports) 
	module.exports = cadXML2GeoJSON;
else if (typeof define === "function" && define.amd) 
	define(function() {return cadXML2GeoJSON;});