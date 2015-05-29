(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                
                var vectorSource = new ol.source.Vector({
                    //projection: 'EPSG:3857'
                });
                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
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


},{"./cadXML2GeoJSON.js":2}],2:[function(require,module,exports){
var ES = require('./spatial/EntitySpatial.js');

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
            console.log('Объект квартала с пустой геометрией! Будет пропущен.');
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
                                console.log('Объект границы с пустой геометрией! Будет пропущен.');
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
                        console.log('Объект границы с пустой геометрией! Будет пропущен.');
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
                console.log('Объект границы с пустой геометрией! Будет пропущен.');
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
    if (AllData.Zones != null) {
        if (AllData.Zones.Zone.splice) {
            for(var i=0; i<AllData.Zones.Zone.length; i++) {
                if (AllData.Zones.Zone[i].EntitySpatial !== null) {
                    var spObj = ES.getEntitySpatial(AllData.Zones.Zone[i].EntitySpatial, false);
                    if ((spObj === undefined) || (spObj.length === 0)) { 
                        console.log('Объект зоны с пустой геометрией! Будет пропущен.');
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
                    console.log('Объект зоны с пустой геометрией! Будет пропущен.');
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
                console.log('Объект участка с пустой геометрией! Будет пропущен.');
                continue;
            }
            // Земельный участок
            var feature = {
                properties: {},
                geometry: {}
            };
            feature.geometry = spObj;
            // Остальные свойства....
            
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

},{"./spatial/EntitySpatial.js":3}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL3NwYXRpYWwvRW50aXR5U3BhdGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuICogVG8gY2hhbmdlIHRoaXMgbGljZW5zZSBoZWFkZXIsIGNob29zZSBMaWNlbnNlIEhlYWRlcnMgaW4gUHJvamVjdCBQcm9wZXJ0aWVzLlxuICogVG8gY2hhbmdlIHRoaXMgdGVtcGxhdGUgZmlsZSwgY2hvb3NlIFRvb2xzIHwgVGVtcGxhdGVzXG4gKiBhbmQgb3BlbiB0aGUgdGVtcGxhdGUgaW4gdGhlIGVkaXRvci5cbiAqL1xuXG52YXIgQ29udmVydGVyID0gcmVxdWlyZSgnLi9jYWRYTUwyR2VvSlNPTi5qcycpO1xuXG5TdGFydFBhcnNlKCk7XG5cbmZ1bmN0aW9uIFN0YXJ0UGFyc2UoKSB7XG4gICAgLy8gaHR0cHM6Ly9iaXRidWNrZXQub3JnL3N1cmVucmFvL3htbDJqc29uXG4gICAgLy8gaHR0cDovL3d3dy5jaHJvbWUtYWxsb3ctZmlsZS1hY2Nlc3MtZnJvbS1maWxlLmNvbS9cbiAgICB2YXIgcGFyc2VkRGF0YTtcbiAgICAkLmdldCgnLi90ZXN0ZGF0YS9kb2M4NTAwNzE3LnhtbCcsIGZ1bmN0aW9uICh4bWwpIHtcbiAgICAgICAgLy92YXIganNvbiA9ICQueG1sMmpzb24oeG1sKS5DYWRhc3RyYWxCbG9ja3M7XG4gICAgICAgIC8vICQoXCIjZGF0YVwiKS5odG1sKCc8Y29kZT4nK0pTT04uc3RyaW5naWZ5KGpzb24pKyc8L2NvZGU+Jyk7XG4gICAgICAgIC8vY29uc29sZS5sb2coQ29udmVydGVyLkdlb0pTT04pO1xuICAgICAgICBwYXJzZWREYXRhID0gQ29udmVydGVyLkdlb0pTT04oeG1sKTtcbiAgICB9KS5zdWNjZXNzKFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9cbiAgICAgICAgICAgICAgICB2YXIgZmlsbCA9IG5ldyBvbC5zdHlsZS5GaWxsKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjYTNiZGM4J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBzdHJva2UgPSBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMzEzMDMwJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IG5ldyBvbC5zdHlsZS5UZXh0KHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyDQn9C+0LTQv9C40YHQsNGC0Ywg0LrQsNC00LDRgdGC0YDQvtCy0YvQtSDQvdC+0LzQtdGA0LBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGVzID0gW1xuICAgICAgICAgICAgICAgICAgICBuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9maWxsOiBmaWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBzdHJva2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciB2ZWN0b3JTb3VyY2UgPSBuZXcgb2wuc291cmNlLlZlY3Rvcih7XG4gICAgICAgICAgICAgICAgICAgIC8vcHJvamVjdGlvbjogJ0VQU0c6Mzg1NydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgdmVjdG9yTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiB2ZWN0b3JTb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiBzdHlsZXMsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdCA9IG5ldyBvbC5mb3JtYXQuR2VvSlNPTigpO1xuICAgICAgICAgICAgICAgIGZvcih2YXIga2V5IGluIHBhcnNlZERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Ch0L7Qt9C00LDQvdC+INC+0LHRitC10LrRgtC+0LIgJyArIGtleSArICc6ICcgKyBwYXJzZWREYXRhW2tleV0uZmVhdHVyZXMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcnNlZERhdGFba2V5XS5mZWF0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWFkR2VvbWV0cnkocGFyc2VkRGF0YVtrZXldLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeU9iai8vLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVjdG9yTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBtYXAgPSBuZXcgb2wuTWFwKHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnbWFwJyxcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBbXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBvbC5sYXllci5UaWxlKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbmV3IG9sLnNvdXJjZS5PU00oKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlY3RvckxheWVyXSxcbiAgICAgICAgICAgICAgICAgICAgdmlldzogbmV3IG9sLlZpZXcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyOiBbMCwgMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB6b29tOiA3XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbWFwLmdldFZpZXcoKS5maXRFeHRlbnQodmVjdG9yTGF5ZXIuZ2V0U291cmNlKCkuZ2V0RXh0ZW50KCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuZ2V0U2l6ZSgpKTtcbiAgICAgICAgICAgIH0pO1xufVxuXG4iLCJ2YXIgRVMgPSByZXF1aXJlKCcuL3NwYXRpYWwvRW50aXR5U3BhdGlhbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cy5HZW9KU09OID0gZnVuY3Rpb24gKHhtbERhdGEpIHtcbiAgICBcbiAgICB2YXIgZ2VvSlNPTlF1YXJ0YWwgPSB7XG4gICAgICAgIHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgZmVhdHVyZXMgOiBbXVxuICAgIH07XG4gICAgdmFyIGdlb0pTT05Cb3VuZHMgPSB7XG4gICAgICAgIHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgZmVhdHVyZXMgOiBbXVxuICAgIH07XG4gICAgdmFyIGdlb0pTT05ab25lcyA9IHtcbiAgICAgICAgdHlwZTogXCJGZWF0dXJlQ29sbGVjdGlvblwiLFxuICAgICAgICBmZWF0dXJlcyA6IFtdXG4gICAgfTtcbiAgICB2YXIgZ2VvSlNPTlBhcmNlbHMgPSB7XG4gICAgICAgIHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgZmVhdHVyZXMgOiBbXVxuICAgIH07XG4gICAgdmFyIGdlb0pTT05SZWFsdHkgPSB7XG4gICAgICAgIHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgZmVhdHVyZXMgOiBbXVxuICAgIH07XG5cbiAgICB2YXIgQWxsRGF0YSA9ICQueG1sMmpzb24oeG1sRGF0YSkuQ2FkYXN0cmFsQmxvY2tzLkNhZGFzdHJhbEJsb2NrO1xuICAgIC8vY29uc29sZS5sb2coQWxsRGF0YSk7XG4gICAgICAgXG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINC60LLQsNGA0YLQsNC70LAuINCd0LUg0LzQvtC20LXRgiDQsdGL0YLRjCDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C8ICAgICAgICAgICBcbiAgICBpZiAoQWxsRGF0YS5TcGF0aWFsRGF0YSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgc3BPYmogPSBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuU3BhdGlhbERhdGEuRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7IFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ9Ce0LHRitC10LrRgiDQutCy0LDRgNGC0LDQu9CwINGBINC/0YPRgdGC0L7QuSDQs9C10L7QvNC10YLRgNC40LXQuSEg0JHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICB9XG4gICAgICAgIC8vINCa0LLQsNGA0YLQsNC7XG4gICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgfTtcbiAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICBnZW9KU09OUXVhcnRhbC5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuSDQutCy0LDRgNGC0LDQu9CwJyk7XG4gICAgfVxuXG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINCz0YDQsNC90LjRhi4g0J3QtSDQvNC+0LPRg9GCINCx0YvRgtGMINC80L3QvtCz0L7QutC+0L3RgtGD0YDQvdGL0LzQuFxuICAgIGlmIChBbGxEYXRhLkJvdW5kcyAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoQWxsRGF0YS5Cb3VuZHMuQm91bmQuc3BsaWNlKSB7XG4gICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxBbGxEYXRhLkJvdW5kcy5Cb3VuZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5LnNwbGljZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrPTA7IGs8QWxsRGF0YS5Cb3VuZHMuQm91bmRbaV0uQm91bmRhcmllcy5Cb3VuZGFyeS5sZW5ndGg7IGsrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQWxsRGF0YS5Cb3VuZHMuQm91bmRbaV0uQm91bmRhcmllcy5Cb3VuZGFyeVtrXS5FbnRpdHlTcGF0aWFsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5W2tdLkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J7QsdGK0LXQutGCINCz0YDQsNC90LjRhtGLINGBINC/0YPRgdGC0L7QuSDQs9C10L7QvNC10YLRgNC40LXQuSEg0JHRg9C00LXRgiDQv9GA0L7Qv9GD0YnQtdC9LicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0JPRgNCw0L3QuNGG0LBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5OiB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCe0YHRgtCw0LvRjNC90YvQtSDRgdCy0L7QudGB0YLQstCwLi4uLlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VvSlNPTkJvdW5kcy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuSDQs9GA0LDQvdC40YbRiycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLkJvdW5kcy5Cb3VuZFtpXS5Cb3VuZGFyaWVzLkJvdW5kYXJ5LkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzcE9iaiA9PT0gdW5kZWZpbmVkKSB8fCAoc3BPYmoubGVuZ3RoID09PSAwKSkgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LPRgNCw0L3QuNGG0Ysg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQkdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyDQk9GA0LDQvdC40YbQsFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IHt9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG5cbiAgICAgICAgICAgICAgICAgICAgZ2VvSlNPTkJvdW5kcy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5Cb3VuZHMuQm91bmQuQm91bmRhcmllcy5Cb3VuZGFyeS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7IFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LPRgNCw0L3QuNGG0Ysg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQkdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQk9GA0LDQvdC40YbQsFxuICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgICAgICAgICAgZ2VvbWV0cnk6IHt9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG5cbiAgICAgICAgICAgIGdlb0pTT05Cb3VuZHMuZmVhdHVyZXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0LfQvtC9LiDQndC1INC80L7Qs9GD0YIg0LHRi9GC0Ywg0LzQvdC+0LPQvtC60L7QvdGC0YPRgNC90YvQvNC4XG4gICAgaWYgKEFsbERhdGEuWm9uZXMgIT0gbnVsbCkge1xuICAgICAgICBpZiAoQWxsRGF0YS5ab25lcy5ab25lLnNwbGljZSkge1xuICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8QWxsRGF0YS5ab25lcy5ab25lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFsbERhdGEuWm9uZXMuWm9uZVtpXS5FbnRpdHlTcGF0aWFsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5ab25lcy5ab25lW2ldLkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzcE9iaiA9PT0gdW5kZWZpbmVkKSB8fCAoc3BPYmoubGVuZ3RoID09PSAwKSkgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LfQvtC90Ysg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQkdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyDQl9C+0L3QsFxuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnk6IHt9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG5cbiAgICAgICAgICAgICAgICAgICAgZ2VvSlNPTlpvbmVzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QtdGCINC+0L/QuNGB0LDQvdC40Y8g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC10L3QvdC+0Lkg0YHQvtGB0YLQsNCy0LvRj9GO0YnQtdC5INC30L7QvdGLJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKEFsbERhdGEuWm9uZXMuWm9uZS5FbnRpdHlTcGF0aWFsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLlpvbmVzLlpvbmUuRW50aXR5U3BhdGlhbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHsgXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0LfQvtC90Ysg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQkdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vINCX0L7QvdCwXG4gICAgICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeToge31cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgICAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YHQstC+0LnRgdGC0LLQsC4uLi5cblxuICAgICAgICAgICAgICAgIGdlb0pTT05ab25lcy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuSDQt9C+0L3RiycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQstGB0LXRhSDQt9C10LzQtdC70YzQvdGL0YUg0YPRh9Cw0YLQutC+0LIg0Lgg0LjRhSDRh9Cw0YHRgtC10LlcbiAgICBmb3IodmFyIGk9MDsgaTxBbGxEYXRhLlBhcmNlbHMuUGFyY2VsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7IFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0YPRh9Cw0YHRgtC60LAg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQkdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQl9C10LzQtdC70YzQvdGL0Lkg0YPRh9Cw0YHRgtC+0LpcbiAgICAgICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgIGdlb21ldHJ5OiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgIC8vINCe0YHRgtCw0LvRjNC90YvQtSDRgdCy0L7QudGB0YLQstCwLi4uLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBnZW9KU09OUGFyY2Vscy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICB9XG4gICAgICAgIC8vINCc0L3QvtCz0L7QutC+0L3RgtGD0YDQvdGL0LlcbiAgICAgICAgZWxzZSBpZiAoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXS5Db250b3Vycykge1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QtdGCINC+0L/QuNGB0LDQvdC40Y8g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC10L3QvdC+0Lkg0YHQvtGB0YLQsNCy0LvRj9GO0YnQtdC5Jyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgIFxuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQv9GD0L3QutGC0L7QsiDQntCc0KFcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBnZW9KU09OUXVhcnRhbDogZ2VvSlNPTlF1YXJ0YWwsXG4gICAgICAgIGdlb0pTT05Cb3VuZHM6IGdlb0pTT05Cb3VuZHMsXG4gICAgICAgIGdlb0pTT05ab25lczogZ2VvSlNPTlpvbmVzLFxuICAgICAgICBnZW9KU09OUGFyY2VsczogZ2VvSlNPTlBhcmNlbHMsXG4gICAgICAgIGdlb0pTT05SZWFsdHk6IGdlb0pTT05SZWFsdHlcbiAgICB9O1xufTtcbiIsIi8qKlxuICog0JzQvtC00YPQu9GMINC+0LHRgNCw0LHQvtGC0LrQuCDQs9C10L7QvNC10YLRgNC40Lgg0YLQuNC/0LAg0L/QvtC70LjQs9C+0L0uXG4gKiDQntC00LjQvSDQstC90LXRiNC90LjQuSDQutC+0L3RgtGD0YAg0LggMCDQuNC70Lgg0LHQvtC70LXQtSDQstC90YPRgtGA0LXQvdC90LjRhSDQutC+0L3RgtGD0YDQvtCyLVwi0LTRi9GA0L7QulwiXG4gKiBcbiAqIEdlb0pTT04gZ2VvbWV0cnkg0YLQuNC/0LAgdEVudGl0eVNwYXRpYWxMYW5kT3V0XG4gKi9cblxuLy9cImdlb21ldHJ5XCI6IHtcbi8vICAgIFwidHlwZVwiOiBcIlBvbHlnb25cIixcbi8vICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuLy8gICAgICBbIFsxMDAuMCwgMC4wXSwgWzEwMS4wLCAwLjBdLCBbMTAxLjAsIDEuMF0sXG4vLyAgICAgICAgWzEwMC4wLCAxLjBdLCBbMTAwLjAsIDAuMF0gXVxuLy8gICAgICBdXG4vLyAgfVxuXG5cbm1vZHVsZS5leHBvcnRzLmdldEVudGl0eVNwYXRpYWwgPSBmdW5jdGlvbihFbnRpdHlTcGF0aWFsT2JqLCBwYXJ0T2ZNdWx0dSkge1xuXHRcbi8vXHR0aGlzLmdlb21ldHJ5ID0ge1xuLy8gICAgICAgIHR5cGU6ICcnLFxuLy9cdFx0Y29vcmRpbmF0ZXM6IFtdXG4vL1x0fTtcbiAgICBcbiAgICAvL3ZhciBFbnRpdHlTcGF0aWFsID0gW107XG4gICAgdmFyIEFyZWEgPSAwLjA7XG4gICAgXG4gICAgLy8g0JLRi9GH0LjRgdC70LXQvdC40LUg0L/Qu9C+0YnQsNC00Lgg0LfQsNC80LrQvdGD0YLQvtCz0L4g0LrQvtC90YLRg9GA0LBcbiAgICBmdW5jdGlvbiBwb2x5Z29uQXJlYShYcywgWXMsIG51bVBvaW50cykgeyBcbiAgICAgICAgdmFyIGFyZWEgPSAwOyAgIFxuICAgICAgICB2YXIgaiA9IG51bVBvaW50cy0xO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8bnVtUG9pbnRzOyBpKyspXG4gICAgICAgIHsgYXJlYSA9IGFyZWEgKyAgKChYc1tqXSkrKFhzW2ldKSkgKiAoKFlzW2pdKS0oWXNbaV0pKTsgXG4gICAgICAgICAgICBqID0gaTsgIC8vaiBpcyBwcmV2aW91cyB2ZXJ0ZXggdG8gaVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhcmVhLzIpO1xuICAgIH1cbiAgICBcbiAgICAvLyDQodC+0LfQtNCw0L3QuNC1INC+0LTQvdC+0LPQviDQt9Cw0LzQutC90YPRgtC+0LPQviDQutC+0L3RgtGD0YDQsFxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbnRvdXIoU3BhdGlhbEVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHhzID0gW107XG4gICAgICAgIHZhciB5cyA9IFtdO1xuICAgICAgICB2YXIgY29udG91ciA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIHBvaW50ID0gU3BhdGlhbEVsZW1lbnQuU3BlbGVtZW50VW5pdFtqXTtcbiAgICAgICAgICAgIHZhciB4eSA9IFtdO1xuICAgICAgICAgICAgeHMucHVzaChwYXJzZUZsb2F0KHBvaW50Lk9yZGluYXRlLlkpKTtcbiAgICAgICAgICAgIHlzLnB1c2gocGFyc2VGbG9hdChwb2ludC5PcmRpbmF0ZS5YKSk7XG4gICAgICAgICAgICB4eS5wdXNoKHBhcnNlRmxvYXQocG9pbnQuT3JkaW5hdGUuWSkpO1xuICAgICAgICAgICAgeHkucHVzaChwYXJzZUZsb2F0KHBvaW50Lk9yZGluYXRlLlgpKTtcbiAgICAgICAgICAgIGNvbnRvdXIucHVzaCh4eSk7XG4gICAgICAgIH1cbiAgICAgICAgQXJlYSA9IHBvbHlnb25BcmVhKHhzLCB5cywgeHMubGVuZ3RoKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhBcmVhKTtcbiAgICAgICAgcmV0dXJuIGNvbnRvdXI7XG4gICAgfVxuICAgIFxuXHRpZiAoKEVudGl0eVNwYXRpYWxPYmogIT09IHVuZGVmaW5lZCkgJiYgKEVudGl0eVNwYXRpYWxPYmogIT09IG51bGwpKSB7XG4gICAgICAgIHZhciBjbnRycyA9IFtdO1xuICAgICAgICAvLyDQo9GC0LjQvdC90LDRjyDRgtC40L/QuNC30LDRhtC40Y8g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsNC70LjRh9C40Y8g0LTRi9GA0L7QuiDQsiDQv9C+0LvQuNCz0L7QvdC1XG4gICAgICAgIC8vINCSINCg0L7RgdGA0LXQtdGB0YLRgNC1INC90LUg0YHQu9C10LTRj9GCINC30LAg0L/QvtGA0Y/QtNC60L7QvCDQutC+0L3RgtGD0YDQvtCyINC/0L7Qu9C40LPQvtC90LBcbiAgICAgICAgaWYgKEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQuc3BsaWNlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCfQn9C+0LvQuNCz0L7QvSDRgSDQtNGL0YDQutCw0LzQuCcpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgTWF4QXJlYTtcbiAgICAgICAgICAgIHZhciBNYXhBcmVhSWR4ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb250b3VyID0gRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudFtrXTtcbiAgICAgICAgICAgICAgICB2YXIgY250ID0gY3JlYXRlQ29udG91cihjb250b3VyKTtcbiAgICAgICAgICAgICAgICBjbnRycy5wdXNoKGNudCk7XG4gICAgICAgICAgICAgICAgaWYoQXJlYSA+IE1heEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgTWF4QXJlYSA9IEFyZWE7XG4gICAgICAgICAgICAgICAgICAgIE1heEFyZWFJZHggPSBrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCf0LXRgNC10LzQtdGJ0LDQtdC8INC+0YHQvdC+0LLQvdC+0LkgKNC90LDRgNGD0LbQvdC40LkpINC60L7QvdGC0YPRgCDQsiDQvdCw0YfQsNC70L4g0LzQsNGB0YHQuNCy0LBcbiAgICAgICAgICAgIGlmIChNYXhBcmVhSWR4ID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBtYWluQ250ID0gY250cnMuc3BsaWNlKE1heEFyZWFJZHgsIDEpO1xuICAgICAgICAgICAgICAgIGNudHJzLnNwbGljZSgwLCAwLCBtYWluQ250KTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCfQndC+0LzQtdGAINC+0YHQvdC+0LLQvdC+0LPQviDQutC+0L3RgtGD0YDQsCDQsdGL0LsgJyArIE1heEFyZWFJZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3QvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC80LDRgdGB0LjQsiDQutC+0L3RgtGD0YDQvtCyXG4gICAgICAgICAgICBpZiAocGFydE9mTXVsdHUpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNudHJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRjdGC0L4g0LTQu9GPINC/0YDQvtGB0YLQvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC+0LHRitC10LrRgiBnZW9tZXRyeVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjbnRyc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY29udG91ciA9IEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgcG9seWdvbiA9IGNyZWF0ZUNvbnRvdXIoY29udG91cik7XG4gICAgICAgICAgICBjbnRycy5wdXNoKHBvbHlnb24pO1xuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3QvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC80LDRgdGB0LjQsiDQutC+0L3RgtGD0YDQvtCyXG4gICAgICAgICAgICBpZiAocGFydE9mTXVsdHUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY250cnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRjdGC0L4g0LTQu9GPINC/0YDQvtGB0YLQvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC+0LHRitC10LrRgiBnZW9tZXRyeVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjbnRyc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59OyJdfQ==
