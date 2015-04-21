var ES = require('./cadastre/EntitySpatial.js');

module.exports.GeoJSON = function (xmlData) {
//	var Parcels;
//	var Quartal;
//	var Zones;
//	var Bounds;
    console.log('start parse');
    var AllData = $.xml2json(xmlData).CadastralBlocks.CadastralBlock;
    for(var i=0; i<AllData.Parcels.Parcel.length; i++) {
        ES.getEntitySpatial(AllData.Parcels.Parcel[i].EntitySpatial);
        console.log(AllData.Parcels.Parcel[i].EntitySpatial);
    }
};