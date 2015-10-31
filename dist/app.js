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
                    color: 'red'
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
                    features: (new ol.format.GeoJSON()).readFeatures(parsedData.geoJSONRealty)
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
                var realtys = parsedData.geoJSONRealtyCircle;
                // vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([5e6, 7e6], 1e6)));
                for (i = 0; i < realtys.features.length; i++) {
                    console.log(realtys.features[i]);
                    realtyLayer.getSource().addFeature(
                            new ol.Feature(new ol.geom.Circle(
                            [realtys.features[i].geometry.coordinates[0], realtys.features[i].geometry.coordinates[1]], 
                    realtys.features[i].geometry.radius)));
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
    // В GeoJSON нет окружностей и обрабатывать стандартными парсерами нельзя
    var geoJSONRealtyCircle = {
        type: "CircleCollection",
        features: []
    };
    var geoJSONOSMPoints = {
        type: "FeatureCollection",
        features: []
    };

    var AllData = $.xml2json(xmlData).CadastralBlocks.CadastralBlock;
    console.log(AllData);

    // Обработка квартала. Не может быть многоконтурным           
    if (AllData.SpatialData !== null) {
        var spObj = ES.getEntitySpatial(AllData.SpatialData.EntitySpatial, false);
        if ((spObj === undefined) || (spObj.length === 0)) {
            console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
        }
        // Квартал
        var feature = {
            'type': 'Feature'
        };
        feature.geometry = spObj;
        // Остальные свойства....

        geoJSONQuartal.features.push(feature);
    } else {
        console.log('Нет описания пространственной составляющей квартала');
    }

    // Обработка границ. Не могут быть многоконтурными
    if (AllData.Bounds !== null) {
        // Граница
        var feature = {
            'type': 'Feature'
        };
        if (AllData.Bounds.Bound.splice) {
            for (var i = 0; i < AllData.Bounds.Bound.length; i++) {
                if (AllData.Bounds.Bound[i].Boundaries.Boundary.splice) {
                    for (var k = 0; k < AllData.Bounds.Bound[i].Boundaries.Boundary.length; k++) {
                        if (AllData.Bounds.Bound[i].Boundaries.Boundary[k].EntitySpatial !== null) {
                            var spObj = ES.getEntitySpatial(AllData.Bounds.Bound[i].Boundaries.Boundary[k].EntitySpatial, false);
                            if ((spObj === undefined) || (spObj.length === 0)) {
                                //console.log('Объект с пустой геометрией! Объект будет пропущен.');
                                continue;
                            }
                            feature.geometry = spObj;
                            // Остальные свойства....

                            geoJSONBounds.features.push(feature);
                        } else {
                            //console.log('Нет описания пространственной составляющей границы');
                        }
                    }
                } else {
                    var spObj = ES.getEntitySpatial(AllData.Bounds.Bound[i].Boundaries.Boundary.EntitySpatial, false);
                    if ((spObj === undefined) || (spObj.length === 0)) {
                        //console.log('Объект с пустой геометрией! Объект будет пропущен.');
                        continue;
                    }
                    feature.geometry = spObj;
                    // Остальные свойства....

                    geoJSONBounds.features.push(feature);
                }
            }
        } else {
            var spObj = ES.getEntitySpatial(AllData.Bounds.Bound.Boundaries.Boundary.EntitySpatial, false);
            if ((spObj === undefined) || (spObj.length === 0)) {
                //console.log('Объект  с пустой геометрией! Объект будет пропущен.');
            }
            feature.geometry = spObj;
            // Остальные свойства....

            geoJSONBounds.features.push(feature);
        }
    }
    // Обработка зон. Не могут быть многоконтурными
    if (AllData.Zones !== null) {
        // Зона
        var feature = {
            'type': 'Feature'
        };
        if (AllData.Zones.Zone.splice) {
            for (var i = 0; i < AllData.Zones.Zone.length; i++) {
                if (AllData.Zones.Zone[i].EntitySpatial !== null) {
                    var spObj = ES.getEntitySpatial(AllData.Zones.Zone[i].EntitySpatial, false);
                    if ((spObj === undefined) || (spObj.length === 0)) {
                        console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
                        continue;
                    }
                    feature.geometry = spObj;

                    geoJSONZones.features.push(feature);
                } else {
                    console.log('Нет описания пространственной составляющей зоны');
                }
            }
        } else {
            if (AllData.Zones.Zone.EntitySpatial !== null) {
                var spObj = ES.getEntitySpatial(AllData.Zones.Zone.EntitySpatial, false);
                if ((spObj === undefined) || (spObj.length === 0)) {
                    console.log('Объект с пустой геометрией! Объект будет пропущен.');
                }
                feature.geometry = spObj;

                geoJSONZones.features.push(feature);
            } else {
                console.log('Нет описания пространственной составляющей зоны');
            }
        }
    }
    // Обработка всех земельных участков
    for (var e = 0; e < AllData.Parcels.Parcel.length; e++) {
        var spObj = null;
        // Земельный участок
        var feature = {
            'type': 'Feature'
        };
        if (AllData.Parcels.Parcel[e].EntitySpatial !== undefined) {
            spObj = ES.getEntitySpatial(AllData.Parcels.Parcel[e].EntitySpatial, false);
            if ((spObj === undefined) || (spObj.length === 0)) {
                continue;
            }

        }
        // Многоконтурный
        else if (AllData.Parcels.Parcel[e].Contours) {
            var Contours = AllData.Parcels.Parcel[e].Contours.Contour;
            var multiPolygon = [];
            for (var c = 0; c < Contours.length; c++) {
                var es = Contours[c].EntitySpatial;
                var p = ES.getEntitySpatial(es, true);
                if (p) {
                    multiPolygon.push(p);
                }
            }
            spObj = {
                type: "MultiPolygon",
                coordinates: multiPolygon
            };
        } else {
            //console.log('Нет описания пространственной составляющей');
        }

        // Если нет геометрии, то объект не нужен
        if (spObj) {
            feature.geometry = spObj;
            // Остальные свойства....
            var props = Props.getProperties(AllData.Parcels.Parcel[e], 'Parcel');
            if (props) {
                feature.properties = props.properties;
            }
            console.log('Объект создан. КН:' + feature.properties.cadastreNumber);
            geoJSONParcels.features.push(feature);
        }

    }
    // Обработка строений. Не могут быть многоконтурными
    if (AllData.ObjectsRealty.ObjectRealty !== null) {
        if (AllData.ObjectsRealty.ObjectRealty.splice) {

            function processES(EntitySpatial) {
                var spObj = ES.getEntitySpatial(EntitySpatial);
                if (spObj) {
                    feature.geometry = spObj;
                    if (spObj.type === 'Circle') {
                        geoJSONRealtyCircle.features.push(feature);
                    } else {
                        geoJSONRealty.features.push(feature);
                    }
                } else {
                    console.log('Объект с пустой геометрией! Объект будет пропущен.');
                }
            }

            for (var i = 0; i < AllData.ObjectsRealty.ObjectRealty.length; i++) {
                var spObj = null;
                // ОКС
                var feature = {
                    'type': 'Feature'
                };
                // строения
                if (AllData.ObjectsRealty.ObjectRealty[i].Building) {
                    if (AllData.ObjectsRealty.ObjectRealty[i].Building.EntitySpatial) {
                        var props = Props.getProperties(AllData.ObjectsRealty.ObjectRealty[i].Building, 'Building');
                        if (props) {
                            feature.properties = props.properties;
                        }
                        processES(AllData.ObjectsRealty.ObjectRealty[i].Building.EntitySpatial);
                    }
                }
                // объекты незавершённого строительства
                else if (AllData.ObjectsRealty.ObjectRealty[i].Uncompleted) {
                    if (AllData.ObjectsRealty.ObjectRealty[i].Uncompleted.EntitySpatial) {
                        var props = Props.getProperties(AllData.ObjectsRealty.ObjectRealty[i].Uncompleted, 'Uncompleted');
                        if (props) {
                            feature.properties = props.properties;
                        }
                        processES(AllData.ObjectsRealty.ObjectRealty[i].Uncompleted.EntitySpatial);
                    }
                }
                // сооружения
                else if (AllData.ObjectsRealty.ObjectRealty[i].Construction) {
                    if (AllData.ObjectsRealty.ObjectRealty[i].Construction.EntitySpatial) {
                        var props = Props.getProperties(AllData.ObjectsRealty.ObjectRealty[i].Construction, 'Construction');
                        if (props) {
                            feature.properties = props.properties;
                        }
                        processES(AllData.ObjectsRealty.ObjectRealty[i].Construction.EntitySpatial);
                    }
                }
            }
        }
    }
    // Обработка пунктов ОМС
    
    return {
        geoJSONQuartal: geoJSONQuartal,
        geoJSONBounds: geoJSONBounds,
        geoJSONZones: geoJSONZones,
        geoJSONParcels: geoJSONParcels,
        geoJSONRealty: geoJSONRealty,
        geoJSONRealtyCircle: geoJSONRealtyCircle
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


module.exports.getEntitySpatial = function (EntitySpatialObj, partOfMultu) {

//	this.geometry = {
//        type: '',
//		coordinates: []
//	};

    //var EntitySpatial = [];
    var Area = 0.0;

    // Вычисление площади замкнутого контура
    function polygonArea(Xs, Ys, numPoints) {
        var area = 0;
        var j = numPoints - 1;
        for (var i = 0; i < numPoints; i++)
        {
            area = area + ((Xs[j]) + (Xs[i])) * ((Ys[j]) - (Ys[i]));
            j = i;  //j is previous vertex to i
        }
        return Math.abs(area / 2);
    }

    // Создание одного замкнутого контура
    function createContour(SpatialElement) {
        var xs = [];
        var ys = [];
        var contour = [];
        // проверка на окружность
        if ((partOfMultu === undefined) &&
                (SpatialElement.SpelementUnit.R !== undefined)) {
            console.log('Circle');
            return {
                'R': SpatialElement.SpelementUnit.R,
                'X': SpatialElement.SpelementUnit.Ordinate.Y,
                'Y': SpatialElement.SpelementUnit.Ordinate.X
            };
        } else {
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
                if (cnt)
                    cntrs.push(cnt);
                if (Area > MaxArea) {
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
            // для ОКС. Только один контур
            else if (partOfMultu === undefined) {
                if (cntrs[0].R) {
                    return {
                        "type": "Circle",
                        "coordinates": [cntrs[0].X, cntrs[0].Y],
                        "radius": cntrs[0].R,
                        "properties": {
                            "radius_units": "m"
                        }
                    };
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFByb3BzLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL3NwYXRpYWwvRW50aXR5U3BhdGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuICogVG8gY2hhbmdlIHRoaXMgbGljZW5zZSBoZWFkZXIsIGNob29zZSBMaWNlbnNlIEhlYWRlcnMgaW4gUHJvamVjdCBQcm9wZXJ0aWVzLlxuICogVG8gY2hhbmdlIHRoaXMgdGVtcGxhdGUgZmlsZSwgY2hvb3NlIFRvb2xzIHwgVGVtcGxhdGVzXG4gKiBhbmQgb3BlbiB0aGUgdGVtcGxhdGUgaW4gdGhlIGVkaXRvci5cbiAqL1xuXG52YXIgQ29udmVydGVyID0gcmVxdWlyZSgnLi9jYWRYTUwyR2VvSlNPTi5qcycpO1xudmFyIG1hcDtcblN0YXJ0UGFyc2UoKTtcblxuZnVuY3Rpb24gU3RhcnRQYXJzZSgpIHtcblxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAnKTtcbiAgICB2YXIgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cC1jb250ZW50Jyk7XG4gICAgdmFyIGNsb3NlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cC1jbG9zZXInKTtcblxuICAgIGNsb3Nlci5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvdmVybGF5LnNldFBvc2l0aW9uKHVuZGVmaW5lZCk7XG4gICAgICAgIGNsb3Nlci5ibHVyKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIG92ZXJsYXkgPSBuZXcgb2wuT3ZlcmxheSgvKiogQHR5cGUge29seC5PdmVybGF5T3B0aW9uc30gKi8gKHtcbiAgICAgICAgZWxlbWVudDogY29udGFpbmVyLFxuICAgICAgICBhdXRvUGFuOiB0cnVlLFxuICAgICAgICBhdXRvUGFuQW5pbWF0aW9uOiB7XG4gICAgICAgICAgICBkdXJhdGlvbjogMjUwXG4gICAgICAgIH1cbiAgICB9KSk7XG5cbiAgICAvLyBodHRwczovL2JpdGJ1Y2tldC5vcmcvc3VyZW5yYW8veG1sMmpzb25cbiAgICAvLyBodHRwOi8vd3d3LmNocm9tZS1hbGxvdy1maWxlLWFjY2Vzcy1mcm9tLWZpbGUuY29tL1xuICAgIHZhciBwYXJzZWREYXRhO1xuICAgICQuZ2V0KCcuL3Rlc3RkYXRhL2RvYzg1MDA3MTcueG1sJywgZnVuY3Rpb24gKHhtbCkge1xuICAgICAgICAvL3ZhciBqc29uID0gJC54bWwyanNvbih4bWwpLkNhZGFzdHJhbEJsb2NrcztcbiAgICAgICAgLy8gJChcIiNkYXRhXCIpLmh0bWwoJzxjb2RlPicrSlNPTi5zdHJpbmdpZnkoanNvbikrJzwvY29kZT4nKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhDb252ZXJ0ZXIuR2VvSlNPTik7XG4gICAgICAgIHBhcnNlZERhdGEgPSBDb252ZXJ0ZXIuR2VvSlNPTih4bWwpO1xuICAgIH0pLnN1Y2Nlc3MoXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL1xuICAgICAgICAgICAgICAgIHZhciBwYXJjZWxGaWxsID0gbmV3IG9sLnN0eWxlLkZpbGwoe1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNhM2JkYzgnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlYWx0eWxGaWxsID0gbmV3IG9sLnN0eWxlLkZpbGwoe1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3JlZCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdHJva2UgPSBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMzEzMDMwJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgYm91bmRTdHJva2UgPSBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDA0QzAwJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgem9uZVN0cm9rZSA9IG5ldyBvbC5zdHlsZS5TdHJva2Uoe1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNlZTZhNTAnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBxdWFydGFsU3Ryb2tlID0gbmV3IG9sLnN0eWxlLlN0cm9rZSh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNiMjAyZicsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSBuZXcgb2wuc3R5bGUuVGV4dCh7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8g0J/QvtC00L/QuNGB0LDRgtGMINC60LDQtNCw0YHRgtGA0L7QstGL0LUg0L3QvtC80LXRgNCwXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyDQodGC0LjQu9C4XG4gICAgICAgICAgICAgICAgdmFyIHBhcmNlbFN0eWxlID0gbmV3IG9sLnN0eWxlLlN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogcGFyY2VsRmlsbCxcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHJva2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcmVhbHR5U3R5bGUgPSBuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBmaWxsOiByZWFsdHlsRmlsbCxcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHJva2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbFN0eWxlID0gbmV3IG9sLnN0eWxlLlN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBxdWFydGFsU3Ryb2tlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kU3R5bGUgPSBuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBzdHJva2U6IGJvdW5kU3Ryb2tlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHpvbmVTdHlsZSA9IG5ldyBvbC5zdHlsZS5TdHlsZSh7XG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogem9uZVN0cm9rZVxuICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbFNvdXJjZSA9IG5ldyBvbC5zb3VyY2UuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgLy9wcm9qZWN0aW9uOiAnRVBTRzozODU3J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBwYXJjZWxTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmVzOiAobmV3IG9sLmZvcm1hdC5HZW9KU09OKCkpLnJlYWRGZWF0dXJlcyhwYXJzZWREYXRhLmdlb0pTT05QYXJjZWxzKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciByZWFsdHlTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmVzOiAobmV3IG9sLmZvcm1hdC5HZW9KU09OKCkpLnJlYWRGZWF0dXJlcyhwYXJzZWREYXRhLmdlb0pTT05SZWFsdHkpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kU291cmNlID0gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICAvL3Byb2plY3Rpb246ICdFUFNHOjM4NTcnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHpvbmVTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIC8vcHJvamVjdGlvbjogJ0VQU0c6Mzg1NydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgcXVhcnRhbExheWVyID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogcXVhcnRhbFNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHF1YXJ0YWxTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC41XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmNlbExheWVyID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogcGFyY2VsU291cmNlLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogcGFyY2VsU3R5bGUsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciByZWFsdHlMYXllciA9IG5ldyBvbC5sYXllci5WZWN0b3Ioe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHJlYWx0eVNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHJlYWx0eVN0eWxlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBib3VuZFNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGJvdW5kU3R5bGUsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciB6b25lTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB6b25lU291cmNlLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogem9uZVN0eWxlLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBmb3JtYXQgPSBuZXcgb2wuZm9ybWF0Lkdlb0pTT04oKTtcbi8vICAgICAgICAgICAgICAgIHZhciBwYXJjZWxzID0gcGFyc2VkRGF0YS5nZW9KU09OUGFyY2Vscztcbi8vICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJjZWxzLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0LnJlYWRHZW9tZXRyeShwYXJjZWxzLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbi8vICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IG5ldyBvbC5GZWF0dXJlKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbi8vICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICBwYXJjZWxMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuLy8gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZWFsdHlzID0gcGFyc2VkRGF0YS5nZW9KU09OUmVhbHR5Q2lyY2xlO1xuICAgICAgICAgICAgICAgIC8vIHZlY3RvclNvdXJjZS5hZGRGZWF0dXJlKG5ldyBvbC5GZWF0dXJlKG5ldyBvbC5nZW9tLkNpcmNsZShbNWU2LCA3ZTZdLCAxZTYpKSk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHJlYWx0eXMuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVhbHR5cy5mZWF0dXJlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIHJlYWx0eUxheWVyLmdldFNvdXJjZSgpLmFkZEZlYXR1cmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IG9sLkZlYXR1cmUobmV3IG9sLmdlb20uQ2lyY2xlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyZWFsdHlzLmZlYXR1cmVzW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLCByZWFsdHlzLmZlYXR1cmVzW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdXSwgXG4gICAgICAgICAgICAgICAgICAgIHJlYWx0eXMuZmVhdHVyZXNbaV0uZ2VvbWV0cnkucmFkaXVzKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgem9uZXMgPSBwYXJzZWREYXRhLmdlb0pTT05ab25lcztcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgem9uZXMuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0LnJlYWRHZW9tZXRyeSh6b25lcy5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJvcEEgOiBwYXJzZWREYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuY2FkbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB6b25lTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHF1YXJ0YWwgPSBwYXJzZWREYXRhLmdlb0pTT05RdWFydGFsO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBxdWFydGFsLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9tZXRyeU9iaiA9IGZvcm1hdC5yZWFkR2VvbWV0cnkocXVhcnRhbC5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5T2JqLy8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJvcEEgOiBwYXJzZWREYXRhLmZlYXR1cmVzW2ldLnByb3BlcnRpZXMuY2FkbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBxdWFydGFsTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IHBhcnNlZERhdGEuZ2VvSlNPTkJvdW5kcztcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYm91bmRzLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnZW9tZXRyeU9iaiA9IGZvcm1hdC5yZWFkR2VvbWV0cnkoYm91bmRzLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlPYmovLyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyQoXCIjdHh0XCIpLmpKc29uVmlld2VyKHBhcnNlZERhdGEpO1xuLy8gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcnNlZERhdGEpIHtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0KHQvtC30LTQsNC90L4g0L7QsdGK0LXQutGC0L7QsiAnICsga2V5ICsgJzogJyArIHBhcnNlZERhdGFba2V5XS5mZWF0dXJlcy5sZW5ndGgpO1xuLy8gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJzZWREYXRhW2tleV0uZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlYWRHZW9tZXRyeShwYXJzZWREYXRhW2tleV0uZmVhdHVyZXNbaV0uZ2VvbWV0cnkpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IG5ldyBvbC5GZWF0dXJlKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeU9iai8vLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Byb3BBIDogcGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmNhZG51bWJlclxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgdmVjdG9yTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtYXAgPSBuZXcgb2wuTWFwKHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnbWFwJyxcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBbXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBvbC5sYXllci5UaWxlKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbmV3IG9sLnNvdXJjZS5PU00oKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YXJ0YWxMYXllciwgYm91bmRMYXllciwgem9uZUxheWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyY2VsTGF5ZXIsIHJlYWx0eUxheWVyXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlzOiBbb3ZlcmxheV0sXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6IG5ldyBvbC5WaWV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlcjogWzAsIDBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgem9vbTogN1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1hcC5nZXRWaWV3KCkuZml0KHF1YXJ0YWxMYXllci5nZXRTb3VyY2UoKS5nZXRFeHRlbnQoKSwgbWFwLmdldFNpemUoKSk7XG5cbiAgICAgICAgICAgICAgICBtYXAub24oJ3NpbmdsZWNsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvb3JkaW5hdGUgPSBldnQuY29vcmRpbmF0ZTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcC5nZXRMYXllcnMoKS5nZXRMZW5ndGgoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXIgPSBtYXAuZ2V0TGF5ZXJzKCkuaXRlbShpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXllciBpbnN0YW5jZW9mIG9sLmxheWVyLlZlY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbGF5ZXIuZ2V0U291cmNlKCkuZ2V0Q2xvc2VzdEZlYXR1cmVUb0Nvb3JkaW5hdGUoZXZ0LmNvb3JkaW5hdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmZWF0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUluZm9Db250ZXRudChmZWF0dXJlcywgY29vcmRpbmF0ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVJbmZvQ29udGV0bnQoZmVhdHVyZXMsIGNvb3JkaW5hdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNuID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2F0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmID0gZmVhdHVyZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi5nZXQoJ2NhZGFzdHJlTnVtYmVyJykhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY24gPSBmLmdldCgnY2FkYXN0cmVOdW1iZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLmdldCgnU3RhdGUnKSE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdCA9IGYuZ2V0KCdTdGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYuZ2V0KCdOYW1lJykhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA9IGYuZ2V0KCdOYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi5nZXQoJ0NhdGVnb3J5JykhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ID0gZi5nZXQoJ0NhdGVnb3J5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGZlYXR1cmVzW2ldLmdldFByb3BlcnRpZXMoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGhkbXMgPSBvbC5jb29yZGluYXRlLnRvU3RyaW5nSERNUyhvbC5wcm9qLnRyYW5zZm9ybShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlLCAnRVBTRzozODU3JywgJ0VQU0c6NDMyNicpKTtcblxuICAgICAgICAgICAgICAgICAgICBjb250ZW50LmlubmVySFRNTCA9ICc8cD7QmtCw0LTQsNGB0YLRgNC+0LLRi9C5INC90L7QvNC10YA6PGNvZGU+JyArIGNuICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9jb2RlPjwvcD48cD7QntCx0YrQtdC60YI6PGNvZGU+JyArIG5hbWUgKyc8L2NvZGU+PC9wPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvY29kZT48cD7QodGC0LDRgtGD0YE6PGNvZGU+JyArIHN0ICsnPC9jb2RlPjwvcD4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2NvZGU+PHA+0JrQsNGC0LXQs9C+0YDQuNGPINC30LXQvNC10LvRjDo8Y29kZT4nICsgY2F0ICsnPC9jb2RlPjwvcD4nO1xuICAgICAgICAgICAgICAgICAgICBvdmVybGF5LnNldFBvc2l0aW9uKGNvb3JkaW5hdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG59XG5cblxuXG4iLCIvKiBcbiAqIFRoZSBNSVQgTGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAyMDE1IGZpbGlwcG92LlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cbid1c2Ugc3RyaWN0Jztcbi8vIERpY3RzXG5cbi8vINCh0YLQsNGC0YPRgSDQvtCx0YrQtdC60YLQsCDQvdC10LTQstC40LbQuNC80L7RgdGC0LhcbnZhciBkU3RhdGVzID0ge1xuICAgICcwMSc6ICfQoNCw0L3QtdC1INGD0YfRgtC10L3QvdGL0LknLFxuICAgICcwNSc6ICfQktGA0LXQvNC10L3QvdGL0LknLFxuICAgICcwNic6ICfQo9GH0YLQtdC90L3Ri9C5JyxcbiAgICAnMDcnOiAn0KHQvdGP0YIg0YEg0YPRh9C10YLQsCcsXG4gICAgJzA4JzogJ9CQ0L3QvdGD0LvQuNGA0L7QstCw0L3QvdGL0LknXG59O1xuLy8g0KLQuNC/ICDQvtCx0YrQtdC60YLQsCDQvdC10LTQstC40LbQuNC80L7RgdGC0LhcbnZhciBkUGFyY2VscyA9IHtcbiAgICAnMDEnOiAn0JfQtdC80LvQtdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUnLFxuICAgICcwMic6ICfQldC00LjQvdC+0LUg0LfQtdC80LvQtdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUnLFxuICAgICcwMyc6ICfQntCx0L7RgdC+0LHQu9C10L3QvdGL0Lkg0YPRh9Cw0YHRgtC+0LonLFxuICAgICcwNCc6ICfQo9GB0LvQvtCy0L3Ri9C5INGD0YfQsNGB0YLQvtC6JyxcbiAgICAnMDUnOiAn0JzQvdC+0LPQvtC60L7QvdGC0YPRgNC90YvQuSDRg9GH0LDRgdGC0L7QuicsXG4gICAgJzA2JzogJ9CX0L3QsNGH0LXQvdC40LUg0L7RgtGB0YPRgtGB0YLQstGD0LXRgidcbn07XG4vLyDQmtCw0YLQtdCz0L7RgNC40Y8g0LfQtdC80LXQu9GMXG52YXIgZENhdGVnb3JpZXMgPSB7XG4gICAgJzAwMzAwMTAwMDAwMCc6ICfQl9C10LzQu9C4INGB0LXQu9GM0YHQutC+0YXQvtC30Y/QudGB0YLQstC10L3QvdC+0LPQviDQvdCw0LfQvdCw0YfQtdC90LjRjycsXG4gICAgJzAwMzAwMjAwMDAwMCc6ICfQl9C10LzQu9C4INC90LDRgdC10LvRkdC90L3Ri9GFINC/0YPQvdC60YLQvtCyJyxcbiAgICAnMDAzMDAzMDAwMDAwJzogJ9CX0LXQvNC70Lgg0L/RgNC+0LzRi9GI0LvQtdC90L3QvtGB0YLQuCwg0Y3QvdC10YDQs9C10YLQuNC60LgsINGC0YDQsNC90YHQv9C+0YDRgtCwLCDRgdCy0Y/Qt9C4LCDRgNCw0LTQuNC+0LLQtdGJ0LDQvdC40Y8sINGC0LXQu9C10LLQuNC00LXQvdC40Y8sINC40L3RhNC+0YDQvNCw0YLQuNC60LgsINC30LXQvNC70Lgg0LTQu9GPINC+0LHQtdGB0L/QtdGH0LXQvdC40Y8g0LrQvtGB0LzQuNGH0LXRgdC60L7QuSDQtNC10Y/RgtC10LvRjNC90L7RgdGC0LgsINC30LXQvNC70Lgg0L7QsdC+0YDQvtC90YssINCx0LXQt9C+0L/QsNGB0L3QvtGB0YLQuCDQuCDQt9C10LzQu9C4INC40L3QvtCz0L4g0YHQv9C10YbQuNCw0LvRjNC90L7Qs9C+INC90LDQt9C90LDRh9C10L3QuNGPJyxcbiAgICAnMDAzMDA0MDAwMDAwJzogJ9CX0LXQvNC70Lgg0L7RgdC+0LHQviDQvtGF0YDQsNC90Y/QtdC80YvRhSDRgtC10YDRgNC40YLQvtGA0LjQuSDQuCDQvtCx0YrQtdC60YLQvtCyJyxcbiAgICAnMDAzMDA1MDAwMDAwJzogJ9CX0LXQvNC70Lgg0LvQtdGB0L3QvtCz0L4g0YTQvtC90LTQsCcsXG4gICAgJzAwMzAwNjAwMDAwMCc6ICfQl9C10LzQu9C4INCy0L7QtNC90L7Qs9C+INGE0L7QvdC00LAnLFxuICAgICcwMDMwMDcwMDAwMDAnOiAn0JfQtdC80LvQuCDQt9Cw0L/QsNGB0LAnLFxuICAgICcwMDMwMDgwMDAwMDAnOiAn0JrQsNGC0LXQs9C+0YDQuNGPINC90LUg0YPRgdGC0LDQvdC+0LLQu9C10L3QsCdcbn07XG52YXIgUGFyY2VsUHJvcGVydGllcztcblxuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tRGljdChLZXksIERpYykge1xuICAgIGZvciAodmFyIGsgaW4gRGljKSB7XG4gICAgICAgIGlmIChrID09PSBLZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBEaWNba107XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmdldFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoRmVhdHVyZSwgRmVhdHVyZVR5cGUpIHtcbiAgICBzd2l0Y2ggKEZlYXR1cmVUeXBlKSB7XG4gICAgICAgIGNhc2UgJ1BhcmNlbCcgOlxuICAgICAgICB7XG4gICAgICAgICAgICBQYXJjZWxQcm9wZXJ0aWVzID0ge1xuICAgICAgICAgICAgICAgIGNhZGFzdHJlTnVtYmVyOiAnJywgLy8gcmVxdWlyZVxuICAgICAgICAgICAgICAgIFN0YXRlOiAnMDEnLCAvLyBkU3RhdGVzIHJlcXVpcmVcbiAgICAgICAgICAgICAgICBEYXRlQ3JlYXRlZDogJycsXG4gICAgICAgICAgICAgICAgTmFtZTogJycsIC8vZFBhcmNlbHMgcmVxdWlyZVxuICAgICAgICAgICAgICAgIENhdGVnb3J5OiAnJywgLy8gZENhdGVnb3JpZXMgLy8gcmVxdWlyZVxuICAgICAgICAgICAgICAgIEFyZWE6IHsvLyByZXF1cmVcbiAgICAgICAgICAgICAgICAgICAgQXJlYTogMCwgLy8gcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICBVbml0OiAnJywgLy9kVW5pdCByZXF1aXJlXG4gICAgICAgICAgICAgICAgICAgIEluYWNjdXJhY3k6ICcnIC8vIGQyMF8yXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBVdGlsaXphdGlvbjogey8vIHJlcXVpcmVcbiAgICAgICAgICAgICAgICAgICAgQnlEb2M6ICcnLFxuICAgICAgICAgICAgICAgICAgICBVdGlsaXphdGlvbjogJycgLy8gZFV0aWxpemF0aW9uIHJlcXVpcmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgUGFyY2VsUHJvcGVydGllcy5jYWRhc3RyZU51bWJlciA9IEZlYXR1cmUuQ2FkYXN0cmFsTnVtYmVyO1xuICAgICAgICAgICAgUGFyY2VsUHJvcGVydGllcy5TdGF0ZSA9IGdldFZhbHVlRnJvbURpY3QoRmVhdHVyZS5TdGF0ZSwgZFN0YXRlcyk7XG4gICAgICAgICAgICBQYXJjZWxQcm9wZXJ0aWVzLk5hbWUgPSBnZXRWYWx1ZUZyb21EaWN0KEZlYXR1cmUuTmFtZSwgZFBhcmNlbHMpO1xuICAgICAgICAgICAgUGFyY2VsUHJvcGVydGllcy5DYXRlZ29yeSA9IGdldFZhbHVlRnJvbURpY3QoRmVhdHVyZS5DYXRlZ29yeSwgZENhdGVnb3JpZXMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvcGVydGllczogUGFyY2VsUHJvcGVydGllc1xuICAgIH07XG59OyIsInZhciBFUyA9IHJlcXVpcmUoJy4vc3BhdGlhbC9FbnRpdHlTcGF0aWFsLmpzJyk7XG52YXIgUHJvcHMgPSByZXF1aXJlKCcuL2NhZFByb3BzJyk7XG5cbm1vZHVsZS5leHBvcnRzLkdlb0pTT04gPSBmdW5jdGlvbiAoeG1sRGF0YSkge1xuXG4gICAgdmFyIGdlb0pTT05RdWFydGFsID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzOiBbXVxuICAgIH07XG4gICAgdmFyIGdlb0pTT05Cb3VuZHMgPSB7XG4gICAgICAgIHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgZmVhdHVyZXM6IFtdXG4gICAgfTtcbiAgICB2YXIgZ2VvSlNPTlpvbmVzID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzOiBbXVxuICAgIH07XG4gICAgdmFyIGdlb0pTT05QYXJjZWxzID0ge1xuICAgICAgICAndHlwZSc6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICAgICdmZWF0dXJlcyc6IFtdXG4gICAgfTtcbiAgICB2YXIgZ2VvSlNPTlJlYWx0eSA9IHtcbiAgICAgICAgdHlwZTogXCJGZWF0dXJlQ29sbGVjdGlvblwiLFxuICAgICAgICBmZWF0dXJlczogW11cbiAgICB9O1xuICAgIC8vINCSIEdlb0pTT04g0L3QtdGCINC+0LrRgNGD0LbQvdC+0YHRgtC10Lkg0Lgg0L7QsdGA0LDQsdCw0YLRi9Cy0LDRgtGMINGB0YLQsNC90LTQsNGA0YLQvdGL0LzQuCDQv9Cw0YDRgdC10YDQsNC80Lgg0L3QtdC70YzQt9GPXG4gICAgdmFyIGdlb0pTT05SZWFsdHlDaXJjbGUgPSB7XG4gICAgICAgIHR5cGU6IFwiQ2lyY2xlQ29sbGVjdGlvblwiLFxuICAgICAgICBmZWF0dXJlczogW11cbiAgICB9O1xuICAgIHZhciBnZW9KU09OT1NNUG9pbnRzID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzOiBbXVxuICAgIH07XG5cbiAgICB2YXIgQWxsRGF0YSA9ICQueG1sMmpzb24oeG1sRGF0YSkuQ2FkYXN0cmFsQmxvY2tzLkNhZGFzdHJhbEJsb2NrO1xuICAgIGNvbnNvbGUubG9nKEFsbERhdGEpO1xuXG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINC60LLQsNGA0YLQsNC70LAuINCd0LUg0LzQvtC20LXRgiDQsdGL0YLRjCDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C8ICAgICAgICAgICBcbiAgICBpZiAoQWxsRGF0YS5TcGF0aWFsRGF0YSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuU3BhdGlhbERhdGEuRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0J7QsdGK0LXQutGCINC60LLQsNGA0YLQsNC70LAg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQntCx0YrQtdC60YIg0LHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICB9XG4gICAgICAgIC8vINCa0LLQsNGA0YLQsNC7XG4gICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgJ3R5cGUnOiAnRmVhdHVyZSdcbiAgICAgICAgfTtcbiAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICBnZW9KU09OUXVhcnRhbC5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfQndC10YIg0L7Qv9C40YHQsNC90LjRjyDQv9GA0L7RgdGC0YDQsNC90YHRgtCy0LXQvdC90L7QuSDRgdC+0YHRgtCw0LLQu9GP0Y7RidC10Lkg0LrQstCw0YDRgtCw0LvQsCcpO1xuICAgIH1cblxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQs9GA0LDQvdC40YYuINCd0LUg0LzQvtCz0YPRgiDQsdGL0YLRjCDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C80LhcbiAgICBpZiAoQWxsRGF0YS5Cb3VuZHMgIT09IG51bGwpIHtcbiAgICAgICAgLy8g0JPRgNCw0L3QuNGG0LBcbiAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICAndHlwZSc6ICdGZWF0dXJlJ1xuICAgICAgICB9O1xuICAgICAgICBpZiAoQWxsRGF0YS5Cb3VuZHMuQm91bmQuc3BsaWNlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IEFsbERhdGEuQm91bmRzLkJvdW5kLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFsbERhdGEuQm91bmRzLkJvdW5kW2ldLkJvdW5kYXJpZXMuQm91bmRhcnkuc3BsaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgQWxsRGF0YS5Cb3VuZHMuQm91bmRbaV0uQm91bmRhcmllcy5Cb3VuZGFyeS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFsbERhdGEuQm91bmRzLkJvdW5kW2ldLkJvdW5kYXJpZXMuQm91bmRhcnlba10uRW50aXR5U3BhdGlhbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5Cb3VuZHMuQm91bmRbaV0uQm91bmRhcmllcy5Cb3VuZGFyeVtrXS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChzcE9iaiA9PT0gdW5kZWZpbmVkKSB8fCAoc3BPYmoubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQntCx0YrQtdC60YIg0LHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCe0YHRgtCw0LvRjNC90YvQtSDRgdCy0L7QudGB0YLQstCwLi4uLlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VvSlNPTkJvdW5kcy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCfQndC10YIg0L7Qv9C40YHQsNC90LjRjyDQv9GA0L7RgdGC0YDQsNC90YHRgtCy0LXQvdC90L7QuSDRgdC+0YHRgtCw0LLQu9GP0Y7RidC10Lkg0LPRgNCw0L3QuNGG0YsnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5Cb3VuZHMuQm91bmRbaV0uQm91bmRhcmllcy5Cb3VuZGFyeS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ9Ce0LHRitC10LrRgiDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCe0LHRitC10LrRgiDQsdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmZWF0dXJlLmdlb21ldHJ5ID0gc3BPYmo7XG4gICAgICAgICAgICAgICAgICAgIC8vINCe0YHRgtCw0LvRjNC90YvQtSDRgdCy0L7QudGB0YLQstCwLi4uLlxuXG4gICAgICAgICAgICAgICAgICAgIGdlb0pTT05Cb3VuZHMuZmVhdHVyZXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuQm91bmRzLkJvdW5kLkJvdW5kYXJpZXMuQm91bmRhcnkuRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKChzcE9iaiA9PT0gdW5kZWZpbmVkKSB8fCAoc3BPYmoubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ9Ce0LHRitC10LrRgiAg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQntCx0YrQtdC60YIg0LHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG5cbiAgICAgICAgICAgIGdlb0pTT05Cb3VuZHMuZmVhdHVyZXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0LfQvtC9LiDQndC1INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LzQvdC+0LPQvtC60L7QvdGC0YPRgNC90YvQvNC4XG4gICAgaWYgKEFsbERhdGEuWm9uZXMgIT09IG51bGwpIHtcbiAgICAgICAgLy8g0JfQvtC90LBcbiAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICAndHlwZSc6ICdGZWF0dXJlJ1xuICAgICAgICB9O1xuICAgICAgICBpZiAoQWxsRGF0YS5ab25lcy5ab25lLnNwbGljZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBBbGxEYXRhLlpvbmVzLlpvbmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoQWxsRGF0YS5ab25lcy5ab25lW2ldLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLlpvbmVzLlpvbmVbaV0uRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J7QsdGK0LXQutGCINC60LLQsNGA0YLQsNC70LAg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQntCx0YrQtdC60YIg0LHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuXG4gICAgICAgICAgICAgICAgICAgIGdlb0pTT05ab25lcy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQndC10YIg0L7Qv9C40YHQsNC90LjRjyDQv9GA0L7RgdGC0YDQsNC90YHRgtCy0LXQvdC90L7QuSDRgdC+0YHRgtCw0LLQu9GP0Y7RidC10Lkg0LfQvtC90YsnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoQWxsRGF0YS5ab25lcy5ab25lLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuWm9uZXMuWm9uZS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKChzcE9iaiA9PT0gdW5kZWZpbmVkKSB8fCAoc3BPYmoubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J7QsdGK0LXQutGCINGBINC/0YPRgdGC0L7QuSDQs9C10L7QvNC10YLRgNC40LXQuSEg0J7QsdGK0LXQutGCINCx0YPQtNC10YIg0L/RgNC+0L/Rg9GJ0LXQvS4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuXG4gICAgICAgICAgICAgICAgZ2VvSlNPTlpvbmVzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQndC10YIg0L7Qv9C40YHQsNC90LjRjyDQv9GA0L7RgdGC0YDQsNC90YHRgtCy0LXQvdC90L7QuSDRgdC+0YHRgtCw0LLQu9GP0Y7RidC10Lkg0LfQvtC90YsnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0LLRgdC10YUg0LfQtdC80LXQu9GM0L3Ri9GFINGD0YfQsNGB0YLQutC+0LJcbiAgICBmb3IgKHZhciBlID0gMDsgZSA8IEFsbERhdGEuUGFyY2Vscy5QYXJjZWwubGVuZ3RoOyBlKyspIHtcbiAgICAgICAgdmFyIHNwT2JqID0gbnVsbDtcbiAgICAgICAgLy8g0JfQtdC80LXQu9GM0L3Ri9C5INGD0YfQsNGB0YLQvtC6XG4gICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgJ3R5cGUnOiAnRmVhdHVyZSdcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbZV0uRW50aXR5U3BhdGlhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtlXS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICAvLyDQnNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C5XG4gICAgICAgIGVsc2UgaWYgKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbZV0uQ29udG91cnMpIHtcbiAgICAgICAgICAgIHZhciBDb250b3VycyA9IEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbZV0uQ29udG91cnMuQ29udG91cjtcbiAgICAgICAgICAgIHZhciBtdWx0aVBvbHlnb24gPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgQ29udG91cnMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZXMgPSBDb250b3Vyc1tjXS5FbnRpdHlTcGF0aWFsO1xuICAgICAgICAgICAgICAgIHZhciBwID0gRVMuZ2V0RW50aXR5U3BhdGlhbChlcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHApIHtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlQb2x5Z29uLnB1c2gocCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BPYmogPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJNdWx0aVBvbHlnb25cIixcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogbXVsdGlQb2x5Z29uXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygn0J3QtdGCINC+0L/QuNGB0LDQvdC40Y8g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC10L3QvdC+0Lkg0YHQvtGB0YLQsNCy0LvRj9GO0YnQtdC5Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQldGB0LvQuCDQvdC10YIg0LPQtdC+0LzQtdGC0YDQuNC4LCDRgtC+INC+0LHRitC10LrRgiDQvdC1INC90YPQttC10L1cbiAgICAgICAgaWYgKHNwT2JqKSB7XG4gICAgICAgICAgICBmZWF0dXJlLmdlb21ldHJ5ID0gc3BPYmo7XG4gICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cbiAgICAgICAgICAgIHZhciBwcm9wcyA9IFByb3BzLmdldFByb3BlcnRpZXMoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtlXSwgJ1BhcmNlbCcpO1xuICAgICAgICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzID0gcHJvcHMucHJvcGVydGllcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0YHQvtC30LTQsNC9LiDQmtCdOicgKyBmZWF0dXJlLnByb3BlcnRpZXMuY2FkYXN0cmVOdW1iZXIpO1xuICAgICAgICAgICAgZ2VvSlNPTlBhcmNlbHMuZmVhdHVyZXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDRgdGC0YDQvtC10L3QuNC5LiDQndC1INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LzQvdC+0LPQvtC60L7QvdGC0YPRgNC90YvQvNC4XG4gICAgaWYgKEFsbERhdGEuT2JqZWN0c1JlYWx0eS5PYmplY3RSZWFsdHkgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKEFsbERhdGEuT2JqZWN0c1JlYWx0eS5PYmplY3RSZWFsdHkuc3BsaWNlKSB7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NFUyhFbnRpdHlTcGF0aWFsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChFbnRpdHlTcGF0aWFsKTtcbiAgICAgICAgICAgICAgICBpZiAoc3BPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3BPYmoudHlwZSA9PT0gJ0NpcmNsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlb0pTT05SZWFsdHlDaXJjbGUuZmVhdHVyZXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlb0pTT05SZWFsdHkuZmVhdHVyZXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQntCx0YrQtdC60YIg0LHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBBbGxEYXRhLk9iamVjdHNSZWFsdHkuT2JqZWN0UmVhbHR5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNwT2JqID0gbnVsbDtcbiAgICAgICAgICAgICAgICAvLyDQntCa0KFcbiAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnRmVhdHVyZSdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIC8vINGB0YLRgNC+0LXQvdC40Y9cbiAgICAgICAgICAgICAgICBpZiAoQWxsRGF0YS5PYmplY3RzUmVhbHR5Lk9iamVjdFJlYWx0eVtpXS5CdWlsZGluZykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQWxsRGF0YS5PYmplY3RzUmVhbHR5Lk9iamVjdFJlYWx0eVtpXS5CdWlsZGluZy5FbnRpdHlTcGF0aWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcHMgPSBQcm9wcy5nZXRQcm9wZXJ0aWVzKEFsbERhdGEuT2JqZWN0c1JlYWx0eS5PYmplY3RSZWFsdHlbaV0uQnVpbGRpbmcsICdCdWlsZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzID0gcHJvcHMucHJvcGVydGllcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NFUyhBbGxEYXRhLk9iamVjdHNSZWFsdHkuT2JqZWN0UmVhbHR5W2ldLkJ1aWxkaW5nLkVudGl0eVNwYXRpYWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vINC+0LHRitC10LrRgtGLINC90LXQt9Cw0LLQtdGA0YjRkdC90L3QvtCz0L4g0YHRgtGA0L7QuNGC0LXQu9GM0YHRgtCy0LBcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChBbGxEYXRhLk9iamVjdHNSZWFsdHkuT2JqZWN0UmVhbHR5W2ldLlVuY29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChBbGxEYXRhLk9iamVjdHNSZWFsdHkuT2JqZWN0UmVhbHR5W2ldLlVuY29tcGxldGVkLkVudGl0eVNwYXRpYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wcyA9IFByb3BzLmdldFByb3BlcnRpZXMoQWxsRGF0YS5PYmplY3RzUmVhbHR5Lk9iamVjdFJlYWx0eVtpXS5VbmNvbXBsZXRlZCwgJ1VuY29tcGxldGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlLnByb3BlcnRpZXMgPSBwcm9wcy5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0VTKEFsbERhdGEuT2JqZWN0c1JlYWx0eS5PYmplY3RSZWFsdHlbaV0uVW5jb21wbGV0ZWQuRW50aXR5U3BhdGlhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8g0YHQvtC+0YDRg9C20LXQvdC40Y9cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChBbGxEYXRhLk9iamVjdHNSZWFsdHkuT2JqZWN0UmVhbHR5W2ldLkNvbnN0cnVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQWxsRGF0YS5PYmplY3RzUmVhbHR5Lk9iamVjdFJlYWx0eVtpXS5Db25zdHJ1Y3Rpb24uRW50aXR5U3BhdGlhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BzID0gUHJvcHMuZ2V0UHJvcGVydGllcyhBbGxEYXRhLk9iamVjdHNSZWFsdHkuT2JqZWN0UmVhbHR5W2ldLkNvbnN0cnVjdGlvbiwgJ0NvbnN0cnVjdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5wcm9wZXJ0aWVzID0gcHJvcHMucHJvcGVydGllcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NFUyhBbGxEYXRhLk9iamVjdHNSZWFsdHkuT2JqZWN0UmVhbHR5W2ldLkNvbnN0cnVjdGlvbi5FbnRpdHlTcGF0aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0L/Rg9C90LrRgtC+0LIg0J7QnNChXG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2VvSlNPTlF1YXJ0YWw6IGdlb0pTT05RdWFydGFsLFxuICAgICAgICBnZW9KU09OQm91bmRzOiBnZW9KU09OQm91bmRzLFxuICAgICAgICBnZW9KU09OWm9uZXM6IGdlb0pTT05ab25lcyxcbiAgICAgICAgZ2VvSlNPTlBhcmNlbHM6IGdlb0pTT05QYXJjZWxzLFxuICAgICAgICBnZW9KU09OUmVhbHR5OiBnZW9KU09OUmVhbHR5LFxuICAgICAgICBnZW9KU09OUmVhbHR5Q2lyY2xlOiBnZW9KU09OUmVhbHR5Q2lyY2xlXG4gICAgfTtcbn07XG4iLCIvKipcbiAqINCc0L7QtNGD0LvRjCDQvtCx0YDQsNCx0L7RgtC60Lgg0LPQtdC+0LzQtdGC0YDQuNC4INGC0LjQv9CwINC/0L7Qu9C40LPQvtC9LlxuICog0J7QtNC40L0g0LLQvdC10YjQvdC40Lkg0LrQvtC90YLRg9GAINC4IDAg0LjQu9C4INCx0L7Qu9C10LUg0LLQvdGD0YLRgNC10L3QvdC40YUg0LrQvtC90YLRg9GA0L7Qsi1cItC00YvRgNC+0LpcIlxuICogXG4gKiBHZW9KU09OIGdlb21ldHJ5INGC0LjQv9CwIHRFbnRpdHlTcGF0aWFsTGFuZE91dFxuICovXG5cbi8vXCJnZW9tZXRyeVwiOiB7XG4vLyAgICBcInR5cGVcIjogXCJQb2x5Z29uXCIsXG4vLyAgICBcImNvb3JkaW5hdGVzXCI6IFtcbi8vICAgICAgWyBbMTAwLjAsIDAuMF0sIFsxMDEuMCwgMC4wXSwgWzEwMS4wLCAxLjBdLFxuLy8gICAgICAgIFsxMDAuMCwgMS4wXSwgWzEwMC4wLCAwLjBdIF1cbi8vICAgICAgXVxuLy8gIH1cblxuXG5tb2R1bGUuZXhwb3J0cy5nZXRFbnRpdHlTcGF0aWFsID0gZnVuY3Rpb24gKEVudGl0eVNwYXRpYWxPYmosIHBhcnRPZk11bHR1KSB7XG5cbi8vXHR0aGlzLmdlb21ldHJ5ID0ge1xuLy8gICAgICAgIHR5cGU6ICcnLFxuLy9cdFx0Y29vcmRpbmF0ZXM6IFtdXG4vL1x0fTtcblxuICAgIC8vdmFyIEVudGl0eVNwYXRpYWwgPSBbXTtcbiAgICB2YXIgQXJlYSA9IDAuMDtcblxuICAgIC8vINCS0YvRh9C40YHQu9C10L3QuNC1INC/0LvQvtGJ0LDQtNC4INC30LDQvNC60L3Rg9GC0L7Qs9C+INC60L7QvdGC0YPRgNCwXG4gICAgZnVuY3Rpb24gcG9seWdvbkFyZWEoWHMsIFlzLCBudW1Qb2ludHMpIHtcbiAgICAgICAgdmFyIGFyZWEgPSAwO1xuICAgICAgICB2YXIgaiA9IG51bVBvaW50cyAtIDE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtUG9pbnRzOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFyZWEgPSBhcmVhICsgKChYc1tqXSkgKyAoWHNbaV0pKSAqICgoWXNbal0pIC0gKFlzW2ldKSk7XG4gICAgICAgICAgICBqID0gaTsgIC8vaiBpcyBwcmV2aW91cyB2ZXJ0ZXggdG8gaVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhcmVhIC8gMik7XG4gICAgfVxuXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQvtC00L3QvtCz0L4g0LfQsNC80LrQvdGD0YLQvtCz0L4g0LrQvtC90YLRg9GA0LBcbiAgICBmdW5jdGlvbiBjcmVhdGVDb250b3VyKFNwYXRpYWxFbGVtZW50KSB7XG4gICAgICAgIHZhciB4cyA9IFtdO1xuICAgICAgICB2YXIgeXMgPSBbXTtcbiAgICAgICAgdmFyIGNvbnRvdXIgPSBbXTtcbiAgICAgICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQvdCwINC+0LrRgNGD0LbQvdC+0YHRgtGMXG4gICAgICAgIGlmICgocGFydE9mTXVsdHUgPT09IHVuZGVmaW5lZCkgJiZcbiAgICAgICAgICAgICAgICAoU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdC5SICE9PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2lyY2xlJyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdSJzogU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdC5SLFxuICAgICAgICAgICAgICAgICdYJzogU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdC5PcmRpbmF0ZS5ZLFxuICAgICAgICAgICAgICAgICdZJzogU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdC5PcmRpbmF0ZS5YXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBTcGF0aWFsRWxlbWVudC5TcGVsZW1lbnRVbml0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvaW50ID0gU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdFtqXTtcbiAgICAgICAgICAgICAgICB2YXIgeHkgPSBbXTtcbiAgICAgICAgICAgICAgICB4cy5wdXNoKHBhcnNlRmxvYXQocG9pbnQuT3JkaW5hdGUuWSkpO1xuICAgICAgICAgICAgICAgIHlzLnB1c2gocGFyc2VGbG9hdChwb2ludC5PcmRpbmF0ZS5YKSk7XG4gICAgICAgICAgICAgICAgeHkucHVzaChwYXJzZUZsb2F0KHBvaW50Lk9yZGluYXRlLlkpKTtcbiAgICAgICAgICAgICAgICB4eS5wdXNoKHBhcnNlRmxvYXQocG9pbnQuT3JkaW5hdGUuWCkpO1xuICAgICAgICAgICAgICAgIGNvbnRvdXIucHVzaCh4eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBBcmVhID0gcG9seWdvbkFyZWEoeHMsIHlzLCB4cy5sZW5ndGgpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhBcmVhKTtcbiAgICAgICAgICAgIHJldHVybiBjb250b3VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKChFbnRpdHlTcGF0aWFsT2JqICE9PSB1bmRlZmluZWQpICYmIChFbnRpdHlTcGF0aWFsT2JqICE9PSBudWxsKSkge1xuICAgICAgICB2YXIgY250cnMgPSBbXTtcbiAgICAgICAgLy8g0KPRgtC40L3QvdCw0Y8g0YLQuNC/0LjQt9Cw0YbQuNGPINC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LDQu9C40YfQuNGPINC00YvRgNC+0Log0LIg0L/QvtC70LjQs9C+0L3QtVxuICAgICAgICAvLyDQkiDQoNC+0YHRgNC10LXRgdGC0YDQtSDQvdC1INGB0LvQtdC00Y/RgiDQt9CwINC/0L7RgNGP0LTQutC+0Lwg0LrQvtC90YLRg9GA0L7QsiDQv9C+0LvQuNCz0L7QvdCwXG4gICAgICAgIGlmIChFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50LnNwbGljZSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygn0J/QvtC70LjQs9C+0L0g0YEg0LTRi9GA0LrQsNC80LgnKTtcblxuICAgICAgICAgICAgdmFyIE1heEFyZWE7XG4gICAgICAgICAgICB2YXIgTWF4QXJlYUlkeCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29udG91ciA9IEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnRba107XG4gICAgICAgICAgICAgICAgdmFyIGNudCA9IGNyZWF0ZUNvbnRvdXIoY29udG91cik7XG4gICAgICAgICAgICAgICAgaWYgKGNudClcbiAgICAgICAgICAgICAgICAgICAgY250cnMucHVzaChjbnQpO1xuICAgICAgICAgICAgICAgIGlmIChBcmVhID4gTWF4QXJlYSkge1xuICAgICAgICAgICAgICAgICAgICBNYXhBcmVhID0gQXJlYTtcbiAgICAgICAgICAgICAgICAgICAgTWF4QXJlYUlkeCA9IGs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0J/QtdGA0LXQvNC10YnQsNC10Lwg0L7RgdC90L7QstC90L7QuSAo0L3QsNGA0YPQttC90LjQuSkg0LrQvtC90YLRg9GAINCyINC90LDRh9Cw0LvQviDQvNCw0YHRgdC40LLQsFxuICAgICAgICAgICAgaWYgKE1heEFyZWFJZHggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1haW5DbnQgPSBjbnRycy5zcGxpY2UoTWF4QXJlYUlkeCwgMSk7XG4gICAgICAgICAgICAgICAgY250cnMuc3BsaWNlKDAsIDAsIG1haW5DbnQpO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ9Cd0L7QvNC10YAg0L7RgdC90L7QstC90L7Qs9C+INC60L7QvdGC0YPRgNCwINCx0YvQuyAnICsgTWF4QXJlYUlkeCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGN0YLQviDQtNC70Y8g0LzQvdC+0LPQvtC60L7QvdGC0YPRgNC90L7Qs9C+INC+0LHRitC10LrRgtCwLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LXQvCDQvNCw0YHRgdC40LIg0LrQvtC90YLRg9GA0L7QslxuICAgICAgICAgICAgaWYgKHBhcnRPZk11bHR1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNudHJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQv9GA0L7RgdGC0L7Qs9C+INC+0LHRitC10LrRgtCwLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LXQvCDQvtCx0YrQtdC60YIgZ2VvbWV0cnlcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUG9seWdvblwiLFxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlczogY250cnNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY29udG91ciA9IEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgcG9seWdvbiA9IGNyZWF0ZUNvbnRvdXIoY29udG91cik7XG4gICAgICAgICAgICBjbnRycy5wdXNoKHBvbHlnb24pO1xuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3QvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC80LDRgdGB0LjQsiDQutC+0L3RgtGD0YDQvtCyXG4gICAgICAgICAgICBpZiAocGFydE9mTXVsdHUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY250cnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQtNC70Y8g0J7QmtChLiDQotC+0LvRjNC60L4g0L7QtNC40L0g0LrQvtC90YLRg9GAXG4gICAgICAgICAgICBlbHNlIGlmIChwYXJ0T2ZNdWx0dSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNudHJzWzBdLlIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkNpcmNsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbY250cnNbMF0uWCwgY250cnNbMF0uWV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhZGl1c1wiOiBjbnRyc1swXS5SLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJhZGl1c191bml0c1wiOiBcIm1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGN0YLQviDQtNC70Y8g0L/RgNC+0YHRgtC+0LPQviDQvtCx0YrQtdC60YLQsCwg0YLQviDQstC+0LfQstGA0LDRidC10Lwg0L7QsdGK0LXQutGCIGdlb21ldHJ5XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBvbHlnb25cIixcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IGNudHJzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iXX0=
