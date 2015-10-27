/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Converter = require('./cadXML2GeoJSON.js');
var map;
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
                var parcelFill = new ol.style.Fill({
                    color: '#a3bdc8'
                });
                var realtylFill = new ol.style.Fill({
                    color: '#f3e5f1'
                });

                var stroke = new ol.style.Stroke({
                    color: '#313030',
                    width: 1
                });
                var boundStroke = new ol.style.Stroke({
                    color: '#004C00',
                    width: 1
                });
                var zoneStroke = new ol.style.Stroke({
                    color: '#ee6a50',
                    width: 1
                });
                var quartalStroke = new ol.style.Stroke({
                    color: '#3b202f',
                    width: 2
                });
                var text = new ol.style.Text({
                    // TODO Подписать кадастровые номера
                });

                // Стили
                var parcelStyle = new ol.style.Style({
                    fill: parcelFill,
                    stroke: stroke
                });
                var realtyStyle = new ol.style.Style({
                    fill: realtylFill,
                    stroke: stroke
                });
                var quartalStyle = new ol.style.Style({
                    stroke: quartalStroke
                });
                var boundStyle = new ol.style.Style({
                    stroke: boundStroke
                });
                var zoneStyle = new ol.style.Style({
                    stroke: zoneStroke
                });


                var quartalSource = new ol.source.Vector({
                    //projection: 'EPSG:3857'
                });
                var parcelSource = new ol.source.Vector({
                    //projection: 'EPSG:3857'
                });
                var realtySource = new ol.source.Vector({
                    //projection: 'EPSG:3857'
                });
                var boundSource = new ol.source.Vector({
                    //projection: 'EPSG:3857'
                });
                var zoneSource = new ol.source.Vector({
                    //projection: 'EPSG:3857'
                });
                var quartalLayer = new ol.layer.Vector({
                    source: quartalSource,
                    style: quartalStyle,
                    opacity: 0.5
                });
                var parcelLayer = new ol.layer.Vector({
                    source: parcelSource,
                    style: parcelStyle,
                    opacity: 0.5
                });
                var realtyLayer = new ol.layer.Vector({
                    source: realtySource,
                    style: realtyStyle
                });
                var boundLayer = new ol.layer.Vector({
                    source: boundSource,
                    style: boundStyle,
                    opacity: 0.5
                });
                var zoneLayer = new ol.layer.Vector({
                    source: zoneSource,
                    style: zoneStyle,
                    opacity: 0.5
                });

                var format = new ol.format.GeoJSON();
                var parcels = parsedData.geoJSONParcels;
                for (i = 0; i < parcels.features.length; i++) {
                    var geometryObj = format.readGeometry(parcels.features[i].geometry);
                    var feature = new ol.Feature({
                        geometry: geometryObj//,
                                //propA : parsedData.features[i].properties.cadnumber
                    });
                    parcelLayer.getSource().addFeature(feature);
                }
                var realtys = parsedData.geoJSONRealty;
                for (i = 0; i < realtys.features.length; i++) {
                    var geometryObj = format.readGeometry(realtys.features[i].geometry);
                    var feature = new ol.Feature({
                        geometry: geometryObj//,
                                //propA : parsedData.features[i].properties.cadnumber
                    });
                    realtyLayer.getSource().addFeature(feature);
                }
                var zones = parsedData.geoJSONZones;
                for (i = 0; i < zones.features.length; i++) {
                    var geometryObj = format.readGeometry(zones.features[i].geometry);
                    var feature = new ol.Feature({
                        geometry: geometryObj//,
                                //propA : parsedData.features[i].properties.cadnumber
                    });
                    zoneLayer.getSource().addFeature(feature);
                }
                var quartal = parsedData.geoJSONQuartal;
                for (i = 0; i < quartal.features.length; i++) {
                    var geometryObj = format.readGeometry(quartal.features[i].geometry);
                    var feature = new ol.Feature({
                        geometry: geometryObj//,
                                //propA : parsedData.features[i].properties.cadnumber
                    });
                    quartalLayer.getSource().addFeature(feature);
                }
                var bounds = parsedData.geoJSONBounds;
                for (i = 0; i < bounds.features.length; i++) {
                    var geometryObj = format.readGeometry(bounds.features[i].geometry);
                    var feature = new ol.Feature({
                        geometry: geometryObj//,
                                //propA : parsedData.features[i].properties.cadnumber
                    });
                    boundLayer.getSource().addFeature(feature);
                }

                //$("#txt").jJsonViewer(parsedData);
//                for (var key in parsedData) {
//                    console.log('Создано объектов ' + key + ': ' + parsedData[key].features.length);
//                    for (i = 0; i < parsedData[key].features.length; i++) {
//                        var geometryObj = format
//                                .readGeometry(parsedData[key].features[i].geometry);
//                        var feature = new ol.Feature({
//                            geometry: geometryObj//,
//                                    //propA : parsedData.features[i].properties.cadnumber
//                        });
//                        vectorLayer.getSource().addFeature(feature);
//                    }
//                }

                map = new ol.Map({
                    target: 'map',
                    layers: [
//                        new ol.layer.Tile({
//                            source: new ol.source.OSM()
//                        }),
                        quartalLayer, boundLayer, zoneLayer,
                        parcelLayer, realtyLayer
                    ],
                    view: new ol.View({
                        center: [0, 0],
                        zoom: 7
                    })
                });
                map.getView().fit(quartalLayer.getSource().getExtent(), map.getSize());

                map.on('singleclick', function (evt) {
//                    var viewResolution = /** @type {number} */ (map.getView().getResolution());
//                    var url = parcelSource.getFeatureInfoUrl(
//                            evt.coordinate, viewResolution, 'EPSG:3857', {
//                                'INFO_FORMAT': 'application/json' //text/xml, application/geojson, text/html
//                            });
//                    if (url) {
//
//                        createInfoContetnt(url);
//                    }
            
                });

                function createInfoContetnt(url) {
                    $.ajax({
                        url: url
                    }).done(function (data) {
                        //$('#infocontent').html('');
//                        if (data.features.length > 0) {
//                            $('#info').modal({
//                                show: true,
//                                remote: ''
//                            });
//                            var additionalInfo = '';
//                            if (data.features[0].properties.add_prop !== undefined) {
//
//                            }
//                            $('#infocontent').html(
//                                    "<h2>" + data.features[0].properties.name + "</h2>" +
//                                    "</br><h3>" + data.features[0].properties.a_strt +
//                                    " " + data.features[0].properties.a_hsnmbr + "</h3>"
//                                    );
//                        }
                        console.log(data);
                        
                    }
                    );

                }
            });

}



