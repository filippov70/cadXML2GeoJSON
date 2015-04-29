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
    $.get('./testdata/doc8500717.xml', function (xml) {
        //var json = $.xml2json(xml).CadastralBlocks;
        // $("#data").html('<code>'+JSON.stringify(json)+'</code>');
        //console.log(Converter.GeoJSON);
        parsedData = Converter.GeoJSON(xml);
    }).success(
            function () {
                // http://www.color-hex.com/
                var fill = new ol.style.Fill({
                    color: '#a3bdc8'
                });
                var stroke = new ol.style.Stroke({
                    color: '#313030',
                    width: 1
                });
                var text = new ol.style.Text({
                    // TODO Подписать кадастровые номера
                });
                var styles = [
                    new ol.style.Style({
                        //fill: fill,
                        stroke: stroke
                    })
                ];
                var vectorLayer = new ol.layer.Vector({
                    source: new ol.source.GeoJSON({
                        projection: 'EPSG:3857'

                    }),
                    style: styles,
                    opacity: 0.5
                });

                var format = new ol.format.GeoJSON();
                for(var key in parsedData) {
                    console.log('Создано объектов ' + key + ': ' + parsedData[key].features.length);
                    for (i = 0; i < parsedData[key].features.length; i++) {
                        var geometryObj = format
                                .readGeometry(parsedData[key].features[i].geometry);
                        var feature = new ol.Feature({
                            geometry: geometryObj//,
                                    //propA : parsedData.features[i].properties.cadnumber
                        });
                        vectorLayer.getSource().addFeature(feature);
                    }
                }    
                var map = new ol.Map({
                    target: 'map',
                    layers: [
//                        new ol.layer.Tile({
//                            source: new ol.source.OSM()
//                        }),
                        vectorLayer],
                    view: new ol.View({
                        center: [0, 0],
                        zoom: 7
                    })
                });
                map.getView().fitExtent(vectorLayer.getSource().getExtent(),
                        map.getSize());
            });
}

