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
                    var viewResolution = /** @type {number} */ (map.getView().getResolution());
                    var url = parcelSource.getFeatureInfoUrl(
                            evt.coordinate, viewResolution, 'EPSG:3857', {
                                'INFO_FORMAT': 'application/json' //text/xml, application/geojson, text/html
                            });
                    if (url) {

                        createInfoContetnt(url);
                    }
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

// Properties

var ParcelProperties = {
    CadastreNumber: '', // require
    Sate : '01', // dStates require
    DateCreated: '',
    
    Name: '', //dNames requre
    Category : '', // dCategories // require
    Area: { // requre
        Area: 0, // require
        Unit: '', //dUnit require
        Inaccuracy: '' // d20_2
    },
    Utilization: { // require
        ByDoc: '',
        Utilization: '' // dUtilization require
    }
};


// Functions
function getValueFromDict(Key, Dict) {
    var retVal = '';
    switch (Dict) {
        case 'dStates': {
                
        }
    }
    return retVal;
}

module.exports.getProperties = function(Feature, FeatureType) {
    switch (FeatureType){
        case 'Parcel' : {
                ParcelProperties.CadastreNumber = Feature.CadastralNumber;
                ParcelProperties.Sate = getValueFromDict(Feature.State);
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
        features : []
    };
    var geoJSONBounds = {
        type: "FeatureCollection",
        features : []
    };
    var geoJSONZones = {
        type: "FeatureCollection",
        features : []
    };
    var geoJSONParcels = {
        type: "FeatureCollection",
        features : []
    };
    var geoJSONRealty = {
        type: "FeatureCollection",
        features : []
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
    }
    else {
        console.log('Нет описания пространственной составляющей квартала');
    }

    // Обработка границ. Не могут быть многоконтурными
    if (AllData.Bounds !== null) {
        if (AllData.Bounds.Bound.splice) {
            for(var i=0; i<AllData.Bounds.Bound.length; i++) {
                if (AllData.Bounds.Bound[i].Boundaries.Boundary.splice) {
                    for (var k=0; k<AllData.Bounds.Bound[i].Boundaries.Boundary.length; k++){
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
                        }
                        else {
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
        }
        else {
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
            for(var i=0; i<AllData.Zones.Zone.length; i++) {
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
                }
                else {
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
            }
            else {
                console.log('Нет описания пространственной составляющей зоны');
            }
        }
    }
    // Обработка всех земельных учатков и их частей
    for(var i=0; i<AllData.Parcels.Parcel.length; i++) {
                
        if (AllData.Parcels.Parcel[i].EntitySpatial !== null) {
            var spObj = ES.getEntitySpatial(AllData.Parcels.Parcel[i].EntitySpatial, false);
            if ((spObj === undefined) || (spObj.length === 0)) { 
                console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
                continue;
            }
            // Земельный участок
            var feature = {
                properties: {},
                geometry: {}
            };
            feature.geometry = spObj;
            // Остальные свойства....
            var props = Props.getProperties(spObj, 'Parcel');
            if (props) {
                feature.properties = props;
            }
            
            geoJSONParcels.features.push(feature);
        }
        // Многоконтурный
        else if (AllData.Parcels.Parcel[i].Contours) {
            
        }
        else {
            console.log('Нет описания пространственной составляющей');
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFByb3BzLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL3NwYXRpYWwvRW50aXR5U3BhdGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogXG4gKiBUbyBjaGFuZ2UgdGhpcyBsaWNlbnNlIGhlYWRlciwgY2hvb3NlIExpY2Vuc2UgSGVhZGVycyBpbiBQcm9qZWN0IFByb3BlcnRpZXMuXG4gKiBUbyBjaGFuZ2UgdGhpcyB0ZW1wbGF0ZSBmaWxlLCBjaG9vc2UgVG9vbHMgfCBUZW1wbGF0ZXNcbiAqIGFuZCBvcGVuIHRoZSB0ZW1wbGF0ZSBpbiB0aGUgZWRpdG9yLlxuICovXG5cbnZhciBDb252ZXJ0ZXIgPSByZXF1aXJlKCcuL2NhZFhNTDJHZW9KU09OLmpzJyk7XG52YXIgbWFwO1xuU3RhcnRQYXJzZSgpO1xuXG5mdW5jdGlvbiBTdGFydFBhcnNlKCkge1xuICAgIC8vIGh0dHBzOi8vYml0YnVja2V0Lm9yZy9zdXJlbnJhby94bWwyanNvblxuICAgIC8vIGh0dHA6Ly93d3cuY2hyb21lLWFsbG93LWZpbGUtYWNjZXNzLWZyb20tZmlsZS5jb20vXG4gICAgdmFyIHBhcnNlZERhdGE7XG4gICAgJC5nZXQoJy4vdGVzdGRhdGEvZG9jODUwMDcxNy54bWwnLCBmdW5jdGlvbiAoeG1sKSB7XG4gICAgICAgIC8vdmFyIGpzb24gPSAkLnhtbDJqc29uKHhtbCkuQ2FkYXN0cmFsQmxvY2tzO1xuICAgICAgICAvLyAkKFwiI2RhdGFcIikuaHRtbCgnPGNvZGU+JytKU09OLnN0cmluZ2lmeShqc29uKSsnPC9jb2RlPicpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKENvbnZlcnRlci5HZW9KU09OKTtcbiAgICAgICAgcGFyc2VkRGF0YSA9IENvbnZlcnRlci5HZW9KU09OKHhtbCk7XG4gICAgfSkuc3VjY2VzcyhcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vXG4gICAgICAgICAgICAgICAgdmFyIHBhcmNlbEZpbGwgPSBuZXcgb2wuc3R5bGUuRmlsbCh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2EzYmRjOCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcmVhbHR5bEZpbGwgPSBuZXcgb2wuc3R5bGUuRmlsbCh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2YzZTVmMSdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHJva2UgPSBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMzEzMDMwJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRTdHJva2UgPSBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDA0QzAwJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgem9uZVN0cm9rZSA9IG5ldyBvbC5zdHlsZS5TdHJva2Uoe1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNlZTZhNTAnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBxdWFydGFsU3Ryb2tlID0gbmV3IG9sLnN0eWxlLlN0cm9rZSh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNiMjAyZicsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSBuZXcgb2wuc3R5bGUuVGV4dCh7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8g0J/QvtC00L/QuNGB0LDRgtGMINC60LDQtNCw0YHRgtGA0L7QstGL0LUg0L3QvtC80LXRgNCwXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDQodGC0LjQu9C4XG4gICAgICAgICAgICAgICAgdmFyIHBhcmNlbFN0eWxlID0gbmV3IG9sLnN0eWxlLlN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogcGFyY2VsRmlsbCxcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHJva2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcmVhbHR5U3R5bGUgPSBuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBmaWxsOiByZWFsdHlsRmlsbCxcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHJva2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbFN0eWxlID0gbmV3IG9sLnN0eWxlLlN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBxdWFydGFsU3Ryb2tlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kU3R5bGUgPSBuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBzdHJva2U6IGJvdW5kU3Ryb2tlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHpvbmVTdHlsZSA9IG5ldyBvbC5zdHlsZS5TdHlsZSh7XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogem9uZVN0cm9rZVxuICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbFNvdXJjZSA9IG5ldyBvbC5zb3VyY2UuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgLy9wcm9qZWN0aW9uOiAnRVBTRzozODU3J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBwYXJjZWxTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIC8vcHJvamVjdGlvbjogJ0VQU0c6Mzg1NydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcmVhbHR5U291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICAvL3Byb2plY3Rpb246ICdFUFNHOjM4NTcnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kU291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICAvL3Byb2plY3Rpb246ICdFUFNHOjM4NTcnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHpvbmVTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIC8vcHJvamVjdGlvbjogJ0VQU0c6Mzg1NydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbExheWVyID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogcXVhcnRhbFNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHF1YXJ0YWxTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC41XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmNlbExheWVyID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogcGFyY2VsU291cmNlLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogcGFyY2VsU3R5bGUsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciByZWFsdHlMYXllciA9IG5ldyBvbC5sYXllci5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHJlYWx0eVNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHJlYWx0eVN0eWxlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBib3VuZFNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGJvdW5kU3R5bGUsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciB6b25lTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB6b25lU291cmNlLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogem9uZVN0eWxlLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBmb3JtYXQgPSBuZXcgb2wuZm9ybWF0Lkdlb0pTT04oKTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyY2VscyA9IHBhcnNlZERhdGEuZ2VvSlNPTlBhcmNlbHM7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcmNlbHMuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0LnJlYWRHZW9tZXRyeShwYXJjZWxzLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlPYmovLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmNlbExheWVyLmdldFNvdXJjZSgpLmFkZEZlYXR1cmUoZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZWFsdHlzID0gcGFyc2VkRGF0YS5nZW9KU09OUmVhbHR5O1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCByZWFsdHlzLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9tZXRyeU9iaiA9IGZvcm1hdC5yZWFkR2VvbWV0cnkocmVhbHR5cy5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJvcEEgOiBwYXJzZWREYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuY2FkbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWFsdHlMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgem9uZXMgPSBwYXJzZWREYXRhLmdlb0pTT05ab25lcztcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgem9uZXMuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0LnJlYWRHZW9tZXRyeSh6b25lcy5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJvcEEgOiBwYXJzZWREYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuY2FkbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB6b25lTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHF1YXJ0YWwgPSBwYXJzZWREYXRhLmdlb0pTT05RdWFydGFsO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBxdWFydGFsLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9tZXRyeU9iaiA9IGZvcm1hdC5yZWFkR2VvbWV0cnkocXVhcnRhbC5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJvcEEgOiBwYXJzZWREYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuY2FkbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBxdWFydGFsTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IHBhcnNlZERhdGEuZ2VvSlNPTkJvdW5kcztcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYm91bmRzLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9tZXRyeU9iaiA9IGZvcm1hdC5yZWFkR2VvbWV0cnkoYm91bmRzLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlPYmovLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyQoXCIjdHh0XCIpLmpKc29uVmlld2VyKHBhcnNlZERhdGEpO1xuLy8gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcnNlZERhdGEpIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0KHQvtC30LTQsNC90L4g0L7QsdGK0LXQutGC0L7QsiAnICsga2V5ICsgJzogJyArIHBhcnNlZERhdGFba2V5XS5mZWF0dXJlcy5sZW5ndGgpO1xuLy8gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJzZWREYXRhW2tleV0uZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlYWRHZW9tZXRyeShwYXJzZWREYXRhW2tleV0uZmVhdHVyZXNbaV0uZ2VvbWV0cnkpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IG5ldyBvbC5GZWF0dXJlKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeU9iai8vLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Byb3BBIDogcGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmNhZG51bWJlclxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdmVjdG9yTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtYXAgPSBuZXcgb2wuTWFwKHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnbWFwJyxcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBbXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBvbC5sYXllci5UaWxlKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbmV3IG9sLnNvdXJjZS5PU00oKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YXJ0YWxMYXllciwgYm91bmRMYXllciwgem9uZUxheWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyY2VsTGF5ZXIsIHJlYWx0eUxheWVyXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6IG5ldyBvbC5WaWV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlcjogWzAsIDBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgem9vbTogN1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1hcC5nZXRWaWV3KCkuZml0KHF1YXJ0YWxMYXllci5nZXRTb3VyY2UoKS5nZXRFeHRlbnQoKSwgbWFwLmdldFNpemUoKSk7XG5cbiAgICAgICAgICAgICAgICBtYXAub24oJ3NpbmdsZWNsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmlld1Jlc29sdXRpb24gPSAvKiogQHR5cGUge251bWJlcn0gKi8gKG1hcC5nZXRWaWV3KCkuZ2V0UmVzb2x1dGlvbigpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IHBhcmNlbFNvdXJjZS5nZXRGZWF0dXJlSW5mb1VybChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldnQuY29vcmRpbmF0ZSwgdmlld1Jlc29sdXRpb24sICdFUFNHOjM4NTcnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdJTkZPX0ZPUk1BVCc6ICdhcHBsaWNhdGlvbi9qc29uJyAvL3RleHQveG1sLCBhcHBsaWNhdGlvbi9nZW9qc29uLCB0ZXh0L2h0bWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVybCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVJbmZvQ29udGV0bnQodXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlSW5mb0NvbnRldG50KHVybCkge1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmxcbiAgICAgICAgICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8kKCcjaW5mb2NvbnRlbnQnKS5odG1sKCcnKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXMubGVuZ3RoID4gMCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2luZm8nKS5tb2RhbCh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdGU6ICcnXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRpdGlvbmFsSW5mbyA9ICcnO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmVhdHVyZXNbMF0ucHJvcGVydGllcy5hZGRfcHJvcCAhPT0gdW5kZWZpbmVkKSB7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2luZm9jb250ZW50JykuaHRtbChcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8aDI+XCIgKyBkYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMubmFtZSArIFwiPC9oMj5cIiArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9icj48aDM+XCIgKyBkYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuYV9zdHJ0ICtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXCIgKyBkYXRhLmZlYXR1cmVzWzBdLnByb3BlcnRpZXMuYV9oc25tYnIgKyBcIjwvaDM+XCJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbn1cblxuXG5cbiIsIi8qIFxuICogVGhlIE1JVCBMaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IDIwMTUgZmlsaXBwb3YuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuLy8gRGljdHNcblxuLy8g0KHRgtCw0YLRg9GBINC+0LHRitC10LrRgtCwINC90LXQtNCy0LjQttC40LzQvtGB0YLQuFxudmFyIGRTdGF0ZXMgPSB7XG4gICAgJzAxJzogJ9Cg0LDQvdC10LUg0YPRh9GC0LXQvdC90YvQuScsXG4gICAgJzA1JzogJ9CS0YDQtdC80LXQvdC90YvQuScsXG4gICAgJzA2JzogJ9Cj0YfRgtC10L3QvdGL0LknLFxuICAgICcwNyc6ICfQodC90Y/RgiDRgSDRg9GH0LXRgtCwJyxcbiAgICAnMDgnOiAn0JDQvdC90YPQu9C40YDQvtCy0LDQvdC90YvQuSdcbn07XG5cbi8vIFByb3BlcnRpZXNcblxudmFyIFBhcmNlbFByb3BlcnRpZXMgPSB7XG4gICAgQ2FkYXN0cmVOdW1iZXI6ICcnLCAvLyByZXF1aXJlXG4gICAgU2F0ZSA6ICcwMScsIC8vIGRTdGF0ZXMgcmVxdWlyZVxuICAgIERhdGVDcmVhdGVkOiAnJyxcbiAgICBcbiAgICBOYW1lOiAnJywgLy9kTmFtZXMgcmVxdXJlXG4gICAgQ2F0ZWdvcnkgOiAnJywgLy8gZENhdGVnb3JpZXMgLy8gcmVxdWlyZVxuICAgIEFyZWE6IHsgLy8gcmVxdXJlXG4gICAgICAgIEFyZWE6IDAsIC8vIHJlcXVpcmVcbiAgICAgICAgVW5pdDogJycsIC8vZFVuaXQgcmVxdWlyZVxuICAgICAgICBJbmFjY3VyYWN5OiAnJyAvLyBkMjBfMlxuICAgIH0sXG4gICAgVXRpbGl6YXRpb246IHsgLy8gcmVxdWlyZVxuICAgICAgICBCeURvYzogJycsXG4gICAgICAgIFV0aWxpemF0aW9uOiAnJyAvLyBkVXRpbGl6YXRpb24gcmVxdWlyZVxuICAgIH1cbn07XG5cblxuLy8gRnVuY3Rpb25zXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21EaWN0KEtleSwgRGljdCkge1xuICAgIHZhciByZXRWYWwgPSAnJztcbiAgICBzd2l0Y2ggKERpY3QpIHtcbiAgICAgICAgY2FzZSAnZFN0YXRlcyc6IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0VmFsO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5nZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oRmVhdHVyZSwgRmVhdHVyZVR5cGUpIHtcbiAgICBzd2l0Y2ggKEZlYXR1cmVUeXBlKXtcbiAgICAgICAgY2FzZSAnUGFyY2VsJyA6IHtcbiAgICAgICAgICAgICAgICBQYXJjZWxQcm9wZXJ0aWVzLkNhZGFzdHJlTnVtYmVyID0gRmVhdHVyZS5DYWRhc3RyYWxOdW1iZXI7XG4gICAgICAgICAgICAgICAgUGFyY2VsUHJvcGVydGllcy5TYXRlID0gZ2V0VmFsdWVGcm9tRGljdChGZWF0dXJlLlN0YXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBwcm9wZXJ0aWVzOiBQYXJjZWxQcm9wZXJ0aWVzXG4gICAgfTtcbn07IiwidmFyIEVTID0gcmVxdWlyZSgnLi9zcGF0aWFsL0VudGl0eVNwYXRpYWwuanMnKTtcbnZhciBQcm9wcyA9IHJlcXVpcmUoJy4vY2FkUHJvcHMnKTtcblxubW9kdWxlLmV4cG9ydHMuR2VvSlNPTiA9IGZ1bmN0aW9uICh4bWxEYXRhKSB7XG4gICAgXG4gICAgdmFyIGdlb0pTT05RdWFydGFsID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzIDogW11cbiAgICB9O1xuICAgIHZhciBnZW9KU09OQm91bmRzID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzIDogW11cbiAgICB9O1xuICAgIHZhciBnZW9KU09OWm9uZXMgPSB7XG4gICAgICAgIHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgZmVhdHVyZXMgOiBbXVxuICAgIH07XG4gICAgdmFyIGdlb0pTT05QYXJjZWxzID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzIDogW11cbiAgICB9O1xuICAgIHZhciBnZW9KU09OUmVhbHR5ID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzIDogW11cbiAgICB9O1xuXG4gICAgdmFyIEFsbERhdGEgPSAkLnhtbDJqc29uKHhtbERhdGEpLkNhZGFzdHJhbEJsb2Nrcy5DYWRhc3RyYWxCbG9jaztcbiAgICAvL2NvbnNvbGUubG9nKEFsbERhdGEpO1xuICAgICAgIFxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQutCy0LDRgNGC0LDQu9CwLiDQndC1INC80L7QttC10YIg0LHRi9GC0Ywg0LzQvdC+0LPQvtC60L7QvdGC0YPRgNC90YvQvCAgICAgICAgICAgXG4gICAgaWYgKEFsbERhdGEuU3BhdGlhbERhdGEgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLlNwYXRpYWxEYXRhLkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgaWYgKChzcE9iaiA9PT0gdW5kZWZpbmVkKSB8fCAoc3BPYmoubGVuZ3RoID09PSAwKSkgeyBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LrQstCw0YDRgtCw0LvQsCDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCe0LHRitC10LrRgiDQsdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g0JrQstCw0YDRgtCw0LtcbiAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICAgIGdlb21ldHJ5OiB7fVxuICAgICAgICB9O1xuICAgICAgICBmZWF0dXJlLmdlb21ldHJ5ID0gc3BPYmo7XG4gICAgICAgIC8vINCe0YHRgtCw0LvRjNC90YvQtSDRgdCy0L7QudGB0YLQstCwLi4uLlxuXG4gICAgICAgIGdlb0pTT05RdWFydGFsLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygn0J3QtdGCINC+0L/QuNGB0LDQvdC40Y8g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC10L3QvdC+0Lkg0YHQvtGB0YLQsNCy0LvRj9GO0YnQtdC5INC60LLQsNGA0YLQsNC70LAnKTtcbiAgICB9XG5cbiAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0LPRgNCw0L3QuNGGLiDQndC1INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LzQvdC+0LPQvtC60L7QvdGC0YPRgNC90YvQvNC4XG4gICAgaWYgKEFsbERhdGEuQm91bmRzICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChBbGxEYXRhLkJvdW5kcy5Cb3VuZC5zcGxpY2UpIHtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPEFsbERhdGEuQm91bmRzLkJvdW5kLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFsbERhdGEuQm91bmRzLkJvdW5kW2ldLkJvdW5kYXJpZXMuQm91bmRhcnkuc3BsaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGs9MDsgazxBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5Lmxlbmd0aDsgaysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5W2tdLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuQm91bmRzLkJvdW5kW2ldLkJvdW5kYXJpZXMuQm91bmRhcnlba10uRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LrQstCw0YDRgtCw0LvQsCDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCe0LHRitC10LrRgiDQsdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQk9GA0LDQvdC40YbQsFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlLmdlb21ldHJ5ID0gc3BPYmo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW9KU09OQm91bmRzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QtdGCINC+0L/QuNGB0LDQvdC40Y8g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC10L3QvdC+0Lkg0YHQvtGB0YLQsNCy0LvRj9GO0YnQtdC5INCz0YDQsNC90LjRhtGLJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuQm91bmRzLkJvdW5kW2ldLkJvdW5kYXJpZXMuQm91bmRhcnkuRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Ce0LHRitC10LrRgiDQutCy0LDRgNGC0LDQu9CwINGBINC/0YPRgdGC0L7QuSDQs9C10L7QvNC10YLRgNC40LXQuSEg0J7QsdGK0LXQutGCINCx0YPQtNC10YIg0L/RgNC+0L/Rg9GJ0LXQvS4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vINCT0YDQsNC90LjRhtCwXG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAgICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICAgICAgICAgICAgICBnZW9KU09OQm91bmRzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLkJvdW5kcy5Cb3VuZC5Cb3VuZGFyaWVzLkJvdW5kYXJ5LkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHsgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Ce0LHRitC10LrRgiDQutCy0LDRgNGC0LDQu9CwINGBINC/0YPRgdGC0L7QuSDQs9C10L7QvNC10YLRgNC40LXQuSEg0J7QsdGK0LXQutGCINCx0YPQtNC10YIg0L/RgNC+0L/Rg9GJ0LXQvS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCT0YDQsNC90LjRhtCwXG4gICAgICAgICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmZWF0dXJlLmdlb21ldHJ5ID0gc3BPYmo7XG4gICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICAgICAgZ2VvSlNPTkJvdW5kcy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQt9C+0L0uINCd0LUg0LzQvtCz0YPRgiDQsdGL0YLRjCDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C80LhcbiAgICBpZiAoQWxsRGF0YS5ab25lcyAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoQWxsRGF0YS5ab25lcy5ab25lLnNwbGljZSkge1xuICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8QWxsRGF0YS5ab25lcy5ab25lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFsbERhdGEuWm9uZXMuWm9uZVtpXS5FbnRpdHlTcGF0aWFsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5ab25lcy5ab25lW2ldLkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzcE9iaiA9PT0gdW5kZWZpbmVkKSB8fCAoc3BPYmoubGVuZ3RoID09PSAwKSkgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LrQstCw0YDRgtCw0LvQsCDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCe0LHRitC10LrRgiDQsdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyDQl9C+0L3QsFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IHt9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG5cbiAgICAgICAgICAgICAgICAgICAgZ2VvSlNPTlpvbmVzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QtdGCINC+0L/QuNGB0LDQvdC40Y8g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC10L3QvdC+0Lkg0YHQvtGB0YLQsNCy0LvRj9GO0YnQtdC5INC30L7QvdGLJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKEFsbERhdGEuWm9uZXMuWm9uZS5FbnRpdHlTcGF0aWFsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLlpvbmVzLlpvbmUuRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHsgXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LrQstCw0YDRgtCw0LvQsCDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCe0LHRitC10LrRgiDQsdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vINCX0L7QvdCwXG4gICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICAgICAgICAgIGdlb0pTT05ab25lcy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuSDQt9C+0L3RiycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQstGB0LXRhSDQt9C10LzQtdC70YzQvdGL0YUg0YPRh9Cw0YLQutC+0LIg0Lgg0LjRhSDRh9Cw0YHRgtC10LlcbiAgICBmb3IodmFyIGk9MDsgaTxBbGxEYXRhLlBhcmNlbHMuUGFyY2VsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7IFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LrQstCw0YDRgtCw0LvQsCDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCe0LHRitC10LrRgiDQsdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQl9C10LzQtdC70YzQvdGL0Lkg0YPRh9Cw0YHRgtC+0LpcbiAgICAgICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgIGdlb21ldHJ5OiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgIC8vINCe0YHRgtCw0LvRjNC90YvQtSDRgdCy0L7QudGB0YLQstCwLi4uLlxuICAgICAgICAgICAgdmFyIHByb3BzID0gUHJvcHMuZ2V0UHJvcGVydGllcyhzcE9iaiwgJ1BhcmNlbCcpO1xuICAgICAgICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzID0gcHJvcHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGdlb0pTT05QYXJjZWxzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g0JzQvdC+0LPQvtC60L7QvdGC0YPRgNC90YvQuVxuICAgICAgICBlbHNlIGlmIChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkNvbnRvdXJzKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQndC10YIg0L7Qv9C40YHQsNC90LjRjyDQv9GA0L7RgdGC0YDQsNC90YHRgtCy0LXQvdC90L7QuSDRgdC+0YHRgtCw0LLQu9GP0Y7RidC10LknKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAgXG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINC/0YPQvdC60YLQvtCyINCe0JzQoVxuICAgIFxuICAgIFxuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGdlb0pTT05RdWFydGFsOiBnZW9KU09OUXVhcnRhbCxcbiAgICAgICAgZ2VvSlNPTkJvdW5kczogZ2VvSlNPTkJvdW5kcyxcbiAgICAgICAgZ2VvSlNPTlpvbmVzOiBnZW9KU09OWm9uZXMsXG4gICAgICAgIGdlb0pTT05QYXJjZWxzOiBnZW9KU09OUGFyY2VscyxcbiAgICAgICAgZ2VvSlNPTlJlYWx0eTogZ2VvSlNPTlJlYWx0eVxuICAgIH07XG59O1xuIiwiLyoqXG4gKiDQnNC+0LTRg9C70Ywg0L7QsdGA0LDQsdC+0YLQutC4INCz0LXQvtC80LXRgtGA0LjQuCDRgtC40L/QsCDQv9C+0LvQuNCz0L7QvS5cbiAqINCe0LTQuNC9INCy0L3QtdGI0L3QuNC5INC60L7QvdGC0YPRgCDQuCAwINC40LvQuCDQsdC+0LvQtdC1INCy0L3Rg9GC0YDQtdC90L3QuNGFINC60L7QvdGC0YPRgNC+0LItXCLQtNGL0YDQvtC6XCJcbiAqIFxuICogR2VvSlNPTiBnZW9tZXRyeSDRgtC40L/QsCB0RW50aXR5U3BhdGlhbExhbmRPdXRcbiAqL1xuXG4vL1wiZ2VvbWV0cnlcIjoge1xuLy8gICAgXCJ0eXBlXCI6IFwiUG9seWdvblwiLFxuLy8gICAgXCJjb29yZGluYXRlc1wiOiBbXG4vLyAgICAgIFsgWzEwMC4wLCAwLjBdLCBbMTAxLjAsIDAuMF0sIFsxMDEuMCwgMS4wXSxcbi8vICAgICAgICBbMTAwLjAsIDEuMF0sIFsxMDAuMCwgMC4wXSBdXG4vLyAgICAgIF1cbi8vICB9XG5cblxubW9kdWxlLmV4cG9ydHMuZ2V0RW50aXR5U3BhdGlhbCA9IGZ1bmN0aW9uKEVudGl0eVNwYXRpYWxPYmosIHBhcnRPZk11bHR1KSB7XG5cdFxuLy9cdHRoaXMuZ2VvbWV0cnkgPSB7XG4vLyAgICAgICAgdHlwZTogJycsXG4vL1x0XHRjb29yZGluYXRlczogW11cbi8vXHR9O1xuICAgIFxuICAgIC8vdmFyIEVudGl0eVNwYXRpYWwgPSBbXTtcbiAgICB2YXIgQXJlYSA9IDAuMDtcbiAgICBcbiAgICAvLyDQktGL0YfQuNGB0LvQtdC90LjQtSDQv9C70L7RidCw0LTQuCDQt9Cw0LzQutC90YPRgtC+0LPQviDQutC+0L3RgtGD0YDQsFxuICAgIGZ1bmN0aW9uIHBvbHlnb25BcmVhKFhzLCBZcywgbnVtUG9pbnRzKSB7IFxuICAgICAgICB2YXIgYXJlYSA9IDA7ICAgXG4gICAgICAgIHZhciBqID0gbnVtUG9pbnRzLTE7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxudW1Qb2ludHM7IGkrKylcbiAgICAgICAgeyBhcmVhID0gYXJlYSArICAoKFhzW2pdKSsoWHNbaV0pKSAqICgoWXNbal0pLShZc1tpXSkpOyBcbiAgICAgICAgICAgIGogPSBpOyAgLy9qIGlzIHByZXZpb3VzIHZlcnRleCB0byBpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGFyZWEvMik7XG4gICAgfVxuICAgIFxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0L7QtNC90L7Qs9C+INC30LDQvNC60L3Rg9GC0L7Qs9C+INC60L7QvdGC0YPRgNCwXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udG91cihTcGF0aWFsRWxlbWVudCkge1xuICAgICAgICB2YXIgeHMgPSBbXTtcbiAgICAgICAgdmFyIHlzID0gW107XG4gICAgICAgIHZhciBjb250b3VyID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBTcGF0aWFsRWxlbWVudC5TcGVsZW1lbnRVbml0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSBTcGF0aWFsRWxlbWVudC5TcGVsZW1lbnRVbml0W2pdO1xuICAgICAgICAgICAgdmFyIHh5ID0gW107XG4gICAgICAgICAgICB4cy5wdXNoKHBhcnNlRmxvYXQocG9pbnQuT3JkaW5hdGUuWSkpO1xuICAgICAgICAgICAgeXMucHVzaChwYXJzZUZsb2F0KHBvaW50Lk9yZGluYXRlLlgpKTtcbiAgICAgICAgICAgIHh5LnB1c2gocGFyc2VGbG9hdChwb2ludC5PcmRpbmF0ZS5ZKSk7XG4gICAgICAgICAgICB4eS5wdXNoKHBhcnNlRmxvYXQocG9pbnQuT3JkaW5hdGUuWCkpO1xuICAgICAgICAgICAgY29udG91ci5wdXNoKHh5KTtcbiAgICAgICAgfVxuICAgICAgICBBcmVhID0gcG9seWdvbkFyZWEoeHMsIHlzLCB4cy5sZW5ndGgpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKEFyZWEpO1xuICAgICAgICByZXR1cm4gY29udG91cjtcbiAgICB9XG4gICAgXG5cdGlmICgoRW50aXR5U3BhdGlhbE9iaiAhPT0gdW5kZWZpbmVkKSAmJiAoRW50aXR5U3BhdGlhbE9iaiAhPT0gbnVsbCkpIHtcbiAgICAgICAgdmFyIGNudHJzID0gW107XG4gICAgICAgIC8vINCj0YLQuNC90L3QsNGPINGC0LjQv9C40LfQsNGG0LjRjyDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCw0LvQuNGH0LjRjyDQtNGL0YDQvtC6INCyINC/0L7Qu9C40LPQvtC90LVcbiAgICAgICAgLy8g0JIg0KDQvtGB0YDQtdC10YHRgtGA0LUg0L3QtSDRgdC70LXQtNGP0YIg0LfQsCDQv9C+0YDRj9C00LrQvtC8INC60L7QvdGC0YPRgNC+0LIg0L/QvtC70LjQs9C+0L3QsFxuICAgICAgICBpZiAoRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudC5zcGxpY2UpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ9Cf0L7Qu9C40LPQvtC9INGBINC00YvRgNC60LDQvNC4Jyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBNYXhBcmVhO1xuICAgICAgICAgICAgdmFyIE1heEFyZWFJZHggPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50Lmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRvdXIgPSBFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50W2tdO1xuICAgICAgICAgICAgICAgIHZhciBjbnQgPSBjcmVhdGVDb250b3VyKGNvbnRvdXIpO1xuICAgICAgICAgICAgICAgIGNudHJzLnB1c2goY250KTtcbiAgICAgICAgICAgICAgICBpZihBcmVhID4gTWF4QXJlYSkge1xuICAgICAgICAgICAgICAgICAgICBNYXhBcmVhID0gQXJlYTtcbiAgICAgICAgICAgICAgICAgICAgTWF4QXJlYUlkeCA9IGs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0J/QtdGA0LXQvNC10YnQsNC10Lwg0L7RgdC90L7QstC90L7QuSAo0L3QsNGA0YPQttC90LjQuSkg0LrQvtC90YLRg9GAINCyINC90LDRh9Cw0LvQviDQvNCw0YHRgdC40LLQsFxuICAgICAgICAgICAgaWYgKE1heEFyZWFJZHggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1haW5DbnQgPSBjbnRycy5zcGxpY2UoTWF4QXJlYUlkeCwgMSk7XG4gICAgICAgICAgICAgICAgY250cnMuc3BsaWNlKDAsIDAsIG1haW5DbnQpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ9Cd0L7QvNC10YAg0L7RgdC90L7QstC90L7Qs9C+INC60L7QvdGC0YPRgNCwINCx0YvQuyAnICsgTWF4QXJlYUlkeCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRjdGC0L4g0LTQu9GPINC80L3QvtCz0L7QutC+0L3RgtGD0YDQvdC+0LPQviDQvtCx0YrQtdC60YLQsCwg0YLQviDQstC+0LfQstGA0LDRidC10Lwg0LzQsNGB0YHQuNCyINC60L7QvdGC0YPRgNC+0LJcbiAgICAgICAgICAgIGlmIChwYXJ0T2ZNdWx0dSkgeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gY250cnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGN0YLQviDQtNC70Y8g0L/RgNC+0YHRgtC+0LPQviDQvtCx0YrQtdC60YLQsCwg0YLQviDQstC+0LfQstGA0LDRidC10Lwg0L7QsdGK0LXQutGCIGdlb21ldHJ5XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBvbHlnb25cIixcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IGNudHJzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjb250b3VyID0gRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudDtcbiAgICAgICAgICAgIHZhciBwb2x5Z29uID0gY3JlYXRlQ29udG91cihjb250b3VyKTtcbiAgICAgICAgICAgIGNudHJzLnB1c2gocG9seWdvbik7XG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRjdGC0L4g0LTQu9GPINC80L3QvtCz0L7QutC+0L3RgtGD0YDQvdC+0LPQviDQvtCx0YrQtdC60YLQsCwg0YLQviDQstC+0LfQstGA0LDRidC10Lwg0LzQsNGB0YHQuNCyINC60L7QvdGC0YPRgNC+0LJcbiAgICAgICAgICAgIGlmIChwYXJ0T2ZNdWx0dSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbnRycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGN0YLQviDQtNC70Y8g0L/RgNC+0YHRgtC+0LPQviDQvtCx0YrQtdC60YLQsCwg0YLQviDQstC+0LfQstGA0LDRidC10Lwg0L7QsdGK0LXQutGCIGdlb21ldHJ5XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBvbHlnb25cIixcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IGNudHJzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07Il19
