(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                    features: (new ol.format.GeoJSON()).readFeatures(parsedData.geoJSONParcels)
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
//                var parcels = parsedData.geoJSONParcels;
//                for (i = 0; i < parcels.features.length; i++) {
//                    var geometryObj = format.readGeometry(parcels.features[i].geometry);
//                    var feature = new ol.Feature({
//                        geometry: geometryObj//,
//                                //propA : parsedData.features[i].properties.cadnumber
//                    });
//                    parcelLayer.getSource().addFeature(feature);
//                }
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
                    overlays: [overlay],
                    view: new ol.View({
                        center: [0, 0],
                        zoom: 7
                    })
                });
                map.getView().fit(quartalLayer.getSource().getExtent(), map.getSize());

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
                    var cn = '';
                    for (var i = 0; i < features.length; i++) {
                        var f = features[i];
                        if (f.get('cadastreNumber')!== undefined) {
                            cn = f.get('cadastreNumber');
                        }
                        //console.log(features[i].getProperties());
                    }
                    var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                            coordinate, 'EPSG:3857', 'EPSG:4326'));

                    content.innerHTML = '<p>Кадастровый номер:</p><code>' + cn +'</code>';
                    overlay.setPosition(coordinate);
                }
            });

}




},{"./cadXML2GeoJSON.js":3}],2:[function(require,module,exports){
/* 
 * The MIT License
 *
 * Copyright 2015 filippov.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';
// Dicts

// Статус объекта недвижимости
var dStates = {
    '01': 'Ранее учтенный',
    '05': 'Временный',
    '06': 'Учтенный',
    '07': 'Снят с учета',
    '08': 'Аннулированный'
};

var ParcelProperties;

// Functions
function getValueFromDict(Key, Dict) {
    var retVal = '';
    switch (Dict) {
        case 'dStates':
        {
            retVal = '06';
        }
    }
    return retVal;
}

module.exports.getProperties = function (Feature, FeatureType) {
    switch (FeatureType) {
        case 'Parcel' :
        {
            ParcelProperties = {
                cadastreNumber: '', // require
                Sate: '01', // dStates require
                DateCreated: '',
                Name: '', //dNames require
                Category: '', // dCategories // require
                Area: {// requre
                    Area: 0, // require
                    Unit: '', //dUnit require
                    Inaccuracy: '' // d20_2
                },
                Utilization: {// require
                    ByDoc: '',
                    Utilization: '' // dUtilization require
                }
            };
            ParcelProperties.cadastreNumber = Feature.CadastralNumber;
            ParcelProperties.Sate = getValueFromDict(Feature.State, 'dStates');
            break;
        }
    }
    return {
        properties: ParcelProperties
    };
};
},{}],3:[function(require,module,exports){
var ES = require('./spatial/EntitySpatial.js');
var Props = require('./cadProps');

module.exports.GeoJSON = function (xmlData) {

    var geoJSONQuartal = {
        type: "FeatureCollection",
        features: []
    };
    var geoJSONBounds = {
        type: "FeatureCollection",
        features: []
    };
    var geoJSONZones = {
        type: "FeatureCollection",
        features: []
    };
    var geoJSONParcels = {
        'type': 'FeatureCollection',
        'features': []
    };
    var geoJSONRealty = {
        type: "FeatureCollection",
        features: []
    };

    var AllData = $.xml2json(xmlData).CadastralBlocks.CadastralBlock;
    //console.log(AllData);

    // Обработка квартала. Не может быть многоконтурным           
    if (AllData.SpatialData !== null) {
        var spObj = ES.getEntitySpatial(AllData.SpatialData.EntitySpatial, false);
        if ((spObj === undefined) || (spObj.length === 0)) {
            console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
        }
        // Квартал
        var feature = {
            properties: {},
            geometry: {}
        };
        feature.geometry = spObj;
        // Остальные свойства....

        geoJSONQuartal.features.push(feature);
    } else {
        console.log('Нет описания пространственной составляющей квартала');
    }

    // Обработка границ. Не могут быть многоконтурными
    if (AllData.Bounds !== null) {
        if (AllData.Bounds.Bound.splice) {
            for (var i = 0; i < AllData.Bounds.Bound.length; i++) {
                if (AllData.Bounds.Bound[i].Boundaries.Boundary.splice) {
                    for (var k = 0; k < AllData.Bounds.Bound[i].Boundaries.Boundary.length; k++) {
                        if (AllData.Bounds.Bound[i].Boundaries.Boundary[k].EntitySpatial !== null) {
                            var spObj = ES.getEntitySpatial(AllData.Bounds.Bound[i].Boundaries.Boundary[k].EntitySpatial, false);
                            if ((spObj === undefined) || (spObj.length === 0)) {
                                console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
                                continue;
                            }
                            // Граница
                            var feature = {
                                properties: {},
                                geometry: {}
                            };
                            feature.geometry = spObj;
                            // Остальные свойства....

                            geoJSONBounds.features.push(feature);
                        } else {
                            console.log('Нет описания пространственной составляющей границы');
                        }
                    }
                } else {
                    var spObj = ES.getEntitySpatial(AllData.Bounds.Bound[i].Boundaries.Boundary.EntitySpatial, false);
                    if ((spObj === undefined) || (spObj.length === 0)) {
                        console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
                        continue;
                    }
                    // Граница
                    var feature = {
                        properties: {},
                        geometry: {}
                    };
                    feature.geometry = spObj;
                    // Остальные свойства....

                    geoJSONBounds.features.push(feature);
                }
            }
        } else {
            var spObj = ES.getEntitySpatial(AllData.Bounds.Bound.Boundaries.Boundary.EntitySpatial, false);
            if ((spObj === undefined) || (spObj.length === 0)) {
                console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
            }
            // Граница
            var feature = {
                properties: {},
                geometry: {}
            };
            feature.geometry = spObj;
            // Остальные свойства....

            geoJSONBounds.features.push(feature);
        }
    }
    // Обработка зон. Не могут быть многоконтурными
    if (AllData.Zones !== null) {
        if (AllData.Zones.Zone.splice) {
            for (var i = 0; i < AllData.Zones.Zone.length; i++) {
                if (AllData.Zones.Zone[i].EntitySpatial !== null) {
                    var spObj = ES.getEntitySpatial(AllData.Zones.Zone[i].EntitySpatial, false);
                    if ((spObj === undefined) || (spObj.length === 0)) {
                        console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
                        continue;
                    }
                    // Зона
                    var feature = {
                        properties: {},
                        geometry: {}
                    };
                    feature.geometry = spObj;
                    // Остальные свойства....

                    geoJSONZones.features.push(feature);
                } else {
                    console.log('Нет описания пространственной составляющей зоны');
                }
            }
        } else {
            if (AllData.Zones.Zone.EntitySpatial !== null) {
                var spObj = ES.getEntitySpatial(AllData.Zones.Zone.EntitySpatial, false);
                if ((spObj === undefined) || (spObj.length === 0)) {
                    console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
                }
                // Зона
                var feature = {
                    properties: {},
                    geometry: {}
                };
                feature.geometry = spObj;
                // Остальные свойства....

                geoJSONZones.features.push(feature);
            } else {
                console.log('Нет описания пространственной составляющей зоны');
            }
        }
    }
    // Обработка всех земельных учатков и их частей
    for (var i = 0; i < AllData.Parcels.Parcel.length; i++) {

        if (AllData.Parcels.Parcel[i].EntitySpatial !== null) {
            var spObj = ES.getEntitySpatial(AllData.Parcels.Parcel[i].EntitySpatial, false);
            if ((spObj === undefined) || (spObj.length === 0)) {
                continue;
            }

        }
        // Многоконтурный
        else if (AllData.Parcels.Parcel[i].Contours) {

        } else {
            console.log('Нет описания пространственной составляющей');
        }
        // Земельный участок
        var feature = {
            'type': 'Feature'
                    //geometry: {}
        };
        feature.geometry = spObj;
        // Остальные свойства....
        var props = Props.getProperties(AllData.Parcels.Parcel[i], 'Parcel');
        if (props) {
            feature.properties = props.properties;
        }

        geoJSONParcels.features.push(feature);
    }

    // Обработка пунктов ОМС



    return {
        geoJSONQuartal: geoJSONQuartal,
        geoJSONBounds: geoJSONBounds,
        geoJSONZones: geoJSONZones,
        geoJSONParcels: geoJSONParcels,
        geoJSONRealty: geoJSONRealty
    };
};

},{"./cadProps":2,"./spatial/EntitySpatial.js":4}],4:[function(require,module,exports){
/**
 * Модуль обработки геометрии типа полигон.
 * Один внешний контур и 0 или более внутренних контуров-"дырок"
 * 
 * GeoJSON geometry типа tEntitySpatialLandOut
 */

//"geometry": {
//    "type": "Polygon",
//    "coordinates": [
//      [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
//        [100.0, 1.0], [100.0, 0.0] ]
//      ]
//  }


module.exports.getEntitySpatial = function(EntitySpatialObj, partOfMultu) {
	
//	this.geometry = {
//        type: '',
//		coordinates: []
//	};
    
    //var EntitySpatial = [];
    var Area = 0.0;
    
    // Вычисление площади замкнутого контура
    function polygonArea(Xs, Ys, numPoints) { 
        var area = 0;   
        var j = numPoints-1;
        for (var i=0; i<numPoints; i++)
        { area = area +  ((Xs[j])+(Xs[i])) * ((Ys[j])-(Ys[i])); 
            j = i;  //j is previous vertex to i
        }
        return Math.abs(area/2);
    }
    
    // Создание одного замкнутого контура
    function createContour(SpatialElement) {
        var xs = [];
        var ys = [];
        var contour = [];

        for (var j = 0; j < SpatialElement.SpelementUnit.length; j++) {
            var point = SpatialElement.SpelementUnit[j];
            var xy = [];
            xs.push(parseFloat(point.Ordinate.Y));
            ys.push(parseFloat(point.Ordinate.X));
            xy.push(parseFloat(point.Ordinate.Y));
            xy.push(parseFloat(point.Ordinate.X));
            contour.push(xy);
        }
        Area = polygonArea(xs, ys, xs.length);
        //console.log(Area);
        return contour;
    }
    
	if ((EntitySpatialObj !== undefined) && (EntitySpatialObj !== null)) {
        var cntrs = [];
        // Утинная типизация для проверки наличия дырок в полигоне
        // В Росреестре не следят за порядком контуров полигона
        if (EntitySpatialObj.SpatialElement.splice) {
            //console.log('Полигон с дырками');
            
            var MaxArea;
            var MaxAreaIdx = 0;
            for (var k = 0; k < EntitySpatialObj.SpatialElement.length; k++) {
                var contour = EntitySpatialObj.SpatialElement[k];
                var cnt = createContour(contour);
                cntrs.push(cnt);
                if(Area > MaxArea) {
                    MaxArea = Area;
                    MaxAreaIdx = k;
                }
            }
            // Перемещаем основной (наружний) контур в начало массива
            if (MaxAreaIdx > 0) {
                var mainCnt = cntrs.splice(MaxAreaIdx, 1);
                cntrs.splice(0, 0, mainCnt);
                //console.log('Номер основного контура был ' + MaxAreaIdx);
            }
            // Если это для многоконтурного объекта, то возвращем массив контуров
            if (partOfMultu) { 
                return cntrs;
            }
            
            // Если это для простого объекта, то возвращем объект geometry
            else {
                return {
                    type: "Polygon",
                    coordinates: cntrs
                };
            }
        } else {
            var contour = EntitySpatialObj.SpatialElement;
            var polygon = createContour(contour);
            cntrs.push(polygon);
            // Если это для многоконтурного объекта, то возвращем массив контуров
            if (partOfMultu) {
                return cntrs;
            }
            // Если это для простого объекта, то возвращем объект geometry
            else {
                return {
                    type: "Polygon",
                    coordinates: cntrs
                };
            }
        }
    }
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFByb3BzLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL3NwYXRpYWwvRW50aXR5U3BhdGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25QQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogXG4gKiBUbyBjaGFuZ2UgdGhpcyBsaWNlbnNlIGhlYWRlciwgY2hvb3NlIExpY2Vuc2UgSGVhZGVycyBpbiBQcm9qZWN0IFByb3BlcnRpZXMuXG4gKiBUbyBjaGFuZ2UgdGhpcyB0ZW1wbGF0ZSBmaWxlLCBjaG9vc2UgVG9vbHMgfCBUZW1wbGF0ZXNcbiAqIGFuZCBvcGVuIHRoZSB0ZW1wbGF0ZSBpbiB0aGUgZWRpdG9yLlxuICovXG5cbnZhciBDb252ZXJ0ZXIgPSByZXF1aXJlKCcuL2NhZFhNTDJHZW9KU09OLmpzJyk7XG52YXIgbWFwO1xuU3RhcnRQYXJzZSgpO1xuXG5mdW5jdGlvbiBTdGFydFBhcnNlKCkge1xuXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cCcpO1xuICAgIHZhciBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWNvbnRlbnQnKTtcbiAgICB2YXIgY2xvc2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWNsb3NlcicpO1xuXG4gICAgY2xvc2VyLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG92ZXJsYXkuc2V0UG9zaXRpb24odW5kZWZpbmVkKTtcbiAgICAgICAgY2xvc2VyLmJsdXIoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICB2YXIgb3ZlcmxheSA9IG5ldyBvbC5PdmVybGF5KC8qKiBAdHlwZSB7b2x4Lk92ZXJsYXlPcHRpb25zfSAqLyAoe1xuICAgICAgICBlbGVtZW50OiBjb250YWluZXIsXG4gICAgICAgIGF1dG9QYW46IHRydWUsXG4gICAgICAgIGF1dG9QYW5BbmltYXRpb246IHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyNTBcbiAgICAgICAgfVxuICAgIH0pKTtcblxuICAgIC8vIGh0dHBzOi8vYml0YnVja2V0Lm9yZy9zdXJlbnJhby94bWwyanNvblxuICAgIC8vIGh0dHA6Ly93d3cuY2hyb21lLWFsbG93LWZpbGUtYWNjZXNzLWZyb20tZmlsZS5jb20vXG4gICAgdmFyIHBhcnNlZERhdGE7XG4gICAgJC5nZXQoJy4vdGVzdGRhdGEvZG9jODUwMDcxNy54bWwnLCBmdW5jdGlvbiAoeG1sKSB7XG4gICAgICAgIC8vdmFyIGpzb24gPSAkLnhtbDJqc29uKHhtbCkuQ2FkYXN0cmFsQmxvY2tzO1xuICAgICAgICAvLyAkKFwiI2RhdGFcIikuaHRtbCgnPGNvZGU+JytKU09OLnN0cmluZ2lmeShqc29uKSsnPC9jb2RlPicpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKENvbnZlcnRlci5HZW9KU09OKTtcbiAgICAgICAgcGFyc2VkRGF0YSA9IENvbnZlcnRlci5HZW9KU09OKHhtbCk7XG4gICAgfSkuc3VjY2VzcyhcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vXG4gICAgICAgICAgICAgICAgdmFyIHBhcmNlbEZpbGwgPSBuZXcgb2wuc3R5bGUuRmlsbCh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2EzYmRjOCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcmVhbHR5bEZpbGwgPSBuZXcgb2wuc3R5bGUuRmlsbCh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2YzZTVmMSdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHJva2UgPSBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMzEzMDMwJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRTdHJva2UgPSBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDA0QzAwJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgem9uZVN0cm9rZSA9IG5ldyBvbC5zdHlsZS5TdHJva2Uoe1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNlZTZhNTAnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBxdWFydGFsU3Ryb2tlID0gbmV3IG9sLnN0eWxlLlN0cm9rZSh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNiMjAyZicsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSBuZXcgb2wuc3R5bGUuVGV4dCh7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8g0J/QvtC00L/QuNGB0LDRgtGMINC60LDQtNCw0YHRgtGA0L7QstGL0LUg0L3QvtC80LXRgNCwXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDQodGC0LjQu9C4XG4gICAgICAgICAgICAgICAgdmFyIHBhcmNlbFN0eWxlID0gbmV3IG9sLnN0eWxlLlN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogcGFyY2VsRmlsbCxcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHJva2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcmVhbHR5U3R5bGUgPSBuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBmaWxsOiByZWFsdHlsRmlsbCxcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHJva2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbFN0eWxlID0gbmV3IG9sLnN0eWxlLlN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBxdWFydGFsU3Ryb2tlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kU3R5bGUgPSBuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBzdHJva2U6IGJvdW5kU3Ryb2tlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHpvbmVTdHlsZSA9IG5ldyBvbC5zdHlsZS5TdHlsZSh7XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogem9uZVN0cm9rZVxuICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbFNvdXJjZSA9IG5ldyBvbC5zb3VyY2UuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgLy9wcm9qZWN0aW9uOiAnRVBTRzozODU3J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBwYXJjZWxTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmVzOiAobmV3IG9sLmZvcm1hdC5HZW9KU09OKCkpLnJlYWRGZWF0dXJlcyhwYXJzZWREYXRhLmdlb0pTT05QYXJjZWxzKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciByZWFsdHlTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIC8vcHJvamVjdGlvbjogJ0VQU0c6Mzg1NydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIC8vcHJvamVjdGlvbjogJ0VQU0c6Mzg1NydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgem9uZVNvdXJjZSA9IG5ldyBvbC5zb3VyY2UuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgLy9wcm9qZWN0aW9uOiAnRVBTRzozODU3J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBxdWFydGFsTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBxdWFydGFsU291cmNlLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogcXVhcnRhbFN0eWxlLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyY2VsTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBwYXJjZWxTb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiBwYXJjZWxTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC41XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlYWx0eUxheWVyID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogcmVhbHR5U291cmNlLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogcmVhbHR5U3R5bGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRMYXllciA9IG5ldyBvbC5sYXllci5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGJvdW5kU291cmNlLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogYm91bmRTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC41XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHpvbmVMYXllciA9IG5ldyBvbC5sYXllci5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHpvbmVTb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB6b25lU3R5bGUsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdCA9IG5ldyBvbC5mb3JtYXQuR2VvSlNPTigpO1xuLy8gICAgICAgICAgICAgICAgdmFyIHBhcmNlbHMgPSBwYXJzZWREYXRhLmdlb0pTT05QYXJjZWxzO1xuLy8gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcmNlbHMuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbi8vICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvbWV0cnlPYmogPSBmb3JtYXQucmVhZEdlb21ldHJ5KHBhcmNlbHMuZmVhdHVyZXNbaV0uZ2VvbWV0cnkpO1xuLy8gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlPYmovLyxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Byb3BBIDogcGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmNhZG51bWJlclxuLy8gICAgICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgICAgICAgIHBhcmNlbExheWVyLmdldFNvdXJjZSgpLmFkZEZlYXR1cmUoZmVhdHVyZSk7XG4vLyAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHJlYWx0eXMgPSBwYXJzZWREYXRhLmdlb0pTT05SZWFsdHk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHJlYWx0eXMuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0LnJlYWRHZW9tZXRyeShyZWFsdHlzLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlPYmovLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlYWx0eUxheWVyLmdldFNvdXJjZSgpLmFkZEZlYXR1cmUoZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB6b25lcyA9IHBhcnNlZERhdGEuZ2VvSlNPTlpvbmVzO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB6b25lcy5mZWF0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvbWV0cnlPYmogPSBmb3JtYXQucmVhZEdlb21ldHJ5KHpvbmVzLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlPYmovLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHpvbmVMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbCA9IHBhcnNlZERhdGEuZ2VvSlNPTlF1YXJ0YWw7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHF1YXJ0YWwuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0LnJlYWRHZW9tZXRyeShxdWFydGFsLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlPYmovLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHF1YXJ0YWxMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYm91bmRzID0gcGFyc2VkRGF0YS5nZW9KU09OQm91bmRzO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBib3VuZHMuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0LnJlYWRHZW9tZXRyeShib3VuZHMuZmVhdHVyZXNbaV0uZ2VvbWV0cnkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IG5ldyBvbC5GZWF0dXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeU9iai8vLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Byb3BBIDogcGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmNhZG51bWJlclxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYm91bmRMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vJChcIiN0eHRcIikuakpzb25WaWV3ZXIocGFyc2VkRGF0YSk7XG4vLyAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGFyc2VkRGF0YSkge1xuLy8gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQodC+0LfQtNCw0L3QviDQvtCx0YrQtdC60YLQvtCyICcgKyBrZXkgKyAnOiAnICsgcGFyc2VkRGF0YVtrZXldLmZlYXR1cmVzLmxlbmd0aCk7XG4vLyAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcnNlZERhdGFba2V5XS5mZWF0dXJlcy5sZW5ndGg7IGkrKykge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvbWV0cnlPYmogPSBmb3JtYXRcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVhZEdlb21ldHJ5KHBhcnNlZERhdGFba2V5XS5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJvcEEgOiBwYXJzZWREYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuY2FkbnVtYmVyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB2ZWN0b3JMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuLy8gICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1hcCA9IG5ldyBvbC5NYXAoe1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6ICdtYXAnLFxuICAgICAgICAgICAgICAgICAgICBsYXllcnM6IFtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgbmV3IG9sLmxheWVyLlRpbGUoe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBuZXcgb2wuc291cmNlLk9TTSgpXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgcXVhcnRhbExheWVyLCBib3VuZExheWVyLCB6b25lTGF5ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJjZWxMYXllciwgcmVhbHR5TGF5ZXJcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheXM6IFtvdmVybGF5XSxcbiAgICAgICAgICAgICAgICAgICAgdmlldzogbmV3IG9sLlZpZXcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyOiBbMCwgMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB6b29tOiA3XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbWFwLmdldFZpZXcoKS5maXQocXVhcnRhbExheWVyLmdldFNvdXJjZSgpLmdldEV4dGVudCgpLCBtYXAuZ2V0U2l6ZSgpKTtcblxuICAgICAgICAgICAgICAgIG1hcC5vbignc2luZ2xlY2xpY2snLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29vcmRpbmF0ZSA9IGV2dC5jb29yZGluYXRlO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFwLmdldExheWVycygpLmdldExlbmd0aCgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllciA9IG1hcC5nZXRMYXllcnMoKS5pdGVtKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxheWVyIGluc3RhbmNlb2Ygb2wubGF5ZXIuVmVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSBsYXllci5nZXRTb3VyY2UoKS5nZXRDbG9zZXN0RmVhdHVyZVRvQ29vcmRpbmF0ZShldnQuY29vcmRpbmF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZlYXR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlSW5mb0NvbnRldG50KGZlYXR1cmVzLCBjb29yZGluYXRlKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUluZm9Db250ZXRudChmZWF0dXJlcywgY29vcmRpbmF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY24gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmZWF0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGYgPSBmZWF0dXJlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLmdldCgnY2FkYXN0cmVOdW1iZXInKSE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbiA9IGYuZ2V0KCdjYWRhc3RyZU51bWJlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhmZWF0dXJlc1tpXS5nZXRQcm9wZXJ0aWVzKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZG1zID0gb2wuY29vcmRpbmF0ZS50b1N0cmluZ0hETVMob2wucHJvai50cmFuc2Zvcm0oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZSwgJ0VQU0c6Mzg1NycsICdFUFNHOjQzMjYnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29udGVudC5pbm5lckhUTUwgPSAnPHA+0JrQsNC00LDRgdGC0YDQvtCy0YvQuSDQvdC+0LzQtdGAOjwvcD48Y29kZT4nICsgY24gKyc8L2NvZGU+JztcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5zZXRQb3NpdGlvbihjb29yZGluYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxufVxuXG5cblxuIiwiLyogXG4gKiBUaGUgTUlUIExpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgMjAxNSBmaWxpcHBvdi5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG4ndXNlIHN0cmljdCc7XG4vLyBEaWN0c1xuXG4vLyDQodGC0LDRgtGD0YEg0L7QsdGK0LXQutGC0LAg0L3QtdC00LLQuNC20LjQvNC+0YHRgtC4XG52YXIgZFN0YXRlcyA9IHtcbiAgICAnMDEnOiAn0KDQsNC90LXQtSDRg9GH0YLQtdC90L3Ri9C5JyxcbiAgICAnMDUnOiAn0JLRgNC10LzQtdC90L3Ri9C5JyxcbiAgICAnMDYnOiAn0KPRh9GC0LXQvdC90YvQuScsXG4gICAgJzA3JzogJ9Ch0L3Rj9GCINGBINGD0YfQtdGC0LAnLFxuICAgICcwOCc6ICfQkNC90L3Rg9C70LjRgNC+0LLQsNC90L3Ri9C5J1xufTtcblxudmFyIFBhcmNlbFByb3BlcnRpZXM7XG5cbi8vIEZ1bmN0aW9uc1xuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tRGljdChLZXksIERpY3QpIHtcbiAgICB2YXIgcmV0VmFsID0gJyc7XG4gICAgc3dpdGNoIChEaWN0KSB7XG4gICAgICAgIGNhc2UgJ2RTdGF0ZXMnOlxuICAgICAgICB7XG4gICAgICAgICAgICByZXRWYWwgPSAnMDYnO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXRWYWw7XG59XG5cbm1vZHVsZS5leHBvcnRzLmdldFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoRmVhdHVyZSwgRmVhdHVyZVR5cGUpIHtcbiAgICBzd2l0Y2ggKEZlYXR1cmVUeXBlKSB7XG4gICAgICAgIGNhc2UgJ1BhcmNlbCcgOlxuICAgICAgICB7XG4gICAgICAgICAgICBQYXJjZWxQcm9wZXJ0aWVzID0ge1xuICAgICAgICAgICAgICAgIGNhZGFzdHJlTnVtYmVyOiAnJywgLy8gcmVxdWlyZVxuICAgICAgICAgICAgICAgIFNhdGU6ICcwMScsIC8vIGRTdGF0ZXMgcmVxdWlyZVxuICAgICAgICAgICAgICAgIERhdGVDcmVhdGVkOiAnJyxcbiAgICAgICAgICAgICAgICBOYW1lOiAnJywgLy9kTmFtZXMgcmVxdWlyZVxuICAgICAgICAgICAgICAgIENhdGVnb3J5OiAnJywgLy8gZENhdGVnb3JpZXMgLy8gcmVxdWlyZVxuICAgICAgICAgICAgICAgIEFyZWE6IHsvLyByZXF1cmVcbiAgICAgICAgICAgICAgICAgICAgQXJlYTogMCwgLy8gcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICBVbml0OiAnJywgLy9kVW5pdCByZXF1aXJlXG4gICAgICAgICAgICAgICAgICAgIEluYWNjdXJhY3k6ICcnIC8vIGQyMF8yXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBVdGlsaXphdGlvbjogey8vIHJlcXVpcmVcbiAgICAgICAgICAgICAgICAgICAgQnlEb2M6ICcnLFxuICAgICAgICAgICAgICAgICAgICBVdGlsaXphdGlvbjogJycgLy8gZFV0aWxpemF0aW9uIHJlcXVpcmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgUGFyY2VsUHJvcGVydGllcy5jYWRhc3RyZU51bWJlciA9IEZlYXR1cmUuQ2FkYXN0cmFsTnVtYmVyO1xuICAgICAgICAgICAgUGFyY2VsUHJvcGVydGllcy5TYXRlID0gZ2V0VmFsdWVGcm9tRGljdChGZWF0dXJlLlN0YXRlLCAnZFN0YXRlcycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvcGVydGllczogUGFyY2VsUHJvcGVydGllc1xuICAgIH07XG59OyIsInZhciBFUyA9IHJlcXVpcmUoJy4vc3BhdGlhbC9FbnRpdHlTcGF0aWFsLmpzJyk7XG52YXIgUHJvcHMgPSByZXF1aXJlKCcuL2NhZFByb3BzJyk7XG5cbm1vZHVsZS5leHBvcnRzLkdlb0pTT04gPSBmdW5jdGlvbiAoeG1sRGF0YSkge1xuXG4gICAgdmFyIGdlb0pTT05RdWFydGFsID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzOiBbXVxuICAgIH07XG4gICAgdmFyIGdlb0pTT05Cb3VuZHMgPSB7XG4gICAgICAgIHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgZmVhdHVyZXM6IFtdXG4gICAgfTtcbiAgICB2YXIgZ2VvSlNPTlpvbmVzID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzOiBbXVxuICAgIH07XG4gICAgdmFyIGdlb0pTT05QYXJjZWxzID0ge1xuICAgICAgICAndHlwZSc6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICAgICdmZWF0dXJlcyc6IFtdXG4gICAgfTtcbiAgICB2YXIgZ2VvSlNPTlJlYWx0eSA9IHtcbiAgICAgICAgdHlwZTogXCJGZWF0dXJlQ29sbGVjdGlvblwiLFxuICAgICAgICBmZWF0dXJlczogW11cbiAgICB9O1xuXG4gICAgdmFyIEFsbERhdGEgPSAkLnhtbDJqc29uKHhtbERhdGEpLkNhZGFzdHJhbEJsb2Nrcy5DYWRhc3RyYWxCbG9jaztcbiAgICAvL2NvbnNvbGUubG9nKEFsbERhdGEpO1xuXG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINC60LLQsNGA0YLQsNC70LAuINCd0LUg0LzQvtC20LXRgiDQsdGL0YLRjCDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C8ICAgICAgICAgICBcbiAgICBpZiAoQWxsRGF0YS5TcGF0aWFsRGF0YSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuU3BhdGlhbERhdGEuRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0J7QsdGK0LXQutGCINC60LLQsNGA0YLQsNC70LAg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQntCx0YrQtdC60YIg0LHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICB9XG4gICAgICAgIC8vINCa0LLQsNGA0YLQsNC7XG4gICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgfTtcbiAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICBnZW9KU09OUXVhcnRhbC5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfQndC10YIg0L7Qv9C40YHQsNC90LjRjyDQv9GA0L7RgdGC0YDQsNC90YHRgtCy0LXQvdC90L7QuSDRgdC+0YHRgtCw0LLQu9GP0Y7RidC10Lkg0LrQstCw0YDRgtCw0LvQsCcpO1xuICAgIH1cblxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQs9GA0LDQvdC40YYuINCd0LUg0LzQvtCz0YPRgiDQsdGL0YLRjCDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C80LhcbiAgICBpZiAoQWxsRGF0YS5Cb3VuZHMgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKEFsbERhdGEuQm91bmRzLkJvdW5kLnNwbGljZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBBbGxEYXRhLkJvdW5kcy5Cb3VuZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5LnNwbGljZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IEFsbERhdGEuQm91bmRzLkJvdW5kW2ldLkJvdW5kYXJpZXMuQm91bmRhcnkubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5W2tdLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuQm91bmRzLkJvdW5kW2ldLkJvdW5kYXJpZXMuQm91bmRhcnlba10uRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Ce0LHRitC10LrRgiDQutCy0LDRgNGC0LDQu9CwINGBINC/0YPRgdGC0L7QuSDQs9C10L7QvNC10YLRgNC40LXQuSEg0J7QsdGK0LXQutGCINCx0YPQtNC10YIg0L/RgNC+0L/Rg9GJ0LXQvS4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCT0YDQsNC90LjRhtCwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlb0pTT05Cb3VuZHMuZmVhdHVyZXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuSDQs9GA0LDQvdC40YbRiycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5LkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzcE9iaiA9PT0gdW5kZWZpbmVkKSB8fCAoc3BPYmoubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Ce0LHRitC10LrRgiDQutCy0LDRgNGC0LDQu9CwINGBINC/0YPRgdGC0L7QuSDQs9C10L7QvNC10YLRgNC40LXQuSEg0J7QsdGK0LXQutGCINCx0YPQtNC10YIg0L/RgNC+0L/Rg9GJ0LXQvS4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vINCT0YDQsNC90LjRhtCwXG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAgICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICAgICAgICAgICAgICBnZW9KU09OQm91bmRzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLkJvdW5kcy5Cb3VuZC5Cb3VuZGFyaWVzLkJvdW5kYXJ5LkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J7QsdGK0LXQutGCINC60LLQsNGA0YLQsNC70LAg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQntCx0YrQtdC60YIg0LHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JPRgNCw0L3QuNGG0LBcbiAgICAgICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgIGdlb21ldHJ5OiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgIC8vINCe0YHRgtCw0LvRjNC90YvQtSDRgdCy0L7QudGB0YLQstCwLi4uLlxuXG4gICAgICAgICAgICBnZW9KU09OQm91bmRzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINC30L7QvS4g0J3QtSDQvNC+0LPRg9GCINCx0YvRgtGMINC80L3QvtCz0L7QutC+0L3RgtGD0YDQvdGL0LzQuFxuICAgIGlmIChBbGxEYXRhLlpvbmVzICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChBbGxEYXRhLlpvbmVzLlpvbmUuc3BsaWNlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEFsbERhdGEuWm9uZXMuWm9uZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChBbGxEYXRhLlpvbmVzLlpvbmVbaV0uRW50aXR5U3BhdGlhbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuWm9uZXMuWm9uZVtpXS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LrQstCw0YDRgtCw0LvQsCDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCe0LHRitC10LrRgiDQsdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyDQl9C+0L3QsFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IHt9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG5cbiAgICAgICAgICAgICAgICAgICAgZ2VvSlNPTlpvbmVzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuSDQt9C+0L3RiycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChBbGxEYXRhLlpvbmVzLlpvbmUuRW50aXR5U3BhdGlhbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5ab25lcy5ab25lLkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LrQstCw0YDRgtCw0LvQsCDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCe0LHRitC10LrRgiDQsdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vINCX0L7QvdCwXG4gICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICAgICAgICAgIGdlb0pTT05ab25lcy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QtdGCINC+0L/QuNGB0LDQvdC40Y8g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC10L3QvdC+0Lkg0YHQvtGB0YLQsNCy0LvRj9GO0YnQtdC5INC30L7QvdGLJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINCy0YHQtdGFINC30LXQvNC10LvRjNC90YvRhSDRg9GH0LDRgtC60L7QsiDQuCDQuNGFINGH0LDRgdGC0LXQuVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQWxsRGF0YS5QYXJjZWxzLlBhcmNlbC5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIGlmIChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICAvLyDQnNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C5XG4gICAgICAgIGVsc2UgaWYgKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbaV0uQ29udG91cnMpIHtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuScpO1xuICAgICAgICB9XG4gICAgICAgIC8vINCX0LXQvNC10LvRjNC90YvQuSDRg9GH0LDRgdGC0L7QulxuICAgICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgICAgICd0eXBlJzogJ0ZlYXR1cmUnXG4gICAgICAgICAgICAgICAgICAgIC8vZ2VvbWV0cnk6IHt9XG4gICAgICAgIH07XG4gICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG4gICAgICAgIHZhciBwcm9wcyA9IFByb3BzLmdldFByb3BlcnRpZXMoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXSwgJ1BhcmNlbCcpO1xuICAgICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllcyA9IHByb3BzLnByb3BlcnRpZXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZW9KU09OUGFyY2Vscy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgIH1cblxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQv9GD0L3QutGC0L7QsiDQntCc0KFcblxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZW9KU09OUXVhcnRhbDogZ2VvSlNPTlF1YXJ0YWwsXG4gICAgICAgIGdlb0pTT05Cb3VuZHM6IGdlb0pTT05Cb3VuZHMsXG4gICAgICAgIGdlb0pTT05ab25lczogZ2VvSlNPTlpvbmVzLFxuICAgICAgICBnZW9KU09OUGFyY2VsczogZ2VvSlNPTlBhcmNlbHMsXG4gICAgICAgIGdlb0pTT05SZWFsdHk6IGdlb0pTT05SZWFsdHlcbiAgICB9O1xufTtcbiIsIi8qKlxuICog0JzQvtC00YPQu9GMINC+0LHRgNCw0LHQvtGC0LrQuCDQs9C10L7QvNC10YLRgNC40Lgg0YLQuNC/0LAg0L/QvtC70LjQs9C+0L0uXG4gKiDQntC00LjQvSDQstC90LXRiNC90LjQuSDQutC+0L3RgtGD0YAg0LggMCDQuNC70Lgg0LHQvtC70LXQtSDQstC90YPRgtGA0LXQvdC90LjRhSDQutC+0L3RgtGD0YDQvtCyLVwi0LTRi9GA0L7QulwiXG4gKiBcbiAqIEdlb0pTT04gZ2VvbWV0cnkg0YLQuNC/0LAgdEVudGl0eVNwYXRpYWxMYW5kT3V0XG4gKi9cblxuLy9cImdlb21ldHJ5XCI6IHtcbi8vICAgIFwidHlwZVwiOiBcIlBvbHlnb25cIixcbi8vICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuLy8gICAgICBbIFsxMDAuMCwgMC4wXSwgWzEwMS4wLCAwLjBdLCBbMTAxLjAsIDEuMF0sXG4vLyAgICAgICAgWzEwMC4wLCAxLjBdLCBbMTAwLjAsIDAuMF0gXVxuLy8gICAgICBdXG4vLyAgfVxuXG5cbm1vZHVsZS5leHBvcnRzLmdldEVudGl0eVNwYXRpYWwgPSBmdW5jdGlvbihFbnRpdHlTcGF0aWFsT2JqLCBwYXJ0T2ZNdWx0dSkge1xuXHRcbi8vXHR0aGlzLmdlb21ldHJ5ID0ge1xuLy8gICAgICAgIHR5cGU6ICcnLFxuLy9cdFx0Y29vcmRpbmF0ZXM6IFtdXG4vL1x0fTtcbiAgICBcbiAgICAvL3ZhciBFbnRpdHlTcGF0aWFsID0gW107XG4gICAgdmFyIEFyZWEgPSAwLjA7XG4gICAgXG4gICAgLy8g0JLRi9GH0LjRgdC70LXQvdC40LUg0L/Qu9C+0YnQsNC00Lgg0LfQsNC80LrQvdGD0YLQvtCz0L4g0LrQvtC90YLRg9GA0LBcbiAgICBmdW5jdGlvbiBwb2x5Z29uQXJlYShYcywgWXMsIG51bVBvaW50cykgeyBcbiAgICAgICAgdmFyIGFyZWEgPSAwOyAgIFxuICAgICAgICB2YXIgaiA9IG51bVBvaW50cy0xO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8bnVtUG9pbnRzOyBpKyspXG4gICAgICAgIHsgYXJlYSA9IGFyZWEgKyAgKChYc1tqXSkrKFhzW2ldKSkgKiAoKFlzW2pdKS0oWXNbaV0pKTsgXG4gICAgICAgICAgICBqID0gaTsgIC8vaiBpcyBwcmV2aW91cyB2ZXJ0ZXggdG8gaVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhcmVhLzIpO1xuICAgIH1cbiAgICBcbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC+0LTQvdC+0LPQviDQt9Cw0LzQutC90YPRgtC+0LPQviDQutC+0L3RgtGD0YDQsFxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRvdXIoU3BhdGlhbEVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHhzID0gW107XG4gICAgICAgIHZhciB5cyA9IFtdO1xuICAgICAgICB2YXIgY29udG91ciA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIHBvaW50ID0gU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdFtqXTtcbiAgICAgICAgICAgIHZhciB4eSA9IFtdO1xuICAgICAgICAgICAgeHMucHVzaChwYXJzZUZsb2F0KHBvaW50Lk9yZGluYXRlLlkpKTtcbiAgICAgICAgICAgIHlzLnB1c2gocGFyc2VGbG9hdChwb2ludC5PcmRpbmF0ZS5YKSk7XG4gICAgICAgICAgICB4eS5wdXNoKHBhcnNlRmxvYXQocG9pbnQuT3JkaW5hdGUuWSkpO1xuICAgICAgICAgICAgeHkucHVzaChwYXJzZUZsb2F0KHBvaW50Lk9yZGluYXRlLlgpKTtcbiAgICAgICAgICAgIGNvbnRvdXIucHVzaCh4eSk7XG4gICAgICAgIH1cbiAgICAgICAgQXJlYSA9IHBvbHlnb25BcmVhKHhzLCB5cywgeHMubGVuZ3RoKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhBcmVhKTtcbiAgICAgICAgcmV0dXJuIGNvbnRvdXI7XG4gICAgfVxuICAgIFxuXHRpZiAoKEVudGl0eVNwYXRpYWxPYmogIT09IHVuZGVmaW5lZCkgJiYgKEVudGl0eVNwYXRpYWxPYmogIT09IG51bGwpKSB7XG4gICAgICAgIHZhciBjbnRycyA9IFtdO1xuICAgICAgICAvLyDQo9GC0LjQvdC90LDRjyDRgtC40L/QuNC30LDRhtC40Y8g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsNC70LjRh9C40Y8g0LTRi9GA0L7QuiDQsiDQv9C+0LvQuNCz0L7QvdC1XG4gICAgICAgIC8vINCSINCg0L7RgdGA0LXQtdGB0YLRgNC1INC90LUg0YHQu9C10LTRj9GCINC30LAg0L/QvtGA0Y/QtNC60L7QvCDQutC+0L3RgtGD0YDQvtCyINC/0L7Qu9C40LPQvtC90LBcbiAgICAgICAgaWYgKEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQuc3BsaWNlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCfQn9C+0LvQuNCz0L7QvSDRgSDQtNGL0YDQutCw0LzQuCcpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgTWF4QXJlYTtcbiAgICAgICAgICAgIHZhciBNYXhBcmVhSWR4ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb250b3VyID0gRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudFtrXTtcbiAgICAgICAgICAgICAgICB2YXIgY250ID0gY3JlYXRlQ29udG91cihjb250b3VyKTtcbiAgICAgICAgICAgICAgICBjbnRycy5wdXNoKGNudCk7XG4gICAgICAgICAgICAgICAgaWYoQXJlYSA+IE1heEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgTWF4QXJlYSA9IEFyZWE7XG4gICAgICAgICAgICAgICAgICAgIE1heEFyZWFJZHggPSBrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCf0LXRgNC10LzQtdGJ0LDQtdC8INC+0YHQvdC+0LLQvdC+0LkgKNC90LDRgNGD0LbQvdC40LkpINC60L7QvdGC0YPRgCDQsiDQvdCw0YfQsNC70L4g0LzQsNGB0YHQuNCy0LBcbiAgICAgICAgICAgIGlmIChNYXhBcmVhSWR4ID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBtYWluQ250ID0gY250cnMuc3BsaWNlKE1heEFyZWFJZHgsIDEpO1xuICAgICAgICAgICAgICAgIGNudHJzLnNwbGljZSgwLCAwLCBtYWluQ250KTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCfQndC+0LzQtdGAINC+0YHQvdC+0LLQvdC+0LPQviDQutC+0L3RgtGD0YDQsCDQsdGL0LsgJyArIE1heEFyZWFJZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3QvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC80LDRgdGB0LjQsiDQutC+0L3RgtGD0YDQvtCyXG4gICAgICAgICAgICBpZiAocGFydE9mTXVsdHUpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNudHJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRjdGC0L4g0LTQu9GPINC/0YDQvtGB0YLQvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC+0LHRitC10LrRgiBnZW9tZXRyeVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjbnRyc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY29udG91ciA9IEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgcG9seWdvbiA9IGNyZWF0ZUNvbnRvdXIoY29udG91cik7XG4gICAgICAgICAgICBjbnRycy5wdXNoKHBvbHlnb24pO1xuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3QvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC80LDRgdGB0LjQsiDQutC+0L3RgtGD0YDQvtCyXG4gICAgICAgICAgICBpZiAocGFydE9mTXVsdHUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY250cnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRjdGC0L4g0LTQu9GPINC/0YDQvtGB0YLQvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC+0LHRitC10LrRgiBnZW9tZXRyeVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjbnRyc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59OyJdfQ==
