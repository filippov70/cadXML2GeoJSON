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
        //console.log();

    }).success(
            function () {

                var fill = new ol.style.Fill({
                    color: 'rgba(255,255,255,0.4)'
                });
                var stroke = new ol.style.Stroke({
                    color: '#3399CC',
                    width: 1.25
                });
                var styles = [
                    new ol.style.Style({
                        fill: fill,
                        stroke: stroke
                    })
                ];
                var vectorLayer = new ol.layer.Vector({
                    source: new ol.source.GeoJSON({
                        projection: 'EPSG:3857'
                        
                    })
                });

                var format = new ol.format.GeoJSON();
                for (i = 0; i < parsedData.features.length; i++) {
                    console.log(parsedData.features[i].geometry);
                    var geometryObj = format
                            .readGeometry(parsedData.features[i].geometry);
                    var feature = new ol.Feature({
                        geometry: geometryObj//,
                                //propA : parsedData.features[i].properties.cadnumber
                    });
                    vectorLayer.getSource().addFeature(feature);
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
//	var Parcels;
//	var Quartal;
//	var Zones;
//	var Bounds;
    
    var geoJSON = {
        type: "FeatureCollection",
        features : []
    };
    
    
    
    var AllData = $.xml2json(xmlData).CadastralBlocks.CadastralBlock;
    //console.log(AllData.Parcels);
    // Обработка всех земельных учатков и их частей
    for(var i=0; i<AllData.Parcels.Parcel.length; i++) {
                
        if (AllData.Parcels.Parcel[i].EntitySpatial !== null) {
            var spObj = ES.getEntitySpatial(AllData.Parcels.Parcel[i].EntitySpatial, false);
            if ((spObj === undefined) || (spObj.length === 0)) { 
                console.log('Объект с пустой геометрией! Будет пропущен.');
                continue;
            }
            // Земельный участок
            var feature = {
                properties: {},
                geometry: {}
            };
            feature.geometry = spObj;
            // Остальные свойства....
            
            geoJSON.features.push(feature);
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
},{"./spatial/EntitySpatial.js":3}],3:[function(require,module,exports){
/**
 * Модуль обработки геометрии типа полигон.
 * Один внешний контур и 0 или более внутренних контуров-"дырок"
 * 
 * GeoJSON geometry
 * Зпросто может быть что внешний контур может быть не первым в XML!!!
 * 
 * 
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
            console.log('Полигон с дырками');
            
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
                console.log('Номер основного контура был ' + MaxAreaIdx);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL3NwYXRpYWwvRW50aXR5U3BhdGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogXG4gKiBUbyBjaGFuZ2UgdGhpcyBsaWNlbnNlIGhlYWRlciwgY2hvb3NlIExpY2Vuc2UgSGVhZGVycyBpbiBQcm9qZWN0IFByb3BlcnRpZXMuXG4gKiBUbyBjaGFuZ2UgdGhpcyB0ZW1wbGF0ZSBmaWxlLCBjaG9vc2UgVG9vbHMgfCBUZW1wbGF0ZXNcbiAqIGFuZCBvcGVuIHRoZSB0ZW1wbGF0ZSBpbiB0aGUgZWRpdG9yLlxuICovXG5cbnZhciBDb252ZXJ0ZXIgPSByZXF1aXJlKCcuL2NhZFhNTDJHZW9KU09OLmpzJyk7XG5cblN0YXJ0UGFyc2UoKTtcblxuZnVuY3Rpb24gU3RhcnRQYXJzZSgpIHtcbiAgICAvLyBodHRwczovL2JpdGJ1Y2tldC5vcmcvc3VyZW5yYW8veG1sMmpzb25cbiAgICAvLyBodHRwOi8vd3d3LmNocm9tZS1hbGxvdy1maWxlLWFjY2Vzcy1mcm9tLWZpbGUuY29tL1xuICAgIHZhciBwYXJzZWREYXRhO1xuICAgICQuZ2V0KCcuL3Rlc3RkYXRhL2RvYzg1MDA3MTcueG1sJywgZnVuY3Rpb24gKHhtbCkge1xuICAgICAgICAvL3ZhciBqc29uID0gJC54bWwyanNvbih4bWwpLkNhZGFzdHJhbEJsb2NrcztcbiAgICAgICAgLy8gJChcIiNkYXRhXCIpLmh0bWwoJzxjb2RlPicrSlNPTi5zdHJpbmdpZnkoanNvbikrJzwvY29kZT4nKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhDb252ZXJ0ZXIuR2VvSlNPTik7XG4gICAgICAgIHBhcnNlZERhdGEgPSBDb252ZXJ0ZXIuR2VvSlNPTih4bWwpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCk7XG5cbiAgICB9KS5zdWNjZXNzKFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGZpbGwgPSBuZXcgb2wuc3R5bGUuRmlsbCh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwLjQpJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBzdHJva2UgPSBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMzM5OUNDJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEuMjVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGVzID0gW1xuICAgICAgICAgICAgICAgICAgICBuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogZmlsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZTogc3Ryb2tlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB2YXIgdmVjdG9yTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBuZXcgb2wuc291cmNlLkdlb0pTT04oe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbjogJ0VQU0c6Mzg1NydcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdCA9IG5ldyBvbC5mb3JtYXQuR2VvSlNPTigpO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJzZWREYXRhLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBhcnNlZERhdGEuZmVhdHVyZXNbaV0uZ2VvbWV0cnkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvbWV0cnlPYmogPSBmb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVhZEdlb21ldHJ5KHBhcnNlZERhdGEuZmVhdHVyZXNbaV0uZ2VvbWV0cnkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IG5ldyBvbC5GZWF0dXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlb21ldHJ5OiBnZW9tZXRyeU9iai8vLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Byb3BBIDogcGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmNhZG51bWJlclxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdmVjdG9yTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbWFwID0gbmV3IG9sLk1hcCh7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogJ21hcCcsXG4gICAgICAgICAgICAgICAgICAgIGxheWVyczogW1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBuZXcgb2wubGF5ZXIuVGlsZSh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuT1NNKClcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZWN0b3JMYXllcl0sXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6IG5ldyBvbC5WaWV3KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlcjogWzAsIDBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgem9vbTogN1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1hcC5nZXRWaWV3KCkuZml0RXh0ZW50KHZlY3RvckxheWVyLmdldFNvdXJjZSgpLmdldEV4dGVudCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwLmdldFNpemUoKSk7XG4gICAgICAgICAgICB9KTtcbn1cblxuIiwidmFyIEVTID0gcmVxdWlyZSgnLi9zcGF0aWFsL0VudGl0eVNwYXRpYWwuanMnKTtcblxubW9kdWxlLmV4cG9ydHMuR2VvSlNPTiA9IGZ1bmN0aW9uICh4bWxEYXRhKSB7XG4vL1x0dmFyIFBhcmNlbHM7XG4vL1x0dmFyIFF1YXJ0YWw7XG4vL1x0dmFyIFpvbmVzO1xuLy9cdHZhciBCb3VuZHM7XG4gICAgXG4gICAgdmFyIGdlb0pTT04gPSB7XG4gICAgICAgIHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgZmVhdHVyZXMgOiBbXVxuICAgIH07XG4gICAgXG4gICAgXG4gICAgXG4gICAgdmFyIEFsbERhdGEgPSAkLnhtbDJqc29uKHhtbERhdGEpLkNhZGFzdHJhbEJsb2Nrcy5DYWRhc3RyYWxCbG9jaztcbiAgICAvL2NvbnNvbGUubG9nKEFsbERhdGEuUGFyY2Vscyk7XG4gICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINCy0YHQtdGFINC30LXQvNC10LvRjNC90YvRhSDRg9GH0LDRgtC60L7QsiDQuCDQuNGFINGH0LDRgdGC0LXQuVxuICAgIGZvcih2YXIgaT0wOyBpPEFsbERhdGEuUGFyY2Vscy5QYXJjZWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbaV0uRW50aXR5U3BhdGlhbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHNwT2JqID0gRVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmICgoc3BPYmogPT09IHVuZGVmaW5lZCkgfHwgKHNwT2JqLmxlbmd0aCA9PT0gMCkpIHsgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Ce0LHRitC10LrRgiDRgSDQv9GD0YHRgtC+0Lkg0LPQtdC+0LzQtdGC0YDQuNC10LkhINCR0YPQtNC10YIg0L/RgNC+0L/Rg9GJ0LXQvS4nKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCX0LXQvNC10LvRjNC90YvQuSDRg9GH0LDRgdGC0L7QulxuICAgICAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgICAgICAgICAgZ2VvbWV0cnk6IHt9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHNwT2JqO1xuICAgICAgICAgICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGB0LLQvtC50YHRgtCy0LAuLi4uXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGdlb0pTT04uZmVhdHVyZXMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXS5FbnRpdHlTcGF0aWFsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyDQnNC90L7Qs9C+0LrQvtC90YLRg9GA0L3Ri9C5XG4gICAgICAgIGVsc2UgaWYgKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbaV0uQ29udG91cnMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0LXRgiDQvtC/0LjRgdCw0L3QuNGPINC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQtdC90L3QvtC5INGB0L7RgdGC0LDQstC70Y/RjtGJ0LXQuScpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnZW9KU09OO1xufTsiLCIvKipcbiAqINCc0L7QtNGD0LvRjCDQvtCx0YDQsNCx0L7RgtC60Lgg0LPQtdC+0LzQtdGC0YDQuNC4INGC0LjQv9CwINC/0L7Qu9C40LPQvtC9LlxuICog0J7QtNC40L0g0LLQvdC10YjQvdC40Lkg0LrQvtC90YLRg9GAINC4IDAg0LjQu9C4INCx0L7Qu9C10LUg0LLQvdGD0YLRgNC10L3QvdC40YUg0LrQvtC90YLRg9GA0L7Qsi1cItC00YvRgNC+0LpcIlxuICogXG4gKiBHZW9KU09OIGdlb21ldHJ5XG4gKiDQl9C/0YDQvtGB0YLQviDQvNC+0LbQtdGCINCx0YvRgtGMINGH0YLQviDQstC90LXRiNC90LjQuSDQutC+0L3RgtGD0YAg0LzQvtC20LXRgiDQsdGL0YLRjCDQvdC1INC/0LXRgNCy0YvQvCDQsiBYTUwhISFcbiAqIFxuICogXG4gKi9cblxuLy9cImdlb21ldHJ5XCI6IHtcbi8vICAgIFwidHlwZVwiOiBcIlBvbHlnb25cIixcbi8vICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuLy8gICAgICBbIFsxMDAuMCwgMC4wXSwgWzEwMS4wLCAwLjBdLCBbMTAxLjAsIDEuMF0sXG4vLyAgICAgICAgWzEwMC4wLCAxLjBdLCBbMTAwLjAsIDAuMF0gXVxuLy8gICAgICBdXG4vLyAgfVxuXG5tb2R1bGUuZXhwb3J0cy5nZXRFbnRpdHlTcGF0aWFsID0gZnVuY3Rpb24oRW50aXR5U3BhdGlhbE9iaiwgcGFydE9mTXVsdHUpIHtcblx0XG4vL1x0dGhpcy5nZW9tZXRyeSA9IHtcbi8vICAgICAgICB0eXBlOiAnJyxcbi8vXHRcdGNvb3JkaW5hdGVzOiBbXVxuLy9cdH07XG4gICAgXG4gICAgLy92YXIgRW50aXR5U3BhdGlhbCA9IFtdO1xuICAgIHZhciBBcmVhID0gMC4wO1xuICAgIFxuICAgIC8vINCS0YvRh9C40YHQu9C10L3QuNC1INC/0LvQvtGJ0LDQtNC4INC30LDQvNC60L3Rg9GC0L7Qs9C+INC60L7QvdGC0YPRgNCwXG4gICAgZnVuY3Rpb24gcG9seWdvbkFyZWEoWHMsIFlzLCBudW1Qb2ludHMpIHsgXG4gICAgICAgIHZhciBhcmVhID0gMDsgICBcbiAgICAgICAgdmFyIGogPSBudW1Qb2ludHMtMTtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPG51bVBvaW50czsgaSsrKVxuICAgICAgICB7IGFyZWEgPSBhcmVhICsgICgoWHNbal0pKyhYc1tpXSkpICogKChZc1tqXSktKFlzW2ldKSk7IFxuICAgICAgICAgICAgaiA9IGk7ICAvL2ogaXMgcHJldmlvdXMgdmVydGV4IHRvIGlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYXJlYS8yKTtcbiAgICB9XG4gICAgXG4gICAgLy8g0KHQvtC30LTQsNC90LjQtSDQvtC00L3QvtCz0L4g0LfQsNC80LrQvdGD0YLQvtCz0L4g0LrQvtC90YLRg9GA0LBcbiAgICBmdW5jdGlvbiBjcmVhdGVDb250b3VyKFNwYXRpYWxFbGVtZW50KSB7XG4gICAgICAgIHZhciB4cyA9IFtdO1xuICAgICAgICB2YXIgeXMgPSBbXTtcbiAgICAgICAgdmFyIGNvbnRvdXIgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IFNwYXRpYWxFbGVtZW50LlNwZWxlbWVudFVuaXQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBwb2ludCA9IFNwYXRpYWxFbGVtZW50LlNwZWxlbWVudFVuaXRbal07XG4gICAgICAgICAgICB2YXIgeHkgPSBbXTtcbiAgICAgICAgICAgIHhzLnB1c2gocGFyc2VGbG9hdChwb2ludC5PcmRpbmF0ZS5ZKSk7XG4gICAgICAgICAgICB5cy5wdXNoKHBhcnNlRmxvYXQocG9pbnQuT3JkaW5hdGUuWCkpO1xuICAgICAgICAgICAgeHkucHVzaChwYXJzZUZsb2F0KHBvaW50Lk9yZGluYXRlLlkpKTtcbiAgICAgICAgICAgIHh5LnB1c2gocGFyc2VGbG9hdChwb2ludC5PcmRpbmF0ZS5YKSk7XG4gICAgICAgICAgICBjb250b3VyLnB1c2goeHkpO1xuICAgICAgICB9XG4gICAgICAgIEFyZWEgPSBwb2x5Z29uQXJlYSh4cywgeXMsIHhzLmxlbmd0aCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coQXJlYSk7XG4gICAgICAgIHJldHVybiBjb250b3VyO1xuICAgIH1cbiAgICBcblx0aWYgKChFbnRpdHlTcGF0aWFsT2JqICE9PSB1bmRlZmluZWQpICYmIChFbnRpdHlTcGF0aWFsT2JqICE9PSBudWxsKSkge1xuICAgICAgICB2YXIgY250cnMgPSBbXTtcbiAgICAgICAgLy8g0KPRgtC40L3QvdCw0Y8g0YLQuNC/0LjQt9Cw0YbQuNGPINC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LDQu9C40YfQuNGPINC00YvRgNC+0Log0LIg0L/QvtC70LjQs9C+0L3QtVxuICAgICAgICAvLyDQkiDQoNC+0YHRgNC10LXRgdGC0YDQtSDQvdC1INGB0LvQtdC00Y/RgiDQt9CwINC/0L7RgNGP0LTQutC+0Lwg0LrQvtC90YLRg9GA0L7QsiDQv9C+0LvQuNCz0L7QvdCwXG4gICAgICAgIGlmIChFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50LnNwbGljZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cf0L7Qu9C40LPQvtC9INGBINC00YvRgNC60LDQvNC4Jyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBNYXhBcmVhO1xuICAgICAgICAgICAgdmFyIE1heEFyZWFJZHggPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50Lmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRvdXIgPSBFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50W2tdO1xuICAgICAgICAgICAgICAgIHZhciBjbnQgPSBjcmVhdGVDb250b3VyKGNvbnRvdXIpO1xuICAgICAgICAgICAgICAgIGNudHJzLnB1c2goY250KTtcbiAgICAgICAgICAgICAgICBpZihBcmVhID4gTWF4QXJlYSkge1xuICAgICAgICAgICAgICAgICAgICBNYXhBcmVhID0gQXJlYTtcbiAgICAgICAgICAgICAgICAgICAgTWF4QXJlYUlkeCA9IGs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0J/QtdGA0LXQvNC10YnQsNC10Lwg0L7RgdC90L7QstC90L7QuSAo0L3QsNGA0YPQttC90LjQuSkg0LrQvtC90YLRg9GAINCyINC90LDRh9Cw0LvQviDQvNCw0YHRgdC40LLQsFxuICAgICAgICAgICAgaWYgKE1heEFyZWFJZHggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1haW5DbnQgPSBjbnRycy5zcGxpY2UoTWF4QXJlYUlkeCwgMSk7XG4gICAgICAgICAgICAgICAgY250cnMuc3BsaWNlKDAsIDAsIG1haW5DbnQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQndC+0LzQtdGAINC+0YHQvdC+0LLQvdC+0LPQviDQutC+0L3RgtGD0YDQsCDQsdGL0LsgJyArIE1heEFyZWFJZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3QvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC80LDRgdGB0LjQsiDQutC+0L3RgtGD0YDQvtCyXG4gICAgICAgICAgICBpZiAocGFydE9mTXVsdHUpIHsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNudHJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRjdGC0L4g0LTQu9GPINC/0YDQvtGB0YLQvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC+0LHRitC10LrRgiBnZW9tZXRyeVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjbnRyc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY29udG91ciA9IEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgcG9seWdvbiA9IGNyZWF0ZUNvbnRvdXIoY29udG91cik7XG4gICAgICAgICAgICBjbnRycy5wdXNoKHBvbHlnb24pO1xuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQvNC90L7Qs9C+0LrQvtC90YLRg9GA0L3QvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC80LDRgdGB0LjQsiDQutC+0L3RgtGD0YDQvtCyXG4gICAgICAgICAgICBpZiAocGFydE9mTXVsdHUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY250cnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRjdGC0L4g0LTQu9GPINC/0YDQvtGB0YLQvtCz0L4g0L7QsdGK0LXQutGC0LAsINGC0L4g0LLQvtC30LLRgNCw0YnQtdC8INC+0LHRitC10LrRgiBnZW9tZXRyeVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjbnRyc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59OyJdfQ==
