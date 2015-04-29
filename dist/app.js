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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL3NwYXRpYWwvRW50aXR5U3BhdGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBcbiAqIFRvIGNoYW5nZSB0aGlzIGxpY2Vuc2UgaGVhZGVyLCBjaG9vc2UgTGljZW5zZSBIZWFkZXJzIGluIFByb2plY3QgUHJvcGVydGllcy5cbiAqIFRvIGNoYW5nZSB0aGlzIHRlbXBsYXRlIGZpbGUsIGNob29zZSBUb29scyB8IFRlbXBsYXRlc1xuICogYW5kIG9wZW4gdGhlIHRlbXBsYXRlIGluIHRoZSBlZGl0b3IuXG4gKi9cblxudmFyIENvbnZlcnRlciA9IHJlcXVpcmUoJy4vY2FkWE1MMkdlb0pTT04uanMnKTtcblxuU3RhcnRQYXJzZSgpO1xuXG5mdW5jdGlvbiBTdGFydFBhcnNlKCkge1xuXHQvLyBodHRwczovL2JpdGJ1Y2tldC5vcmcvc3VyZW5yYW8veG1sMmpzb25cbiAgICAvLyBodHRwOi8vd3d3LmNocm9tZS1hbGxvdy1maWxlLWFjY2Vzcy1mcm9tLWZpbGUuY29tL1xuICAgIHZhciBwYXJzZWREYXRhO1xuXHQkLmdldCgnLi90ZXN0ZGF0YS9kb2M4NTAwNzE3LnhtbCcsIGZ1bmN0aW9uKHhtbCkge1xuXHRcdC8vdmFyIGpzb24gPSAkLnhtbDJqc29uKHhtbCkuQ2FkYXN0cmFsQmxvY2tzO1xuXHRcdC8vICQoXCIjZGF0YVwiKS5odG1sKCc8Y29kZT4nK0pTT04uc3RyaW5naWZ5KGpzb24pKyc8L2NvZGU+Jyk7XG5cdFx0Ly9jb25zb2xlLmxvZyhDb252ZXJ0ZXIuR2VvSlNPTik7XG4gICAgICAgIHBhcnNlZERhdGEgPSBDb252ZXJ0ZXIuR2VvSlNPTih4bWwpO1xuXHRcdC8vY29uc29sZS5sb2coKTtcblxuXHR9KS5zdWNjZXNzKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgdmVjdG9yTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcblx0XHRcdFx0XHRzb3VyY2UgOiBuZXcgb2wuc291cmNlLkdlb0pTT04oe1xuXHRcdFx0XHRcdFx0cHJvamVjdGlvbiA6ICdFUFNHOjM4NTcnLy8gLFxuXHRcdFx0XHRcdCAgICAvL29iamVjdDogcGFyc2VkRGF0YVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciBmb3JtYXQgPSBuZXcgb2wuZm9ybWF0Lkdlb0pTT04oKTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHBhcnNlZERhdGEuZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG5cdFx0XHRcdFx0dmFyIGdlb21ldHJ5T2JqID0gZm9ybWF0XG5cdFx0XHRcdFx0XHRcdC5yZWFkR2VvbWV0cnkocGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5nZW9tZXRyeSk7XG5cdFx0XHRcdFx0dmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG5cdFx0XHRcdFx0XHRnZW9tZXRyeSA6IGdlb21ldHJ5T2JqLy8sXG5cdFx0XHRcdFx0XHQvL3Byb3BBIDogcGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmNhZG51bWJlclxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHZlY3RvckxheWVyLmdldFNvdXJjZSgpLmFkZEZlYXR1cmUoZmVhdHVyZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgbWFwID0gbmV3IG9sLk1hcCh7XG5cdFx0XHRcdFx0dGFyZ2V0IDogJ21hcCcsXG5cdFx0XHRcdFx0bGF5ZXJzIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IG9sLmxheWVyLlRpbGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbmV3IG9sLnNvdXJjZS5PU00oKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG5cdFx0XHRcdFx0dmVjdG9yTGF5ZXIgXSxcblx0XHRcdFx0XHR2aWV3IDogbmV3IG9sLlZpZXcoe1xuXHRcdFx0XHRcdFx0Y2VudGVyIDogWyAwLCAwIF0sXG5cdFx0XHRcdFx0XHR6b29tIDogN1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRtYXAuZ2V0VmlldygpLmZpdEV4dGVudCh2ZWN0b3JMYXllci5nZXRTb3VyY2UoKS5nZXRFeHRlbnQoKSxcblx0XHRcdFx0XHRcdG1hcC5nZXRTaXplKCkpO1xuXHRcdFx0fSk7XG59XG5cbiIsInZhciBFUyA9IHJlcXVpcmUoJy4vc3BhdGlhbC9FbnRpdHlTcGF0aWFsLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzLkdlb0pTT04gPSBmdW5jdGlvbiAoeG1sRGF0YSkge1xuLy9cdHZhciBQYXJjZWxzO1xuLy9cdHZhciBRdWFydGFsO1xuLy9cdHZhciBab25lcztcbi8vXHR2YXIgQm91bmRzO1xuICAgIFxuICAgIHZhciBnZW9KU09OID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzIDogW11cbiAgICB9O1xuICAgIFxuICAgIFxuICAgIFxuICAgIHZhciBBbGxEYXRhID0gJC54bWwyanNvbih4bWxEYXRhKS5DYWRhc3RyYWxCbG9ja3MuQ2FkYXN0cmFsQmxvY2s7XG4gICAgLy9jb25zb2xlLmxvZyhBbGxEYXRhLlBhcmNlbHMpO1xuICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQstGB0LXRhSDQt9C10LzQtdC70YzQvdGL0YUg0YPRh9Cw0YLQutC+0LIg0Lgg0LjRhSDRh9Cw0YHRgtC10LlcbiAgICBmb3IodmFyIGk9MDsgaTxBbGxEYXRhLlBhcmNlbHMuUGFyY2VsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBzcE9iaiA9IEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXS5FbnRpdHlTcGF0aWFsLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoKHNwT2JqID09PSB1bmRlZmluZWQpIHx8IChzcE9iai5sZW5ndGggPT09IDApKSB7IFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQntCx0YrQtdC60YIg0YEg0L/Rg9GB0YLQvtC5INCz0LXQvtC80LXRgtGA0LjQtdC5ISDQkdGD0LTQtdGCINC/0YDQvtC/0YPRidC10L0uJyk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQl9C10LzQtdC70YzQvdGL0Lkg0YPRh9Cw0YHRgtC+0LpcbiAgICAgICAgICAgIHZhciBmZWF0dXJlID0ge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgICAgIGdlb21ldHJ5OiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBzcE9iajtcbiAgICAgICAgICAgIC8vINCe0YHRgtCw0LvRjNC90YvQtSDRgdCy0L7QudGB0YLQstCwLi4uLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBnZW9KU09OLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbaV0uRW50aXR5U3BhdGlhbCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g0JzQvdC+0LPQvtC60L7QvdGC0YPRgNC90YvQuVxuICAgICAgICBlbHNlIGlmIChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkNvbnRvdXJzKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQndC10YIg0L7Qv9C40YHQsNC90LjRjyDQv9GA0L7RgdGC0YDQsNC90YHRgtCy0LXQvdC90L7QuSDRgdC+0YHRgtCw0LLQu9GP0Y7RidC10LknKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2VvSlNPTjtcbn07IiwiLyoqXG4gKiDQnNC+0LTRg9C70Ywg0L7QsdGA0LDQsdC+0YLQutC4INCz0LXQvtC80LXRgtGA0LjQuCDRgtC40L/QsCDQv9C+0LvQuNCz0L7QvS5cbiAqINCe0LTQuNC9INCy0L3QtdGI0L3QuNC5INC60L7QvdGC0YPRgCDQuCAwINC40LvQuCDQsdC+0LvQtdC1INCy0L3Rg9GC0YDQtdC90L3QuNGFINC60L7QvdGC0YPRgNC+0LItXCLQtNGL0YDQvtC6XCJcbiAqIFxuICogR2VvSlNPTiBnZW9tZXRyeVxuICog0JfQv9GA0L7RgdGC0L4g0LzQvtC20LXRgiDQsdGL0YLRjCDRh9GC0L4g0LLQvdC10YjQvdC40Lkg0LrQvtC90YLRg9GAINC80L7QttC10YIg0LHRi9GC0Ywg0L3QtSDQv9C10YDQstGL0Lwg0LIgWE1MISEhXG4gKiBcbiAqIFxuICovXG5cbi8vXCJnZW9tZXRyeVwiOiB7XG4vLyAgICBcInR5cGVcIjogXCJQb2x5Z29uXCIsXG4vLyAgICBcImNvb3JkaW5hdGVzXCI6IFtcbi8vICAgICAgWyBbMTAwLjAsIDAuMF0sIFsxMDEuMCwgMC4wXSwgWzEwMS4wLCAxLjBdLFxuLy8gICAgICAgIFsxMDAuMCwgMS4wXSwgWzEwMC4wLCAwLjBdIF1cbi8vICAgICAgXVxuLy8gIH1cblxubW9kdWxlLmV4cG9ydHMuZ2V0RW50aXR5U3BhdGlhbCA9IGZ1bmN0aW9uKEVudGl0eVNwYXRpYWxPYmosIHBhcnRPZk11bHR1KSB7XG5cdFxuLy9cdHRoaXMuZ2VvbWV0cnkgPSB7XG4vLyAgICAgICAgdHlwZTogJycsXG4vL1x0XHRjb29yZGluYXRlczogW11cbi8vXHR9O1xuICAgIFxuICAgIC8vdmFyIEVudGl0eVNwYXRpYWwgPSBbXTtcbiAgICB2YXIgQXJlYSA9IDAuMDtcbiAgICBcbiAgICAvLyDQktGL0YfQuNGB0LvQtdC90LjQtSDQv9C70L7RidCw0LTQuCDQt9Cw0LzQutC90YPRgtC+0LPQviDQutC+0L3RgtGD0YDQsFxuICAgIGZ1bmN0aW9uIHBvbHlnb25BcmVhKFhzLCBZcywgbnVtUG9pbnRzKSB7IFxuICAgICAgICB2YXIgYXJlYSA9IDA7ICAgXG4gICAgICAgIHZhciBqID0gbnVtUG9pbnRzLTE7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxudW1Qb2ludHM7IGkrKylcbiAgICAgICAgeyBhcmVhID0gYXJlYSArICAoKFhzW2pdKSsoWHNbaV0pKSAqICgoWXNbal0pLShZc1tpXSkpOyBcbiAgICAgICAgICAgIGogPSBpOyAgLy9qIGlzIHByZXZpb3VzIHZlcnRleCB0byBpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGFyZWEvMik7XG4gICAgfVxuICAgIFxuICAgIC8vINCh0L7Qt9C00LDQvdC40LUg0L7QtNC90L7Qs9C+INC30LDQvNC60L3Rg9GC0L7Qs9C+INC60L7QvdGC0YPRgNCwXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udG91cihTcGF0aWFsRWxlbWVudCkge1xuICAgICAgICB2YXIgeHMgPSBbXTtcbiAgICAgICAgdmFyIHlzID0gW107XG4gICAgICAgIHZhciBjb250b3VyID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBTcGF0aWFsRWxlbWVudC5TcGVsZW1lbnRVbml0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSBTcGF0aWFsRWxlbWVudC5TcGVsZW1lbnRVbml0W2pdO1xuICAgICAgICAgICAgdmFyIHh5ID0gW107XG4gICAgICAgICAgICB4cy5wdXNoKHBhcnNlRmxvYXQocG9pbnQuT3JkaW5hdGUuWSkpO1xuICAgICAgICAgICAgeXMucHVzaChwYXJzZUZsb2F0KHBvaW50Lk9yZGluYXRlLlgpKTtcbiAgICAgICAgICAgIHh5LnB1c2gocGFyc2VGbG9hdChwb2ludC5PcmRpbmF0ZS5ZKSk7XG4gICAgICAgICAgICB4eS5wdXNoKHBhcnNlRmxvYXQocG9pbnQuT3JkaW5hdGUuWCkpO1xuICAgICAgICAgICAgY29udG91ci5wdXNoKHh5KTtcbiAgICAgICAgfVxuICAgICAgICBBcmVhID0gcG9seWdvbkFyZWEoeHMsIHlzLCB4cy5sZW5ndGgpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKEFyZWEpO1xuICAgICAgICByZXR1cm4gY29udG91cjtcbiAgICB9XG4gICAgXG5cdGlmICgoRW50aXR5U3BhdGlhbE9iaiAhPT0gdW5kZWZpbmVkKSAmJiAoRW50aXR5U3BhdGlhbE9iaiAhPT0gbnVsbCkpIHtcbiAgICAgICAgdmFyIGNudHJzID0gW107XG4gICAgICAgIC8vINCj0YLQuNC90L3QsNGPINGC0LjQv9C40LfQsNGG0LjRjyDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCw0LvQuNGH0LjRjyDQtNGL0YDQvtC6INCyINC/0L7Qu9C40LPQvtC90LVcbiAgICAgICAgLy8g0JIg0KDQvtGB0YDQtdC10YHRgtGA0LUg0L3QtSDRgdC70LXQtNGP0YIg0LfQsCDQv9C+0YDRj9C00LrQvtC8INC60L7QvdGC0YPRgNC+0LIg0L/QvtC70LjQs9C+0L3QsFxuICAgICAgICBpZiAoRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudC5zcGxpY2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQn9C+0LvQuNCz0L7QvSDRgSDQtNGL0YDQutCw0LzQuCcpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgTWF4QXJlYTtcbiAgICAgICAgICAgIHZhciBNYXhBcmVhSWR4ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb250b3VyID0gRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudFtrXTtcbiAgICAgICAgICAgICAgICB2YXIgY250ID0gY3JlYXRlQ29udG91cihjb250b3VyKTtcbiAgICAgICAgICAgICAgICBjbnRycy5wdXNoKGNudCk7XG4gICAgICAgICAgICAgICAgaWYoQXJlYSA+IE1heEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgTWF4QXJlYSA9IEFyZWE7XG4gICAgICAgICAgICAgICAgICAgIE1heEFyZWFJZHggPSBrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCf0LXRgNC10LzQtdGJ0LDQtdC8INC+0YHQvdC+0LLQvdC+0LkgKNC90LDRgNGD0LbQvdC40LkpINC60L7QvdGC0YPRgCDQsiDQvdCw0YfQsNC70L4g0LzQsNGB0YHQuNCy0LBcbiAgICAgICAgICAgIGlmIChNYXhBcmVhSWR4ID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBtYWluQ250ID0gY250cnMuc3BsaWNlKE1heEFyZWFJZHgsIDEpO1xuICAgICAgICAgICAgICAgIGNudHJzLnNwbGljZSgwLCAwLCBtYWluQ250KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QvtC80LXRgCDQvtGB0L3QvtCy0L3QvtCz0L4g0LrQvtC90YLRg9GA0LAg0LHRi9C7ICcgKyBNYXhBcmVhSWR4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGN0YLQviDQtNC70Y8g0LzQvdC+0LPQvtC60L7QvdGC0YPRgNC90L7Qs9C+INC+0LHRitC10LrRgtCwLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LXQvCDQvNCw0YHRgdC40LIg0LrQvtC90YLRg9GA0L7QslxuICAgICAgICAgICAgaWYgKHBhcnRPZk11bHR1KSB7IFxuICAgICAgICAgICAgICAgIHJldHVybiBjbnRycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQv9GA0L7RgdGC0L7Qs9C+INC+0LHRitC10LrRgtCwLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LXQvCDQvtCx0YrQtdC60YIgZ2VvbWV0cnlcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUG9seWdvblwiLFxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlczogY250cnNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNvbnRvdXIgPSBFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50O1xuICAgICAgICAgICAgdmFyIHBvbHlnb24gPSBjcmVhdGVDb250b3VyKGNvbnRvdXIpO1xuICAgICAgICAgICAgY250cnMucHVzaChwb2x5Z29uKTtcbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGN0YLQviDQtNC70Y8g0LzQvdC+0LPQvtC60L7QvdGC0YPRgNC90L7Qs9C+INC+0LHRitC10LrRgtCwLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LXQvCDQvNCw0YHRgdC40LIg0LrQvtC90YLRg9GA0L7QslxuICAgICAgICAgICAgaWYgKHBhcnRPZk11bHR1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNudHJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0Y3RgtC+INC00LvRjyDQv9GA0L7RgdGC0L7Qs9C+INC+0LHRitC10LrRgtCwLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LXQvCDQvtCx0YrQtdC60YIgZ2VvbWV0cnlcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUG9seWdvblwiLFxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlczogY250cnNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTsiXX0=
