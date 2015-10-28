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
                    var st = '';
                    var cat = '';
                    var name = '';
                    for (var i = 0; i < features.length; i++) {
                        var f = features[i];
                        if (f.get('cadastreNumber')!== undefined) {
                            cn = f.get('cadastreNumber');
                        }
                        if (f.get('State')!== undefined) {
                            st = f.get('State');
                        }
                        if (f.get('Name')!== undefined) {
                            name = f.get('Name');
                        }
                        if (f.get('Category')!== undefined) {
                            cat = f.get('Category');
                        }
                        //console.log(features[i].getProperties());
                    }
                    var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                            coordinate, 'EPSG:3857', 'EPSG:4326'));

                    content.innerHTML = '<p>Кадастровый номер:<code>' + cn +
                            '</code></p><p>Объект:<code>' + name +'</code></p>'+
                            '</code><p>Статус:<code>' + st +'</code></p>'+
                            '</code><p>Категория земель:<code>' + cat +'</code></p>';
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
// Тип  объекта недвижимости
var dParcels = {
    '01': 'Землепользование',
    '02': 'Единое землепользование',
    '03': 'Обособленный участок',
    '04': 'Условный участок',
    '05': 'Многоконтурный участок',
    '06': 'Значение отсутствует'
};
// Категория земель
var dCategories = {
    '003001000000': 'Земли сельскохозяйственного назначения',
    '003002000000': 'Земли населённых пунктов',
    '003003000000': 'Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения',
    '003004000000': 'Земли особо охраняемых территорий и объектов',
    '003005000000': 'Земли лесного фонда',
    '003006000000': 'Земли водного фонда',
    '003007000000': 'Земли запаса',
    '003008000000': 'Категория не установлена'
};
var ParcelProperties;

function getValueFromDict(Key, Dic) {
    for (var k in Dic) {
        if (k === Key) {
            return Dic[k];
        }
    }
}

module.exports.getProperties = function (Feature, FeatureType) {
    switch (FeatureType) {
        case 'Parcel' :
        {
            ParcelProperties = {
                cadastreNumber: '', // require
                State: '01', // dStates require
                DateCreated: '',
                Name: '', //dParcels require
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
            ParcelProperties.State = getValueFromDict(Feature.State, dStates);
            ParcelProperties.Name = getValueFromDict(Feature.Name, dParcels);
            ParcelProperties.Category = getValueFromDict(Feature.Category, dCategories);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFByb3BzLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL3NwYXRpYWwvRW50aXR5U3BhdGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuICogVG8gY2hhbmdlIHRoaXMgbGljZW5zZSBoZWFkZXIsIGNob29zZSBMaWNlbnNlIEhlYWRlcnMgaW4gUHJvamVjdCBQcm9wZXJ0aWVzLlxuICogVG8gY2hhbmdlIHRoaXMgdGVtcGxhdGUgZmlsZSwgY2hvb3NlIFRvb2xzIHwgVGVtcGxhdGVzXG4gKiBhbmQgb3BlbiB0aGUgdGVtcGxhdGUgaW4gdGhlIGVkaXRvci5cbiAqL1xuXG52YXIgQ29udmVydGVyID0gcmVxdWlyZSgnLi9jYWRYTUwyR2VvSlNPTi5qcycpO1xudmFyIG1hcDtcblN0YXJ0UGFyc2UoKTtcblxuZnVuY3Rpb24gU3RhcnRQYXJzZSgpIHtcblxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAnKTtcbiAgICB2YXIgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cC1jb250ZW50Jyk7XG4gICAgdmFyIGNsb3NlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cC1jbG9zZXInKTtcblxuICAgIGNsb3Nlci5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvdmVybGF5LnNldFBvc2l0aW9uKHVuZGVmaW5lZCk7XG4gICAgICAgIGNsb3Nlci5ibHVyKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIG92ZXJsYXkgPSBuZXcgb2wuT3ZlcmxheSgvKiogQHR5cGUge29seC5PdmVybGF5T3B0aW9uc30gKi8gKHtcbiAgICAgICAgZWxlbWVudDogY29udGFpbmVyLFxuICAgICAgICBhdXRvUGFuOiB0cnVlLFxuICAgICAgICBhdXRvUGFuQW5pbWF0aW9uOiB7XG4gICAgICAgICAgICBkdXJhdGlvbjogMjUwXG4gICAgICAgIH1cbiAgICB9KSk7XG5cbiAgICAvLyBodHRwczovL2JpdGJ1Y2tldC5vcmcvc3VyZW5yYW8veG1sMmpzb25cbiAgICAvLyBodHRwOi8vd3d3LmNocm9tZS1hbGxvdy1maWxlLWFjY2Vzcy1mcm9tLWZpbGUuY29tL1xuICAgIHZhciBwYXJzZWREYXRhO1xuICAgICQuZ2V0KCcuL3Rlc3RkYXRhL2RvYzg1MDA3MTcueG1sJywgZnVuY3Rpb24gKHhtbCkge1xuICAgICAgICAvL3ZhciBqc29uID0gJC54bWwyanNvbih4bWwpLkNhZGFzdHJhbEJsb2NrcztcbiAgICAgICAgLy8gJChcIiNkYXRhXCIpLmh0bWwoJzxjb2RlPicrSlNPTi5zdHJpbmdpZnkoanNvbikrJzwvY29kZT4nKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhDb252ZXJ0ZXIuR2VvSlNPTik7XG4gICAgICAgIHBhcnNlZERhdGEgPSBDb252ZXJ0ZXIuR2VvSlNPTih4bWwpO1xuICAgIH0pLnN1Y2Nlc3MoXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL1xuICAgICAgICAgICAgICAgIHZhciBwYXJjZWxGaWxsID0gbmV3IG9sLnN0eWxlLkZpbGwoe1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNhM2JkYzgnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlYWx0eWxGaWxsID0gbmV3IG9sLnN0eWxlLkZpbGwoe1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNmM2U1ZjEnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3Ryb2tlID0gbmV3IG9sLnN0eWxlLlN0cm9rZSh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzMxMzAzMCcsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kU3Ryb2tlID0gbmV3IG9sLnN0eWxlLlN0cm9rZSh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwNEMwMCcsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHpvbmVTdHJva2UgPSBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZWU2YTUwJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbFN0cm9rZSA9IG5ldyBvbC5zdHlsZS5TdHJva2Uoe1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzYjIwMmYnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gbmV3IG9sLnN0eWxlLlRleHQoe1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPINCf0L7QtNC/0LjRgdCw0YLRjCDQutCw0LTQsNGB0YLRgNC+0LLRi9C1INC90L7QvNC10YDQsFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8g0KHRgtC40LvQuFxuICAgICAgICAgICAgICAgIHZhciBwYXJjZWxTdHlsZSA9IG5ldyBvbC5zdHlsZS5TdHlsZSh7XG4gICAgICAgICAgICAgICAgICAgIGZpbGw6IHBhcmNlbEZpbGwsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogc3Ryb2tlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlYWx0eVN0eWxlID0gbmV3IG9sLnN0eWxlLlN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogcmVhbHR5bEZpbGwsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogc3Ryb2tlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHF1YXJ0YWxTdHlsZSA9IG5ldyBvbC5zdHlsZS5TdHlsZSh7XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogcXVhcnRhbFN0cm9rZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBib3VuZFN0eWxlID0gbmV3IG9sLnN0eWxlLlN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBib3VuZFN0cm9rZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciB6b25lU3R5bGUgPSBuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBzdHJva2U6IHpvbmVTdHJva2VcbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAgICAgdmFyIHF1YXJ0YWxTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIC8vcHJvamVjdGlvbjogJ0VQU0c6Mzg1NydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyY2VsU291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICBmZWF0dXJlczogKG5ldyBvbC5mb3JtYXQuR2VvSlNPTigpKS5yZWFkRmVhdHVyZXMocGFyc2VkRGF0YS5nZW9KU09OUGFyY2VscylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcmVhbHR5U291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICAvL3Byb2plY3Rpb246ICdFUFNHOjM4NTcnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kU291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICAvL3Byb2plY3Rpb246ICdFUFNHOjM4NTcnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHpvbmVTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIC8vcHJvamVjdGlvbjogJ0VQU0c6Mzg1NydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbExheWVyID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogcXVhcnRhbFNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHF1YXJ0YWxTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC41XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmNlbExheWVyID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogcGFyY2VsU291cmNlLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogcGFyY2VsU3R5bGUsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciByZWFsdHlMYXllciA9IG5ldyBvbC5sYXllci5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHJlYWx0eVNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHJlYWx0eVN0eWxlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBib3VuZFNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGJvdW5kU3R5bGUsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciB6b25lTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB6b25lU291cmNlLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogem9uZVN0eWxlLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBmb3JtYXQgPSBuZXcgb2wuZm9ybWF0Lkdlb0pTT04oKTtcbi8vICAgICAgICAgICAgICAgIHZhciBwYXJjZWxzID0gcGFyc2VkRGF0YS5nZW9KU09OUGFyY2Vscztcbi8vICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJjZWxzLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0LnJlYWRHZW9tZXRyeShwYXJjZWxzLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbi8vICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IG5ldyBvbC5GZWF0dXJlKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbi8vICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICBwYXJjZWxMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuLy8gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZWFsdHlzID0gcGFyc2VkRGF0YS5nZW9KU09OUmVhbHR5O1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCByZWFsdHlzLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9tZXRyeU9iaiA9IGZvcm1hdC5yZWFkR2VvbWV0cnkocmVhbHR5cy5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJvcEEgOiBwYXJzZWREYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuY2FkbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZWFsdHlMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgem9uZXMgPSBwYXJzZWREYXRhLmdlb0pTT05ab25lcztcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgem9uZXMuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0LnJlYWRHZW9tZXRyeSh6b25lcy5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJvcEEgOiBwYXJzZWREYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuY2FkbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB6b25lTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHF1YXJ0YWwgPSBwYXJzZWREYXRhLmdlb0pTT05RdWFydGFsO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBxdWFydGFsLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9tZXRyeU9iaiA9IGZvcm1hdC5yZWFkR2VvbWV0cnkocXVhcnRhbC5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJvcEEgOiBwYXJzZWREYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuY2FkbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBxdWFydGFsTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IHBhcnNlZERhdGEuZ2VvSlNPTkJvdW5kcztcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYm91bmRzLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9tZXRyeU9iaiA9IGZvcm1hdC5yZWFkR2VvbWV0cnkoYm91bmRzLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlPYmovLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyQoXCIjdHh0XCIpLmpKc29uVmlld2VyKHBhcnNlZERhdGEpO1xuLy8gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcnNlZERhdGEpIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0KHQvtC30LTQsNC90L4g0L7QsdGK0LXQutGC0L7QsiAnICsga2V5ICsgJzogJyArIHBhcnNlZERhdGFba2V5XS5mZWF0dXJlcy5sZW5ndGgpO1xuLy8gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJzZWREYXRhW2tleV0uZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlYWRHZW9tZXRyeShwYXJzZWREYXRhW2tleV0uZmVhdHVyZXNbaV0uZ2VvbWV0cnkpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IG5ldyBvbC5GZWF0dXJlKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeU9iai8vLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Byb3BBIDogcGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmNhZG51bWJlclxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdmVjdG9yTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtYXAgPSBuZXcgb2wuTWFwKHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnbWFwJyxcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBbXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBvbC5sYXllci5UaWxlKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbmV3IG9sLnNvdXJjZS5PU00oKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YXJ0YWxMYXllciwgYm91bmRMYXllciwgem9uZUxheWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyY2VsTGF5ZXIsIHJlYWx0eUxheWVyXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlzOiBbb3ZlcmxheV0sXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6IG5ldyBvbC5WaWV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlcjogWzAsIDBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgem9vbTogN1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1hcC5nZXRWaWV3KCkuZml0KHF1YXJ0YWxMYXllci5nZXRTb3VyY2UoKS5nZXRFeHRlbnQoKSwgbWFwLmdldFNpemUoKSk7XG5cbiAgICAgICAgICAgICAgICBtYXAub24oJ3NpbmdsZWNsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvb3JkaW5hdGUgPSBldnQuY29vcmRpbmF0ZTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcC5nZXRMYXllcnMoKS5nZXRMZW5ndGgoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXIgPSBtYXAuZ2V0TGF5ZXJzKCkuaXRlbShpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXllciBpbnN0YW5jZW9mIG9sLmxheWVyLlZlY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbGF5ZXIuZ2V0U291cmNlKCkuZ2V0Q2xvc2VzdEZlYXR1cmVUb0Nvb3JkaW5hdGUoZXZ0LmNvb3JkaW5hdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmZWF0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUluZm9Db250ZXRudChmZWF0dXJlcywgY29vcmRpbmF0ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVJbmZvQ29udGV0bnQoZmVhdHVyZXMsIGNvb3JkaW5hdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNuID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2F0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmID0gZmVhdHVyZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi5nZXQoJ2NhZGFzdHJlTnVtYmVyJykhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY24gPSBmLmdldCgnY2FkYXN0cmVOdW1iZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLmdldCgnU3RhdGUnKSE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdCA9IGYuZ2V0KCdTdGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYuZ2V0KCdOYW1lJykhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA9IGYuZ2V0KCdOYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi5nZXQoJ0NhdGVnb3J5JykhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ID0gZi5nZXQoJ0NhdGVnb3J5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGZlYXR1cmVzW2ldLmdldFByb3BlcnRpZXMoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGhkbXMgPSBvbC5jb29yZGluYXRlLnRvU3RyaW5nSERNUyhvbC5wcm9qLnRyYW5zZm9ybShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlLCAnRVBTRzozODU3JywgJ0VQU0c6NDMyNicpKTtcblxuICAgICAgICAgICAgICAgICAgICBjb250ZW50LmlubmVySFRNTCA9ICc8cD7QmtCw0LTQsNGB0YLRgNC+0LLRi9C5INC90L7QvNC10YA6PGNvZGU+JyArIGNuICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9jb2RlPjwvcD48cD7QntCx0YrQtdC60YI6PGNvZGU+JyArIG5hbWUgKyc8L2NvZGU+PC9wPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvY29kZT48cD7QodGC0LDRgtGD0YE6PGNvZGU+JyArIHN0ICsnPC9jb2RlPjwvcD4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2NvZGU+PHA+0JrQsNGC0LXQs9C+0YDQuNGPINC30LXQvNC10LvRjDo8Y29kZT4nICsgY2F0ICsnPC9jb2RlPjwvcD4nO1xuICAgICAgICAgICAgICAgICAgICBvdmVybGF5LnNldFBvc2l0aW9uKGNvb3JkaW5hdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG59XG5cblxuXG4iLCIvKiBcbiAqIFRoZSBNSVQgTGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAyMDE1IGZpbGlwcG92LlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cbid1c2Ugc3RyaWN0Jztcbi8vIERpY3RzXG5cbi8vINCh0YLQsNGC0YPRgSDQvtCx0YrQtdC60YLQsCDQvdC10LTQstC40LbQuNC80L7RgdGC0LhcbnZhciBkU3RhdGVzID0ge1xuICAgICcwMSc6ICfQoNCw0L3QtdC1INGD0YfRgtC10L3QvdGL0LknLFxuICAgICcwNSc6ICfQktGA0LXQvNC10L3QvdGL0LknLFxuICAgICcwNic6ICfQo9GH0YLQtdC90L3Ri9C5JyxcbiAgICAnMDcnOiAn0KHQvdGP0YIg0YEg0YPRh9C10YLQsCcsXG4gICAgJzA4JzogJ9CQ0L3QvdGD0LvQuNGA0L7QstCw0L3QvdGL0LknXG59O1xuLy8g0KLQuNC/ICDQvtCx0YrQtdC60YLQsCDQvdC10LTQstC40LbQuNC80L7RgdGC0LhcbnZhciBkUGFyY2VscyA9IHtcbiAgICAnMDEnOiAn0JfQtdC80LvQtdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUnLFxuICAgICcwMic6ICfQldC00LjQvdC+0LUg0LfQtdC80LvQtdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUnLFxuICAgICcwMyc6ICfQntCx0L7RgdC+0LHQu9C10L3QvdGL0Lkg0YPRh9Cw0YHRgtC+0LonLFxuICAgICcwNCc6ICfQo9GB0LvQvtCy0L3Ri9C5INGD0YfQsNGB0YLQvtC6JyxcbiAgICAnMDUnOiAn0JzQvdC+0LPQvtC60L7QvdGC0YPRgNC90YvQuSDRg9GH0LDRgdGC0L7QuicsXG4gICAgJzA2JzogJ9CX0L3QsNGH0LXQvdC40LUg0L7RgtGB0YPRgtGB0YLQstGD0LXRgidcbn07XG4vLyDQmtCw0YLQtdCz0L7RgNC40Y8g0LfQtdC80LXQu9GMXG52YXIgZENhdGVnb3JpZXMgPSB7XG4gICAgJzAwMzAwMTAwMDAwMCc6ICfQl9C10LzQu9C4INGB0LXQu9GM0YHQutC+0YXQvtC30Y/QudGB0YLQstC10L3QvdC+0LPQviDQvdCw0LfQvdCw0YfQtdC90LjRjycsXG4gICAgJzAwMzAwMjAwMDAwMCc6ICfQl9C10LzQu9C4INC90LDRgdC10LvRkdC90L3Ri9GFINC/0YPQvdC60YLQvtCyJyxcbiAgICAnMDAzMDAzMDAwMDAwJzogJ9CX0LXQvNC70Lgg0L/RgNC+0LzRi9GI0LvQtdC90L3QvtGB0YLQuCwg0Y3QvdC10YDQs9C10YLQuNC60LgsINGC0YDQsNC90YHQv9C+0YDRgtCwLCDRgdCy0Y/Qt9C4LCDRgNCw0LTQuNC+0LLQtdGJ0LDQvdC40Y8sINGC0LXQu9C10LLQuNC00LXQvdC40Y8sINC40L3RhNC+0YDQvNCw0YLQuNC60LgsINC30LXQvNC70Lgg0LTQu9GPINC+0LHQtdGB0L/QtdGH0LXQvdC40Y8g0LrQvtGB0LzQuNGH0LXRgdC60L7QuSDQtNC10Y/RgtC10LvRjNC90L7RgdGC0LgsINC30LXQvNC70Lgg0L7QsdC+0YDQvtC90YssINCx0LXQt9C+0L/QsNGB0L3QvtGB0YLQuCDQuCDQt9C10LzQu9C4INC40L3QvtCz0L4g0YHQv9C10YbQuNCw0LvRjNC90L7Qs9C+INC90LDQt9C90LDRh9C10L3QuNGPJyxcbiAgICAnMDAzMDA0MDAwMDAwJzogJ9CX0LXQvNC70Lgg0L7RgdC+0LHQviDQvtGF0YDQsNC90Y/QtdC80YvRhSDRgtC10YDRgNC40YLQvtGA0LjQuSDQuCDQvtCx0YrQtdC60YLQvtCyJyxcbiAgICAnMDAzMDA1MDAwMDAwJzogJ9CX0LXQvNC70Lgg0LvQtdGB0L3QvtCz0L4g0YTQvtC90LTQsCcsXG4gICAgJzAwMzAwNjAwMDAwMCc6ICfQl9C10LzQu9C4INCy0L7QtNC90L7Qs9C+INGE0L7QvdC00LAnLFxuICAgICcwMDMwMDcwMDAwMDAnOiAn0JfQtdC80LvQuCDQt9Cw0L/QsNGB0LAnLFxuICAgICcwMDMwMDgwMDAwMDAnOiAn0JrQsNGC0LXQs9C+0YDQuNGPINC90LUg0YPRgdGC0LDQvdC+0LLQu9C10L3QsCdcbn07XG52YXIgUGFyY2VsUHJvcGVydGllcztcblxuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tRGljdChLZXksIERpYykge1xuICAgIGZvciAodmFyIGsgaW4gRGljKSB7XG4gICAgICAgIGlmIChrID09PSBLZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBEaWNba107XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmdldFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoRmVhdHVyZSwgRmVhdHVyZVR5cGUpIHtcbiAgICBzd2l0Y2ggKEZlYXR1cmVUeXBlKSB7XG4gICAgICAgIGNhc2UgJ1BhcmNlbCcgOlxuICAgICAgICB7XG4gICAgICAgICAgICBQYXJjZWxQcm9wZXJ0aWVzID0ge1xuICAgICAgICAgICAgICAgIGNhZGFzdHJlTnVtYmVyOiAnJywgLy8gcmVxdWlyZVxuICAgICAgICAgICAgICAgIFN0YXRlOiAnMDEnLCAvLyBkU3RhdGVzIHJlcXVpcmVcbiAgICAgICAgICAgICAgICBEYXRlQ3JlYXRlZDogJycsXG4gICAgICAgICAgICAgICAgTmFtZTogJycsIC8vZFBhcmNlbHMgcmVxdWlyZVxuICAgICAgICAgICAgICAgIENhdGVnb3J5OiAnJywgLy8gZENhdGVnb3JpZXMgLy8gcmVxdWlyZVxuICAgICAgICAgICAgICAgIEFyZWE6IHsvLyByZXF1cmVcbiAgICAgICAgICAgICAgICAgICAgQXJlYTogMCwgLy8gcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICBVbml0OiAnJywgLy9kVW5pdCByZXF1aXJlXG4gICAgICAgICAgICAgICAgICAgIEluYWNjdXJhY3k6ICcnIC8vIGQyMF8yXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBVdGlsaXphdGlvbjogey8vIHJlcXVpcmVcbiAgICAgICAgICAgICAgICAgICAgQnlEb2M6ICcnLFxuICAgICAgICAgICAgICAgICAgICBVdGlsaXphdGlvbjogJycgLy8gZFV0aWxpemF0aW9uIHJlcXVpcmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgUGFyY2VsUHJvcGVydGllcy5jYWRhc3RyZU51bWJlciA9IEZlYXR1cmUuQ2FkYXN0cmFsTnVtYmVyO1xuICAgICAgICAgICAgUGFyY2VsUHJvcGVydGllcy5TdGF0ZSA9IGdldFZhbHVlRnJvbURpY3QoRmVhdHVyZS5TdGF0ZSwgZFN0YXRlcyk7XG4gICAgICAgICAgICBQYXJjZWxQcm9wZXJ0aWVzLk5hbWUgPSBnZXRWYWx1ZUZyb21EaWN0KEZlYXR1cmUuTmFtZSwgZFBhcmNlbHMpO1xuICAgICAgICAgICAgUGFyY2VsUHJvcGVydGllcy5DYXRlZ29yeSA9IGdldFZhbHVlRnJvbURpY3QoRmVhdHVyZS5DYXRlZ29yeSwgZENhdGVnb3JpZXMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvcGVydGllczogUGFyY2VsUHJvcGVydGllc1xuICAgIH07XG59OyIsInZhciBFUyA9IHJlcXVpcmUoJy4vc3BhdGlhbC9FbnRpdHlTcGF0aWFsLmpzJyk7XG52YXIgUHJvcHMgPSByZXF1aXJlKCcuL2NhZFByb3BzJyk7XG5cbm1vZHVsZS5leHBvcnRzLkdlb0pTT04gPSBmdW5jdGlvbiAoeG1sRGF0YSkge1xuXG4gICAgdmFyIGdlb0pTT05RdWFydGFsID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzOiBbXVxuICAgIH07XG4gICAgdmFyIGdlb0pTT05Cb3VuZHMgPSB7XG4gICAgICAgIHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgZmVhdHVyZXM6IFtdXG4gICAgfTtcbiAgICB2YXIgZ2VvSlNPTlpvbmVzID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzOiBbXVxuICAgIH07XG4gICAgdmFyIGdlb0pTT05QYXJjZWxzID0ge1xuICAgICAgICAndHlwZSc6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICAgICdmZWF0dXJlcyc6IFtdXG4gICAgfTtcbiAgICB2YXIgZ2VvSlNPTlJlYWx0eSA9IHtcbiAgICAgICAgdHlwZTogXCJGZWF0dXJlQ29sbGVjdGlvblwiLFxuICAgICAgICBmZWF0dXJlczogW11cbiAgICB9O1xuXG4gICAgdmFyIEFsbERhdGEgPSAkLnhtbDJqc29uKHhtbERhdGEpLkNhZGFzdHJhbEJsb2Nrcy5DYWRhc3RyYWxCbG9jaztcbiAgICAvL2NvbnNvbGUubG9nKEFsbERhdGEpO1xuXG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINC60LLQsNGA0YLQsNC70LAuINCd0LUg0LzQvtC20LXRgiDQsdGL0YLRjCDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C8ICAgICAgICAgICBcbiAgICBpZiAoQWxsRGF0YS5TcGF0aWFsRGF0YSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuU3BhdGlhbERhdGEuRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0J7QsdGK0LXQutGCINC60LLQsNGA0YLQsNC70LAg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQntCx0YrQtdC60YIg0LHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICB9XG4gICAgICAgIC8vINCa0LLQsNGA0YLQsNC7XG4gICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgfTtcbiAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICBnZW9KU09OUXVhcnRhbC5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfQndC10YIg0L7Qv9C40YHQsNC90LjRjyDQv9GA0L7RgdGC0YDQsNC90YHRgtCy0LXQvdC90L7QuSDRgdC+0YHRgtCw0LLQu9GP0Y7RidC10Lkg0LrQstCw0YDRgtCw0LvQsCcpO1xuICAgIH1cblxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQs9GA0LDQvdC40YYuINCd0LUg0LzQvtCz0YPRgiDQsdGL0YLRjCDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C80LhcbiAgICBpZiAoQWxsRGF0YS5Cb3VuZHMgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKEFsbERhdGEuQm91bmRzLkJvdW5kLnNwbGljZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBBbGxEYXRhLkJvdW5kcy5Cb3VuZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5LnNwbGljZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IEFsbERhdGEuQm91bmRzLkJvdW5kW2ldLkJvdW5kYXJpZXMuQm91bmRhcnkubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5W2tdLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuQm91bmRzLkJvdW5kW2ldLkJvdW5kYXJpZXMuQm91bmRhcnlba10uRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Ce0LHRitC10LrRgiDQutCy0LDRgNGC0LDQu9CwINGBINC/0YPRgdGC0L7QuSDQs9C10L7QvNC10YLRgNC40LXQuSEg0J7QsdGK0LXQutGCINCx0YPQtNC10YIg0L/RgNC+0L/Rg9GJ0LXQvS4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCT0YDQsNC90LjRhtCwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlb0pTT05Cb3VuZHMuZmVhdHVyZXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuSDQs9GA0LDQvdC40YbRiycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5LkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzcE9iaiA9PT0gdW5kZWZpbmVkKSB8fCAoc3BPYmoubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Ce0LHRitC10LrRgiDQutCy0LDRgNGC0LDQu9CwINGBINC/0YPRgdGC0L7QuSDQs9C10L7QvNC10YLRgNC40LXQuSEg0J7QsdGK0LXQutGCINCx0YPQtNC10YIg0L/RgNC+0L/Rg9GJ0LXQvS4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vINCT0YDQsNC90LjRhtCwXG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAgICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICAgICAgICAgICAgICBnZW9KU09OQm91bmRzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLkJvdW5kcy5Cb3VuZC5Cb3VuZGFyaWVzLkJvdW5kYXJ5LkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J7QsdGK0LXQutGCINC60LLQsNGA0YLQsNC70LAg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQntCx0YrQtdC60YIg0LHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JPRgNCw0L3QuNGG0LBcbiAgICAgICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgIGdlb21ldHJ5OiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgIC8vINCe0YHRgtCw0LvRjNC90YvQtSDRgdCy0L7QudGB0YLQstCwLi4uLlxuXG4gICAgICAgICAgICBnZW9KU09OQm91bmRzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINC30L7QvS4g0J3QtSDQvNC+0LPRg9GCINCx0YvRgtGMINC80L3QvtCz0L7QutC+0L3RgtGD0YDQvdGL0LzQuFxuICAgIGlmIChBbGxEYXRhLlpvbmVzICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChBbGxEYXRhLlpvbmVzLlpvbmUuc3BsaWNlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEFsbERhdGEuWm9uZXMuWm9uZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChBbGxEYXRhLlpvbmVzLlpvbmVbaV0uRW50aXR5U3BhdGlhbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuWm9uZXMuWm9uZVtpXS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LrQstCw0YDRgtCw0LvQsCDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCe0LHRitC10LrRgiDQsdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyDQl9C+0L3QsFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IHt9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG5cbiAgICAgICAgICAgICAgICAgICAgZ2VvSlNPTlpvbmVzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuSDQt9C+0L3RiycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChBbGxEYXRhLlpvbmVzLlpvbmUuRW50aXR5U3BhdGlhbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5ab25lcy5ab25lLkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LrQstCw0YDRgtCw0LvQsCDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCe0LHRitC10LrRgiDQsdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vINCX0L7QvdCwXG4gICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICAgICAgICAgIGdlb0pTT05ab25lcy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QtdGCINC+0L/QuNGB0LDQvdC40Y8g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC10L3QvdC+0Lkg0YHQvtGB0YLQsNCy0LvRj9GO0YnQtdC5INC30L7QvdGLJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINCy0YHQtdGFINC30LXQvNC10LvRjNC90YvRhSDRg9GH0LDRgtC60L7QsiDQuCDQuNGFINGH0LDRgdGC0LXQuVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQWxsRGF0YS5QYXJjZWxzLlBhcmNlbC5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIGlmIChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICAvLyDQnNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C5XG4gICAgICAgIGVsc2UgaWYgKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbaV0uQ29udG91cnMpIHtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuScpO1xuICAgICAgICB9XG4gICAgICAgIC8vINCX0LXQvNC10LvRjNC90YvQuSDRg9GH0LDRgdGC0L7QulxuICAgICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgICAgICd0eXBlJzogJ0ZlYXR1cmUnXG4gICAgICAgICAgICAgICAgICAgIC8vZ2VvbWV0cnk6IHt9XG4gICAgICAgIH07XG4gICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG4gICAgICAgIHZhciBwcm9wcyA9IFByb3BzLmdldFByb3BlcnRpZXMoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXSwgJ1BhcmNlbCcpO1xuICAgICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllcyA9IHByb3BzLnByb3BlcnRpZXM7XG4gICAgICAgIH1cblxuICAgICAgICBnZW9KU09OUGFyY2Vscy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgIH1cblxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQv9GD0L3QutGC0L7QsiDQntCc0KFcblxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZW9KU09OUXVhcnRhbDogZ2VvSlNPTlF1YXJ0YWwsXG4gICAgICAgIGdlb0pTT05Cb3VuZHM6IGdlb0pTT05Cb3VuZHMsXG4gICAgICAgIGdlb0pTT05ab25lczogZ2VvSlNPTlpvbmVzLFxuICAgICAgICBnZW9KU09OUGFyY2VsczogZ2VvSlNPTlBhcmNlbHMsXG4gICAgICAgIGdlb0pTT05SZWFsdHk6IGdlb0pTT05SZWFsdHlcbiAgICB9O1xufTtcbiIsIi8qKlxuICog0JzQvtC00YPQu9GMINC+0LHRgNCw0LHQvtGC0LrQuCDQs9C10L7QvNC10YLRgNC40Lgg0YLQuNC/0LAg0L/QvtC70LjQs9C+0L0uXG4gKiDQntC00LjQvSDQstC90LXRiNC90LjQuSDQutC+0L3RgtGD0YAg0LggMCDQuNC70Lgg0LHQvtC70LXQtSDQstC90YPRgtGA0LXQvdC90LjRhSDQutC+0L3RgtGD0YDQvtCyLVwi0LTRi9GA0L7QulwiXG4gKiBcbiAqIEdlb0pTT04gZ2VvbWV0cnkg0YLQuNC/0LAgdEVudGl0eVNwYXRpYWxMYW5kT3V0XG4gKi9cblxuLy9cImdlb21ldHJ5XCI6IHtcbi8vICAgIFwidHlwZVwiOiBcIlBvbHlnb25cIixcbi8vICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuLy8gICAgICBbIFsxMDAuMCwgMC4wXSwgWzEwMS4wLCAwLjBdLCBbMTAxLjAsIDEuMF0sXG4vLyAgICAgICAgWzEwMC4wLCAxLjBdLCBbMTAwLjAsIDAuMF0gXVxuLy8gICAgICBdXG4vLyAgfVxuXG5cbm1vZHVsZS5leHBvcnRzLmdldEVudGl0eVNwYXRpYWwgPSBmdW5jdGlvbihFbnRpdHlTcGF0aWFsT2JqLCBwYXJ0T2ZNdWx0dSkge1xuXHRcbi8vXHR0aGlzLmdlb21ldHJ5ID0ge1xuLy8gICAgICAgIHR5cGU6ICcnLFxuLy9cdFx0Y29vcmRpbmF0ZXM6IFtdXG4vL1x0fTtcbiAgICBcbiAgICAvL3ZhciBFbnRpdHlTcGF0aWFsID0gW107XG4gICAgdmFyIEFyZWEgPSAwLjA7XG4gICAgXG4gICAgLy8g0JLRi9GH0LjRgdC70LXQvdC40LUg0L/Qu9C+0YnQsNC00Lgg0LfQsNC80LrQvdGD0YLQvtCz0L4g0LrQvtC90YLRg9GA0LBcbiAgICBmdW5jdGlvbiBwb2x5Z29uQXJlYShYcywgWXMsIG51bVBvaW50cykgeyBcbiAgICAgICAgdmFyIGFyZWEgPSAwOyAgIFxuICAgICAgICB2YXIgaiA9IG51bVBvaW50cy0xO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8bnVtUG9pbnRzOyBpKyspXG4gICAgICAgIHsgYXJlYSA9IGFyZWEgKyAgKChYc1tqXSkrKFhzW2ldKSkgKiAoKFlzW2pdKS0oWXNbaV0pKTsgXG4gICAgICAgICAgICBqID0gaTsgIC8vaiBpcyBwcmV2aW91cyB2ZXJ0ZXggdG8gaVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhcmVhLzIpO1xuICAgIH1cbiAgICBcbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC+0LTQvdC+0LPQviDQt9Cw0LzQutC90YPRgtC+0LPQviDQutC+0L3RgtGD0YDQsFxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRvdXIoU3BhdGlhbEVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHhzID0gW107XG4gICAgICAgIHZhciB5cyA9IFtdO1xuICAgICAgICB2YXIgY29udG91ciA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIHBvaW50ID0gU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdFtqXTtcbiAgICAgICAgICAgIHZhciB4eSA9IFtdO1xuICAgICAgICAgICAgeHMucHVzaChwYXJzZUZsb2F0KHBvaW50Lk9yZGluYXRlLlkpKTtcbiAgICAgICAgICAgIHlzLnB1c2gocGFyc2VGbG9hdChwb2ludC5PcmRpbmF0ZS5YKSk7XG4gICAgICAgICAgICB4eS5wdXNoKHBhcnNlRmxvYXQocG9pbnQuT3JkaW5hdGUuWSkpO1xuICAgICAgICAgICAgeHkucHVzaChwYXJzZUZsb2F0KHBvaW50Lk9yZGluYXRlLlgpKTtcbiAgICAgICAgICAgIGNvbnRvdXIucHVzaCh4eSk7XG4gICAgICAgIH1cbiAgICAgICAgQXJlYSA9IHBvbHlnb25BcmVhKHhzLCB5cywgeHMubGVuZ3RoKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhBcmVhKTtcbiAgICAgICAgcmV0dXJuIGNvbnRvdXI7XG4gICAgfVxuICAgIFxuXHRpZiAoKEVudGl0eVNwYXRpYWxPYmogIT09IHVuZGVmaW5lZCkgJiYgKEVudGl0eVNwYXRpYWxPYmogIT09IG51bGwpKSB7XG4gICAgICAgIHZhciBjbnRycyA9IFtdO1xuICAgICAgICAvLyDQo9GC0LjQvdC90LDRjyDRgtC40L/QuNC30LDRhtC40Y8g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsNC70LjRh9C40Y8g0LTRi9GA0L7QuiDQsiDQv9C+0LvQuNCz0L7QvdC1XG4gICAgICAgIC8vINCSINCg0L7RgdGA0LXQtdGB0YLRgNC1INC90LUg0YHQu9C10LTRj9GCINC30LAg0L/QvtGA0Y/QtNC60L7QvCDQutC+0L3RgtGD0YDQvtCyINC/0L7Qu9C40LPQvtC90LBcbiAgICAgICAgaWYgKEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQuc3BsaWNlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCfQn9C+0LvQuNCz0L7QvSDRgSDQtNGL0YDQutCw0LzQuCcpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgTWF4QXJlYTtcbiAgICAgICAgICAgIHZhciBNYXhBcmVhSWR4ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb250b3VyID0gRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudFtrXTtcbiAgICAgICAgICAgICAgICB2YXIgY250ID0gY3JlYXRlQ29udG91cihjb250b3VyKTtcbiAgICAgICAgICAgICAgICBjbnRycy5wdXNoKGNudCk7XG4gICAgICAgICAgICAgICAgaWYoQXJlYSA+IE1heEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgTWF4QXJlYSA9IEFyZWE7XG4gICAgICAgICAgICAgICAgICAgIE1heEFyZWFJZHggPSBrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCf0LXRgNC10LzQtdGJ0LDQtdC8INC+0YHQvdC+0LLQvdC+0LkgKNC90LDRgNGD0LbQvdC40LkpINC60L7QvdGC0YPRgCDQsiDQvdCw0YfQsNC70L4g0LzQsNGB0YHQuNCy0LBcbiAgICAgICAgICAgIGlmIChNYXhBcmVhSWR4ID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBtYWluQ250ID0gY250cnMuc3BsaWNlKE1heEFyZWFJZHgsIDEpO1xuICAgICAgICAgICAgICAgIGNudHJzLnNwbGljZSgwLCAwLCBtYWluQ250KTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCfQndC+0LzQtdGAINC+0YHQvdC+0LLQvdC+0LPQviDQutC+0L3RgtGD0YDQsCDQsdGL0LsgJyArIE1heEFyZWFJZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3QvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC80LDRgdGB0LjQsiDQutC+0L3RgtGD0YDQvtCyXG4gICAgICAgICAgICBpZiAocGFydE9mTXVsdHUpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNudHJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRjdGC0L4g0LTQu9GPINC/0YDQvtGB0YLQvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC+0LHRitC10LrRgiBnZW9tZXRyeVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjbnRyc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY29udG91ciA9IEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgcG9seWdvbiA9IGNyZWF0ZUNvbnRvdXIoY29udG91cik7XG4gICAgICAgICAgICBjbnRycy5wdXNoKHBvbHlnb24pO1xuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3QvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC80LDRgdGB0LjQsiDQutC+0L3RgtGD0YDQvtCyXG4gICAgICAgICAgICBpZiAocGFydE9mTXVsdHUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY250cnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRjdGC0L4g0LTQu9GPINC/0YDQvtGB0YLQvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC+0LHRitC10LrRgiBnZW9tZXRyeVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjbnRyc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59OyJdfQ==
