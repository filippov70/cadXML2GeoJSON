/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Converter = require('./cadXML2GeoJSON.js');
var map;

StartParse();

function StartParse() {

    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));

    // https://bitbucket.org/surenrao/xml2json
    // http://www.chrome-allow-file-access-from-file.com/
    var parsedData;
    $.get('./testdata/doc2161974.xml', function (xml) {
        //var json = $.xml2json(xml).CadastralBlocks;
        // $("#data").html('<code>'+JSON.stringify(json)+'</code>');
        //console.log(Converter.GeoJSON);
        parsedData = Converter.GeoJSON(xml, true);
    }).success(
            function () {
                // http://www.color-hex.com/
                var parcelFill = new ol.style.Fill({
                    color: '#bbf144'
                });
                var zoneFill = new ol.style.Fill({
                    color: '#009fff'
                });
                var realtylStroke = new ol.style.Stroke({
                    color: '#FF00C1',
                    width: 1.2
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
                    color: '#143388',
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
                    stroke: realtylStroke
                });
                var quartalStyle = new ol.style.Style({
                    stroke: quartalStroke
                });
                var boundStyle = new ol.style.Style({
                    stroke: boundStroke
                });
                var zoneStyle = new ol.style.Style({
                    fill: zoneFill,
                    stroke: zoneStroke
                });


                var quartalSource = new ol.source.Vector({
                    projection: 'EPSG:3857'
                });
                var parcelSource = new ol.source.Vector({
                    features: (new ol.format.GeoJSON()).readFeatures(parsedData.geoJSONParcels),
                    projection: 'EPSG:3857'
                });
                var realtySource = new ol.source.Vector({
                    features: (new ol.format.GeoJSON()).readFeatures(parsedData.geoJSONRealty),
                    projection: 'EPSG:3857'
                });
                var realtyCollectionSource = new ol.source.Vector({
                    features: (new ol.format.GeoJSON()).readFeatures(parsedData.geoJSONRealtyGeometryCollection),
                    projection: 'EPSG:3857'
                });
                var boundSource = new ol.source.Vector({
                    projection: 'EPSG:3857'
                });
                var zoneSource = new ol.source.Vector({
                    projection: 'EPSG:3857'
                });
                var quartalLayer = new ol.layer.Vector({
                    title: 'Квартал',
                    source: quartalSource,
                    style: quartalStyle,
                    opacity: 0.54326
                });
                var parcelLayer = new ol.layer.Vector({
                    title: 'ЗУ',
                    source: parcelSource,
                    style: parcelStyle,
                    opacity: 0.5
                });
                var realtyLayer = new ol.layer.Vector({
                    title: 'ОКС',
                    source: realtySource,
                    style: realtyStyle,
                    opacity: 0.5
                }); 
                var realtyCollectionLayer = new ol.layer.Vector({
                    title: 'ОКС сложные',
                    source: realtyCollectionSource,
                    style: realtyStyle,
                    opacity: 0.5
                }); 
                var boundLayer = new ol.layer.Vector({
                    title: 'Границы',
                    source: boundSource,
                    style: boundStyle,
                    opacity: 0.5
                });
                var zoneLayer = new ol.layer.Vector({
                    title: 'Зоны',
                    source: zoneSource,
                    style: zoneStyle,
                    opacity: 0.5
                });

                var format = new ol.format.GeoJSON();

                var realtysCollection = parsedData.geoJSONRealtyGeometryCollection;

                for (var i = 0; i < realtysCollection.features.length; i++) {
                    //console.log(realtysCollection.features[i]);
                    var geometryObj = format.readGeometry(realtysCollection.features[i].geometry);
                    var feature = new ol.Feature({
                        geometry: geometryObj//,
                                //propA : parsedData.features[i].properties.cadnumber
                    });
                    realtyCollectionLayer.getSource().addFeature(feature);
                }
                var zones = parsedData.geoJSONZones;
                for (var i = 0; i < zones.features.length; i++) {
                    var geometryObj = format.readGeometry(zones.features[i].geometry);
                    var feature = new ol.Feature({
                        geometry: geometryObj//,
                                //propA : parsedData.features[i].properties.cadnumber
                    });
                    zoneLayer.getSource().addFeature(feature);
                }
                var quartal = parsedData.geoJSONQuartal;
                for (var i = 0; i < quartal.features.length; i++) {
                    var geometryObj = format.readGeometry(quartal.features[i].geometry);
                    var feature = new ol.Feature({
                        geometry: geometryObj//,
                                //propA : parsedData.features[i].properties.cadnumber
                    });
                    quartalLayer.getSource().addFeature(feature);
                }
                var bounds = parsedData.geoJSONBounds;
                for (var i = 0; i < bounds.features.length; i++) {
                    var geometryObj = format.readGeometry(bounds.features[i].geometry);
                    var feature = new ol.Feature({
                        geometry: geometryObj//,
                                //propA : parsedData.features[i].properties.cadnumber
                    });
                    boundLayer.getSource().addFeature(feature);
                }

                map = new ol.Map({
                    target: 'map',
                    layers: [
                        new ol.layer.Tile({
                            source: new ol.source.OSM(),
                            opacity: 0.5,
                            visible: true,
                            title: 'Подложка'
                        }),
                        new ol.layer.Tile({
                            title: 'ПКК',
                            visible: false,
                            source: new ol.source.TileArcGISRest({
                                url: 'http://maps.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/'
                            })
                        }),
                        quartalLayer, boundLayer, zoneLayer,
                        parcelLayer, realtyLayer, realtyCollectionLayer
                    ],
                    overlays: [overlay],
                    view: new ol.View({
                        projection: 'EPSG:3857',
                        center: [0, 0],
                        zoom: 7
                    })
                });
                map.getView().fit(quartalLayer.getSource().getExtent(), map.getSize());
                var layerSwitcher = new ol.control.LayerSwitcher({
                    tipLabel: 'Слои' // Optional label for button
                });
                map.addControl(layerSwitcher);
//                var graticule = new ol.Graticule({
//                    map: map
//                });
                map.on('singleclick', function (evt) {
                    var features = [];
                    var coordinate = evt.coordinate;

                    for (var i = 0; i < map.getLayers().getLength(); i++) {
                        var layer = map.getLayers().item(i);
                        if (layer instanceof ol.layer.Vector) {
                            var feature = layer.getSource().getClosestFeatureToCoordinate(evt.coordinate);
                            if (feature) {
                                features.push(feature);
                            }
                        }
                    }
                    createInfoContetnt(features, coordinate);
                });

                function createInfoContetnt(features, coordinate) {
                    var contenInfo = '';
//                    var st = '';
//                    var cat = '';
//                    var name = '';
//                    var ut = '';
                    for (var i = 0; i < features.length; i++) {
//                        var f = features[i];
//                        if (f.get('cadastreNumber') !== undefined) {
//                            cn = f.get('cadastreNumber');
//                        }
//                        if (f.get('State') !== undefined) {
//                            st = f.get('State');
//                        }
//                        if (f.get('Name') !== undefined) {
//                            name = f.get('Name');
//                        }
//                        if (f.get('Category') !== undefined) {
//                            cat = f.get('Category');
//                        }
//                        if (f.get('Category') !== undefined) {
//                            cat = f.get('Category');
//                        }
                        console.log(features[i].getProperties());
//                    }
//                    var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
//                            coordinate, 'EPSG:3857', 'EPSG:4326'));
//                        var json = JSON.stringify(features[i].getProperties());
//                        contenInfo += '<p>' + $('').jJsonViewer(json) + '</p>';
                        
//                    content.innerHTML = '<p>Кадастровый номер:<code>' + cn +
//                            '</code></p><p>Объект:<code>' + name + '</code></p>' +
//                            '</code><p>Статус:<code>' + st + '</code></p>' +
//                            '</code><p>Категория земель:<code>' + cat + '</code></p>';
                        //content.jJsonViewer(features[i].getProperties()); 
                    }
//                    content.innerHTML = contenInfo;
//                    overlay.setPosition(coordinate);
                }
            });

}
