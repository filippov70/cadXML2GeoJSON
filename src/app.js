/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Converter = require('./cadXML2GeoJSON.js');

StartParse();

function StartParse() {
	// https://bitbucket.org/surenrao/xml2json
    // http://www.chrome-allow-file-access-from-file.com/
    var parsedData;
	$.get('./testdata/doc8500717.xml', function(xml) {
		//var json = $.xml2json(xml).CadastralBlocks;
		// $("#data").html('<code>'+JSON.stringify(json)+'</code>');
		//console.log(Converter.GeoJSON);
        parsedData = Converter.GeoJSON(xml);
		//console.log();

	}).success(
		function() {
				var vectorLayer = new ol.layer.Vector({
					source : new ol.source.GeoJSON({
						projection : 'EPSG:3857'// ,
					    //object: parsedData
					})
				});

				var format = new ol.format.GeoJSON();
				for (i = 0; i < parsedData.features.length; i++) {
                    console.log(parsedData.features[i].geometry);
					var geometryObj = format
							.readGeometry(parsedData.features[i].geometry);
					var feature = new ol.Feature({
						geometry : geometryObj//,
						//propA : parsedData.features[i].properties.cadnumber
					});
					vectorLayer.getSource().addFeature(feature);
				}

				var map = new ol.Map({
					target : 'map',
					layers : [
                        new ol.layer.Tile({
                            source: new ol.source.OSM()
                        }),
					vectorLayer ],
					view : new ol.View({
						center : [ 0, 0 ],
						zoom : 7
					})
				});
				map.getView().fitExtent(vectorLayer.getSource().getExtent(),
						map.getSize());
			});
}

