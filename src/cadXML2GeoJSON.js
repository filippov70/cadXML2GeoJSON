
var ES = require('./cadastre/EntitySpatial.js');

module.exports = function() {
	var Parcels;
	var Quartal;
	var Zones;
	var Bounds;
	this.getGeoJSON = function (xmlData) {
		var AllData = $.xml2json(xmlData).CadastralBlocks;
		for(var i=0; i<AllData.Parcels.Parcel.length; i++) {
			ES.getEntitySpatial(AllData.Parcels.Parcel[i].EntitySpatial);
            console.log(AllData.Parcels.Parcel[i].EntitySpatial);
		}
	};
	return this;
};

//if (typeof module != "undefined" && module !== null && module.exports) 
//	module.exports = cadXML2GeoJSON;
//else if (typeof define === "function" && define.amd) 
//	define(function() {return cadXML2GeoJSON;});