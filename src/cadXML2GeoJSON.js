var ES = require('./spatial/EntitySpatial.js');

module.exports.GeoJSON = function (xmlData) {
//	var Parcels;
//	var Quartal;
//	var Zones;
//	var Bounds;
    
    var geoJSON = {
        type: "FeatureCollection",
        features : []
    };
    
    console.log('start parse');
    var AllData = $.xml2json(xmlData).CadastralBlocks.CadastralBlock;
    for(var i=0; i<AllData.Parcels.Parcel.length; i++) {
        if (AllData.Parcels.Parcel[i].EntitySpatial !== null) {
            geoJSON.features.push(ES.getEntitySpatial(AllData.Parcels.Parcel[i].EntitySpatial));
            //console.log(AllData.Parcels.Parcel[i].EntitySpatial);
        }
        // Многоконтурный
        else if (AllData.Parcels.Parcel[i].Contours) {
            
        }
        else {
            console.log('Нет описания пространственной составляющей');
        }
    }
    return geoJSON;
};